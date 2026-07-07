"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/teachers", label: "Profesores" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/logs", label: "Logs" },
];

export function AdminHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo />
          <span className="text-sm font-semibold">
            VocalFlow <span className="text-muted-foreground">· Admin</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <LogoutButton />
        </div>

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
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-1 border-t border-border pt-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  );
}
