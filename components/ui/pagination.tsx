import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between pt-2">
      <Link
        href={buildHref(currentPage - 1)}
        className={cn(
          "text-sm",
          hasPrevious
            ? "text-black hover:underline"
            : "pointer-events-none text-gray-300"
        )}
      >
        Anterior
      </Link>

      <span className="text-sm text-gray-500">
        Página {currentPage} de {totalPages}
      </span>

      <Link
        href={buildHref(currentPage + 1)}
        className={cn(
          "text-sm",
          hasNext
            ? "text-black hover:underline"
            : "pointer-events-none text-gray-300"
        )}
      >
        Siguiente
      </Link>
    </div>
  );
}
