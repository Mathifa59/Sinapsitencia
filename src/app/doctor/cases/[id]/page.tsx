"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, User, Scale, Calendar, AlertTriangle } from "lucide-react";
import { mockCases } from "@/mocks/cases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/utils";
import { CASE_STATUS_LABELS, CASE_PRIORITY_LABELS } from "@/constants";
import type { CaseStatus, CasePriority } from "@/types";

const STATUS_VARIANT: Record<CaseStatus, "info" | "warning" | "success" | "secondary" | "outline"> = {
  nuevo: "info", en_revision: "warning", activo: "success", cerrado: "secondary", archivado: "outline",
};
const PRIORITY_VARIANT: Record<CasePriority, "destructive" | "warning" | "secondary" | "outline"> = {
  critica: "destructive", alta: "warning", media: "secondary", baja: "outline",
};

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const caseData = mockCases.find((c) => c.id === id);

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertTriangle className="h-10 w-10 mb-3" />
        <p className="font-medium">Caso no encontrado</p>
        <Link href="/doctor/cases" className="text-blue-600 text-sm mt-2 hover:underline">Volver a casos</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/doctor/cases">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">{caseData.title}</h1>
          <p className="text-sm text-slate-500">Caso #{caseData.id.toUpperCase()}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={STATUS_VARIANT[caseData.status]}>{CASE_STATUS_LABELS[caseData.status]}</Badge>
          <Badge variant={PRIORITY_VARIANT[caseData.priority]}>{CASE_PRIORITY_LABELS[caseData.priority]}</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Descripción del caso</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{caseData.description}</p>
            {caseData.notes && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Notas internas</p>
                <p className="text-sm text-slate-600">{caseData.notes}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900">Documentos del caso</h2>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5" />
                Adjuntar
              </Button>
            </div>
            {caseData.documents.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-4 text-center">No hay documentos adjuntos aún</p>
            ) : (
              <div className="space-y-2">
                {caseData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-md border border-slate-100">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{doc.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Patient */}
          {caseData.patient && (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                Paciente
              </h3>
              <div className="space-y-1.5 text-sm">
                <p className="font-medium text-slate-800">{caseData.patient.name} {caseData.patient.lastName}</p>
                <p className="text-slate-500">DNI: {caseData.patient.dni}</p>
                {caseData.patient.phone && <p className="text-slate-500">{caseData.patient.phone}</p>}
                <p className="text-slate-500">Tipo: {caseData.patient.bloodType}</p>
              </div>
            </div>
          )}

          {/* Lawyer */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4 text-slate-400" />
              Abogado asignado
            </h3>
            {caseData.lawyer ? (
              <div className="space-y-1.5 text-sm">
                <p className="font-medium text-slate-800">{caseData.lawyer.user.name}</p>
                <p className="text-slate-500">{caseData.lawyer.specialties.join(", ")}</p>
                <p className="text-slate-500">{caseData.lawyer.phone}</p>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-slate-400 mb-3">Sin abogado asignado</p>
                <Link href="/doctor/lawyers">
                  <Button variant="outline" size="sm" className="text-xs w-full">Buscar abogado</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              Fechas
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Creado</p>
                <p className="text-slate-700">{formatDate(caseData.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Actualizado</p>
                <p className="text-slate-700">{formatDateTime(caseData.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
