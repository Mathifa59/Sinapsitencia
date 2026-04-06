"use client";

import { useState } from "react";
import { Search, ShieldCheck, Loader2 } from "lucide-react";
import { useAuditLogs } from "@/modules/audit/presentation/hooks/useAuditLogs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { AuditAction } from "@/modules/audit/domain/entities/audit-log.entity";

const ACTION_LABELS: Record<AuditAction, string> = {
  login: "Login", logout: "Logout", create: "Creado", update: "Actualizado",
  delete: "Eliminado", view: "Consulta", sign: "Firma", download: "Descarga", share: "Compartido",
};
const ACTION_VARIANT: Record<AuditAction, "info" | "success" | "warning" | "destructive" | "secondary" | "outline"> = {
  login: "success", logout: "secondary", create: "info", update: "warning",
  delete: "destructive", view: "outline", sign: "success", download: "secondary", share: "info",
};

export default function AdminAuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: auditResult, isLoading } = useAuditLogs({ search: searchQuery || undefined });

  const auditLogs = auditResult?.data ?? [];
  const totalLogs = auditResult?.total ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Auditoría del Sistema</h1>
          <p className="text-slate-500 text-sm mt-0.5">{totalLogs} eventos registrados</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por descripción o usuario..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando registros...</span>
        </div>
      )}

      {!isLoading && (
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
              {auditLogs.map((auditLog) => (
                <tr key={auditLog.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <Badge variant={ACTION_VARIANT[auditLog.action]} className="whitespace-nowrap">
                      {ACTION_LABELS[auditLog.action]}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-700 max-w-xs">
                    <p className="line-clamp-1">{auditLog.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Recurso: {auditLog.resource}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="font-medium text-slate-700">{auditLog.userName}</p>
                    <p className="text-xs text-slate-400">{auditLog.userRole}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-xs hidden lg:table-cell">
                    {auditLog.ipAddress}
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs hidden sm:table-cell whitespace-nowrap">
                    {formatDateTime(auditLog.createdAt)}
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    No se encontraron registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
