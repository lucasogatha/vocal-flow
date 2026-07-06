import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="text-sm text-gray-500">
          Acesse sua conta do VocalFlow.
        </p>
      </div>

      <LoginForm />

      <p className="text-sm text-gray-500">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-medium text-black underline">
          Cadastre-se
        </Link>
      </p>

      <p className="text-sm text-gray-500">
        É aluno?{" "}
        <Link
          href="/register-student"
          className="font-medium text-black underline"
        >
          Ative sua conta
        </Link>
      </p>
    </main>
  );
}
