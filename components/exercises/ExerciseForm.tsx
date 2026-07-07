"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createExerciseAction,
  type CreateExerciseState,
} from "@/app/(teacher)/exercises/new/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { EXERCISE_CATEGORIES, EXERCISE_LEVELS } from "@/lib/exercise-constants";

const initialState: CreateExerciseState = {};

export function ExerciseForm() {
  const [state, formAction] = useFormState(createExerciseAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Ej: Respiración Diafragmática Básica"
        />
        {state.errors?.title && (
          <span className="text-sm text-red-600 dark:text-red-400">{state.errors.title}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
          className="h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {EXERCISE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {state.errors?.category && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {state.errors.category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="objective">Objetivo</Label>
        <Input
          id="objective"
          name="objective"
          type="text"
          required
          placeholder="Ej: Enseñar al alumno a dirigir el aire hacia el diafragma"
        />
        {state.errors?.objective && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {state.errors.objective}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          placeholder="Instrucciones detalladas del ejercicio..."
          className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {state.errors?.description && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {state.errors.description}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="duration_minutes">Duración</Label>
        <select
          id="duration_minutes"
          name="duration_minutes"
          required
          defaultValue=""
          className="h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="" disabled>
            Selecciona una duración
          </option>
          <option value="5">5 minutos</option>
          <option value="10">10 minutos</option>
          <option value="15">15 minutos</option>
        </select>
        {state.errors?.duration_minutes && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {state.errors.duration_minutes}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="level">Nivel</Label>
        <select
          id="level"
          name="level"
          required
          defaultValue=""
          className="h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="" disabled>
            Selecciona un nivel
          </option>
          {EXERCISE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {state.errors?.level && (
          <span className="text-sm text-red-600 dark:text-red-400">{state.errors.level}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="tags">Etiquetas (opcional, separadas por coma)</Label>
        <Input
          id="tags"
          name="tags"
          type="text"
          placeholder="Ej: respiración, principiante"
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
      {pending ? "Guardando..." : "Crear ejercicio"}
    </Button>
  );
}
