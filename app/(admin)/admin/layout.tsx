import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/services/admin";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Segunda camada de proteção (a primeira é o middleware). Um layout
  // nunca deve confiar sozinho em uma checagem feita fora dele.
  const { isAdmin } = await isCurrentUserAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
