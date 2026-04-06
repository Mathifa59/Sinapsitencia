"use client";

import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { mockAuditLogs } from "@/mocks/documents";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { AuditAction } from "@/types";

const ACTION_LABELS: Record<AuditAction, string> = {
  login: "Login", logout: "Logout", create: "Creado", update: "Actualizado",
  delete: "Eliminado", view: "Consulta", sign: "Firma", download: "Descarga", share: "Compartido",
};
const ACTION_VARIANT: Record<AuditAction, "info" | "success" | "warning" | "destructive" | "secondary" | "outline"> = {
  login: "success", logout: "secondary", create: "info", update: "warning",
  delete: "destructive", view: "outline", sign: "success", download: "secondary", share: "info",
};

export default function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const filtered = mockAuditLogs.filter(
    (l) =>
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Auditoría del Sistema</h1>
          <p className="text-slate-500 text-sm mt-0.5">{mockAuditLogs.length} eventos registrados</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar por descripción o usuario..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Acción</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Descripción</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Usuario</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">IP</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden sm:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <Badge variant={ACTION_VARIANT[log.action]} className="whitespace-nowrap">
                    {ACTION_LABELS[log.action]}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-slate-700 max-w-xs">
                  <p className="line-clamp-1">{log.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Recurso: {log.resource}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="font-medium text-slate-700">{log.user.name}</p>
                  <p className="text-xs text-slate-400">{log.user.role}</p>
                </td>
                <td className="px-5 py-4 text-slate-500 font-mono text-xs hidden lg:table-cell">{log.ipAddress}</td>
                <td className="px-5 py-4 text-slate-400 text-xs hidden sm:table-cell whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">No se encontraron registros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
