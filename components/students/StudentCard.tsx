import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Student } from "@/types/student";

type StudentCardProps = {
  student: Student;
  homeworksCount: number;
  lastActivityLabel: string;
};

export function StudentCard({
  student,
  homeworksCount,
  lastActivityLabel,
}: StudentCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{student.name}</span>
        <span className="text-sm text-gray-500">{student.email}</span>
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <span>{homeworksCount} homeworks enviados</span>
        <span>Última atividade: {lastActivityLabel}</span>
      </div>

      <Link
        href={`/students/${student.id}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-1 w-fit"
        )}
      >
        Abrir
      </Link>
    </Card>
  );
}
