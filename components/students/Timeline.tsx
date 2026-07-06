import { Send, CheckCircle2, AlertTriangle, History } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { TimelineEvent, TimelineEventType } from "@/lib/assignment-status";

const EVENT_CONFIG: Record<
  TimelineEventType,
  { icon: typeof Send; label: string; className: string }
> = {
  sent: {
    icon: Send,
    label: "Homework enviado",
    className: "bg-accent/10 text-accent",
  },
  completed: {
    icon: CheckCircle2,
    label: "Homework concluído",
    className: "bg-green-100 text-green-700",
  },
  overdue: {
    icon: AlertTriangle,
    label: "Homework atrasado",
    className: "bg-red-100 text-red-700",
  },
};

type TimelineProps = {
  events: TimelineEvent[];
};

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Nenhuma atividade registrada ainda."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {events.map((event) => {
        const config = EVENT_CONFIG[event.type];
        const Icon = config.icon;

        return (
          <li key={event.id} className="flex gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.className}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {config.label}: {event.lessonTitle}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(event.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
