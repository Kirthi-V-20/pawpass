"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

const LocationMap = dynamic(
  () => import("@/components/shared/LocationPicker/LocationMap"),
  {
    ssr: false,
  },
);

type Position = [number, number];

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;

  onLocationSelect: (
    latitude: number,
    longitude: number,
    locationName: string,
  ) => void;
}

interface SearchResult {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
  category: string;
  houseNumber: string;
  road: string;
  neighbourhood: string;
  suburb: string;
  city: string;
  county: string;
  state: string;
  postcode: string;
  country: string;
  countryCode: string;
}

interface SearchResponse {
  results: SearchResult[];
}

interface ReverseResponse {
  latitude: number;
  longitude: number;
  name: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

const DEFAULT_POSITION: Position = [10.8505, 76.2711];

export default function LocationPicker({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );

  const [selectedLocationName, setSelectedLocationName] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const watchIdRef = useRef<number | null>(null);

  const bestGpsPositionRef = useRef<GeolocationPosition | null>(null);

  /*
   * Prevent multiple reverse-geocoding requests
   * during one "Use Current Location" action.
   */
  const reverseGeocodeStartedRef = useRef(false);

  const initialPosition: Position =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
      ? [latitude, longitude]
      : DEFAULT_POSITION;

  const [mapPosition, setMapPosition] = useState<Position>(initialPosition);

  /*
   * Clear the GPS watch when the component is unmounted.
   */
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);

