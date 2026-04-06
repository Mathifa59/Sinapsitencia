"use client";

import { Plus, Activity, Loader2 } from "lucide-react";
import { useAllCases } from "@/modules/cases/presentation/hooks/useCases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CASE_STATUS_LABELS } from "@/constants";
import type { CaseStatus } from "@/modules/cases/domain/entities/legal-case.entity";

const STATUS_VARIANT: Record<CaseStatus, "success" | "warning" | "info" | "secondary" | "outline"> = {
  activo: "success",
  en_revision: "warning",
  nuevo: "info",
  cerrado: "secondary",
  archivado: "outline",
};

export default function AdminEpisodesPage() {
  const { data: paginatedCases, isLoading } = useAllCases();

  const legalCases = paginatedCases?.data ?? [];
  const totalCases = paginatedCases?.total ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Episodios Clínicos</h1>
          <p className="text-slate-500 text-sm mt-1">{totalCases} episodios registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />Nuevo episodio
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando episodios...</span>
        </div>
      )}

      {!isLoading && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Título</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Paciente</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Médico responsable</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Estado</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Inicio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {legalCases.map((legalCase) => (
                <tr key={legalCase.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                        {legalCase.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 hidden md:table-cell">
                    {legalCase.patient?.fullName ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-600 hidden lg:table-cell">
                    {legalCase.doctor.fullName}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={STATUS_VARIANT[legalCase.status]}>
                      {CASE_STATUS_LABELS[legalCase.status]}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">
                    {formatDate(legalCase.createdAt)}
                  </td>
                </tr>
              ))}
              {legalCases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    No hay episodios registrados
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
