"use client";

import { completeAssignmentAction } from "@/app/(student)/student-portal/actions";
import { Button } from "@/components/ui/button";
import { SuccessBadge } from "@/components/ui/success-badge";
import { useCompleteAction } from "@/hooks/useCompleteAction";

type CompleteHomeworkButtonProps = {
  assignmentId: string;
};

export function CompleteHomeworkButton({
  assignmentId,
}: CompleteHomeworkButtonProps) {
  const { isPending, completed, visible, trigger } = useCompleteAction(
    () => completeAssignmentAction(assignmentId),
    1400
  );

  if (completed) {
    return <SuccessBadge label="Homework concluído!" visible={visible} />;
  }

  return (
    <Button onClick={trigger} disabled={isPending}>
      {isPending ? "Salvando..." : "Marcar como concluído"}
    </Button>
  );
}
