export type AssignmentStatus = "pending" | "completed";

export type Assignment = {
  id: string;
  teacher_id: string;
  student_id: string;
  lesson_id: string;
  status: AssignmentStatus;
  due_date: string;
  assigned_at: string;
  completed_at: string | null;
  teacher_notes: string | null;
};

// Usado para exibir o histórico já com o título da aula.
export type AssignmentWithLesson = Assignment & {
  lesson_title: string;
};

// Usado no portal do aluno, com os detalhes completos da aula.
export type AssignmentWithLessonDetails = Assignment & {
  lesson: {
    title: string;
    objective: string;
    exercises: string[];
    homework: string;
    order_index: number;
  } | null;
};
