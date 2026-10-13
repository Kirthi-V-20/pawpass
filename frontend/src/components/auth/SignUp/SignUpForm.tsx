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

export default function SignUpForm() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    signUp(fullName, email, password);

    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1
          className="text-2xl font-semibold"
          style={{ color: COLORS.neutral.black }}
        >
          {localize.auth.signup_form_title}
        </h1>

        <p className="mt-1 text-sm" style={{ color: COLORS.grey[500] }}>
          {localize.auth.signup_form_subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <label
            htmlFor="fullName"
            className="text-sm font-medium"
            style={{ color: COLORS.neutral.black }}
          >
            {localize.auth.fullname_label}
          </label>

          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
          />
        </div>

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
              autoComplete="new-password"
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

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium"
            style={{ color: COLORS.neutral.black }}
          >
            {localize.auth.confirm_password_label}
          </label>

          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.grey[500] }}
              aria-label={localize.auth.confirm_password_label}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
            {localize.auth.create_account}
          </Button>
        </div>
      </form>

      <p
        className="mt-5 text-center text-sm"
        style={{ color: COLORS.grey[500] }}
      >
        {localize.auth.have_account}{" "}
        <Link
          href={ROUTES.SIGN_IN}
          className="font-medium"
          style={{ color: COLORS.primary.DEFAULT }}
        >
          {localize.auth.login}
        </Link>
      </p>
    </div>
  );
}
