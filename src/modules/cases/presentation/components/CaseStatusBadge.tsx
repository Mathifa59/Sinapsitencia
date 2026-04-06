import { Badge } from "@/components/ui/badge";
import type { CaseStatus, CasePriority } from "../../domain/entities/legal-case.entity";

const STATUS_CONFIG: Record<CaseStatus, { label: string; variant: "info" | "warning" | "success" | "secondary" | "outline" }> = {
  nuevo:       { label: "Nuevo",       variant: "info" },
  en_revision: { label: "En Revisión", variant: "warning" },
  activo:      { label: "Activo",      variant: "success" },
  cerrado:     { label: "Cerrado",     variant: "secondary" },
  archivado:   { label: "Archivado",   variant: "outline" },
};

const PRIORITY_CONFIG: Record<CasePriority, { label: string; variant: "destructive" | "warning" | "secondary" | "outline" }> = {
  critica: { label: "Crítica", variant: "destructive" },
  alta:    { label: "Alta",    variant: "warning" },
  media:   { label: "Media",   variant: "secondary" },
  baja:    { label: "Baja",    variant: "outline" },
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function CasePriorityBadge({ priority }: { priority: CasePriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
