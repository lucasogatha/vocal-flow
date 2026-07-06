import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types/plan";

type PlanCardProps = {
  plan: Plan;
  isCurrent?: boolean;
  cta: React.ReactNode;
};

export function PlanCard({ plan, isCurrent, cta }: PlanCardProps) {
  const price = (plan.price_cents / 100).toFixed(2);

  return (
    <Card
      className={cn(
        "flex flex-col gap-4",
        isCurrent && "border-accent ring-1 ring-accent"
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <p className="text-3xl font-bold text-gray-900">
          US$ {price}
          <span className="text-sm font-normal text-gray-500">/mês</span>
        </p>
        <p className="text-sm text-gray-500">
          {plan.student_limit
            ? `Até ${plan.student_limit} alunos`
            : "Alunos ilimitados"}
        </p>
      </div>

      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto">{cta}</div>
    </Card>
  );
}
