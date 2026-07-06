import { Suspense } from "react";
import { ensureSubscription } from "@/services/subscriptions";
import { TopNav } from "@/components/layout/TopNav";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ToastFromQuery } from "@/components/providers/ToastFromQuery";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Garante que todo professor tenha uma assinatura (cria o Starter
  // automaticamente no primeiro acesso). Mesmo padrão de ensureStudentLink
  // no portal do aluno: auto-cura, sem exigir nenhuma ação do usuário.
  if (user && user.user_metadata?.role !== "student") {
    await ensureSubscription(user.id);
  }

  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
