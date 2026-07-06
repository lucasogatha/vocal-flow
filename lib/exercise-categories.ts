import type { ExerciseCategory } from "@/types/exercise";

// Paleta fixa e discreta — uma cor por categoria, para facilitar a
// varredura visual na biblioteca sem fugir do "poucas cores" do projeto.
export const CATEGORY_STYLES: Record<ExerciseCategory, string> = {
  "Respiração": "bg-blue-50 text-blue-700",
  "Aquecimento Vocal": "bg-amber-50 text-amber-700",
  "Apoio Respiratório": "bg-cyan-50 text-cyan-700",
  "Afinação": "bg-violet-50 text-violet-700",
  "Voz de Peito": "bg-rose-50 text-rose-700",
  "Voz de Cabeça": "bg-sky-50 text-sky-700",
  "Voz Mista": "bg-fuchsia-50 text-fuchsia-700",
  "Extensão Vocal": "bg-orange-50 text-orange-700",
  "Ressonância": "bg-teal-50 text-teal-700",
  "Dicção": "bg-emerald-50 text-emerald-700",
};
