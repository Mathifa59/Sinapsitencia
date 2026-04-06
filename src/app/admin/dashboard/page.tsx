"use client";

import { Users, Heart, Activity, FolderOpen, ShieldCheck, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/modules/users/presentation/hooks/useUsers";
import { usePatients } from "@/modules/patients/presentation/hooks/usePatients";
import { useDocuments } from "@/modules/documents/presentation/hooks/useDocuments";
import { useAuditLogs } from "@/modules/audit/presentation/hooks/useAuditLogs";
import { formatDateTime, getInitials } from "@/lib/utils";
import { ROLE_LABELS, AUDIT_ACTION_LABELS, AUDIT_ACTION_BADGE_VARIANT, ROLE_BADGE_VARIANT } from "@/constants";

export default function AdminDashboardPage() {
  const { data: systemUsers = [] } = useUsers();
  const { data: patientsPaginated } = usePatients();
  const { data: documentsPaginated } = useDocuments();
  const { data: auditPaginated } = useAuditLogs({ pageSize: 8 });

  const recentAuditLogs = auditPaginated?.data ?? [];
  const totalPatients = patientsPaginated?.total ?? 0;
  const totalDocuments = documentsPaginated?.total ?? 0;
  const totalAuditEvents = auditPaginated?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
        <p className="text-slate-500 text-sm mt-1">Supervisión general del sistema</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Usuarios registrados"
          value={systemUsers.length}
          icon={Users}
          color="blue"
          trend={{ value: 12, label: "este mes" }}
        />
        <StatCard
          title="Pacientes"
          value={totalPatients}
          icon={Heart}
          color="emerald"
          description="En el sistema"
        />
        <StatCard
          title="Documentos"
          value={totalDocuments}
          icon={FolderOpen}
          color="amber"
          description="Total procesados"
        />
        <StatCard
          title="Episodios activos"
          value={2}
          icon={Activity}
          color="slate"
          description="Episodios clínicos"
        />
        <StatCard
          title="Eventos de auditoría"
          value={totalAuditEvents}
          icon={ShieldCheck}
          color="slate"
          description="Últimos 30 días"
        />
        <StatCard
          title="Actividad sistema"
          value="Alta"
          icon={TrendingUp}
          color="emerald"
          description="Estado operativo"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Usuarios del sistema */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Usuarios del sistema</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Rol
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {systemUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate hidden sm:block">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <Badge variant={ROLE_BADGE_VARIANT[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={user.isActive ? "success" : "destructive"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Auditoría reciente */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Auditoría reciente</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {recentAuditLogs.map((auditLog) => (
              <div key={auditLog.id} className="px-5 py-3.5 flex items-start gap-3">
                <Badge
                  variant={AUDIT_ACTION_BADGE_VARIANT[auditLog.action]}
                  className="shrink-0 mt-0.5 text-xs"
                >
                  {AUDIT_ACTION_LABELS[auditLog.action]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-700 truncate">{auditLog.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {auditLog.userName} · {formatDateTime(auditLog.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
