import Link from "next/link";
import { RegisterStudentForm } from "@/components/auth/RegisterStudentForm";

export default function RegisterStudentPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold">Activar mi cuenta</h1>
        <p className="text-sm text-gray-500">
          Usa el mismo correo que tu profesor registró en VocalFlow.
        </p>
      </div>

      <RegisterStudentForm />

      <p className="text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-medium text-black underline">
          Iniciar sesión
        </Link>
      </p>
    </main>
  );
}
