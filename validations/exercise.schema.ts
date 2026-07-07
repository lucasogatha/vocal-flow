import { z } from "zod";
import { EXERCISE_CATEGORIES, EXERCISE_LEVELS } from "@/lib/exercise-constants";

export const exerciseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Ingresa un título")
    .max(150, "Título demasiado largo"),
  category: z.enum(EXERCISE_CATEGORIES as [string, ...string[]], {
    errorMap: () => ({ message: "Selecciona una categoría" }),
  }),
  objective: z
    .string()
    .trim()
    .min(2, "Ingresa un objetivo")
    .max(300, "Objetivo demasiado largo"),
  description: z
    .string()
    .trim()
    .min(2, "Ingresa una descripción")
    .max(2000, "Descripción demasiado larga"),
  duration_minutes: z.coerce
    .number()
    .refine((value) => [5, 10, 15].includes(value), {
      message: "Selecciona una duración válida",
    }),
  level: z.enum(EXERCISE_LEVELS as [string, ...string[]], {
    errorMap: () => ({ message: "Selecciona un nivel" }),
  }),
  tags: z.string().trim().optional().or(z.literal("")),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;
