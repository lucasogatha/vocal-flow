import { cn } from "@/lib/utils";
import type { HomeworkOverviewStatus } from "@/services/homeworks";

const STATUS_CONFIG: Record<
  HomeworkOverviewStatus,
  { label: string; className: string }
> = {
  in_progress: {
    label: "Em andamento",
    className: "bg-accent/10 text-accent",
  },
  completed: {
    label: "Concluído",
    className: "bg-green-100 text-green-700",
  },
  overdue: {
    label: "Atrasado",
    className: "bg-red-100 text-red-700",
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
