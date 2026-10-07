"use client";

import { useMemo, useState } from "react";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { useAuthStore } from "@/store/authStore";
import { useLostPetStore } from "@/store/lostPetStore";
import { usePetStore } from "@/store/petStore";

import PetSpeciesSelect from "@/components/ui/pet-species-select";
import ReportFoundCard from "@/components/pets/ReportFoundCard";
import ReportFoundModal from "@/components/modals/ReportFoundModal";
import ReportFoundPetDetailsModal from "@/components/modals/ReportFoundPetDetailsModal";

import type { Pet } from "@/types/pet";
import type { LostPetReport } from "@/types/lostPet";

function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number {
  const earthRadius = 6371;

  const latitudeDifference = ((latitude2 - latitude1) * Math.PI) / 180;
  const longitudeDifference = ((longitude2 - longitude1) * Math.PI) / 180;

  const latitude1Radians = (latitude1 * Math.PI) / 180;
  const latitude2Radians = (latitude2 * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(latitude1Radians) *
      Math.cos(latitude2Radians) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export default function ReportFoundPage() {
  const user = useAuthStore((state) => state.user);

  const lostPets = useLostPetStore((state) => state.lostPets);

  const pets = usePetStore((state) => state.pets);

  const [search, setSearch] = useState("");

  const [selectedSpecies, setSelectedSpecies] = useState("");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationError, setLocationError] = useState(false);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [selectedReport, setSelectedReport] = useState<LostPetReport | null>(
    null,
  );

  const [selectedDetailsPet, setSelectedDetailsPet] = useState<Pet | null>(
    null,
  );

  const [selectedDetailsReport, setSelectedDetailsReport] =
    useState<LostPetReport | null>(null);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }

    setLocationError(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationError(false);
      },
      () => {
        setLocationError(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const nearbyLostPets = useMemo(() => {
    if (!user || !userLocation) {
      return [];
    }

    return lostPets
      .filter(
        (report) => report.status === "ACTIVE" && report.ownerId !== user.id,
      )
      .map((report) => {
        const pet = pets.find((item) => item.id === report.petId);

        if (!pet) {
          return null;
        }

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          report.latitude,
          report.longitude,
        );

        if (distance > 50) {
          return null;
        }

        return {
          pet,
          report,
          distance,
        };
      })
      .filter(
        (
          item,
        ): item is {
          pet: Pet;
          report: LostPetReport;
          distance: number;
        } => item !== null,
      );
  }, [user, userLocation, lostPets, pets]);

  const filteredLostPets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return nearbyLostPets.filter(({ pet }) => {
      const matchesSearch =
        !normalizedSearch || pet.name.toLowerCase().includes(normalizedSearch);

      const matchesSpecies =
        !selectedSpecies || pet.species === selectedSpecies;

      return matchesSearch && matchesSpecies;
    });
  }, [nearbyLostPets, search, selectedSpecies]);

  const handleViewDetails = (pet: Pet, report: LostPetReport) => {
    setSelectedDetailsPet(pet);
    setSelectedDetailsReport(report);
  };

  const handleCloseDetails = () => {
    setSelectedDetailsPet(null);
    setSelectedDetailsReport(null);
  };

  const handleReportFound = (pet: Pet, report: LostPetReport) => {
    setSelectedPet(pet);
    setSelectedReport(report);
  };

  const handleCloseReportFound = () => {
    setSelectedPet(null);
    setSelectedReport(null);
  };

  const handleReportFoundFromDetails = () => {
    if (!selectedDetailsPet || !selectedDetailsReport) {
      return;
    }

    setSelectedPet(selectedDetailsPet);
    setSelectedReport(selectedDetailsReport);

    setSelectedDetailsPet(null);
    setSelectedDetailsReport(null);
  };

  return (
    <>
      <main
        className="flex h-full min-h-0 flex-col overflow-hidden px-8 pb-8 pt-2"
        style={{
          backgroundColor: COLORS.primary.background,
        }}
      >
        <div className="mb-3 shrink-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {localize.found.title}
              </h1>

              <p
                className="mt-1 text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.found.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="w-fit rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              {localize.found.use_current_location}
            </button>
          </div>

          <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={localize.found.search_placeholder}
              className="h-9 w-full rounded-lg border px-3 text-sm outline-none sm:w-64"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.neutral.black,
                backgroundColor: COLORS.neutral.white,
              }}
            />

            <PetSpeciesSelect
              value={selectedSpecies}
              onChange={setSelectedSpecies}
            />
          </div>

          {!userLocation && (
            <div
              className="mt-3 rounded-lg border p-3"
              style={{
                borderColor: COLORS.grey[200],
                backgroundColor: COLORS.grey[50],
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.found.no_location}
              </p>
            </div>
          )}

          {locationError && (
            <div
              className="mt-3 rounded-lg border p-3"
              style={{
                borderColor: COLORS.status.red,
                backgroundColor: COLORS.status.redLight,
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: COLORS.status.red,
                }}
              >
                {localize.found.location_error}
              </p>
            </div>
          )}
        </div>

        <div
          className="report-found-scroll-area min-h-0 flex-1 overflow-y-auto pb-6"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {userLocation && (
            <>
              {filteredLostPets.length === 0 ? (
                <div
                  className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border px-6 text-center"
                  style={{
                    backgroundColor: COLORS.neutral.white,
                    borderColor: COLORS.grey[200],
                  }}
                >
                  <h2
                    className="text-lg font-semibold"
                    style={{
                      color: COLORS.neutral.black,
                    }}
                  >
                    {localize.found.no_nearby_pets}
                  </h2>

                  <p
                    className="mt-2 max-w-sm text-sm"
                    style={{
                      color: COLORS.grey[600],
                    }}
                  >
                    {localize.found.no_nearby_pets}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 pb-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredLostPets.map(({ pet, report, distance }) => (
                    <ReportFoundCard
                      key={report.id}
                      pet={pet}
                      report={report}
                      distance={distance}
                      onViewDetails={() => handleViewDetails(pet, report)}
                      onReportFound={() => handleReportFound(pet, report)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ReportFoundPetDetailsModal
        open={selectedDetailsPet !== null && selectedDetailsReport !== null}
        onClose={handleCloseDetails}
        pet={selectedDetailsPet}
        report={selectedDetailsReport}
        onReportFound={handleReportFoundFromDetails}
      />

      <ReportFoundModal
        open={selectedPet !== null && selectedReport !== null}
        onClose={handleCloseReportFound}
        pet={selectedPet}
        report={selectedReport}
      />

      <style jsx>{`
        .report-found-scroll-area::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
