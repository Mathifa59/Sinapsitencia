"use client";

import Link from "next/link";
import { Bell, Users, Briefcase, Star, ArrowRight, CheckCircle, XCircle, Clock, Loader2, Stethoscope, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import {
  useContactRequestsForLawyer,
  useDoctorProfiles,
  useRespondContactRequest,
} from "@/modules/matching/presentation/hooks/useMatching";
import { useAuthStore } from "@/store/auth.store";
import { formatDateTime } from "@/lib/utils";
import type { ContactRequestStatus } from "@/modules/matching/domain/entities/matching.entity";

interface RelevantCase {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  doctorId: string;
  doctor?: { id: string; fullName: string; specialty: string };
  patient?: { id: string; fullName: string };
  createdAt: string;
}

function useRelevantCases(lawyerId: string) {
  return useQuery({
    queryKey: ["relevant-cases", lawyerId],
    queryFn: () =>
      apiFetch<{ data: RelevantCase[]; medicalAreas: string[] }>(
        `/api/matching/relevant-cases?lawyerId=${lawyerId}`
      ),
    enabled: Boolean(lawyerId),
  });
}

const PRIORITY_VARIANT: Record<string, "destructive" | "warning" | "info" | "secondary"> = {
  critica: "destructive",
  alta: "warning",
  media: "info",
  baja: "secondary",
};
const PRIORITY_LABELS: Record<string, string> = {
  critica: "Crítica", alta: "Alta", media: "Media", baja: "Baja",
};

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
  const { mutate: respondToRequest, isPending: isResponding } = useRespondContactRequest(user?.id ?? "");
  const { data: relevantData, isLoading: isLoadingCases } = useRelevantCases(user?.id ?? "");
  const relevantCases = relevantData?.data ?? [];
  const medicalAreas = relevantData?.medicalAreas ?? [];

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
                    <Button
                      size="sm"
                      variant="primary"
                      className="gap-1.5 text-xs flex-1"
                      disabled={isResponding}
                      onClick={() => respondToRequest({ requestId: request.id, status: "aceptado" })}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs flex-1"
                      disabled={isResponding}
                      onClick={() => respondToRequest({ requestId: request.id, status: "rechazado" })}
                    >
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
      {/* Casos relevantes según áreas médicas */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Casos que podrían interesarte
            </h2>
            {medicalAreas.length > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Basado en tus áreas: {medicalAreas.join(", ")}
              </p>
            )}
          </div>
        </div>
        {isLoadingCases ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          </div>
        ) : relevantCases.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-400 text-sm">
            {medicalAreas.length === 0
              ? "Completa tu perfil con áreas médicas de interés para ver casos relevantes"
              : "No hay casos disponibles en tus áreas en este momento"}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {relevantCases.map((c) => (
              <div key={c.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {c.doctor && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          {c.doctor.fullName} · {c.doctor.specialty}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={PRIORITY_VARIANT[c.priority] ?? "secondary"}>
                    {PRIORITY_LABELS[c.priority] ?? c.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{c.description}</p>
                {c.patient && (
                  <p className="text-xs text-slate-400">Paciente: {c.patient.fullName}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
