import { z } from "zod";

export const studentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre del alumno")
    .max(100, "Nombre demasiado largo"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Correo electrónico inválido")
    .max(255, "Correo electrónico demasiado largo"),
  phone: z
    .string()
    .trim()
    .max(20, "Teléfono demasiado largo")
    .optional()
    .or(z.literal("")),
});

export type StudentInput = z.infer<typeof studentSchema>;
