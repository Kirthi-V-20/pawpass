"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { usePetStore } from "@/store/petStore";
import { useAuthStore } from "@/store/authStore";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { DownloadIcon } from "@/icons/DownloadIcon";
import { QRIcon } from "@/icons/QRIcon";
import { ShareIcon } from "@/icons/ShareIcon";

import QRViewModal from "@/components/modals/QRViewModal";

import { downloadQRCode } from "@/utils/downloadQRCode";
import { shareQRCode } from "@/utils/shareQRCode";

import type { Pet } from "@/types/pet";

export default function QRCodesPage() {
  const { pets } = usePetStore();
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const filteredPets = useMemo(() => {
    if (!user) {
      return [];
    }

    const searchValue = search.trim().toLowerCase();

    return pets.filter((pet) => {
      if (pet.ownerId !== user.id) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      return pet.name.toLowerCase().includes(searchValue);
    });
  }, [pets, user, search]);

  const handleDownload = async (pet: Pet) => {
    await downloadQRCode(`qr-codes-${pet.id}`, pet.name);
  };

  const handleShare = async (pet: Pet) => {
    const qrData = {
      qrCodeId: pet.qrCodeId,
      name: pet.name,
      species: pet.species,
      gender: pet.gender,
      dateOfBirth: pet.dateOfBirth,
      weight: pet.weight,
    };

    await shareQRCode(`qr-codes-${pet.id}`, pet.name, JSON.stringify(qrData));
  };

  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1
            className="text-2xl font-semibold"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {localize.qr.title}
          </h1>

          <p
            className="mt-1 max-w-2xl text-sm"
            style={{
              color: COLORS.grey[600],
            }}
          >
            {localize.qr.subtitle}
          </p>
        </div>

        <div className="w-full md:w-72 md:shrink-0">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={localize.qr.search_placeholder}
            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
            style={
              {
                borderColor: COLORS.grey[300],
                color: COLORS.neutral.black,
                backgroundColor: COLORS.neutral.white,
                "--tw-ring-color": COLORS.primary.DEFAULT,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {filteredPets.length > 0 ? (
        <div className="mt-8 w-full overflow-x-auto pb-4">
          <div className="flex w-full gap-6">
            {filteredPets.map((pet) => {
              const qrData = {
                qrCodeId: pet.qrCodeId,
                name: pet.name,
                species: pet.species,
                gender: pet.gender,
                dateOfBirth: pet.dateOfBirth,
                weight: pet.weight,
              };

              return (
                <div
                  key={pet.id}
                  className="w-full shrink-0 rounded-2xl border p-4 sm:p-6 md:w-[calc((100%-24px)/2)]"
                  style={{
                    borderColor: COLORS.grey[200],
                    backgroundColor: COLORS.neutral.white,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                      {pet.photo ? (
                        <img
                          src={pet.photo}
                          alt={pet.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{
                            backgroundColor: COLORS.primary.light,
                            color: COLORS.primary.DEFAULT,
                          }}
                        >
                          <span className="text-lg font-semibold">
                            {pet.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2
                        className="truncate text-lg font-semibold"
                        style={{
                          color: COLORS.neutral.black,
                        }}
                      >
                        {pet.name}
                      </h2>

                      <p
                        className="mt-1 truncate text-sm"
                        style={{
                          color: COLORS.grey[600],
                        }}
                      >
                        {localize.qr.pet_id}: {pet.qrCodeId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div
                      className="rounded-xl border p-3"
                      style={{
                        borderColor: COLORS.grey[200],
                        backgroundColor: COLORS.neutral.white,
                      }}
                    >
                      <QRCodeSVG
                        id={`qr-codes-${pet.id}`}
                        value={JSON.stringify(qrData)}
                        size={240}
                        level="M"
                        bgColor={COLORS.neutral.white}
                        fgColor={COLORS.neutral.black}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => handleDownload(pet)}
                      className="flex items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                      style={{
                        borderColor: COLORS.grey[300],
                        color: COLORS.neutral.black,
                      }}
                    >
                      <DownloadIcon size={16} color={COLORS.neutral.black} />

                      {localize.qr.download}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(pet)}
                      className="flex items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                      style={{
                        borderColor: COLORS.grey[300],
                        color: COLORS.neutral.black,
                      }}
                    >
                      <ShareIcon size={16} color={COLORS.neutral.black} />

                      {localize.qr.share}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPet(pet)}
                      className="flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: COLORS.primary.DEFAULT,
                        color: COLORS.neutral.white,
                      }}
                    >
                      <QRIcon size={16} color={COLORS.neutral.white} />

                      {localize.qr.view_qr}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="mt-10 rounded-2xl border p-6 text-center sm:p-10"
          style={{
            borderColor: COLORS.grey[200],
            backgroundColor: COLORS.neutral.white,
          }}
        >
          <div className="flex justify-center">
            <QRIcon size={40} color={COLORS.grey[400]} />
          </div>

          <h2
            className="mt-4 text-lg font-semibold"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {localize.qr.no_pets}
          </h2>

          <p
            className="mt-2 text-sm"
            style={{
              color: COLORS.grey[600],
            }}
          >
            {localize.qr.no_pets_description}
          </p>
        </div>
      )}

      <QRViewModal
        open={selectedPet !== null}
        pet={selectedPet}
        onClose={() => setSelectedPet(null)}
      />
    </div>
  );
}
