"use client";

import { useState } from "react";
import { Search, Stethoscope, Hospital, Phone, Loader2, X } from "lucide-react";
import { useDoctorProfiles } from "@/modules/matching/presentation/hooks/useMatching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInitials } from "@/lib/utils";
import type { DoctorProfileEntity } from "@/modules/matching/domain/entities/matching.entity";

// ─── DoctorProfileModal ───────────────────────────────────────────────────────

function DoctorProfileModal({
  doctor,
  onClose,
}: {
  doctor: DoctorProfileEntity | null;
  onClose: () => void;
}) {
  if (!doctor) return null;
  return (
    <Dialog open={Boolean(doctor)} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {getInitials(doctor.fullName)}
            </div>
            <div>
              <DialogTitle className="text-left">{doctor.fullName}</DialogTitle>
              <p className="text-sm text-slate-500 mt-0.5">CMP: {doctor.cmp}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-md p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Especialidad</p>
              <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                {doctor.specialty}
              </p>
            </div>
            <div className="bg-slate-50 rounded-md p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Hospital</p>
              <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                <Hospital className="h-3.5 w-3.5 text-slate-400" />
                {doctor.hospital}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{doctor.yearsExperience} años de experiencia</Badge>
            <Badge variant="info">Activo</Badge>
          </div>

          {doctor.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" />
              {doctor.phone}
            </div>
          )}

          {doctor.bio && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">Sobre el médico</p>
              <p className="text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="gap-1.5">
            <X className="h-4 w-4" />Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LawyerDoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfileEntity | null>(null);
  const { data: doctorProfiles = [], isLoading } = useDoctorProfiles();

  const filteredDoctors = doctorProfiles.filter(
    (doctor) =>
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Médicos disponibles</h1>
        <p className="text-slate-500 text-sm mt-1">Profesionales que pueden requerir asesoría legal</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nombre o especialidad..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando médicos...</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {getInitials(doctor.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{doctor.fullName}</p>
                <p className="text-xs text-slate-500">CMP: {doctor.cmp}</p>
              </div>
              <Badge variant="info" className="shrink-0">Activo</Badge>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Stethoscope className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {doctor.specialty}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Hospital className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {doctor.hospital}
              </div>
            </div>

            {doctor.bio && (
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{doctor.bio}</p>
            )}

            <div className="flex gap-2 pt-1">
              <Badge variant="secondary" className="text-xs">{doctor.yearsExperience} años exp.</Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setSelectedDoctor(doctor)}
            >
              Ver perfil completo
            </Button>
          </div>
        ))}
      </div>

      <DoctorProfileModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    </div>
  );
}
