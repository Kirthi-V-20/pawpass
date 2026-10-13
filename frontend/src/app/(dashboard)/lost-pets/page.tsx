"use client";

import { useMemo, useState } from "react";

import LostPetDetailsModal from "@/components/modals/LostPetDetailsModal";
import ReportLostModal from "@/components/modals/ReportLostModal";
import DeleteLostPetModal from "@/components/modals/DeleteLostPetModal";
import EditLostPetModal from "@/components/modals/EditLostPetModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

import LostPetCard from "@/components/pets/LostPetCard";
import PetSpeciesSelect from "@/components/ui/pet-species-select";

import { useAuthStore } from "@/store/authStore";
import { useLostPetStore } from "@/store/lostPetStore";
import { useNotificationStore } from "@/store/notificationStore";
import { usePetStore } from "@/store/petStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { LostPetReport } from "@/types/lostPet";
import type { Pet } from "@/types/pet";

export default function LostPetsPage() {
  const user = useAuthStore((state) => state.user);

  const pets = usePetStore((state) => state.pets);

  const updatePet = usePetStore((state) => state.updatePet);

  const lostPets = useLostPetStore((state) => state.lostPets);

  const updateLostPet = useLostPetStore((state) => state.updateLostPet);

  const deleteLostPet = useLostPetStore((state) => state.deleteLostPet);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const [search, setSearch] = useState("");

  const [selectedSpecies, setSelectedSpecies] = useState("");

  const [isReportLostOpen, setIsReportLostOpen] = useState(false);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const [isFoundConfirmationOpen, setIsFoundConfirmationOpen] = useState(false);

  const [selectedLostPet, setSelectedLostPet] = useState<{
    pet: Pet;
    report: LostPetReport;
  } | null>(null);

  /*
   * Get only active lost-pet reports belonging to the
   * currently logged-in user.
   */
  const lostPetsWithDetails = useMemo(() => {
    if (!user) {
      return [];
    }

    return lostPets
      .filter((report) => {
        if (report.status !== "ACTIVE") {
          return false;
        }

        if (report.ownerId !== user.id) {
          return false;
        }

        return true;
      })
      .map((report) => {
        const pet = pets.find((item) => item.id === report.petId);

        return {
          report,
          pet,
        };
      })
      .filter(
        (
          item,
        ): item is {
          report: LostPetReport;
          pet: Pet;
        } => Boolean(item.pet),
      );
  }, [lostPets, pets, user]);

  /*
   * Apply search and species filters.
   */
  const filteredLostPets = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return lostPetsWithDetails.filter(({ pet }) => {
      const matchesSearch = pet.name.toLowerCase().includes(searchValue);

      const matchesSpecies =
        !selectedSpecies || pet.species === selectedSpecies;

      return matchesSearch && matchesSpecies;
    });
  }, [lostPetsWithDetails, search, selectedSpecies]);

  /*
   * Open lost pet details.
   */
  const handleViewDetails = (pet: Pet, report: LostPetReport) => {
    setSelectedLostPet({
      pet,
      report,
    });

    setIsDetailsOpen(true);
  };

  /*
   * Close lost pet details.
   */
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedLostPet(null);
  };

  /*
   * Open edit lost pet modal.
   */
  const handleEdit = (pet: Pet, report: LostPetReport) => {
    setSelectedLostPet({
      pet,
      report,
    });

    setIsEditOpen(true);
  };

  /*
   * Open delete confirmation.
   */
  const handleDelete = (pet: Pet, report: LostPetReport) => {
    setSelectedLostPet({
      pet,
      report,
    });

    setIsDeleteConfirmationOpen(true);
  };

  /*
   * Delete lost pet report and restore pet status.
   */
  const handleConfirmDelete = () => {
    if (!selectedLostPet) {
      return;
    }

    const { pet, report } = selectedLostPet;

    deleteLostPet(report.id);

    updatePet(pet.id, {
      status: "ACTIVE",
    });

    setIsDeleteConfirmationOpen(false);
    setSelectedLostPet(null);
  };

  /*
   * Open mark-as-found confirmation.
   */
  const handleMarkAsFoundClick = () => {
    if (!selectedLostPet) {
      return;
    }

    setIsFoundConfirmationOpen(true);
  };

  /*
   * Mark pet as found.
   */
  const handleConfirmMarkAsFound = () => {
    if (!selectedLostPet) {
      return;
    }

    const { pet, report } = selectedLostPet;

    updateLostPet(report.id, {
      status: "RESOLVED",
    });

    updatePet(pet.id, {
      status: "FOUND",
    });

    addNotification({
      id: crypto.randomUUID(),
      userId: report.ownerId,
      type: "PET_FOUND",
      title: localize.lost.pet_found_title,
      message: localize.lost.pet_found_message.replace("{name}", pet.name),
      relatedId: report.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    setIsFoundConfirmationOpen(false);
    setIsDetailsOpen(false);
    setSelectedLostPet(null);
  };

  /*
   * Open Report Lost modal.
   */
  const handleReportLost = () => {
    setSelectedLostPet(null);
    setIsReportLostOpen(true);
  };

  return (
    <>
      <div
        className="flex h-full min-h-0 flex-col overflow-hidden px-8 pb-8 pt-2"
        style={{
          backgroundColor: COLORS.primary.background,
        }}
      >
        {/* ------------------------------------------------
            PAGE HEADER
        ------------------------------------------------ */}
        <div className="mb-2 shrink-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {localize.lost.title}
              </h1>

              <p
                className="mt-1 text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.lost.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReportLost}
              className="w-fit rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              + {localize.lost.report_lost_btn}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------
            SEARCH + SPECIES FILTER
        ------------------------------------------------ */}
        <div className="mb-3 flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={localize.lost.search_placeholder}
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

        {/* ------------------------------------------------
            LOST PETS CONTENT
        ------------------------------------------------ */}
        <div
          className="lost-pets-scroll-area min-h-0 flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {filteredLostPets.length > 0 ? (
            /*
             * Same responsive grid as My Pets:
             *
             * Mobile  -> 1 card
             * Tablet  -> 2 cards
             * Desktop -> 3 cards
             */
            <div className="grid grid-cols-1 gap-5 pb-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredLostPets.map(({ pet, report }) => (
                <LostPetCard
                  key={report.id}
                  pet={pet}
                  report={report}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            /*
             * Empty state is now exactly like My Pets:
             * - white background
             * - border
             * - rounded corners
             * - same minimum height
             * - centered content
             * - mobile friendly
             */
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
                {localize.lost.no_lost_pets}
              </h2>

              <p
                className="mt-2 max-w-sm text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.lost.no_lost_pets_description}
              </p>

              {lostPets.length === 0 && (
                <button
                  type="button"
                  onClick={handleReportLost}
                  className="mt-5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.primary.DEFAULT,
                    color: COLORS.neutral.white,
                  }}
                >
                  + {localize.lost.report_lost_btn}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------
          HIDE SCROLLBAR
      ------------------------------------------------ */}
      <style jsx>{`
        .lost-pets-scroll-area::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ------------------------------------------------
          REPORT LOST MODAL
      ------------------------------------------------ */}
      <ReportLostModal
        open={isReportLostOpen}
        onClose={() => {
          setIsReportLostOpen(false);
          setSelectedLostPet(null);
        }}
      />

      {/* ------------------------------------------------
          EDIT LOST PET MODAL
      ------------------------------------------------ */}
      <EditLostPetModal
        open={isEditOpen}
        pet={selectedLostPet?.pet ?? null}
        report={selectedLostPet?.report ?? null}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedLostPet(null);
        }}
      />

      {/* ------------------------------------------------
          LOST PET DETAILS MODAL
      ------------------------------------------------ */}
      <LostPetDetailsModal
        open={isDetailsOpen}
        pet={selectedLostPet?.pet ?? null}
        report={selectedLostPet?.report ?? null}
        onClose={handleCloseDetails}
        onMarkAsFound={handleMarkAsFoundClick}
      />

      {/* ------------------------------------------------
          MARK AS FOUND CONFIRMATION
      ------------------------------------------------ */}
      <ConfirmationModal
        open={isFoundConfirmationOpen}
        title={localize.lost.mark_found_title}
        message={localize.lost.mark_found_message.replace(
          "{name}",
          selectedLostPet?.pet.name ?? "",
        )}
        confirmLabel={localize.lost.yes_mark_found}
        onConfirm={handleConfirmMarkAsFound}
        onClose={() => {
          setIsFoundConfirmationOpen(false);
        }}
      />

      {/* ------------------------------------------------
          DELETE LOST PET MODAL
      ------------------------------------------------ */}
      <DeleteLostPetModal
        open={isDeleteConfirmationOpen}
        petName={selectedLostPet?.pet.name ?? ""}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSelectedLostPet(null);
        }}
      />
    </>
  );
}
