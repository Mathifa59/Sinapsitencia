"use client";

import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { useUsers, useToggleUserStatus } from "@/modules/users/presentation/hooks/useUsers";
import { UserFormModal } from "@/modules/users/presentation/components/UserFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, getInitials } from "@/lib/utils";
import { ROLE_LABELS, ROLE_BADGE_VARIANT } from "@/constants";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: systemUsers = [], isLoading } = useUsers();
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleUserStatus();

  const filteredUsers = systemUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">{systemUsers.length} usuarios registrados</p>
        </div>
        <Button variant="primary" size="sm" className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />Nuevo usuario
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nombre o correo..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando usuarios...</span>
        </div>
      )}

      {!isLoading && (
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <span className="font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 hidden md:table-cell">{user.email}</td>
                  <td className="px-5 py-4">
                    <Badge variant={ROLE_BADGE_VARIANT[user.role]}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={user.isActive ? "success" : "destructive"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      disabled={isTogglingStatus}
                      onClick={() => toggleStatus(user.id)}
                    >
                      {user.isActive ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
