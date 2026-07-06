import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-sm text-gray-500">
          Crie sua conta de professor no VocalFlow.
        </p>
      </div>

      <RegisterForm />

      <p className="text-sm text-gray-500">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-black underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
