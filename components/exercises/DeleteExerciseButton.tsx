"use client";

import { useTransition } from "react";
import { deleteExerciseAction } from "@/app/(teacher)/exercises/[id]/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

type DeleteExerciseButtonProps = {
  exerciseId: string;
  exerciseTitle: string;
  usageCount: number;
};

export function DeleteExerciseButton({
  exerciseId,
  exerciseTitle,
  usageCount,
}: DeleteExerciseButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(() => {
      deleteExerciseAction(exerciseId);
    });
  }

  const usageWarning =
    usageCount > 0
      ? ` Actualmente lo usas en ${usageCount} homework${
          usageCount === 1 ? "" : "s"
        } — se quitará de ahí también.`
      : "";

  return (
    <ConfirmDialog
      title="Eliminar ejercicio"
      description={`¿Seguro que quieres eliminar "${exerciseTitle}" de tu Biblioteca?${usageWarning} Esta acción no se puede deshacer.`}
      confirmLabel="Eliminar"
      onConfirm={handleConfirm}
      trigger={(open) => (
        <Button
          type="button"
          variant="outline"
          onClick={open}
          disabled={isPending}
          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          {isPending ? "Eliminando..." : "Eliminar ejercicio"}
        </Button>
      )}
    />
  );
}
