"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Briefcase } from "lucide-react";
import { useCases } from "@/modules/cases/presentation/hooks/useCases";
import { CaseStatusBadge, CasePriorityBadge } from "@/modules/cases/presentation/components/CaseStatusBadge";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function DoctorCasesPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useCases(user?.id ?? "", { search });
  const cases = data?.data ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Casos</h1>
          <p className="text-slate-500 text-sm mt-1">{data?.total ?? 0} casos registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2"><Plus className="h-4 w-4" />Nuevo caso</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar por título o paciente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Caso</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Paciente</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Abogado</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Estado</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden sm:table-cell">Prioridad</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Actualizado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">Cargando...</td></tr>
            )}
            {!isLoading && cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-800 line-clamp-1 max-w-xs">{c.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{c.patient?.fullName ?? "—"}</td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  {c.lawyer ? <span className="text-slate-700">{c.lawyer.fullName}</span> : <span className="text-slate-400 italic">Sin asignar</span>}
                </td>
                <td className="px-5 py-4"><CaseStatusBadge status={c.status} /></td>
                <td className="px-5 py-4 hidden sm:table-cell"><CasePriorityBadge priority={c.priority} /></td>
                <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">{formatDate(c.updatedAt)}</td>
                <td className="px-5 py-4">
                  <Link href={`/doctor/cases/${c.id}`} className="text-blue-600 hover:underline text-xs font-medium">Ver</Link>
                </td>
              </tr>
            ))}
            {!isLoading && cases.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No se encontraron casos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
