"use client";

import Link from "next/link";
import { Bell, Users, Briefcase, Star, ArrowRight, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useContactRequestsForLawyer,
  useDoctorProfiles,
} from "@/modules/matching/presentation/hooks/useMatching";
import { useAuthStore } from "@/store/auth.store";
import { formatDateTime } from "@/lib/utils";
import type { ContactRequestStatus } from "@/modules/matching/domain/entities/matching.entity";

const REQUEST_VARIANT: Record<ContactRequestStatus, "info" | "success" | "destructive" | "secondary"> = {
  pendiente: "info", aceptado: "success", rechazado: "destructive", cancelado: "secondary",
};
const REQUEST_LABELS: Record<ContactRequestStatus, string> = {
  pendiente: "Pendiente", aceptado: "Aceptado", rechazado: "Rechazado", cancelado: "Cancelado",
};

export default function LawyerDashboardPage() {
  const { user } = useAuthStore();
  const { data: allRequests = [], isLoading: isLoadingRequests } = useContactRequestsForLawyer(user?.id ?? "");
  const { data: doctorProfiles = [] } = useDoctorProfiles();

  const pendingRequests = allRequests.filter((req) => req.status === "pendiente");
  const acceptedRequests = allRequests.filter((req) => req.status === "aceptado");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Legal</h1>
        <p className="text-slate-500 text-sm mt-1">Gestiona tus solicitudes y casos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Solicitudes nuevas"
          value={pendingRequests.length}
          icon={Bell}
          color="amber"
          description="Requieren respuesta"
        />
        <StatCard
          title="Casos activos"
          value={acceptedRequests.length}
          icon={Briefcase}
          color="blue"
          description="En seguimiento"
        />
        <StatCard
          title="Médicos disponibles"
          value={doctorProfiles.length}
          icon={Users}
          color="emerald"
          description="Perfil compatible"
        />
        <StatCard
          title="Valoración promedio"
          value="4.8"
          icon={Star}
          color="slate"
          description="Basado en historial"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Solicitudes pendientes */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Solicitudes pendientes</h2>
            <Link href="/lawyer/requests" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-10 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-400 text-sm">No hay solicitudes pendientes</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {pendingRequests.map((request) => (
                <div key={request.id} className="px-5 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{request.fromDoctor.fullName}</p>
                      <p className="text-xs text-slate-500">
                        {request.fromDoctor.specialty} · {request.fromDoctor.hospital}
                      </p>
                    </div>
                    <Badge variant={REQUEST_VARIANT[request.status]}>
                      {REQUEST_LABELS[request.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{request.message}</p>
                  <p className="text-xs text-slate-400">{formatDateTime(request.createdAt)}</p>
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

        {/* Casos en seguimiento */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Casos en seguimiento</h2>
          </div>
          {acceptedRequests.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-400 text-sm">No hay casos activos</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {acceptedRequests.map((request) => (
                <div key={request.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {request.caseTitle ?? "Caso sin título"}
                      </p>
                      <p className="text-xs text-slate-500">{request.fromDoctor.fullName}</p>
                    </div>
                    <Badge variant="success">Activo</Badge>
                  </div>
                  {request.responseMessage && (
                    <p className="text-xs text-slate-500 flex items-start gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                      {request.responseMessage}
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
