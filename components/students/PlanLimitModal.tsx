"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

type PlanLimitModalProps = {
  limit: number;
  onClose: () => void;
};

export function PlanLimitModal({ limit, onClose }: PlanLimitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-card p-6 shadow-lg">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-foreground">
            Límite del plan Starter alcanzado
          </h2>
          <p className="text-sm text-muted-foreground">
            Tu plan permite hasta {limit} alumnos registrados. Actualiza
            al Plan Pro para registrar alumnos ilimitados.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Link href="/pricing" className={buttonVariants()}>
            Ver planes
          </Link>
        </div>
      </div>
    </div>
  );
}
