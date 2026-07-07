import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EXERCISE_CATEGORIES, EXERCISE_LEVELS } from "@/lib/exercise-constants";

type ExerciseFiltersProps = {
  defaultSearch?: string;
  defaultCategory?: string;
  defaultLevel?: string;
};

export function ExerciseFilters({
  defaultSearch,
  defaultCategory,
  defaultLevel,
}: ExerciseFiltersProps) {
  return (
    <form method="GET" className="flex flex-wrap gap-2">
      <Input
        type="text"
        name="search"
        defaultValue={defaultSearch}
        placeholder="Buscar ejercicio por título"
        className="max-w-xs"
      />

      <select
        name="category"
        defaultValue={defaultCategory ?? ""}
        className="h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">Todas las categorías</option>
        {EXERCISE_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        name="level"
        defaultValue={defaultLevel ?? ""}
        className="h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">Todos los niveles</option>
        {EXERCISE_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <Button type="submit" variant="outline">
        Filtrar
      </Button>
    </form>
  );
}
