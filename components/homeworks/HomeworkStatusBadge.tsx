import { cn } from "@/lib/utils";
import type { HomeworkOverviewStatus } from "@/services/homeworks";

const STATUS_CONFIG: Record<
  HomeworkOverviewStatus,
  { label: string; className: string }
> = {
  in_progress: {
    label: "En progreso",
    className: "bg-accent/10 text-accent",
  },
  completed: {
    label: "Completado",
    className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  overdue: {
    label: "Vencido",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export function HomeworkStatusBadge({
  status,
}: {
  status: HomeworkOverviewStatus;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
