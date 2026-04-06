"use client";

import Link from "next/link";
import { Briefcase, FileText, Scale, AlertTriangle, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { mockCases } from "@/mocks/cases";
import { mockDocuments } from "@/mocks/documents";
import { mockMatchRecommendations } from "@/mocks/matching";
import { mockAuditLogs } from "@/mocks/documents";
import { formatDateTime } from "@/lib/utils";
import { CASE_STATUS_LABELS, CASE_PRIORITY_LABELS } from "@/constants";
import type { CaseStatus, CasePriority } from "@/types";

const STATUS_VARIANT: Record<CaseStatus, "info" | "warning" | "success" | "secondary" | "outline"> = {
  nuevo: "info",
  en_revision: "warning",
  activo: "success",
  cerrado: "secondary",
  archivado: "outline",
};

const PRIORITY_VARIANT: Record<CasePriority, "destructive" | "warning" | "secondary" | "outline"> = {
  critica: "destructive",
  alta: "warning",
  media: "secondary",
  baja: "outline",
};

export default function DoctorDashboardPage() {
  const activeCases = mockCases.filter((c) => c.status === "activo" || c.status === "en_revision");
  const pendingDocs = mockDocuments.filter((d) => d.status === "pendiente_firma" || d.status === "borrador");
  const recentLogs = mockAuditLogs.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Médico</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen de tu actividad clínico-legal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Casos activos" value={activeCases.length} icon={Briefcase} color="blue" description="En revisión o activos" />
        <StatCard title="Docs. pendientes" value={pendingDocs.length} icon={FileText} color="amber" description="Sin firma o en borrador" />
        <StatCard title="Abogados sugeridos" value={mockMatchRecommendations.length} icon={Scale} color="emerald" description="Compatibles con tu perfil" />
        <StatCard title="Total de casos" value={mockCases.length} icon={AlertTriangle} color="slate" description="Histórico completo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Casos recientes</h2>
            <Link href="/doctor/cases" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {mockCases.map((c) => (
              <Link
                key={c.id}
                href={`/doctor/cases/${c.id}`}
                className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.patient?.name} {c.patient?.lastName}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant={STATUS_VARIANT[c.status]} className="text-xs">
                    {CASE_STATUS_LABELS[c.status]}
                  </Badge>
                  <Badge variant={PRIORITY_VARIANT[c.priority]} className="text-xs">
                    {CASE_PRIORITY_LABELS[c.priority]}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Documentos recientes</h2>
            <Link href="/doctor/documents" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {mockDocuments.slice(0, 4).map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-4">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${
                  doc.status === "firmado" ? "bg-emerald-50" :
                  doc.status === "pendiente_firma" ? "bg-amber-50" : "bg-slate-100"
                }`}>
                  {doc.status === "firmado" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : doc.status === "pendiente_firma" ? (
                    <Clock className="h-4 w-4 text-amber-600" />
                  ) : (
                    <FileText className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{doc.patient?.name} {doc.patient?.lastName}</p>
                </div>
                <Badge
                  variant={doc.status === "firmado" ? "success" : doc.status === "pendiente_firma" ? "warning" : "secondary"}
                  className="text-xs shrink-0"
                >
                  {doc.status === "firmado" ? "Firmado" : doc.status === "pendiente_firma" ? "Pendiente" : "Borrador"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Actividad reciente</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-4 px-5 py-3">
              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-slate-500">
                  {log.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
              </div>
              <p className="text-sm text-slate-700 flex-1">{log.description}</p>
              <p className="text-xs text-slate-400 shrink-0">{formatDateTime(log.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
