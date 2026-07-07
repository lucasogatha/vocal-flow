"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/services/auth";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <ConfirmDialog
      title="Cerrar sesión"
      description="Deberás iniciar sesión de nuevo para acceder al panel."
      confirmLabel="Cerrar sesión"
      onConfirm={handleLogout}
      trigger={(open) => (
        <button
          onClick={open}
          disabled={isLoggingOut}
          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
        </button>
      )}
    />
  );
}
