"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { useHealthStore } from "@/store/healthStore";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import type { Medication } from "@/types/medication";

interface AddMedicationModalProps {
  open: boolean;
  onClose: () => void;
  petId: string;
  medication?: Medication | null;
}

export default function AddMedicationModal({
  open,
  onClose,
  petId,
  medication,
}: AddMedicationModalProps) {
  const { addMedication, updateMedication } = useHealthStore();

  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const isEditMode = Boolean(medication);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (medication) {
      setMedicationName(medication.medicationName);
      setDosage(medication.dosage);
      setFrequency(medication.frequency);
      setStartDate(medication.startDate);
      setEndDate(medication.endDate ?? "");
      setNotes(medication.notes ?? "");

      return;
    }

    setMedicationName("");
    setDosage("");
    setFrequency("");
    setStartDate("");
    setEndDate("");
    setNotes("");
  }, [open, medication]);

  const resetForm = () => {
    setMedicationName("");
    setDosage("");
    setFrequency("");
    setStartDate("");
    setEndDate("");
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (
      !medicationName.trim() ||
      !dosage.trim() ||
      !frequency.trim() ||
      !startDate
    ) {
      return;
    }

    if (medication) {
      updateMedication(medication.id, {
        medicationName: medicationName.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        startDate,
        endDate: endDate || undefined,
        notes: notes.trim() || undefined,
      });

      handleClose();
      return;
    }

    addMedication({
      id: crypto.randomUUID(),
      petId,
      medicationName: medicationName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      startDate,
      endDate: endDate || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        isEditMode
          ? localize.health.edit_medication
          : localize.health.add_medication
      }
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
            disabled={
              !medicationName.trim() ||
              !dosage.trim() ||
              !frequency.trim() ||
              !startDate
            }
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
      <div className="space-y-4">
        <div>
          <label
            htmlFor="medication-name"
            className="mb-1 block text-sm font-medium"
            style={{
              color: COLORS.grey[700],
            }}
          >
            {localize.health.medication_name}
          </label>

          <input
            id="medication-name"
            type="text"
            value={medicationName}
            onChange={(event) => setMedicationName(event.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: COLORS.grey[300],
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="medication-dosage"
              className="mb-1 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.health.dosage}
            </label>

            <input
              id="medication-dosage"
              type="text"
              value={dosage}
              onChange={(event) => setDosage(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.grey[300],
              }}
            />
          </div>

          <div>
            <label
              htmlFor="medication-frequency"
              className="mb-1 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.health.frequency}
            </label>

            <input
              id="medication-frequency"
              type="text"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.grey[300],
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="medication-start-date"
              className="mb-1 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.health.start_date}
            </label>

            <input
              id="medication-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.grey[300],
              }}
            />
          </div>

          <div>
            <label
              htmlFor="medication-end-date"
              className="mb-1 block text-sm font-medium"
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.health.end_date}
            </label>

            <input
              id="medication-end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.grey[300],
              }}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="medication-notes"
            className="mb-1 block text-sm font-medium"
            style={{
              color: COLORS.grey[700],
            }}
          >
            {localize.pets.notes}
          </label>

          <textarea
            id="medication-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-md border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: COLORS.grey[300],
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
