"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/layout/LogoutButton";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Alunos" },
  { href: "/exercises", label: "Exercícios" },
  { href: "/homeworks", label: "Homeworks" },
  { href: "/pricing", label: "Planos" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-sm font-semibold">VocalFlow</span>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-sm font-medium text-black"
                    : "text-sm text-gray-500 hover:text-black"
                }
              >
                {link.label}
              </Link>
            );
          })}

          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
