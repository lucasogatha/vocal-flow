import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type StudentSearchProps = {
  defaultValue?: string;
};

export function StudentSearch({ defaultValue }: StudentSearchProps) {
  return (
    <form method="GET" className="flex gap-2">
      <Input
        type="text"
        name="search"
        defaultValue={defaultValue}
        placeholder="Buscar alumno por nombre"
        className="max-w-xs"
      />
      <Button type="submit" variant="outline">
        Buscar
      </Button>
    </form>
  );
}
