"use client";

import { useState } from "react";
import { Search, Plus, User, Loader2 } from "lucide-react";
import { usePatients } from "@/modules/patients/presentation/hooks/usePatients";
import { formatPatientGender } from "@/modules/patients/domain/entities/patient.entity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { PatientGender } from "@/modules/patients/domain/entities/patient.entity";

const GENDER_VARIANT: Record<PatientGender, "info" | "secondary" | "outline"> = {
  M: "info",
  F: "secondary",
  other: "outline",
};

export default function AdminPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: paginatedResult, isLoading } = usePatients({ search: searchQuery || undefined });

  const patients = paginatedResult?.data ?? [];
  const totalPatients = paginatedResult?.total ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-slate-500 text-sm mt-1">{totalPatients} pacientes registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />Registrar paciente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nombre o DNI..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando pacientes...</span>
        </div>
      )}

      <div className="grid gap-3">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-lg border border-slate-200 p-5 flex items-start gap-4 hover:border-slate-300 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{patient.fullName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">DNI: {patient.dni}</p>
                </div>
                <Badge variant={GENDER_VARIANT[patient.gender]} className="shrink-0">
                  {formatPatientGender(patient.gender)}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                <span>Nacimiento: {formatDate(patient.birthDate)}</span>
                {patient.bloodType && (
                  <span>
                    Tipo sanguíneo:{" "}
                    <span className="font-medium text-slate-700">{patient.bloodType}</span>
                  </span>
                )}
                {patient.phone && <span>{patient.phone}</span>}
                <span>Registro: {formatDate(patient.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && patients.length === 0 && (
          <div className="text-center py-16 text-slate-400">No se encontraron pacientes</div>
        )}
      </div>
    </div>
  );
}
