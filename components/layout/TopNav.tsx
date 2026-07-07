"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Alumnos" },
  { href: "/exercises", label: "Ejercicios" },
  { href: "/homeworks", label: "Homeworks" },
  { href: "/pricing", label: "Planes" },
];

export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
          <span className="text-sm font-semibold">VocalFlow</span>
        </Link>

        {/* Links completos — só a partir de telas médias */}
        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-sm font-medium text-foreground"
                    : "text-sm text-muted-foreground hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            );
          })}

          <ThemeToggle />
          <LogoutButton />
        </div>

        {/* Celular: só o toggle de tema e o botão de menu */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Abrir menú"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-border px-4 py-3 sm:hidden">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  isActive
                    ? "rounded-md bg-muted px-2 py-2 text-sm font-medium text-foreground"
                    : "rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted"
                }
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-1 border-t border-border pt-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  );
}
