"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createHomeworkAction,
  type CreateHomeworkState,
} from "@/app/(teacher)/students/[id]/homework/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { ExercisePicker } from "@/components/students/ExercisePicker";
import type { Exercise } from "@/types/exercise";

const initialState: CreateHomeworkState = {};

type HomeworkFormProps = {
  studentId: string;
  exercises: Exercise[];
};

export function HomeworkForm({ studentId, exercises }: HomeworkFormProps) {
  const action = createHomeworkAction.bind(null, studentId);
  const [state, formAction] = useFormState(action, initialState);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Nombre del Homework</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ej: Entrenamiento de respiración y afinación"
        />
        {state.errors?.name && (
          <span className="text-sm text-red-600 dark:text-red-400">{state.errors.name}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="objective">Objetivo (opcional)</Label>
        <Input
          id="objective"
          name="objective"
          type="text"
          placeholder="Ej: Preparar la voz para la próxima presentación"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="dueDate">Fecha límite</Label>
        <Input id="dueDate" name="dueDate" type="date" min={today} required />
        {state.errors?.dueDate && (
          <span className="text-sm text-red-600 dark:text-red-400">{state.errors.dueDate}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="notes">Observaciones (opcional)</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Ej: repite cada ejercicio dos veces antes de la próxima clase"
          className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Ejercicios (elige de 1 a 10)</Label>
        <ExercisePicker exercises={exercises} />
        {state.errors?.exerciseIds && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {state.errors.exerciseIds}
          </span>
        )}
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
      {pending ? "Guardando..." : "Guardar Homework"}
    </Button>
  );
}
