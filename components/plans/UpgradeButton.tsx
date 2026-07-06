"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/ToastProvider";
import type { PlanSlug } from "@/types/plan";

type UpgradeButtonProps = {
  targetPlan: PlanSlug;
};

// Placeholder até a integração com o Stripe existir. Não altera nada no
// banco — só avisa que pagamentos ainda não estão disponíveis. Quando o
// Stripe for integrado, este componente passa a redirecionar para o
// Checkout em vez de mostrar o toast.
export function UpgradeButton({ targetPlan }: UpgradeButtonProps) {
  const { showToast } = useToast();

  function handleClick() {
    showToast(
      "Los pagos aún no están disponibles. Pronto podrás cambiar de plan por aquí.",
      "error"
    );
  }

  return (
    <Button onClick={handleClick} className="w-full">
      {targetPlan === "pro" ? "Actualizar a Pro" : "Volver a Starter"}
    </Button>
  );
}
