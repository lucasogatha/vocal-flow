import type { ExerciseCategory } from "@/types/exercise";

// Paleta fixa e discreta — uma cor por categoria, para facilitar a
// varredura visual na biblioteca sem fugir do "poucas cores" do projeto.
export const CATEGORY_STYLES: Record<ExerciseCategory, string> = {
  "Respiración": "bg-blue-50 text-blue-700",
  "Calentamiento Vocal": "bg-amber-50 text-amber-700",
  "Apoyo Respiratorio": "bg-cyan-50 text-cyan-700",
  "Afinación": "bg-violet-50 text-violet-700",
  "Voz de Pecho": "bg-rose-50 text-rose-700",
  "Voz de Cabeza": "bg-sky-50 text-sky-700",
  "Voz Mixta": "bg-fuchsia-50 text-fuchsia-700",
  "Extensión Vocal": "bg-orange-50 text-orange-700",
  "Resonancia": "bg-teal-50 text-teal-700",
  "Dicción": "bg-emerald-50 text-emerald-700",
};
