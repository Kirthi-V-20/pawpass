"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { useHealthStore } from "@/store/healthStore";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import type { Vaccination } from "@/types/vaccination";

interface AddVaccinationModalProps {
  open: boolean;
  onClose: () => void;
  petId: string;
  vaccination?: Vaccination | null;
}

export default function AddVaccinationModal({
  open,
  onClose,
  petId,
  vaccination,
}: AddVaccinationModalProps) {
  const { addVaccination, updateVaccination } = useHealthStore();

  const [vaccineName, setVaccineName] = useState("");
  const [givenDate, setGivenDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [veterinaryClinic, setVeterinaryClinic] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [notes, setNotes] = useState("");

  const isEditMode = Boolean(vaccination);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (vaccination) {
      setVaccineName(vaccination.vaccineName);
      setGivenDate(vaccination.givenDate);
      setNextDueDate(vaccination.nextDueDate);
      setVeterinaryClinic(vaccination.veterinaryClinic ?? "");
      setVeterinarian(vaccination.veterinarian ?? "");
      setNotes(vaccination.notes ?? "");
      return;
    }

    setVaccineName("");
    setGivenDate("");
    setNextDueDate("");
    setVeterinaryClinic("");
    setVeterinarian("");
    setNotes("");
  }, [open, vaccination]);

  const resetForm = () => {
    setVaccineName("");
    setGivenDate("");
    setNextDueDate("");
    setVeterinaryClinic("");
    setVeterinarian("");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!vaccineName.trim() || !givenDate || !nextDueDate) {
      return;
    }

    if (vaccination) {
      updateVaccination(vaccination.id, {
        vaccineName: vaccineName.trim(),
        givenDate,
        nextDueDate,
        veterinaryClinic: veterinaryClinic.trim() || undefined,
        veterinarian: veterinarian.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      handleClose();
      return;
    }

    addVaccination({
      id: crypto.randomUUID(),
      petId,
      vaccineName: vaccineName.trim(),
      givenDate,
      nextDueDate,
      veterinaryClinic: veterinaryClinic.trim() || undefined,
      veterinarian: veterinarian.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Vaccination" : localize.health.add_vaccine}
      className="max-w-lg"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.grey[700],
            }}
          >
            {localize.common.cancel}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!vaccineName.trim() || !givenDate || !nextDueDate}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: COLORS.primary.DEFAULT,
            }}
          >
            {localize.common.save}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="vaccine-name"
            className="mb-1.5 block text-sm font-medium"
            style={{
              color: COLORS.grey[700],
            }}
          >
            {localize.health.vaccine_name}
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="vaccine-name"
            type="text"
            value={vaccineName}
            onChange={(event) => setVaccineName(event.target.value)}
            placeholder="Enter vaccine name"
            className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="given-date"
              className="mb-1.5 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.health.given_date}
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="given-date"
              type="date"
              value={givenDate}
              onChange={(event) => setGivenDate(event.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.neutral.black,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="next-due-date"
              className="mb-1.5 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.health.next_due}
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="next-due-date"
              type="date"
              value={nextDueDate}
              onChange={(event) => setNextDueDate(event.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              style={{
                borderColor: COLORS.grey[300],
                color: COLORS.neutral.black,
              }}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="veterinary-clinic"
            className="mb-1.5 block text-sm font-medium"
            style={{
              color: COLORS.grey[700],
            }}
          >
            {localize.health.clinic}
          </label>

          <input
            id="veterinary-clinic"
            type="text"
            value={veterinaryClinic}
            onChange={(event) => setVeterinaryClinic(event.target.value)}
            placeholder="Enter veterinary clinic"
            className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          />
        </div>

        <div>
          <label
            htmlFor="veterinarian"
            className="mb-1.5 block text-sm font-medium"
            style={{
              color: COLORS.grey[700],
            }}
          >
            {localize.health.vet}
          </label>

          <input
            id="veterinarian"
            type="text"
            value={veterinarian}
            onChange={(event) => setVeterinarian(event.target.value)}
            placeholder="Enter veterinarian name"
            className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          />
        </div>

        <div>
          <label
            htmlFor="vaccination-notes"
            className="mb-1.5 block text-sm font-medium"
            style={{
              color: COLORS.grey[700],
            }}
          >
            {localize.pets.notes}
          </label>

          <textarea
            id="vaccination-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add any additional notes"
            rows={3}
            className="w-full resize-none rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            style={{
              borderColor: COLORS.grey[300],
              color: COLORS.neutral.black,
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
