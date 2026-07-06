export type ExerciseCategory =
  | "Respiración"
  | "Calentamiento Vocal"
  | "Apoyo Respiratorio"
  | "Afinación"
  | "Voz de Pecho"
  | "Voz de Cabeza"
  | "Voz Mixta"
  | "Extensión Vocal"
  | "Resonancia"
  | "Dicción";

export type ExerciseLevel = "Principiante" | "Intermedio" | "Avanzado";

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
