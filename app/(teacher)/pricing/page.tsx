import { getPlans } from "@/services/plans";
import { ensureSubscription } from "@/services/subscriptions";
import { countStudentsByTeacher } from "@/services/students";
import { PlanCard } from "@/components/plans/PlanCard";
import { UpgradeButton } from "@/components/plans/UpgradeButton";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function PricingPage() {
  const user = await getCurrentUser();

  const plans = await getPlans();

  let currentPlanSlug: string | null = null;
  let studentsCount = 0;

  if (user) {
    const [subscription, count] = await Promise.all([
      ensureSubscription(user.id),
      countStudentsByTeacher(user.id),
    ]);
    currentPlanSlug = subscription?.plan_slug ?? null;
    studentsCount = count;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Planos</h1>
        <p className="text-sm text-gray-500">
          Escolha o plano ideal para o seu estúdio.
        </p>
      </div>

      {currentPlanSlug && (
        <p className="text-sm text-gray-500">
          Você está no plano <strong className="text-gray-900">
            {currentPlanSlug === "pro" ? "Pro" : "Starter"}
          </strong>{" "}
          — {studentsCount} aluno{studentsCount === 1 ? "" : "s"} cadastrado
          {studentsCount === 1 ? "" : "s"}.
        </p>
      )}

      <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = currentPlanSlug === plan.slug;

          return (
            <PlanCard
              key={plan.slug}
              plan={plan}
              isCurrent={isCurrent}
              cta={
                isCurrent ? (
                  <span className="flex h-10 w-full items-center justify-center rounded-md bg-gray-100 text-sm font-medium text-gray-500">
                    Seu plano atual
                  </span>
                ) : (
                  <UpgradeButton targetPlan={plan.slug} />
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}
