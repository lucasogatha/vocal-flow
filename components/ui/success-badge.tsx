import { cn } from "@/lib/utils";

type SuccessBadgeProps = {
  label: string;
  visible: boolean;
};

// Extraído de dentro dos botões de conclusão — o mesmo "✓ + texto" era
// desenhado duas vezes com o mesmo markup e as mesmas classes.
export function SuccessBadge({ label, visible }: SuccessBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-green-700 transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
        ✓
      </span>
      {label}
    </div>
  );
}
