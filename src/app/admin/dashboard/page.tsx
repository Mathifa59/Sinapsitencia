"use client";

import { Users, Heart, Activity, FolderOpen, ShieldCheck, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/mocks/users";
import { mockPatients } from "@/mocks/cases";
import { mockDocuments, mockAuditLogs } from "@/mocks/documents";
import { formatDateTime } from "@/lib/utils";
import type { AuditAction } from "@/types";

const ACTION_LABELS: Record<AuditAction, string> = {
  login: "Inicio de sesión", logout: "Cierre de sesión", create: "Registro creado",
  update: "Registro actualizado", delete: "Registro eliminado", view: "Consulta",
  sign: "Firma", download: "Descarga", share: "Compartido",
};
const ACTION_VARIANT: Record<AuditAction, "info" | "success" | "warning" | "destructive" | "secondary" | "outline"> = {
  login: "success", logout: "secondary", create: "info", update: "warning",
  delete: "destructive", view: "outline", sign: "success", download: "secondary", share: "info",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
        <p className="text-slate-500 text-sm mt-1">Supervisión general del sistema</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Usuarios registrados" value={mockUsers.length} icon={Users} color="blue" trend={{ value: 12, label: "este mes" }} />
        <StatCard title="Pacientes" value={mockPatients.length} icon={Heart} color="emerald" description="En el sistema" />
        <StatCard title="Documentos" value={mockDocuments.length} icon={FolderOpen} color="amber" description="Total procesados" />
        <StatCard title="Episodios activos" value={2} icon={Activity} color="slate" description="Episodios clínicos" />
        <StatCard title="Eventos de auditoría" value={mockAuditLogs.length} icon={ShieldCheck} color="slate" description="Últimos 30 días" />
        <StatCard title="Actividad sistema" value="Alta" icon={TrendingUp} color="emerald" description="Estado operativo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Usuarios del sistema</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Rol</th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate hidden sm:block">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <Badge variant={u.role === "doctor" ? "info" : u.role === "lawyer" ? "secondary" : "warning"}>
                      {u.role === "doctor" ? "Médico" : u.role === "lawyer" ? "Abogado" : "Admin"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={u.isActive ? "success" : "destructive"}>
                      {u.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit log */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Auditoría reciente</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {mockAuditLogs.map((log) => (
              <div key={log.id} className="px-5 py-3.5 flex items-start gap-3">
                <Badge variant={ACTION_VARIANT[log.action]} className="shrink-0 mt-0.5 text-xs">
                  {ACTION_LABELS[log.action]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-700 truncate">{log.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{log.user.name} · {formatDateTime(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
