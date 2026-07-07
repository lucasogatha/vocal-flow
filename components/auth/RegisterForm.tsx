"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/validations/auth.schema";
import { signUp } from "@/services/auth";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    setConfirmationMessage(null);

    const { data, error } = await signUp(values);

    if (error) {
      setServerError(error.message);
      return;
    }

    // Se o projeto Supabase exigir confirmação de e-mail, não haverá
    // sessão criada imediatamente após o cadastro.
    if (!data.session) {
      setConfirmationMessage(
        "Registro completado. Revisa tu correo para confirmar la cuenta."
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.name && (
          <span className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.email && (
          <span className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.password && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </span>
        )}
      </div>

      {serverError && <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>}
      {confirmationMessage && (
        <p className="text-sm text-green-700 dark:text-green-400">{confirmationMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
