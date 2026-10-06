"use client";

import { useMemo, useState } from "react";

import AddMedicationModal from "@/components/modals/AddMedicationModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import DataTable from "@/components/ui/DataTable";

import { useHealthStore } from "@/store/healthStore";

import type { Medication } from "@/types/medication";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import { getMedicationStatus } from "@/utils/medicationStatus";

interface MedicationSectionProps {
  petId: string;
}

export default function MedicationSection({ petId }: MedicationSectionProps) {
  const {
    medications,
    deleteMedication,
    markMedicationAsCompleted,
    markMedicationAsStopped,
  } = useHealthStore();

  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);

  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  const petMedications = useMemo(
    () => medications.filter((medication) => medication.petId === petId),
    [medications, petId],
  );

  const getStatusLabel = (status: Medication["status"]) => {
    if (status === "UPCOMING") {
      return localize.health.upcoming;
    }

    if (status === "ACTIVE") {
      return localize.health.active;
    }

    if (status === "COMPLETED") {
      return localize.health.completed;
    }

    if (status === "STOPPED") {
      return localize.health.stopped;
    }

    return "-";
  };

  const getStatusStyle = (status: Medication["status"]) => {
    if (status === "UPCOMING") {
      return {
        backgroundColor: COLORS.status.yellowLight,
        color: COLORS.status.yellow,
      };
    }

    if (status === "ACTIVE") {
      return {
        backgroundColor: COLORS.status.greenLight,
        color: COLORS.status.green,
      };
    }

    if (status === "COMPLETED") {
      return {
        backgroundColor: COLORS.grey[100],
        color: COLORS.grey[600],
      };
    }

    if (status === "STOPPED") {
      return {
        backgroundColor: COLORS.status.redLight,
        color: COLORS.status.red,
      };
    }

    return {
      backgroundColor: COLORS.grey[100],
      color: COLORS.grey[600],
    };
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleAddMedication = () => {
    setSelectedMedication(null);
    setIsMedicationModalOpen(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsMedicationModalOpen(true);
  };

  const handleMarkAsCompleted = (medication: Medication) => {
    markMedicationAsCompleted(medication.id);
  };

  const handleStopMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsStopModalOpen(true);
  };

  const handleStopConfirm = () => {
    if (!selectedMedication) {
      return;
    }

    markMedicationAsStopped(selectedMedication.id);

    setSelectedMedication(null);
    setIsStopModalOpen(false);
  };

  const handleDeleteClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedMedication) {
      return;
    }

    deleteMedication(selectedMedication.id);

    setSelectedMedication(null);
    setIsDeleteModalOpen(false);
  };

  const handleMedicationModalClose = () => {
    setIsMedicationModalOpen(false);
    setSelectedMedication(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedMedication(null);
  };

  const handleStopModalClose = () => {
    setIsStopModalOpen(false);
    setSelectedMedication(null);
  };

  const columns = [
    {
      key: "medicationName",
      label: localize.health.medication_name,
      render: (medication: Medication) => (
        <span
          className="font-medium"
          style={{
            color: COLORS.neutral.black,
          }}
        >
          {medication.medicationName}
        </span>
      ),
    },

    {
      key: "dosage",
      label: localize.health.dosage,
      render: (medication: Medication) => medication.dosage || "-",
    },

    {
      key: "frequency",
      label: localize.health.frequency,
      render: (medication: Medication) => medication.frequency || "-",
    },

    {
      key: "startDate",
      label: localize.health.start_date,
      render: (medication: Medication) => formatDate(medication.startDate),
    },

    {
      key: "endDate",
      label: localize.health.end_date,
      render: (medication: Medication) => formatDate(medication.endDate),
    },

    {
      key: "status",
      label: localize.health.status,
      render: (medication: Medication) => {
        const status = getMedicationStatus(medication);

        return (
          <span
            className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
            style={getStatusStyle(status)}
          >
            {getStatusLabel(status)}
          </span>
        );
      },
    },

    {
      key: "actions",
      label: localize.health.actions,

      render: (medication: Medication) => (
        <div className="relative">
          <details className="group">
            <summary
              className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md text-lg font-semibold transition-colors hover:bg-slate-100"
              style={{
                color: COLORS.grey[600],
              }}
            >
              ⋮
            </summary>

            <div className="absolute right-0 z-20 mt-1 w-40 rounded-md border bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => handleEditMedication(medication)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                style={{
                  color: COLORS.grey[700],
                }}
              >
                {localize.health.edit}
              </button>

              <button
                type="button"
                onClick={() => handleMarkAsCompleted(medication)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                style={{
                  color: COLORS.status.green,
                }}
              >
                {localize.health.mark_as_completed}
              </button>

              <button
                type="button"
                onClick={() => handleStopMedication(medication)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                style={{
                  color: COLORS.status.red,
                }}
              >
                {localize.health.stop_medication}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteClick(medication)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                style={{
                  color: COLORS.status.red,
                }}
              >
                {localize.health.delete}
              </button>
            </div>
          </details>
        </div>
      ),
    },
  ];

  return (
    <>
      <section
        className="rounded-lg border bg-white"
        style={{
          borderColor: COLORS.grey[200],
        }}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.health.medications}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: COLORS.grey[500],
              }}
            >
              {localize.health.medication_description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddMedication}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLORS.primary.DEFAULT,
            }}
          >
            + {localize.health.add_medication}
          </button>
        </div>

        <DataTable
          columns={columns}
          data={petMedications}
          getRowKey={(medication) => medication.id}
          emptyMessage={localize.health.no_medications}
        />
      </section>

      <AddMedicationModal
        open={isMedicationModalOpen}
        onClose={handleMedicationModalClose}
        petId={petId}
        medication={selectedMedication}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title={localize.health.delete_medication}
        message={localize.health.delete_medication_message}
        confirmLabel={localize.health.delete}
      />

      <ConfirmationModal
        open={isStopModalOpen}
        onClose={handleStopModalClose}
        onConfirm={handleStopConfirm}
        title={localize.health.stop_medication}
        message={localize.health.stop_medication_message}
        confirmLabel={localize.health.stop_medication}
      />
    </>
  );
}
