"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import AddVaccinationModal from "@/components/modals/AddVaccinationModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import DataTable from "@/components/ui/DataTable";

import { useHealthStore } from "@/store/healthStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import { getVaccinationStatus } from "@/utils/vaccinationStatus";

import type { Vaccination } from "@/types/vaccination";

interface VaccinationSectionProps {
  petId: string;
}

interface VaccinationActionMenuProps {
  vaccination: Vaccination;
  onEdit: (vaccination: Vaccination) => void;
  onMarkAsGiven: (vaccination: Vaccination) => void;
  onDelete: (vaccination: Vaccination) => void;
}

function VaccinationActionMenu({
  vaccination,
  onEdit,
  onMarkAsGiven,
  onDelete,
}: VaccinationActionMenuProps) {
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

    const menuWidth = window.innerWidth < 640 ? 136 : 144;

    const menuHeight = 132;

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
        `vaccination-action-menu-${vaccination.id}`,
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
  }, [isOpen, vaccination.id]);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit(vaccination);
  };

  const handleMarkAsGiven = () => {
    setIsOpen(false);
    onMarkAsGiven(vaccination);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(vaccination);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={`${vaccination.vaccineName} actions`}
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
            id={`vaccination-action-menu-${vaccination.id}`}
            className="
              fixed
              z-[9999]
              w-[136px]
              overflow-hidden
              rounded-md
              border
              bg-white
              py-1
              shadow-lg
              sm:w-36
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
              onClick={handleMarkAsGiven}
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
              {localize.health.mark_as_given}
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

export default function VaccinationSection({ petId }: VaccinationSectionProps) {
  const { vaccinations, deleteVaccination, markVaccinationAsGiven } =
    useHealthStore();

  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);

  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const petVaccinations = vaccinations.filter(
    (vaccination) => vaccination.petId === petId,
  );

  const getStatusLabel = (status: Vaccination["status"]) => {
    if (status === "UP_TO_DATE") {
      return localize.health.up_to_date;
    }

    if (status === "DUE_SOON") {
      return localize.health.due_soon;
    }

    if (status === "OVERDUE") {
      return localize.health.overdue;
    }

    return "-";
  };

  const getStatusStyle = (status: Vaccination["status"]) => {
    if (status === "UP_TO_DATE") {
      return {
        backgroundColor: COLORS.status.greenLight,
        color: COLORS.status.green,
      };
    }

    if (status === "DUE_SOON") {
      return {
        backgroundColor: COLORS.status.yellowLight,
        color: COLORS.status.yellow,
      };
    }

    if (status === "OVERDUE") {
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

  const handleAddVaccination = () => {
    setSelectedVaccination(null);
    setIsVaccinationModalOpen(true);
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setIsVaccinationModalOpen(true);
  };

  const handleMarkAsGiven = (vaccination: Vaccination) => {
    markVaccinationAsGiven(vaccination.id);
  };

  const handleDeleteClick = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedVaccination) {
      return;
    }

    deleteVaccination(selectedVaccination.id);

    setSelectedVaccination(null);
    setIsDeleteModalOpen(false);
  };

  const handleVaccinationModalClose = () => {
    setIsVaccinationModalOpen(false);
    setSelectedVaccination(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedVaccination(null);
  };

  const columns = [
    {
      key: "vaccineName",
      label: localize.health.vaccine_name,

      render: (vaccination: Vaccination) => (
        <span
          className="font-medium"
          style={{
            color: COLORS.neutral.black,
          }}
        >
          {vaccination.vaccineName}
        </span>
      ),
    },

    {
      key: "givenDate",
      label: localize.health.given_date,

      render: (vaccination: Vaccination) => formatDate(vaccination.givenDate),
    },

    {
      key: "nextDueDate",
      label: localize.health.next_due,

      render: (vaccination: Vaccination) => formatDate(vaccination.nextDueDate),
    },

    {
      key: "status",
      label: localize.health.status,

      render: (vaccination: Vaccination) => {
        const status = getVaccinationStatus(vaccination);

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

      render: (vaccination: Vaccination) => (
        <VaccinationActionMenu
          vaccination={vaccination}
          onEdit={handleEditVaccination}
          onMarkAsGiven={handleMarkAsGiven}
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
              {localize.health.vaccinations}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: COLORS.grey[500],
              }}
            >
              {localize.health.vaccination_description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddVaccination}
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
            + {localize.health.add_vaccine}
          </button>
        </div>

        <DataTable
          columns={columns}
          data={petVaccinations}
          getRowKey={(vaccination) => vaccination.id}
          emptyMessage={localize.health.no_vaccinations}
        />
      </section>

      <AddVaccinationModal
        open={isVaccinationModalOpen}
        onClose={handleVaccinationModalClose}
        petId={petId}
        vaccination={selectedVaccination}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title={localize.health.delete_vaccination}
        message={localize.health.delete_vaccination_message}
      />
    </>
  );
}
