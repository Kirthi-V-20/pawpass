"use client";

import { useParams } from "next/navigation";

import { usePetStore } from "@/store/petStore";
import { useProfileStore } from "@/store/profileStore";
import { useLostPetStore } from "@/store/lostPetStore";

import { MaleIcon, FemaleIcon } from "@/icons/GenderIcons";
import { COLORS } from "@/styles/colors";

export default function ScanPetPage() {
  const params = useParams();

  const qrCodeId = typeof params?.id === "string" ? params.id : "";

  const pets = usePetStore((state) => state.pets);
  const profiles = useProfileStore((state) => state.profiles);
  const lostPets = useLostPetStore((state) => state.lostPets);

  const pet = pets.find((item) => item.qrCodeId === qrCodeId);

  if (!pet) {
    return (
      <main
        className="flex min-h-screen items-center justify-center p-6"
        style={{
          backgroundColor: COLORS.primary.background,
        }}
      >
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <h1
            className="text-xl font-semibold"
            style={{ color: COLORS.neutral.black }}
          >
            Pet Profile Not Found
          </h1>

          <p className="mt-2 text-sm" style={{ color: COLORS.grey[600] }}>
            This QR code is not connected to a pet profile.
          </p>
        </div>
      </main>
    );
  }

  const profile = profiles[pet.ownerId];

  const lostReport = lostPets.find(
    (report) => report.petId === pet.id && report.status === "ACTIVE",
  );

  const isLost = Boolean(lostReport);

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    }

    if (months > 0) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    }

    return "Less than 1 month";
  };

  const age = calculateAge(pet.dateOfBirth);

  return (
    <main
      className="min-h-screen px-4 py-8 sm:px-6"
      style={{
        backgroundColor: COLORS.primary.background,
      }}
    >
      <div className="mx-auto w-full max-w-2xl space-y-5">
        {/* Lost Pet Banner */}
        {isLost && (
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: COLORS.status.red,
              backgroundColor: "#FEF2F2",
            }}
          >
            <h2
              className="text-base font-semibold"
              style={{ color: COLORS.status.red }}
            >
              This pet has been reported Lost
            </h2>

            <p
              className="mt-1 text-sm leading-6"
              style={{ color: COLORS.grey[700] }}
            >
              Please contact the owner or help them find their pet.
            </p>
          </div>
        )}

        {/* Pet Information */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h1
            className="text-lg font-semibold"
            style={{ color: COLORS.neutral.black }}
          >
            Pet Information
          </h1>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row">
            {/* Pet Photo */}
            <div
              className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl"
              style={{
                backgroundColor: COLORS.primary.light,
              }}
            >
              {pet.photo ? (
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="text-4xl font-semibold"
                  style={{
                    color: COLORS.primary.DEFAULT,
                  }}
                >
                  {pet.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h2
                className="text-2xl font-semibold"
                style={{ color: COLORS.neutral.black }}
              >
                {pet.name}
              </h2>

              <p className="mt-1 text-sm" style={{ color: COLORS.grey[600] }}>
                {pet.species}
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2">
                  {pet.gender === "Male" ? (
                    <MaleIcon size={18} color={COLORS.primary.DEFAULT} />
                  ) : (
                    <FemaleIcon size={18} color={COLORS.primary.DEFAULT} />
                  )}

                  <span
                    className="text-sm"
                    style={{
                      color: COLORS.grey[700],
                    }}
                  >
                    {pet.gender}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span
                    className="text-sm"
                    style={{
                      color: COLORS.grey[500],
                    }}
                  >
                    Age
                  </span>

                  <span
                    className="text-sm font-medium"
                    style={{
                      color: COLORS.neutral.black,
                    }}
                  >
                    {age}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span
                    className="text-sm"
                    style={{
                      color: COLORS.grey[500],
                    }}
                  >
                    Weight
                  </span>

                  <span
                    className="text-sm font-medium"
                    style={{
                      color: COLORS.neutral.black,
                    }}
                  >
                    {pet.weight ? `${pet.weight} kg` : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {lostReport && (
          <section
            className="rounded-xl border bg-white p-6"
            style={{
              borderColor: COLORS.status.red,
            }}
          >
            <h2
              className="text-base font-semibold"
              style={{
                color: COLORS.status.red,
              }}
            >
              Lost Pet Information
            </h2>

            <div className="mt-4 space-y-3">
              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  Last seen location
                </p>

                <p
                  className="mt-1 text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {lostReport.lastSeenLocation}
                </p>
              </div>

              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  Last seen date
                </p>

                <p
                  className="mt-1 text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {lostReport.lastSeenDate}
                  {lostReport.lastSeenTime
                    ? ` at ${lostReport.lastSeenTime}`
                    : ""}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2
            className="text-lg font-semibold"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            Owner Information
          </h2>

          {profile ? (
            <div className="mt-5 space-y-4">
              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  Owner Name
                </p>

                <p
                  className="mt-1 text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {profile.fullName}
                </p>
              </div>

              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  Phone Number
                </p>

                <p
                  className="mt-1 text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {profile.phone}
                </p>
              </div>

              <div>
                <p
                  className="text-xs"
                  style={{
                    color: COLORS.grey[500],
                  }}
                >
                  Email
                </p>

                <p
                  className="mt-1 break-all text-sm font-medium"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {profile.email}
                </p>
              </div>
            </div>
          ) : (
            <p
              className="mt-4 text-sm"
              style={{
                color: COLORS.grey[600],
              }}
            >
              Owner information is not available.
            </p>
          )}

          {profile?.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: COLORS.primary.DEFAULT,
                color: COLORS.neutral.white,
              }}
            >
              Contact Owner
            </a>
          )}
        </section>
      </div>
    </main>
  );
}
