import type { ExerciseCategory, ExerciseLevel } from "@/types/exercise";

// Extraído de services/exercises.ts propositalmente: este arquivo não
// importa nada exclusivo de servidor (sem cookies/headers, sem
// Supabase), então pode ser usado com segurança tanto por
// Server Components/services quanto por Client Components (formulários,
// filtros).
export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  "Respiración",
  "Calentamiento Vocal",
  "Apoyo Respiratorio",
  "Afinación",
  "Voz de Pecho",
  "Voz de Cabeza",
  "Voz Mixta",
  "Extensión Vocal",
  "Resonancia",
  "Dicción",
];

export const EXERCISE_LEVELS: ExerciseLevel[] = [
  "Principiante",
  "Intermedio",
  "Avanzado",
];
