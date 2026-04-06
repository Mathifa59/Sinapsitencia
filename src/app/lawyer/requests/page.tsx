"use client";

import { useState } from "react";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { mockContactRequests } from "@/mocks/matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ContactRequestStatus } from "@/types";

const STATUS_VARIANT: Record<ContactRequestStatus, "info" | "success" | "destructive" | "secondary"> = {
  pendiente: "info", aceptado: "success", rechazado: "destructive", cancelado: "secondary",
};
const STATUS_LABELS: Record<ContactRequestStatus, string> = {
  pendiente: "Pendiente", aceptado: "Aceptado", rechazado: "Rechazado", cancelado: "Cancelado",
};

export default function LawyerRequestsPage() {
  const [filter, setFilter] = useState<ContactRequestStatus | "todas">("todas");

  const filtered = filter === "todas"
    ? mockContactRequests
    : mockContactRequests.filter((r) => r.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes de contacto</h1>
        <p className="text-slate-500 text-sm mt-1">{mockContactRequests.length} solicitudes recibidas</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["todas", "pendiente", "aceptado", "rechazado"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f === "todas" ? "Todas" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((req) => (
          <div key={req.id} className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
                  {req.fromDoctor.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{req.fromDoctor.user.name}</p>
                  <p className="text-xs text-slate-500">{req.fromDoctor.specialty} · {req.fromDoctor.hospital}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={STATUS_VARIANT[req.status]}>{STATUS_LABELS[req.status]}</Badge>
                <span className="text-xs text-slate-400">{formatDate(req.createdAt)}</span>
              </div>
            </div>

            {req.case && (
              <div className="bg-slate-50 rounded-md px-4 py-3 text-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Caso relacionado</p>
                <p className="text-slate-700 font-medium">{req.case.title}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mensaje</p>
              <p className="text-sm text-slate-600 leading-relaxed">{req.message}</p>
            </div>

            {req.responseMessage && (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-md px-4 py-3">
                <MessageSquare className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-700">{req.responseMessage}</p>
              </div>
            )}

            {req.status === "pendiente" && (
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="primary" className="gap-1.5 flex-1">
                  <CheckCircle className="h-4 w-4" />Aceptar solicitud
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 flex-1">
                  <XCircle className="h-4 w-4" />Rechazar
                </Button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">No hay solicitudes en esta categoría</div>
        )}
      </div>
    </div>
  );
}
