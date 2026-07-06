import type { AssignmentWithLesson } from "@/types/assignment";

// Rótulos em português para o status simples (pending/completed) usado por
// assignments e homeworks. Centralizado aqui para evitar duplicação entre
// a página do aluno (visão do professor) e o portal do aluno.
export const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  completed: "Concluído",
};

export type TimelineEventType = "sent" | "completed" | "overdue";

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  lessonTitle: string;
  date: string;
};

function isOverdue(assignment: AssignmentWithLesson, today: string): boolean {
  return assignment.status === "pending" && assignment.due_date < today;
}

// Cada homework gera 1 ou 2 eventos: "enviado" sempre, e depois
// "concluído" ou "atrasado", dependendo do que aconteceu com o prazo.
export function buildTimelineEvents(
  assignments: AssignmentWithLesson[]
): TimelineEvent[] {
  const today = new Date().toISOString().split("T")[0];
  const events: TimelineEvent[] = [];

  for (const assignment of assignments) {
    events.push({
      id: `${assignment.id}-sent`,
      type: "sent",
      lessonTitle: assignment.lesson_title,
      date: assignment.assigned_at,
    });

    if (assignment.status === "completed" && assignment.completed_at) {
      events.push({
        id: `${assignment.id}-completed`,
        type: "completed",
        lessonTitle: assignment.lesson_title,
        date: assignment.completed_at,
      });
    } else if (isOverdue(assignment, today)) {
      events.push({
        id: `${assignment.id}-overdue`,
        type: "overdue",
        lessonTitle: assignment.lesson_title,
        date: `${assignment.due_date}T00:00:00`,
      });
    }
  }

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Contagens usadas nos cards de estatística da página do aluno.
export function getAssignmentCounts(assignments: AssignmentWithLesson[]) {
  const today = new Date().toISOString().split("T")[0];

  return {
    sent: assignments.length,
    completed: assignments.filter((a) => a.status === "completed").length,
    overdue: assignments.filter((a) => isOverdue(a, today)).length,
  };
}
