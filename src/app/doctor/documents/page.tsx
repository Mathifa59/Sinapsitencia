"use client";

import { useState } from "react";
import { Search, Plus, FileText, CheckCircle, Clock, Edit3, Archive } from "lucide-react";
import { mockDocuments } from "@/mocks/documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { DOCUMENT_TYPE_LABELS } from "@/constants";
import type { DocumentStatus } from "@/types";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; variant: "success" | "warning" | "secondary" | "outline"; icon: typeof CheckCircle }> = {
  firmado: { label: "Firmado", variant: "success", icon: CheckCircle },
  pendiente_firma: { label: "Pendiente firma", variant: "warning", icon: Clock },
  borrador: { label: "Borrador", variant: "secondary", icon: Edit3 },
  archivado: { label: "Archivado", variant: "outline", icon: Archive },
};

export default function DoctorDocumentsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockDocuments.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      DOCUMENT_TYPE_LABELS[d.type].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
          <p className="text-slate-500 text-sm mt-1">{mockDocuments.length} documentos registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo documento
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar por título o tipo..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-3">
        {filtered.map((doc) => {
          const config = STATUS_CONFIG[doc.status];
          const StatusIcon = config.icon;
          return (
            <div key={doc.id} className="bg-white rounded-lg border border-slate-200 p-5 flex items-start gap-4 hover:border-slate-300 transition-colors cursor-pointer">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                  </div>
                  <Badge variant={config.variant} className="shrink-0 flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span>Paciente: <span className="text-slate-600">{doc.patient?.name} {doc.patient?.lastName}</span></span>
                  <span>Versiones: <span className="text-slate-600">{doc.versions.length}</span></span>
                  <span>Firmas: <span className="text-slate-600">{doc.signatures.length}</span></span>
                  <span>Actualizado: <span className="text-slate-600">{formatDate(doc.updatedAt)}</span></span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No se encontraron documentos</p>
          </div>
        )}
      </div>
    </div>
  );
}
