import Link from "next/link";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "all", label: "Todos" },
  { value: "sent", label: "Enviados" },
  { value: "completed", label: "Concluídos" },
  { value: "overdue", label: "Atrasados" },
];

type TimelineFiltersProps = {
  studentId: string;
  active: string;
};

export function TimelineFilters({ studentId, active }: TimelineFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <Link
          key={filter.value}
          href={
            filter.value === "all"
              ? `/students/${studentId}`
              : `/students/${studentId}?filter=${filter.value}`
          }
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            active === filter.value
              ? "border-accent bg-accent/10 text-accent"
              : "border-gray-200 text-gray-500 hover:border-gray-300"
          )}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}
