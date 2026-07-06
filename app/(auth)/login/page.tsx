import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="text-sm text-gray-500">
          Accede a tu cuenta de VocalFlow.
        </p>
      </div>

      <LoginForm />

      <p className="text-sm text-gray-500">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-black underline">
          Regístrate
        </Link>
      </p>

      <p className="text-sm text-gray-500">
        ¿Eres alumno?{" "}
        <Link
          href="/register-student"
          className="font-medium text-black underline"
        >
          Activa tu cuenta
        </Link>
      </p>
    </main>
  );
}
