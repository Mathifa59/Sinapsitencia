"use client";

import { useState } from "react";
import { CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import {
  useContactRequestsForLawyer,
  useRespondContactRequest,
} from "@/modules/matching/presentation/hooks/useMatching";
import { useAuthStore } from "@/store/auth.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import type { ContactRequestStatus } from "@/modules/matching/domain/entities/matching.entity";

const STATUS_LABELS: Record<ContactRequestStatus, string> = {
  pendiente: "Pendiente", aceptado: "Aceptado", rechazado: "Rechazado", cancelado: "Cancelado",
};
const STATUS_VARIANT: Record<ContactRequestStatus, "info" | "success" | "destructive" | "secondary"> = {
  pendiente: "info", aceptado: "success", rechazado: "destructive", cancelado: "secondary",
};

type RequestFilter = ContactRequestStatus | "todas";

export default function LawyerRequestsPage() {
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<RequestFilter>("todas");

  const { data: contactRequests = [], isLoading } = useContactRequestsForLawyer(user?.id ?? "");
  const { mutate: respondToRequest, isPending: isResponding } = useRespondContactRequest(user?.id ?? "");

  const filteredRequests =
    activeFilter === "todas"
      ? contactRequests
      : contactRequests.filter((req) => req.status === activeFilter);

  const handleAcceptRequest = (requestId: string) => {
    respondToRequest({ requestId, status: "aceptado" });
  };

  const handleRejectRequest = (requestId: string) => {
    respondToRequest({ requestId, status: "rechazado" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes de contacto</h1>
        <p className="text-slate-500 text-sm mt-1">{contactRequests.length} solicitudes recibidas</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["todas", "pendiente", "aceptado", "rechazado"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === filter
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {filter === "todas" ? "Todas" : STATUS_LABELS[filter]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando solicitudes...</span>
        </div>
      )}

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
                  {getInitials(request.fromDoctor.fullName)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{request.fromDoctor.fullName}</p>
                  <p className="text-xs text-slate-500">{request.fromDoctor.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={STATUS_VARIANT[request.status]}>{STATUS_LABELS[request.status]}</Badge>
                <span className="text-xs text-slate-400">{formatDate(request.createdAt)}</span>
              </div>
            </div>

            {request.caseTitle && (
              <div className="bg-slate-50 rounded-md px-4 py-3 text-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Caso relacionado</p>
                <p className="text-slate-700 font-medium">{request.caseTitle}</p>
              </div>
            )}

            <p className="text-sm text-slate-600 leading-relaxed">{request.message}</p>

            {request.responseMessage && (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-md px-4 py-3">
                <MessageSquare className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-700">{request.responseMessage}</p>
              </div>
            )}

            {request.status === "pendiente" && (
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="primary"
                  className="gap-1.5 flex-1"
                  onClick={() => handleAcceptRequest(request.id)}
                  disabled={isResponding}
                >
                  <CheckCircle className="h-4 w-4" />
                  Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 flex-1"
                  onClick={() => handleRejectRequest(request.id)}
                  disabled={isResponding}
                >
                  <XCircle className="h-4 w-4" />
                  Rechazar
                </Button>
              </div>
            )}
          </div>
        ))}

        {!isLoading && filteredRequests.length === 0 && (
          <div className="text-center py-16 text-slate-400">No hay solicitudes</div>
        )}
      </div>
    </div>
  );
}
