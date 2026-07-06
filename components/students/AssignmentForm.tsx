"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createAssignmentAction,
  type CreateAssignmentState,
} from "@/app/(teacher)/students/[id]/assignment/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import type { Lesson } from "@/types/lesson";

const initialState: CreateAssignmentState = {};

type AssignmentFormProps = {
  studentId: string;
  lessons: Lesson[];
};

export function AssignmentForm({ studentId, lessons }: AssignmentFormProps) {
  const action = createAssignmentAction.bind(null, studentId);
  const [state, formAction] = useFormState(action, initialState);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="lessonId">Aula</Label>
        <select
          id="lessonId"
          name="lessonId"
          required
          defaultValue=""
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="" disabled>
            Selecione uma aula
          </option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              Aula {lesson.order_index} — {lesson.title}
            </option>
          ))}
        </select>
        {state.errors?.lessonId && (
          <span className="text-sm text-red-600">
            {state.errors.lessonId}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="dueDate">Data limite</Label>
        <Input id="dueDate" name="dueDate" type="date" min={today} required />
        {state.errors?.dueDate && (
          <span className="text-sm text-red-600">{state.errors.dueDate}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="teacherNotes">Observação (opcional)</Label>
        <textarea
          id="teacherNotes"
          name="teacherNotes"
          rows={3}
          placeholder="Ex: foque na respiração antes de cantar os exercícios"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {state.message && <Alert variant="error">{state.message}</Alert>}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enviando..." : "Enviar"}
    </Button>
  );
}
