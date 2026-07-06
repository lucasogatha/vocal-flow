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
          Algo deu errado
        </h1>
        <p className="text-sm text-gray-500">
          Não conseguimos carregar esta página agora. Tente novamente em
          alguns instantes.
        </p>
        <Button onClick={reset}>Tentar novamente</Button>
      </Card>
    </div>
  );
}
