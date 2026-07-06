import { z } from "zod";

export const studentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome do aluno")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  phone: z
    .string()
    .trim()
    .max(20, "Telefone muito longo")
    .optional()
    .or(z.literal("")),
});

export type StudentInput = z.infer<typeof studentSchema>;
