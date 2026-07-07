"use client";

import { useTransition } from "react";
import { deleteStudentAction } from "@/app/(teacher)/students/[id]/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

type DeleteStudentButtonProps = {
  studentId: string;
  studentName: string;
};

export function DeleteStudentButton({
  studentId,
  studentName,
}: DeleteStudentButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(() => {
      deleteStudentAction(studentId);
    });
  }

  return (
    <ConfirmDialog
      title="Eliminar alumno"
      description={`¿Seguro que quieres eliminar a ${studentName}? Esto también elimina todos sus homeworks. Esta acción no se puede deshacer.`}
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
          {isPending ? "Eliminando..." : "Eliminar alumno"}
        </Button>
      )}
    />
  );
}
