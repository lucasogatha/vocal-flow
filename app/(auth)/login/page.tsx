import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">
          Accede a tu cuenta de VocalFlow.
        </p>
      </div>

      <LoginForm />

      <p className="text-sm text-muted-foreground">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-foreground underline">
          Regístrate
        </Link>
      </p>

      <p className="text-sm text-muted-foreground">
        ¿Eres alumno?{" "}
        <Link
          href="/register-student"
          className="font-medium text-foreground underline"
        >
          Activa tu cuenta
        </Link>
      </p>
    </main>
  );
}
