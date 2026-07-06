import Link from "next/link";
import { StudentForm } from "@/components/students/StudentForm";

export default function NewStudentPage() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Nuevo alumno</h1>
        <p className="text-sm text-gray-500">
          Registra un alumno para dar seguimiento a su progreso.
        </p>
      </div>

      <StudentForm />

      <Link
        href="/students"
        className="text-sm text-gray-500 hover:text-black"
      >
        Volver a la lista
      </Link>
    </div>
  );
}
