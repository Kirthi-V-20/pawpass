"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import PetSpeciesSelect from "@/components/ui/pet-species-select";
import { compressImage } from "@/utils/compressImage";
import { usePetStore } from "@/store/petStore";
import { useAuthStore } from "@/store/authStore";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import type { Pet, PetGender } from "@/types/pet";

interface AddPetModalProps {
  open: boolean;
  onClose: () => void;
  pet?: Pet | null;
}

interface FormData {
  name: string;
  species: string;
  gender: PetGender | "";
  dateOfBirth: string;
  color: string;
  weight: string;
  notes: string;
  photo: string;
}

const initialFormData: FormData = {
  name: "",
  species: "",
  gender: "",
  dateOfBirth: "",
  color: "",
  weight: "",
  notes: "",
  photo: "",
};

export default function AddPetModal({
  open,
  onClose,
  pet = null,
}: AddPetModalProps) {
  const addPet = usePetStore((state) => state.addPet);
  const updatePet = usePetStore((state) => state.updatePet);
  const user = useAuthStore((state) => state.user);

  const isEditMode = Boolean(pet);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        gender: pet.gender,
        dateOfBirth: pet.dateOfBirth,
        color: pet.color ?? "",
        weight: pet.weight !== undefined ? String(pet.weight) : "",
        notes: pet.notes ?? "",
        photo: pet.photo ?? "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [open, pet]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const compressedImage = await compressImage(file);

      setFormData((previous) => ({
        ...previous,
        photo: compressedImage,
      }));
    } catch (error) {
      console.error("Failed to compress pet photo:", error);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.species ||
      !formData.gender ||
      !formData.dateOfBirth
    ) {
      return;
    }

    if (!user) {
      return;
    }

    if (pet) {
      updatePet(pet.id, {
        name: formData.name.trim(),
        species: formData.species as Pet["species"],
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        color: formData.color.trim() || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        notes: formData.notes.trim() || undefined,
        photo: formData.photo || undefined,
      });
    } else {
      const petId = crypto.randomUUID();

      const newPet: Pet = {
        id: petId,
        ownerId: user.id,
        name: formData.name.trim(),
        species: formData.species as Pet["species"],
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        color: formData.color.trim() || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        notes: formData.notes.trim() || undefined,
        photo: formData.photo || undefined,
        qrCodeId: `pawpass-${petId}`,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      };

      addPet(newPet);
    }

    setFormData(initialFormData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        isEditMode
          ? localize.pets.modal_edit_title
          : localize.pets.modal_add_title
      }
      onBack={handleClose}
      className="max-w-xl"
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
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-md px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLORS.primary.DEFAULT,
              color: COLORS.neutral.white,
            }}
          >
            {isEditMode ? "Save Changes" : "Save Pet"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col items-center">
          <label
            className="mb-2 block text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            Pet Photo
          </label>

          <label
            htmlFor="pet-photo"
            className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors hover:bg-orange-100"
            style={{
              borderColor: COLORS.primary.DEFAULT,
              backgroundColor: COLORS.primary.background,
            }}
          >
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Selected pet"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-1"
                style={{
                  color: COLORS.primary.DEFAULT,
                }}
              >
                <span className="text-xl leading-none">+</span>

                <span className="text-xs font-medium">Add Photo</span>
              </div>
            )}

            <input
              id="pet-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="pet-name"
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.pets.name} *
            </label>

            <Input
              id="pet-name"
              type="text"
              value={formData.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Enter pet name"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.pets.species} *
            </label>

            <PetSpeciesSelect
              value={formData.species}
              onChange={(value) => handleChange("species", value)}
              className="sm:w-full"
            />
          </div>

          <div>
            <label
              htmlFor="pet-gender"
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.pets.gender} *
            </label>

            <select
              id="pet-gender"
              value={formData.gender}
              onChange={(event) =>
                handleChange("gender", event.target.value as PetGender)
              }
              className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              style={{
                borderColor: COLORS.grey[300],
                color: formData.gender
                  ? COLORS.neutral.black
                  : COLORS.grey[400],
              }}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pet-dob"
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.pets.dob} *
            </label>

            <Input
              id="pet-dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(event) =>
                handleChange("dateOfBirth", event.target.value)
              }
            />
          </div>

          <div>
            <label
              htmlFor="pet-color"
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.pets.color}
            </label>

            <Input
              id="pet-color"
              type="text"
              value={formData.color}
              onChange={(event) => handleChange("color", event.target.value)}
              placeholder="e.g. Brown and White"
            />
          </div>

          <div>
            <label
              htmlFor="pet-weight"
              className="mb-2 block text-sm font-medium"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.pets.weight}
            </label>

            <Input
              id="pet-weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={(event) => handleChange("weight", event.target.value)}
              placeholder="Enter weight in kg"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="pet-notes"
            className="mb-2 block text-sm font-medium"
            style={{
              color: COLORS.neutral.black,
            }}
          >
            {localize.pets.notes}
          </label>

          <textarea
            id="pet-notes"
            value={formData.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            placeholder="Add any additional information about your pet"
            rows={4}
            className="w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            style={{
              borderColor: COLORS.grey[300],
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
