"use client";

import { useMemo, useState } from "react";

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

export default function VaccinationSection({ petId }: VaccinationSectionProps) {
  const { vaccinations, deleteVaccination, markVaccinationAsGiven } =
    useHealthStore();

  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);

  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const petVaccinations = useMemo(
    () => vaccinations.filter((vaccination) => vaccination.petId === petId),
    [vaccinations, petId],
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
    console.log("MARK AS GIVEN:", vaccination);
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

      render: (vaccination: Vaccination) => (
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

            <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => handleEditVaccination(vaccination)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                style={{
                  color: COLORS.grey[700],
                }}
              >
                {localize.health.edit}
              </button>

              <button
                type="button"
                onClick={(event) => {
                  handleMarkAsGiven(vaccination);

                  const details = event.currentTarget.closest("details");

                  if (details) {
                    details.open = false;
                  }
                }}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                style={{
                  color: COLORS.status.green,
                }}
              >
                {localize.health.mark_as_given}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteClick(vaccination)}
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
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
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
