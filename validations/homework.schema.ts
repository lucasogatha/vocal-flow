import { z } from "zod";

export const homeworkSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa un nombre para el homework")
    .max(150, "Nombre demasiado largo"),
  objective: z
    .string()
    .trim()
    .max(500, "Objetivo demasiado largo")
    .optional()
    .or(z.literal("")),
  dueDate: z.string().min(1, "Define una fecha límite"),
  notes: z
    .string()
    .trim()
    .max(1000, "Observación demasiado larga")
    .optional()
    .or(z.literal("")),
  exerciseIds: z
    .array(z.string().uuid())
    .min(1, "Selecciona al menos 1 ejercicio")
    .max(10, "Selecciona como máximo 10 ejercicios"),
});

export type HomeworkInput = z.infer<typeof homeworkSchema>;
