import { CheckCircle, Clock, Edit3, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "../../domain/entities/document.entity";

const STATUS_CONFIG: Record<DocumentStatus, {
  label: string;
  variant: "success" | "warning" | "secondary" | "outline";
  icon: React.ComponentType<{ className?: string }>;
}> = {
  firmado:         { label: "Firmado",         variant: "success",   icon: CheckCircle },
  pendiente_firma: { label: "Pendiente firma", variant: "warning",   icon: Clock },
  borrador:        { label: "Borrador",        variant: "secondary", icon: Edit3 },
  archivado:       { label: "Archivado",       variant: "outline",   icon: Archive },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const { label, variant, icon: Icon } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
