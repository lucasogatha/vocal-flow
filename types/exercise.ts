export type ExerciseCategory =
  | "Respiração"
  | "Aquecimento Vocal"
  | "Apoio Respiratório"
  | "Afinação"
  | "Voz de Peito"
  | "Voz de Cabeça"
  | "Voz Mista"
  | "Extensão Vocal"
  | "Ressonância"
  | "Dicção";

export type ExerciseLevel = "Iniciante" | "Intermediário" | "Avançado";

export type Exercise = {
  id: string;
  title: string;
  category: ExerciseCategory;
  objective: string;
  description: string;
  duration_minutes: 5 | 10 | 15;
  level: ExerciseLevel;
  tags: string[];
  order_index: number;
  created_at: string;
};
