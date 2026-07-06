export type PlanSlug = "starter" | "pro";

export type Plan = {
  slug: PlanSlug;
  name: string;
  price_cents: number;
  currency: string;
  student_limit: number | null;
  features: string[];
  created_at: string;
};
