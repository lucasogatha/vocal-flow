import Link from "next/link";
import { RegisterStudentForm } from "@/components/auth/RegisterStudentForm";

export default function RegisterStudentPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold">Ativar minha conta</h1>
        <p className="text-sm text-gray-500">
          Use o mesmo e-mail que seu professor cadastrou no VocalFlow.
        </p>
      </div>

      <RegisterStudentForm />

      <p className="text-sm text-gray-500">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-black underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
