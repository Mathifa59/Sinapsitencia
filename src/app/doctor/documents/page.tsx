"use client";

import { useState } from "react";
import { Search, Plus, FileText } from "lucide-react";
import { useDocuments } from "@/modules/documents/presentation/hooks/useDocuments";
import { DocumentStatusBadge } from "@/modules/documents/presentation/components/DocumentStatusBadge";
import { DocumentFormModal } from "@/modules/documents/presentation/components/DocumentFormModal";
import { DocumentDetailModal } from "@/modules/documents/presentation/components/DocumentDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { DOCUMENT_TYPE_LABELS } from "@/constants";
import type { DocumentEntity } from "@/modules/documents/domain/entities/document.entity";

export default function DoctorDocumentsPage() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentEntity | null>(null);

  const { data, isLoading } = useDocuments({ search });
  const docs = data?.data ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
          <p className="text-slate-500 text-sm mt-1">{data?.total ?? 0} documentos registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />Nuevo documento
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por título o tipo..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {isLoading && <p className="text-center py-10 text-slate-400">Cargando...</p>}
        {docs.map((doc) => (
          <button
            key={doc.id}
            type="button"
            className="bg-white rounded-lg border border-slate-200 p-5 flex items-start gap-4 hover:border-slate-300 transition-colors text-left w-full"
            onClick={() => setSelectedDocument(doc)}
          >
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                </div>
                <DocumentStatusBadge status={doc.status} />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span>Paciente: <span className="text-slate-600">{doc.patientName ?? "—"}</span></span>
                <span>Versiones: <span className="text-slate-600">{doc.versions.length}</span></span>
                <span>Firmas: <span className="text-slate-600">{doc.signatures.length}</span></span>
                <span>Actualizado: <span className="text-slate-600">{formatDate(doc.updatedAt)}</span></span>
              </div>
            </div>
          </button>
        ))}
        {!isLoading && docs.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No se encontraron documentos</p>
          </div>
        )}
      </div>

      <DocumentFormModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <DocumentDetailModal document={selectedDocument} onClose={() => setSelectedDocument(null)} />
    </div>
  );
}
