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
        <Label htmlFor="name">Nome do Homework</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ex: Treino de respiração e afinação"
        />
        {state.errors?.name && (
          <span className="text-sm text-red-600">{state.errors.name}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="objective">Objetivo (opcional)</Label>
        <Input
          id="objective"
          name="objective"
          type="text"
          placeholder="Ex: Preparar a voz para a próxima apresentação"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="dueDate">Data limite</Label>
        <Input id="dueDate" name="dueDate" type="date" min={today} required />
        {state.errors?.dueDate && (
          <span className="text-sm text-red-600">{state.errors.dueDate}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Ex: repita cada exercício duas vezes antes da próxima aula"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Exercícios (escolha de 1 a 10)</Label>
        <ExercisePicker exercises={exercises} />
        {state.errors?.exerciseIds && (
          <span className="text-sm text-red-600">
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
      {pending ? "Salvando..." : "Salvar Homework"}
    </Button>
  );
}
