import type { Homework } from "@/types/homework";

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  completed: "Concluído",
};

function isOverdue(homework: Homework, today: string): boolean {
  return homework.status === "pending" && homework.due_date < today;
}

// Contagens usadas nos cards de estatística da página do aluno.
export function getHomeworkCounts(homeworks: Homework[]) {
  const today = new Date().toISOString().split("T")[0];

  return {
    sent: homeworks.length,
    completed: homeworks.filter((homework) => homework.status === "completed")
      .length,
    overdue: homeworks.filter((homework) => isOverdue(homework, today))
      .length,
  };
}