        watchIdRef.current = null;
      }
    };
  }, []);

  /*
   * If the parent provides latitude/longitude,
   * update the map and selected position.
   */
  useEffect(() => {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return;
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    const nextPosition: Position = [latitude, longitude];

    setMapPosition(nextPosition);
    setSelectedPosition(nextPosition);
  }, [latitude, longitude]);

  /*
   * Search locations.
   */
  const searchLocations = useCallback(async () => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setErrorMessage("");
      return;
    }

    setIsSearching(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/location/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Location search failed");
      }

      const data = (await response.json()) as SearchResponse;

      const results = Array.isArray(data.results) ? data.results : [];

      setSearchResults(results);

      if (results.length === 0) {
        setErrorMessage("Location not found");
      }
    } catch (error) {
      console.error("Location search failed:", error);

      setSearchResults([]);
      setErrorMessage("Unable to search location");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void searchLocations();
  };

  /*
   * Handle selecting a location from search results.
   */
  const handleResultSelect = (result: SearchResult) => {
    const position: Position = [result.latitude, result.longitude];

    const locationName = result.name;

    setSelectedPosition(position);
    setMapPosition(position);
    setSelectedLocationName(locationName);
    setSearchQuery(locationName);
    setSearchResults([]);
    setErrorMessage("");

    onLocationSelect(result.latitude, result.longitude, locationName);
  };

  /*
   * Reverse geocode GPS coordinates.
   *
   * A timeout is used so a slow Nominatim response
   * does not block the location picker.
   */
  const reverseGeocode = async (
    latitudeValue: number,
    longitudeValue: number,
  ): Promise<string> => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 8000);

    try {
      const response = await fetch(
        `/api/location/reverse?lat=${encodeURIComponent(
          String(latitudeValue),
        )}&lon=${encodeURIComponent(String(longitudeValue))}`,
        {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error("Reverse location search failed");
      }

      const data = (await response.json()) as ReverseResponse;

      return data.name ?? "";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn("Reverse geocoding timed out");
      } else {
        console.error("Reverse geocoding failed:", error);
      }

      /*
       * GPS coordinates are still valid even if
       * reverse geocoding fails.
       */
      return "";
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  /*
   * Apply the best GPS position.
   */
  const applyGpsPosition = useCallback(
    async (position: GeolocationPosition) => {
      const latitudeValue = position.coords.latitude;

      const longitudeValue = position.coords.longitude;

      if (!Number.isFinite(latitudeValue) || !Number.isFinite(longitudeValue)) {
        return;
      }

      const nextPosition: Position = [latitudeValue, longitudeValue];

      /*
       * Update the map immediately.
       */
      setMapPosition(nextPosition);
      setSelectedPosition(nextPosition);

      /*
       * Use a fallback name immediately.
       *
       * This means the GPS location is usable even
       * when reverse geocoding is slow or unavailable.
       */
      const fallbackName = localize.lost.selected_map_location;

      setSelectedLocationName(fallbackName);
      setSearchQuery(fallbackName);

      /*
       * Send the GPS coordinates to the parent
       * immediately.
       */
      onLocationSelect(latitudeValue, longitudeValue, fallbackName);

      /*
       * Prevent multiple reverse-geocoding requests
       * from the same GPS action.
       */
      if (reverseGeocodeStartedRef.current) {
        return;
      }

      reverseGeocodeStartedRef.current = true;

      const locationName = await reverseGeocode(latitudeValue, longitudeValue);

      /*
       * If reverse geocoding succeeds, replace the
       * fallback name with the real location name.
       */
      if (locationName) {
        setSelectedLocationName(locationName);

        setSearchQuery(locationName);

        onLocationSelect(latitudeValue, longitudeValue, locationName);
      }
    },
    [onLocationSelect],
  );

  /*
   * Handle GPS position updates.
   *
   * We keep the most accurate GPS position received.
   */
  const handleGpsPosition = useCallback(
    (position: GeolocationPosition) => {
      const latitudeValue = position.coords.latitude;

      const longitudeValue = position.coords.longitude;

      const accuracy = position.coords.accuracy;

      console.log("GPS reading:", {
        latitude: latitudeValue,
        longitude: longitudeValue,
        accuracy,
      });

      if (
        !Number.isFinite(latitudeValue) ||
        !Number.isFinite(longitudeValue) ||
        !Number.isFinite(accuracy)
      ) {
        return;
      }

      const previousPosition = bestGpsPositionRef.current;

      /*
       * First valid GPS position.
       */
      if (!previousPosition) {
        bestGpsPositionRef.current = position;

        setIsLocating(false);

        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);

          watchIdRef.current = null;
        }

        void applyGpsPosition(position);

        return;
      }

      /*
       * If a more accurate GPS position arrives,
       * use it.
       */
      if (accuracy < previousPosition.coords.accuracy) {
        bestGpsPositionRef.current = position;

        void applyGpsPosition(position);
      }
    },
    [applyGpsPosition],
  );

  /*
   * Handle GPS errors.
   */
  const handleGpsError = useCallback((error: GeolocationPositionError) => {
    console.error("Current location failed:", {
      code: error.code,
      message: error.message,
    });

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);

      watchIdRef.current = null;
    }

    setIsLocating(false);

    switch (error.code) {
      case error.PERMISSION_DENIED:
        setErrorMessage("Location permission was denied");
        break;

      case error.POSITION_UNAVAILABLE:
        setErrorMessage("Current location is unavailable");
        break;

      case error.TIMEOUT:
        setErrorMessage("Unable to get your current location");
        break;

      default:
        setErrorMessage("Unable to get your current location");
    }
  }, []);

  /*
   * Start getting the user's current location.
   */
  const handleCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by this browser");

      return;
    }

    /*
     * Stop an existing GPS watch.
     */
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);

      watchIdRef.current = null;
    }

    /*
     * Reset GPS state for a new location request.
     */
    bestGpsPositionRef.current = null;

    reverseGeocodeStartedRef.current = false;

    setIsLocating(true);
    setErrorMessage("");
    setSearchResults([]);

    /*
     * Start watching GPS position.
     *
     * We use the first valid GPS reading and stop
     * the watch immediately.
     */
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleGpsPosition,
      handleGpsError,
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <form onSubmit={handleSearchSubmit} className="flex w-full gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setSearchResults([]);
            setErrorMessage("");
          }}
          placeholder={localize.lost.search_location}
          className="h-11 min-w-0 flex-1 rounded-md border px-3 text-sm outline-none"
          style={{
            borderColor: COLORS.grey[300],
            backgroundColor: COLORS.neutral.white,
            color: COLORS.neutral.black,
          }}
        />

        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="h-11 rounded-md px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: COLORS.primary.DEFAULT,
          }}
        >
          {isSearching ? localize.lost.searching : localize.lost.search}
        </button>
      </form>

      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={isLocating}
        className="h-11 w-full rounded-md border text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          borderColor: COLORS.grey[300],
          backgroundColor: COLORS.neutral.white,
          color: COLORS.neutral.black,
        }}
      >
        {isLocating ? localize.lost.locating : localize.lost.current_location}
      </button>

      {searchResults.length > 0 && (
        <div
          className="max-h-64 overflow-y-auto rounded-md border"
          style={{
            borderColor: COLORS.grey[300],
            backgroundColor: COLORS.neutral.white,
          }}
        >
          {searchResults.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => handleResultSelect(result)}
              className="block w-full border-b px-4 py-3 text-left last:border-b-0"
              style={{
                borderColor: COLORS.grey[200],
              }}
            >
              <p
                className="text-sm font-medium"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {result.road || result.name}
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color: COLORS.grey[500],
                }}
              >
                {result.name}
              </p>
            </button>
          ))}
        </div>
      )}

      {errorMessage && (
        <p
          className="text-sm"
          style={{
            color: COLORS.status.red,
          }}
        >
          {errorMessage}
        </p>
      )}

      <div
        className="h-[400px] w-full overflow-hidden rounded-lg border"
        style={{
          borderColor: COLORS.grey[300],
        }}
      >
        <LocationMap
          position={mapPosition}
          selectedPosition={selectedPosition}
        />
      </div>

      {selectedPosition && selectedLocationName && (
        <div
          className="rounded-md border p-3"
          style={{
            borderColor: COLORS.grey[300],
            backgroundColor: COLORS.grey[50],
          }}
        >
          <p
            className="text-xs font-medium"
            style={{
              color: COLORS.grey[500],
            }}
          >
            {localize.lost.location_selected}
          </p>

          <p
            className="mt-1 text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {selectedLocationName}
          </p>
        </div>
      )}
    </div>
  );
}
