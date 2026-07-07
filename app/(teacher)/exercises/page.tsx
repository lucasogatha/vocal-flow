import Link from "next/link";
import { notFound } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { getExercises } from "@/services/exercises";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { ExerciseFilters } from "@/components/exercises/ExerciseFilters";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { buildPaginationHref } from "@/lib/pagination";
import { getCurrentUser } from "@/lib/auth-guard";

const PAGE_SIZE = 9;

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    category?: string;
    level?: string;
    page?: string;
  };
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const search = searchParams.search ?? "";
  const category = searchParams.category ?? "";
  const level = searchParams.level ?? "";
  const currentPage =
    Number(searchParams.page) > 0 ? Number(searchParams.page) : 1;

  const { exercises, totalCount } = await getExercises({
    teacherId: user.id,
    search,
    category: category || undefined,
    level: level || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function buildHref(page: number) {
    return buildPaginationHref("/exercises", { search, category, level }, page);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Biblioteca de Ejercicios</h1>

        <Link href="/exercises/new" className={buttonVariants()}>
          Crear ejercicio
        </Link>
      </div>

      <ExerciseFilters
        defaultSearch={search}
        defaultCategory={category}
        defaultLevel={level}
      />

      {exercises.length === 0 ? (
        <EmptyState icon={Dumbbell} title="Ningún ejercicio encontrado." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </div>
  );
}
