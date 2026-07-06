"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  createStudentAction,
  type CreateStudentState,
} from "@/app/(teacher)/students/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { PlanLimitModal } from "@/components/students/PlanLimitModal";

const initialState: CreateStudentState = {};

export function StudentForm() {
  const [state, formAction] = useFormState(createStudentAction, initialState);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (state.limitReached) {
      setShowLimitModal(true);
    }
  }, [state]);

  return (
    <>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" type="text" autoComplete="name" />
          {state.errors?.name && (
            <span className="text-sm text-red-600">{state.errors.name}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" autoComplete="email" />
          {state.errors?.email && (
            <span className="text-sm text-red-600">{state.errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
          {state.errors?.phone && (
            <span className="text-sm text-red-600">{state.errors.phone}</span>
          )}
        </div>

        {state.message && <Alert variant="error">{state.message}</Alert>}

        <SubmitButton />
      </form>

      {showLimitModal && (
        <PlanLimitModal
          limit={state.planLimit ?? 10}
          onClose={() => setShowLimitModal(false)}
        />
      )}
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Registrar alumno"}
    </Button>
  );
}
