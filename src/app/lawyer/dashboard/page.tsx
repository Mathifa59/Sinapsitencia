"use client";

import Link from "next/link";
import { Bell, Users, Briefcase, Star, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockContactRequests, mockMatchRecommendations } from "@/mocks/matching";
import { formatDateTime } from "@/lib/utils";
import type { ContactRequestStatus } from "@/types";

const REQUEST_VARIANT: Record<ContactRequestStatus, "info" | "success" | "destructive" | "secondary"> = {
  pendiente: "info", aceptado: "success", rechazado: "destructive", cancelado: "secondary",
};
const REQUEST_LABELS: Record<ContactRequestStatus, string> = {
  pendiente: "Pendiente", aceptado: "Aceptado", rechazado: "Rechazado", cancelado: "Cancelado",
};

export default function LawyerDashboardPage() {
  const pendingRequests = mockContactRequests.filter((r) => r.status === "pendiente");
  const acceptedRequests = mockContactRequests.filter((r) => r.status === "aceptado");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Legal</h1>
        <p className="text-slate-500 text-sm mt-1">Gestiona tus solicitudes y casos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Solicitudes nuevas" value={pendingRequests.length} icon={Bell} color="amber" description="Requieren respuesta" />
        <StatCard title="Casos activos" value={acceptedRequests.length} icon={Briefcase} color="blue" description="En seguimiento" />
        <StatCard title="Médicos sugeridos" value={mockMatchRecommendations.length} icon={Users} color="emerald" description="Perfil compatible" />
        <StatCard title="Valoración promedio" value="4.8" icon={Star} color="slate" description="Basado en historial" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending requests */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Solicitudes pendientes</h2>
            <Link href="/lawyer/requests" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-400 text-sm">No hay solicitudes pendientes</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {pendingRequests.map((req) => (
                <div key={req.id} className="px-5 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{req.fromDoctor.user.name}</p>
                      <p className="text-xs text-slate-500">{req.fromDoctor.specialty} · {req.fromDoctor.hospital}</p>
                    </div>
                    <Badge variant={REQUEST_VARIANT[req.status]}>{REQUEST_LABELS[req.status]}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{req.message}</p>
                  <p className="text-xs text-slate-400">{formatDateTime(req.createdAt)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" className="gap-1.5 text-xs flex-1">
                      <CheckCircle className="h-3.5 w-3.5" />Aceptar
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1">
                      <XCircle className="h-3.5 w-3.5" />Rechazar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active cases */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Casos en seguimiento</h2>
          </div>
          {acceptedRequests.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-400 text-sm">No hay casos activos</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {acceptedRequests.map((req) => (
                <div key={req.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{req.case?.title ?? "Caso sin título"}</p>
                      <p className="text-xs text-slate-500">{req.fromDoctor.user.name}</p>
                    </div>
                    <Badge variant="success">Activo</Badge>
                  </div>
                  {req.responseMessage && (
                    <p className="text-xs text-slate-500 flex items-start gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                      {req.responseMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
