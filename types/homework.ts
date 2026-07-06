export type HomeworkStatus = "pending" | "completed";

export type Homework = {
  id: string;
  teacher_id: string;
  student_id: string;
  name: string;
  objective: string | null;
  due_date: string;
  notes: string | null;
  status: HomeworkStatus;
  created_at: string;
  completed_at: string | null;
};

export type HomeworkExerciseItem = {
  linkId: string;
  position: number;
  completedAt: string | null;
  exercise: {
    id: string;
    title: string;
    description: string;
    duration_minutes: number;
  };
};

export type HomeworkWithExercises = Homework & {
  exercises: HomeworkExerciseItem[];
};

export type HomeworkWithCount = Homework & {
  exerciseCount: number;
};
