import Image from "next/image";

import SignUpForm from "@/components/auth/SignUp/SignUpForm";

import { PetsIcon } from "@/icons/PetsIcon";
import { HealthIcon } from "@/icons/HealthIcon";
import { QRIcon } from "@/icons/QRIcon";
import { LostIcon } from "@/icons/LostIcon";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";

const features = [
  {
    text: localize.auth.feature_profiles,
    icon: PetsIcon,
  },
  {
    text: localize.auth.feature_health,
    icon: HealthIcon,
  },
  {
    text: localize.auth.feature_qr,
    icon: QRIcon,
  },
  {
    text: localize.auth.feature_lost,
    icon: LostIcon,
  },
];

export default function SignUpPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.primary.background,
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-8 py-8 lg:px-16">
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <section className="flex flex-col">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/logo.png"
                alt={localize.common.logo_alt}
                width={52}
                height={52}
                priority
                className="h-12 w-12 object-contain"
              />

              <div className="text-2xl font-bold tracking-tight">
                <span style={{ color: COLORS.primary.DEFAULT }}>
                  {localize.common.logo_paw}
                </span>

                <span style={{ color: COLORS.neutral.black }}>
                  {localize.common.logo_pass}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h2
                className="max-w-lg text-3xl font-semibold leading-tight"
                style={{ color: COLORS.neutral.black }}
              >
                {localize.auth.signup_title}
              </h2>

              <p
                className="mt-2 max-w-md text-sm leading-6"
                style={{ color: COLORS.grey[600] }}
              >
                {localize.auth.signup_subtitle}
              </p>
            </div>

            <div className="mt-4 space-y-1.5">
              {features.map(({ text, icon: Icon }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: COLORS.primary.light,
                    }}
                  >
                    <Icon size={17} color={COLORS.primary.DEFAULT} />
                  </div>

                  <span className="text-sm" style={{ color: COLORS.grey[700] }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-center lg:justify-start">
              <Image
                src="/assets/images/pawpass.png"
                alt={localize.common.pet_image_alt}
                width={420}
                height={300}
                priority
                className="h-auto max-h-64 w-auto object-contain"
              />
            </div>
          </section>

          <section className="flex items-center justify-center">
            <SignUpForm />
          </section>
        </div>
      </div>
    </main>
  );
}
