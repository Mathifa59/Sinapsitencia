"use client";

import { useState } from "react";
import { FileText, User, Pen, Archive, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { useUpdateDocumentStatus } from "../hooks/useDocuments";
import { formatDate, formatDateTime } from "@/lib/utils";
import { DOCUMENT_TYPE_LABELS } from "@/constants";
import type { DocumentEntity } from "../../domain/entities/document.entity";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DocumentDetailModalProps {
  document: DocumentEntity | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DocumentDetailModal({ document, onClose }: DocumentDetailModalProps) {
  const { mutateAsync: updateStatus, isPending } = useUpdateDocumentStatus();
  const [actionError, setActionError] = useState<string | null>(null);

  if (!document) return null;

  const currentVersion = document.versions.find(
    (v) => v.id === document.currentVersionId
  ) ?? document.versions[document.versions.length - 1];

  const validSignatureCount = document.signatures.filter((s) => s.isValid).length;

  const handleStatusChange = async (newStatus: DocumentEntity["status"]) => {
    setActionError(null);
    try {
      await updateStatus({ id: document.id, status: newStatus });
      onClose();
    } catch {
      setActionError("No se pudo actualizar el estado. Intenta de nuevo.");
    }
  };

  return (
    <Dialog open={Boolean(document)} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-left leading-snug">{document.title}</DialogTitle>
              <DialogDescription className="text-left mt-0.5">
                {DOCUMENT_TYPE_LABELS[document.type]}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado y metadatos */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <DocumentStatusBadge status={document.status} />
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">
              {document.versions.length} versión{document.versions.length !== 1 ? "es" : ""}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              {validSignatureCount} firma{validSignatureCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Paciente y autor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-md p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Paciente</p>
              <p className="text-sm font-medium text-slate-800">
                {document.patientName ?? <span className="italic text-slate-400">Sin paciente</span>}
              </p>
            </div>
            <div className="bg-slate-50 rounded-md p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Autor</p>
              <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                {document.authorName}
              </p>
            </div>
          </div>

          {/* Contenido de la versión actual */}
          {currentVersion && (
            <div className="border border-slate-200 rounded-md p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Versión {currentVersion.version}
                </p>
                <p className="text-xs text-slate-400">{formatDate(currentVersion.createdAt)}</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line line-clamp-6">
                {currentVersion.content || <span className="italic text-slate-400">Sin contenido</span>}
              </p>
            </div>
          )}

          {/* Firmas */}
          {document.signatures.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Firmas</p>
              <div className="space-y-2">
                {document.signatures.map((signature) => (
                  <div key={signature.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-md px-3 py-2">
                    <span className="text-slate-700">{signature.signerName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={signature.isValid ? "success" : "destructive"} className="text-xs">
                        {signature.isValid ? "Válida" : "Inválida"}
                      </Badge>
                      <span className="text-xs text-slate-400">{formatDateTime(signature.signedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {actionError && (
            <p className="text-xs text-red-500">{actionError}</p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {/* Acciones según estado actual */}
          {document.status === "borrador" && (
            <Button
              variant="primary"
              size="sm"
              className="gap-2 flex-1"
              onClick={() => handleStatusChange("pendiente_firma")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pen className="h-4 w-4" />}
              Enviar a firma
            </Button>
          )}
          {document.status === "pendiente_firma" && (
            <Button
              variant="primary"
              size="sm"
              className="gap-2 flex-1"
              onClick={() => handleStatusChange("firmado")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Marcar como firmado
            </Button>
          )}
          {(document.status === "firmado" || document.status === "borrador") && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleStatusChange("archivado")}
              disabled={isPending}
            >
              <Archive className="h-4 w-4" />
              Archivar
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
