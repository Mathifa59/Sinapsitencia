"use client";

import Link from "next/link";
import { Briefcase, FileText, Scale, AlertTriangle, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CaseStatusBadge, CasePriorityBadge } from "@/modules/cases/presentation/components/CaseStatusBadge";
import { DocumentStatusBadge } from "@/modules/documents/presentation/components/DocumentStatusBadge";
import { useCases } from "@/modules/cases/presentation/hooks/useCases";
import { useDocuments } from "@/modules/documents/presentation/hooks/useDocuments";
import { useMatchRecommendations } from "@/modules/matching/presentation/hooks/useMatching";
import { useAuditLogs } from "@/modules/audit/presentation/hooks/useAuditLogs";
import { useAuthStore } from "@/store/auth.store";
import { formatDateTime } from "@/lib/utils";

export default function DoctorDashboardPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";

  const { data: casesData } = useCases(userId);
  const { data: docsData }  = useDocuments();
  const { data: recs }      = useMatchRecommendations(userId);
  const { data: auditData } = useAuditLogs({ pageSize: 4 });

  const cases       = casesData?.data ?? [];
  const docs        = docsData?.data ?? [];
  const activeCases = cases.filter((c) => c.status === "activo" || c.status === "en_revision");
  const pendingDocs = docs.filter((d) => d.status === "pendiente_firma" || d.status === "borrador");
  const recentLogs  = auditData?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Médico</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen de tu actividad clínico-legal</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Casos activos"      value={activeCases.length}    icon={Briefcase}     color="blue"    description="En revisión o activos" />
        <StatCard title="Docs. pendientes"   value={pendingDocs.length}    icon={FileText}      color="amber"   description="Sin firma o en borrador" />
        <StatCard title="Abogados sugeridos" value={recs?.length ?? 0}     icon={Scale}         color="emerald" description="Compatibles con tu perfil" />
        <StatCard title="Total de casos"     value={casesData?.total ?? 0} icon={AlertTriangle} color="slate"   description="Histórico completo" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Casos recientes</h2>
            <Link href="/doctor/cases" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {cases.slice(0, 4).map((c) => (
              <Link key={c.id} href={`/doctor/cases/${c.id}`} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.patient?.fullName ?? "Sin paciente"}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <CaseStatusBadge status={c.status} />
                  <CasePriorityBadge priority={c.priority} />
                </div>
              </Link>
            ))}
            {cases.length === 0 && <p className="px-5 py-8 text-center text-sm text-slate-400">No hay casos</p>}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Documentos recientes</h2>
            <Link href="/doctor/documents" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {docs.slice(0, 4).map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{doc.patientName ?? "Sin paciente"}</p>
                </div>
                <DocumentStatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">Actividad reciente</h2></div>
        <div className="divide-y divide-slate-50">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-4 px-5 py-3">
              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-slate-500">{log.userName.split(" ").map((n: string) => n[0]).slice(0,2).join("")}</span>
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
