import type { ExerciseCategory } from "@/types/exercise";

// Paleta fixa e discreta — uma cor por categoria, para facilitar a
// varredura visual na biblioteca sem fugir do "poucas cores" do projeto.
// Cada uma tem uma variante "dark:" própria (os tons "-50"/"-700" claros
// ficariam ilegíveis ou muito fortes sobre um fundo escuro).
export const CATEGORY_STYLES: Record<ExerciseCategory, string> = {
  "Respiración": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "Calentamiento Vocal": "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "Apoyo Respiratorio": "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  "Afinación": "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "Voz de Pecho": "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "Voz de Cabeza": "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  "Voz Mixta": "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300",
  "Extensión Vocal": "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "Resonancia": "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  "Dicción": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};
