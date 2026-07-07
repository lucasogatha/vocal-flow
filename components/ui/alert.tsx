import { cn } from "@/lib/utils";

type AlertProps = {
  variant?: "error" | "success";
  children: React.ReactNode;
};

export function Alert({ variant = "error", children }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-md px-3 py-2 text-sm",
        variant === "error"
          ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      )}
    >
      {children}
    </div>
  );
}
