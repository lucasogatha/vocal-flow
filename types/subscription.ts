import type { Plan, PlanSlug } from "@/types/plan";

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export type SubscriptionProvider = "manual" | "stripe";

export type Subscription = {
  id: string;
  teacher_id: string;
  plan_slug: PlanSlug;
  status: SubscriptionStatus;
  provider: SubscriptionProvider;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionWithPlan = Subscription & { plan: Plan };
