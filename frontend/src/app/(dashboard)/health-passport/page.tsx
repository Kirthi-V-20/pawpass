"use client";

import { useMemo, useState } from "react";

import MedicationSection from "@/components/health/MedicationSection";
import VaccinationSection from "@/components/health/VaccinationSection";

import { FemaleIcon, MaleIcon } from "@/icons/GenderIcons";

import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

type HealthTab = "vaccinations" | "medications";

export default function HealthPassportPage() {
  const user = useAuthStore((state) => state.user);

  const pets = usePetStore((state) => state.pets);

  const [selectedPetId, setSelectedPetId] = useState("");

  const [activeTab, setActiveTab] = useState<HealthTab>("vaccinations");

  const userPets = useMemo(() => {
    if (!user) {
      return [];
    }

    return pets.filter((pet) => pet.ownerId === user.id);
  }, [pets, user]);

  const selectedPet = useMemo(
    () => userPets.find((pet) => pet.id === selectedPetId),
    [userPets, selectedPetId],
  );

  const getAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div
        className="flex h-full min-h-0 flex-col overflow-hidden px-8 pb-8 pt-2"
        style={{
          backgroundColor: COLORS.primary.background,
        }}
      >
        <div className="mb-2 shrink-0">
          <h1
            className="text-2xl font-semibold"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {localize.health.title}
          </h1>

          <p
            className="mt-1 text-sm"
            style={{
              color: COLORS.grey[600],
            }}
          >
            {localize.health.subtitle}
          </p>
        </div>

        <div
          className="health-passport-scroll-area min-h-0 flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="mx-auto w-full max-w-6xl pb-6">
            <div
              className="mb-4 rounded-lg border bg-white p-5"
              style={{
                borderColor: COLORS.grey[200],
              }}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
                <div>
                  <label
                    htmlFor="health-pet"
                    className="mb-2 block text-sm font-medium"
                    style={{
                      color: COLORS.grey[700],
                    }}
                  >
                    {localize.health.select_pet}
                  </label>

                  <select
                    id="health-pet"
                    value={selectedPetId}
                    onChange={(event) => {
                      setSelectedPetId(event.target.value);

                      setActiveTab("vaccinations");
                    }}
                    className="h-10 w-full  rounded-md border bg-white px-3 pr-10 text-sm outline-none "
                    style={{
                      borderColor: COLORS.grey[300],
                      color: COLORS.neutral.black,
                    }}
                  >
                    <option value="">
                      {localize.health.select_pet_placeholder}
                    </option>

                    {userPets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPet && (
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-full"
                      style={{
                        backgroundColor: COLORS.grey[100],
                      }}
                    >
                      {selectedPet.photo ? (
                        <img
                          src={selectedPet.photo}
                          alt={selectedPet.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span
                            className="text-xl font-semibold"
                            style={{
                              color: COLORS.primary.DEFAULT,
                            }}
                          >
                            {selectedPet.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2
                          className="truncate text-lg font-semibold"
                          style={{
                            color: COLORS.neutral.black,
                          }}
                        >
                          {selectedPet.name}
                        </h2>

                        {selectedPet.gender === "Male" ? (
                          <MaleIcon size={18} color={COLORS.primary.DEFAULT} />
                        ) : (
                          <FemaleIcon
                            size={18}
                            color={COLORS.primary.DEFAULT}
                          />
                        )}
                      </div>

                      <p
                        className="mt-1 text-sm"
                        style={{
                          color: COLORS.grey[600],
                        }}
                      >
                        {selectedPet.species}
                      </p>

                      <div
                        className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm"
                        style={{
                          color: COLORS.grey[600],
                        }}
                      >
                        <span>{getAge(selectedPet.dateOfBirth)} years old</span>

                        <span>DOB: {formatDate(selectedPet.dateOfBirth)}</span>

                        {selectedPet.weight !== undefined && (
                          <span>{selectedPet.weight} kg</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!selectedPet && (
              <div
                className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border px-6 text-center"
                style={{
                  borderColor: COLORS.grey[200],
                  backgroundColor: COLORS.neutral.white,
                }}
              >
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {localize.health.select_pet_title}
                </h2>

                <p
                  className="mt-2 max-w-sm text-sm"
                  style={{
                    color: COLORS.grey[600],
                  }}
                >
                  {localize.health.select_pet_description}
                </p>
              </div>
            )}

            {selectedPet && (
              <>
                <div
                  className="flex rounded-lg border bg-white p-1"
                  style={{
                    borderColor: COLORS.grey[200],
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("vaccinations")}
                    className="flex-1 rounded-md px-5 py-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        activeTab === "vaccinations"
                          ? COLORS.primary.DEFAULT
                          : "transparent",

                      color:
                        activeTab === "vaccinations"
                          ? COLORS.neutral.white
                          : COLORS.grey[600],
                    }}
                  >
                    {localize.health.vaccinations}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("medications")}
                    className="flex-1 rounded-md px-5 py-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        activeTab === "medications"
                          ? COLORS.primary.DEFAULT
                          : "transparent",

                      color:
                        activeTab === "medications"
                          ? COLORS.neutral.white
                          : COLORS.grey[600],
                    }}
                  >
                    {localize.health.medications}
                  </button>
                </div>

                {activeTab === "vaccinations" ? (
                  <VaccinationSection petId={selectedPet.id} />
                ) : (
                  <MedicationSection petId={selectedPet.id} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .health-passport-scroll-area::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
