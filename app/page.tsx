import { redirect } from "next/navigation";

// A raiz do site não tem conteúdo próprio — redireciona para o login, que
// por sua vez já leva usuários autenticados para a área correta
// (professor ou aluno) via middleware.
export default function HomePage() {
  redirect("/login");
}
