"use client";

import { useState } from "react";
import { Search, Plus, User } from "lucide-react";
import { mockPatients } from "@/mocks/cases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function AdminPatientsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockPatients.filter(
    (p) =>
      `${p.name} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      p.dni.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-slate-500 text-sm mt-1">{mockPatients.length} pacientes registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />Registrar paciente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar por nombre o DNI..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-lg border border-slate-200 p-5 flex items-start gap-4 hover:border-slate-300 transition-colors">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{p.name} {p.lastName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">DNI: {p.dni}</p>
                </div>
                <Badge variant={p.gender === "M" ? "info" : "secondary"} className="shrink-0">
                  {p.gender === "M" ? "Masculino" : p.gender === "F" ? "Femenino" : "Otro"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                <span>Nacimiento: {formatDate(p.birthDate)}</span>
                {p.bloodType && <span>Tipo sanguíneo: <span className="font-medium text-slate-700">{p.bloodType}</span></span>}
                {p.phone && <span>{p.phone}</span>}
                <span>Registro: {formatDate(p.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">No se encontraron pacientes</div>
        )}
      </div>
    </div>
  );
}
