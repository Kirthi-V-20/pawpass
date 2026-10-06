"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/authStore";

export default function SignInForm() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const success = signIn(email, password);

    if (success) {
      router.push(ROUTES.DASHBOARD);
      return;
    }

    setError("Invalid email or password.");
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1
          className="text-2xl font-semibold"
          style={{ color: COLORS.neutral.black }}
        >
          {localize.auth.signin_form_title}
        </h1>

        <p className="mt-1 text-sm" style={{ color: COLORS.grey[500] }}>
          {localize.auth.signin_form_subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium"
            style={{ color: COLORS.neutral.black }}
          >
            {localize.auth.email_label}
          </label>

          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium"
            style={{ color: COLORS.neutral.black }}
          >
            {localize.auth.password_label}
          </label>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.grey[500] }}
              aria-label={localize.auth.password_label}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm" style={{ color: COLORS.status.red }}>
            {error}
          </p>
        )}

        <div className="pt-1">
          <Button
            type="submit"
            className="h-10 w-full"
            style={{
              backgroundColor: COLORS.primary.DEFAULT,
            }}
          >
            {localize.auth.signin_button}
          </Button>
        </div>
      </form>

      <p
        className="mt-5 text-center text-sm"
        style={{ color: COLORS.grey[500] }}
      >
        {localize.auth.no_account}{" "}
        <Link
          href={ROUTES.SIGN_UP}
          className="font-medium"
          style={{ color: COLORS.primary.DEFAULT }}
        >
          {localize.auth.signup}
        </Link>
      </p>
    </div>
  );
}
