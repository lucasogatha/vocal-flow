import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Crea tu cuenta de profesor en VocalFlow.
        </p>
      </div>

      <RegisterForm />

      <p className="text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Iniciar sesión
        </Link>
      </p>
    </main>
  );
}
