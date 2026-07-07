import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function StudentHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <Link href="/student-portal" className="flex items-center gap-2">
          <Logo />
          <span className="text-sm font-semibold">VocalFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
