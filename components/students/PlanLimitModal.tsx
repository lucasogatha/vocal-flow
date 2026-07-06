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
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Limite do plano Starter atingido
          </h2>
          <p className="text-sm text-gray-500">
            Seu plano permite até {limit} alunos cadastrados. Faça upgrade
            para o Plano Pro para cadastrar alunos ilimitados.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Link href="/pricing" className={buttonVariants()}>
            Ver planos
          </Link>
        </div>
      </div>
    </div>
  );
}
