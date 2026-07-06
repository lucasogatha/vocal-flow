"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/services/auth";

export function StudentHeader() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <span className="text-sm font-semibold">VocalFlow</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-black"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
