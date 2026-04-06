"use client";

import { useState } from "react";
import { Search, Plus, CheckCircle, Clock, Edit3, Loader2 } from "lucide-react";
import { useDocuments } from "@/modules/documents/presentation/hooks/useDocuments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { DOCUMENT_TYPE_LABELS } from "@/constants";
import type { DocumentStatus } from "@/modules/documents/domain/entities/document.entity";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; variant: "success" | "warning" | "secondary" | "outline" }> = {
  firmado:         { label: "Firmado",          variant: "success"   },
  pendiente_firma: { label: "Pendiente firma",  variant: "warning"   },
  borrador:        { label: "Borrador",          variant: "secondary" },
  archivado:       { label: "Archivado",         variant: "outline"   },
};

export default function AdminDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: paginatedResult, isLoading } = useDocuments({ search: searchQuery || undefined });

  const documents = paginatedResult?.data ?? [];
  const totalDocuments = paginatedResult?.total ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión Documental</h1>
          <p className="text-slate-500 text-sm mt-1">{totalDocuments} documentos en el sistema</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />Nuevo documento
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por título o paciente..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando documentos...</span>
        </div>
      )}

      {!isLoading && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Documento</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Tipo</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Paciente</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Estado</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden sm:table-cell">Firmas</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Actualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map((document) => {
                const statusConfig = STATUS_CONFIG[document.status];
                const validSignatureCount = document.signatures.filter((s) => s.isValid).length;
                return (
                  <tr key={document.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                          {document.status === "firmado" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : document.status === "pendiente_firma" ? (
                            <Clock className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Edit3 className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                        <span className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                          {document.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 hidden md:table-cell">
                      {DOCUMENT_TYPE_LABELS[document.type]}
                    </td>
                    <td className="px-5 py-4 text-slate-600 hidden lg:table-cell">
                      {document.patientName ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-slate-600">{validSignatureCount}</span>
                      <span className="text-slate-400 ml-1">
                        firma{validSignatureCount !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">
                      {formatDate(document.updatedAt)}
                    </td>
                  </tr>
                );
              })}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    No se encontraron documentos
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
