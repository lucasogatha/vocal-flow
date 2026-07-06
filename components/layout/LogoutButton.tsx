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
      title="Sair da conta"
      description="Você precisará entrar novamente para acessar o painel."
      confirmLabel="Sair"
      onConfirm={handleLogout}
      trigger={(open) => (
        <button
          onClick={open}
          disabled={isLoggingOut}
          className="text-sm text-gray-500 hover:text-black disabled:opacity-50"
        >
          {isLoggingOut ? "Saindo..." : "Sair"}
        </button>
      )}
    />
  );
}
