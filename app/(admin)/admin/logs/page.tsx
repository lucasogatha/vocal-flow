import { History } from "lucide-react";
import { getRecentLogs } from "@/services/admin";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminLogsPage() {
  const logs = await getRecentLogs(100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Logs</h1>
        <p className="text-sm text-gray-500">
          Eventos recientes registrados en el sistema. Cubre los
          principales eventos de negocio, no es una auditoría exhaustiva de
          cada acción.
        </p>
      </div>

      {logs.length === 0 ? (
        <EmptyState icon={History} title="Ningún log registrado todavía." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3 font-medium">Evento</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Detalles</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {log.event_type}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.actor_email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {Object.keys(log.metadata).length > 0
                      ? JSON.stringify(log.metadata)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(log.created_at).toLocaleString("es-419")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
