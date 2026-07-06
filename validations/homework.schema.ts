import { z } from "zod";

export const homeworkSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome para o homework")
    .max(150, "Nome muito longo"),
  objective: z
    .string()
    .trim()
    .max(500, "Objetivo muito longo")
    .optional()
    .or(z.literal("")),
  dueDate: z.string().min(1, "Defina uma data limite"),
  notes: z
    .string()
    .trim()
    .max(1000, "Observação muito longa")
    .optional()
    .or(z.literal("")),
  exerciseIds: z
    .array(z.string().uuid())
    .min(1, "Selecione pelo menos 1 exercício")
    .max(10, "Selecione no máximo 10 exercícios"),
});

export type HomeworkInput = z.infer<typeof homeworkSchema>;
