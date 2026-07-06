import Link from "next/link";
import { LogoutButton } from "@/components/layout/LogoutButton";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/teachers", label: "Professores" },
  { href: "/admin/users", label: "Usuários" },
  { href: "/admin/logs", label: "Logs" },
];

export function AdminHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-sm font-semibold">
          VocalFlow <span className="text-gray-400">· Admin</span>
        </span>

        <div className="flex items-center gap-6">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
