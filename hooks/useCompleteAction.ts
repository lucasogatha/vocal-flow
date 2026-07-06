"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Encapsula o padrão repetido nos botões de "concluir": disparar uma
// Server Action, mostrar uma animação de sucesso, e então atualizar a
// página para refletir dados frescos do servidor. Usado por
// CompleteExerciseButton.
export function useCompleteAction(
  action: () => Promise<void>,
  refreshDelayMs = 1200
) {
  const [isPending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!completed) return;

    // Pequeno atraso para o navegador realmente animar a transição de CSS.
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Depois de mostrar o sucesso, atualiza a página para buscar dados
    // frescos do servidor (ex: próximo homework, progresso).
    const refreshTimer = setTimeout(() => router.refresh(), refreshDelayMs);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(refreshTimer);
    };
  }, [completed, refreshDelayMs, router]);

  function trigger() {
    startTransition(async () => {
      await action();
      setCompleted(true);
    });
  }

  return { isPending, completed, visible, trigger };
}
