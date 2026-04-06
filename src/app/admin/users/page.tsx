"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { mockUsers } from "@/mocks/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">{mockUsers.length} usuarios registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />Nuevo usuario
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar por nombre o correo..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Usuario</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Correo</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Rol</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Estado</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600 hidden lg:table-cell">Registro</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="font-medium text-slate-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500 hidden md:table-cell">{u.email}</td>
                <td className="px-5 py-4">
                  <Badge variant={u.role === "doctor" ? "info" : u.role === "lawyer" ? "secondary" : "warning"}>
                    {u.role === "doctor" ? "Médico" : u.role === "lawyer" ? "Abogado" : "Admin"}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={u.isActive ? "success" : "destructive"}>
                    {u.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-4">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
