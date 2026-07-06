import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LessonSearchProps = {
  defaultSearch?: string;
  defaultSort?: string;
};

export function LessonSearch({ defaultSearch, defaultSort }: LessonSearchProps) {
  return (
    <form method="GET" className="flex flex-wrap gap-2">
      <Input
        type="text"
        name="search"
        defaultValue={defaultSearch}
        placeholder="Buscar aula por título"
        className="max-w-xs"
      />

      <select
        name="sort"
        defaultValue={defaultSort ?? "order"}
        className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="order">Ordem da biblioteca</option>
        <option value="title">Título (A-Z)</option>
      </select>

      <Button type="submit" variant="outline">
        Filtrar
      </Button>
    </form>
  );
}
