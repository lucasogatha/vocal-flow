import { z } from "zod";

export const assignmentSchema = z.object({
  lessonId: z.string().uuid("Selecione uma aula"),
  dueDate: z.string().min(1, "Defina uma data limite"),
  teacherNotes: z
    .string()
    .trim()
    .max(1000, "Observação muito longa")
    .optional()
    .or(z.literal("")),
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;
