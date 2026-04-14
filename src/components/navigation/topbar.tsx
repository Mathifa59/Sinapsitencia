"use client";

import { Menu, Bell, LogOut, ChevronDown, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { ROLE_LABELS } from "@/constants";

export function Topbar({ title }: { title?: string }) {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const profilePath = user ? `/${user.role}/profile` : "#";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-900"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {title && (
          <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-slate-500">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors outline-none">
                <Avatar className="h-8 w-8">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900 leading-none">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ROLE_LABELS[user.role]}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(profilePath)}>
                <User className="h-4 w-4 mr-2 text-slate-500" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(profilePath)}>
                <Settings className="h-4 w-4 mr-2 text-slate-500" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
