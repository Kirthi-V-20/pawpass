import { NextRequest, NextResponse } from "next/server";

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

interface NominatimResult {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  category?: string;
  importance?: number;
  place_rank?: number;
  address?: NominatimAddress;
}

interface LocationResult {
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
  importance: number;
}

function normalizeQuery(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ");
}

function getCity(address: NominatimAddress): string {
  return (
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    ""
  );
}

function convertResult(result: NominatimResult): LocationResult | null {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const address = result.address ?? {};

  return {
    id: `${result.osm_type}-${result.osm_id}`,
    latitude,
    longitude,
    name: result.display_name,
    type: result.type ?? "",
    category: result.category ?? "",
    houseNumber: address.house_number ?? "",
    road: address.road ?? "",
    neighbourhood: address.neighbourhood ?? "",
    suburb: address.suburb ?? "",
    city: getCity(address),
    county: address.county ?? "",
    state: address.state ?? "",
    postcode: address.postcode ?? "",
    country: address.country ?? "",
    countryCode: address.country_code ?? "",
    importance: result.importance ?? 0,
  };
}

function scoreResult(result: LocationResult, query: string): number {
  const searchText = query.toLowerCase();

  const name = result.name.toLowerCase();
  const road = result.road.toLowerCase();
  const neighbourhood = result.neighbourhood.toLowerCase();
  const suburb = result.suburb.toLowerCase();
  const city = result.city.toLowerCase();

  let score = result.importance * 100;

  if (name.includes(searchText)) {
    score += 100;
  }

  if (road.includes(searchText)) {
    score += 80;
  }

  if (neighbourhood.includes(searchText)) {
    score += 70;
  }

  if (suburb.includes(searchText)) {
    score += 60;
  }

  if (city.includes(searchText)) {
    score += 50;
  }

  /*
   * Address/local-place results are more useful for a
   * location picker than administrative boundaries.
   */
  if (result.category === "highway") {
    score += 40;
  }

  if (result.category === "place") {
    score += 30;
  }

  if (result.category === "amenity") {
    score += 30;
  }

  if (result.category === "railway") {
    score += 30;
  }

  if (result.category === "shop") {
    score += 20;
  }

  if (result.category === "building") {
    score += 20;
  }

  return score;
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get("q");

  if (!rawQuery) {
    return NextResponse.json({
      results: [],
    });
  }

  const query = normalizeQuery(rawQuery);

  if (!query) {
    return NextResponse.json({
      results: [],
    });
  }

  try {
    const url = new URL(
      "https://nominatim.openstreetmap.org/search",
    );

    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("namedetails", "1");
    url.searchParams.set("accept-language", "en");
    url.searchParams.set("countrycodes", "in");
    url.searchParams.set("limit", "20");
    url.searchParams.set("dedupe", "1");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "PawPass/1.0 (location search)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Nominatim search failed:",
        response.status,
        response.statusText,
      );

      return NextResponse.json(
        {
          results: [],
          error: "Location search failed",
        },
        {
          status: response.status,
        },
      );
    }

    const data = (await response.json()) as NominatimResult[];

    const results = data
      .map(convertResult)
      .filter(
        (result): result is LocationResult => result !== null,
      )
      .sort(
        (first, second) =>
          scoreResult(second, query) -
          scoreResult(first, query),
      )
      .slice(0, 10);

    return NextResponse.json({
      results,
    });
  } catch (error) {
    console.error("Location search error:", error);

    return NextResponse.json(
      {
        results: [],
        error: "Unable to search location",
      },
      {
        status: 500,
      },
    );
  }
}