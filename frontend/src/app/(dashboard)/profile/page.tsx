"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";

import {
  deleteProfileImage,
  getProfileImage,
  saveProfileImage,
} from "@/lib/imageDb";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  const { getProfile, setProfile, updateProfile } = useProfileStore();

  const profile = user ? getProfile(user.id) : null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      setFullName("");
      setEmail("");
      setPhone("");
      return;
    }

    const currentProfile = getProfile(user.id);

    if (currentProfile) {
      setFullName(currentProfile.fullName);
      setEmail(currentProfile.email);
      setPhone(currentProfile.phone);
      return;
    }

    setFullName(user.fullName);
    setEmail(user.email);
    setPhone("");
  }, [user, getProfile]);

  useEffect(() => {
    if (!user) {
      setPhoto(null);
      return;
    }

    const loadProfileImage = async () => {
      try {
        const storedImage = await getProfileImage(user.id);

        if (storedImage) {
          setPhoto(storedImage);
        } else {
          setPhoto(null);
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    };

    loadProfileImage();
  }, [user]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    const profileData = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      if (photo) {
        await saveProfileImage(user.id, photo);
      } else {
        await deleteProfileImage(user.id);
      }

      if (profile) {
        updateProfile(user.id, profileData);
      } else {
        setProfile(user.id, profileData);
      }

      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col overflow-hidden p-6">
        <div
          className="profile-scroll-area mx-auto min-h-0 w-full max-w-6xl flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="mb-6">
            <h1
              className="text-2xl font-semibold"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.profile.title}
            </h1>

            <p
              className="mt-1 text-sm"
              style={{
                color: COLORS.grey[600],
              }}
            >
              {localize.profile.subtitle}
            </p>
          </div>

          <div
            className="mb-6 rounded-lg border bg-white p-6"
            style={{
              borderColor: COLORS.grey[200],
            }}
          >
            <div className="flex items-center gap-5">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{
                  backgroundColor: COLORS.grey[100],
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={localize.common.logo_alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="text-2xl font-semibold"
                    style={{
                      color: COLORS.primary.DEFAULT,
                    }}
                  >
                    {fullName.charAt(0).toUpperCase() || "P"}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: COLORS.neutral.black,
                  }}
                >
                  {fullName || localize.profile.full_name}
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: COLORS.grey[600],
                  }}
                >
                  {email || localize.profile.email}
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: COLORS.grey[600],
                  }}
                >
                  {phone || localize.profile.phone}
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-sm font-medium"
                  style={{
                    color: COLORS.primary.DEFAULT,
                  }}
                >
                  {localize.profile.change_photo}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border bg-white p-6"
            style={{
              borderColor: COLORS.grey[200],
            }}
          >
            <div className="mb-6">
              <h2
                className="text-lg font-semibold"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {localize.profile.personal_info}
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color: COLORS.grey[600],
                }}
              >
                {localize.profile.update_info}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.profile.full_name}
                </label>

                <Input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder={localize.profile.enter_full_name}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.profile.email}
                </label>

                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={localize.profile.enter_email}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{
                    color: COLORS.grey[700],
                  }}
                >
                  {localize.profile.phone}
                </label>

                <Input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={localize.profile.enter_phone}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-4">
              {isSaved && (
                <p
                  className="text-sm"
                  style={{
                    color: COLORS.status.green,
                  }}
                >
                  {localize.profile.profile_updated}
                </p>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: COLORS.primary.DEFAULT,
                }}
              >
                {localize.profile.save_changes}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-scroll-area::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
