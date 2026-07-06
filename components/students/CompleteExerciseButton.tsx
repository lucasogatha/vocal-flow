"use client";

import { completeHomeworkExerciseAction } from "@/app/(student)/student-portal/homework/[id]/actions";
import { Button } from "@/components/ui/button";
import { SuccessBadge } from "@/components/ui/success-badge";
import { useCompleteAction } from "@/hooks/useCompleteAction";

type CompleteExerciseButtonProps = {
  linkId: string;
};

export function CompleteExerciseButton({
  linkId,
}: CompleteExerciseButtonProps) {
  const { isPending, completed, visible, trigger } = useCompleteAction(
    () => completeHomeworkExerciseAction(linkId),
    900
  );

  if (completed) {
    return <SuccessBadge label="Completado" visible={visible} />;
  }

  return (
    <Button onClick={trigger} disabled={isPending} size="sm">
      {isPending ? "Guardando..." : "Completar ejercicio"}
    </Button>
  );
}
