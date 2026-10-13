"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

interface MedicationActionMenuProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onMarkAsCompleted: (medication: Medication) => void;
  onStopMedication: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

function MedicationActionMenu({
  medication,
  onEdit,
  onMarkAsCompleted,
  onStopMedication,
  onDelete,
}: MedicationActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    const menuWidth = window.innerWidth < 640 ? 148 : 160;

    const menuHeight = 176;

    const screenPadding = 8;
    const menuSpacing = 6;

    let top = rect.bottom + menuSpacing;

    let left = rect.right - menuWidth;

    if (left < screenPadding) {
      left = screenPadding;
    }

    if (left + menuWidth > window.innerWidth - screenPadding) {
      left = window.innerWidth - menuWidth - screenPadding;
    }

    if (top + menuHeight > window.innerHeight - screenPadding) {
      top = rect.top - menuHeight - menuSpacing;
    }

    if (top < screenPadding) {
      top = screenPadding;
    }

    setPosition({
      top,
      left,
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }

    setIsOpen((current) => !current);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const menuElement = document.getElementById(
        `medication-action-menu-${medication.id}`,
      );

      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuElement &&
        !menuElement.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);

    window.addEventListener("scroll", handleScroll, true);

    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      window.removeEventListener("scroll", handleScroll, true);

      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, medication.id]);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit(medication);
  };

  const handleMarkAsCompleted = () => {
    setIsOpen(false);
    onMarkAsCompleted(medication);
  };

  const handleStopMedication = () => {
    setIsOpen(false);
    onStopMedication(medication);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(medication);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={`${medication.medicationName} actions`}
        aria-expanded={isOpen}
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-md
          text-lg
          font-semibold
          transition-colors
          hover:bg-slate-100
          active:bg-slate-200
        "
        style={{
          color: COLORS.grey[600],
        }}
      >
        ⋮
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id={`medication-action-menu-${medication.id}`}
            className="
              fixed
              z-[9999]
              w-[148px]
              overflow-hidden
              rounded-md
              border
              bg-white
              py-1
              shadow-lg
              sm:w-40
            "
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              borderColor: COLORS.grey[200],
            }}
          >
            <button
              type="button"
              onClick={handleEdit}
              className="
                block
                min-h-10
                w-full
                px-4
                py-2
                text-left
                text-sm
                hover:bg-slate-50
                active:bg-slate-100
              "
              style={{
                color: COLORS.grey[700],
              }}
            >
              {localize.health.edit}
            </button>

            <button
              type="button"
              onClick={handleMarkAsCompleted}
              className="
                block
                min-h-10
                w-full
                px-4
                py-2
                text-left
                text-sm
                hover:bg-slate-50
                active:bg-slate-100
              "
              style={{
                color: COLORS.status.green,
              }}
            >
              {localize.health.mark_as_completed}
            </button>

            <button
              type="button"
              onClick={handleStopMedication}
              className="
                block
                min-h-10
                w-full
                px-4
                py-2
                text-left
                text-sm
                hover:bg-slate-50
                active:bg-slate-100
              "
              style={{
                color: COLORS.status.red,
              }}
            >
              {localize.health.stop_medication}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="
                block
                min-h-10
                w-full
                px-4
                py-2
                text-left
                text-sm
                hover:bg-slate-50
                active:bg-slate-100
              "
              style={{
                color: COLORS.status.red,
              }}
            >
              {localize.health.delete}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
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

  const petMedications = medications.filter(
    (medication) => medication.petId === petId,
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
            className="
              inline-flex
              whitespace-nowrap
              rounded-full
              px-2.5
              py-1
              text-xs
              font-medium
            "
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
        <MedicationActionMenu
          medication={medication}
          onEdit={handleEditMedication}
          onMarkAsCompleted={handleMarkAsCompleted}
          onStopMedication={handleStopMedication}
          onDelete={handleDeleteClick}
        />
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
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            px-4
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >
          <div className="min-w-0">
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
            className="
              w-full
              rounded-md
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition-opacity
              hover:opacity-90
              sm:w-auto
            "
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

      {/* Delete Confirmation */}
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
