import { StudentHeader } from "@/components/layout/StudentHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <main>{children}</main>
    </div>
  );
}
