"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TeacherError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="flex max-w-sm flex-col items-center gap-3 text-center">
        <h1 className="text-lg font-semibold text-gray-900">
          Algo salió mal
        </h1>
        <p className="text-sm text-gray-500">
          No pudimos cargar esta página ahora. Intenta de nuevo en unos
          instantes.
        </p>
        <Button onClick={reset}>Intentar de nuevo</Button>
      </Card>
    </div>
  );
}
