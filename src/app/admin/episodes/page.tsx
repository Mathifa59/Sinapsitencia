"use client";

import { Plus, Activity } from "lucide-react";
import { mockCases } from "@/mocks/cases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function AdminEpisodesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Episodios Clínicos</h1>
          <p className="text-slate-500 text-sm mt-1">{mockCases.length} episodios registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />Nuevo episodio
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Título</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Paciente</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Médico</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Estado</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Inicio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockCases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-800 line-clamp-1 max-w-xs">{c.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600 hidden md:table-cell">
                  {c.patient?.name} {c.patient?.lastName}
                </td>
                <td className="px-5 py-4 text-slate-600 hidden lg:table-cell">
                  {c.doctor.user.name}
                </td>
                <td className="px-5 py-4">
                  <Badge variant={c.status === "activo" ? "success" : c.status === "en_revision" ? "warning" : "info"}>
                    {c.status === "activo" ? "Activo" : c.status === "en_revision" ? "En revisión" : "Nuevo"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">{formatDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
