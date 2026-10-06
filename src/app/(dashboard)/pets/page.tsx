"use client";

import { useMemo, useState } from "react";

import ReportLostModal from "@/components/modals/ReportLostModal";
import AddPetModal from "@/components/modals/AddPetModal";
import PetDetailsModal from "@/components/modals/PetDetailsModal";
import PetCard from "@/components/pets/PetCard";
import PetSpeciesSelect from "@/components/ui/pet-species-select";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

import { usePetStore } from "@/store/petStore";
import { useLostPetStore } from "@/store/lostPetStore";
import { useAuthStore } from "@/store/authStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Pet } from "@/types/pet";

export default function MyPetsPage() {
  const pets = usePetStore((state) => state.pets);

  const deletePet = usePetStore((state) => state.deletePet);

  const updatePet = usePetStore((state) => state.updatePet);

  const user = useAuthStore((state) => state.user);

  const updateLostPet = useLostPetStore((state) => state.updateLostPet);

  const getActiveLostPetByPetId = useLostPetStore(
    (state) => state.getActiveLostPetByPetId,
  );

  const [search, setSearch] = useState("");

  const [selectedSpecies, setSelectedSpecies] = useState("");

  const [isEditPetOpen, setIsEditPetOpen] = useState(false);

  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isReportLostOpen, setIsReportLostOpen] = useState(false);

  const filteredPets = useMemo(() => {
    if (!user) {
      return [];
    }

    return pets.filter((pet) => {
      if (pet.ownerId !== user.id) {
        return false;
      }

      const matchesSearch = pet.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSpecies =
        !selectedSpecies || pet.species === selectedSpecies;

      return matchesSearch && matchesSpecies;
    });
  }, [pets, user, search, selectedSpecies]);

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPet(null);
  };

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setIsEditPetOpen(true);
  };

  const handleDelete = (pet: Pet) => {
    setPetToDelete(pet);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!petToDelete) {
      return;
    }

    deletePet(petToDelete.id);

    setIsDeleteConfirmOpen(false);
    setPetToDelete(null);
  };

  const handleReportLost = (pet: Pet) => {
    if (pet.status === "LOST") {
      return;
    }

    setSelectedPet(pet);
    setIsDetailsOpen(false);
    setIsReportLostOpen(true);
  };

  const handleMarkFound = (pet: Pet) => {
    const lostReport = getActiveLostPetByPetId(pet.id);

    if (!lostReport) {
      return;
    }

    updateLostPet(lostReport.id, {
      status: "RESOLVED",
    });

    updatePet(pet.id, {
      status: "ACTIVE",
    });

    setSelectedPet({
      ...pet,
      status: "ACTIVE",
    });
  };

  const handleAddPet = () => {
    setSelectedPet(null);
    setIsAddPetOpen(true);
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {localize.pets.title}
              </h1>

              <p
                className="mt-1 text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.pets.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPet}
              className="w-fit rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              + {localize.pets.add_pet_btn}
            </button>
          </div>
        </div>

        <div className="mb-3 flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={localize.pets.search_placeholder}
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

        <div
          className="pets-scroll-area min-h-0 flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 pb-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
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
                {localize.pets.no_pets}
              </h2>

              <p
                className="mt-2 max-w-sm text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.pets.no_pets_description}
              </p>

              {pets.length === 0 && (
                <button
                  type="button"
                  onClick={handleAddPet}
                  className="mt-5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.primary.DEFAULT,
                    color: COLORS.neutral.white,
                  }}
                >
                  + {localize.pets.add_pet_btn}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .pets-scroll-area::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <AddPetModal
        open={isAddPetOpen}
        onClose={() => {
          setIsAddPetOpen(false);
        }}
      />

      <AddPetModal
        open={isEditPetOpen}
        pet={selectedPet}
        onClose={() => {
          setIsEditPetOpen(false);
          setSelectedPet(null);
        }}
      />

      <PetDetailsModal
        open={isDetailsOpen}
        pet={selectedPet}
        onClose={handleCloseDetails}
        onReportLost={handleReportLost}
        onMarkFound={handleMarkFound}
      />

      <ReportLostModal
        open={isReportLostOpen}
        onClose={() => {
          setIsReportLostOpen(false);
          setSelectedPet(null);
        }}
        pet={selectedPet}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        title={localize.pets.delete_confirmation_title}
        message={localize.pets.delete_confirmation.replace(
          "{name}",
          petToDelete?.name ?? "",
        )}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPetToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
