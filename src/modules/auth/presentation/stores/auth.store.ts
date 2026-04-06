"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUseCase } from "../../domain/use-cases/login.use-case";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth-cookie";
import type { UserEntity, UserRole } from "../../domain/entities/session.entity";
import type { LoginCredentials } from "../../domain/repositories/IAuthRepository";

// El store importa el repositorio desde el container (único punto de decisión)
// Se importa de forma lazy para evitar problemas de inicialización en SSR
const getAuthRepository = () =>
  import("@/infrastructure/di/container").then((m) => m.authRepository);

interface AuthState {
  user: UserEntity | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginByRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const repository = await getAuthRepository();
          const session = await loginUseCase(repository, credentials);
          setAuthCookie(session.user.role);
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (e) {
          set({
            isLoading: false,
            error: e instanceof Error ? e.message : "Error al iniciar sesión",
          });
          throw e;
        }
      },

      loginByRole: async (role) => {
        set({ isLoading: true, error: null });
        try {
          const repository = await getAuthRepository();
          const session = await repository.loginByRole(role);
          setAuthCookie(session.user.role);
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      logout: () => {
        clearAuthCookie();
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "sinapsistencia-auth",
      // Solo persistir lo necesario, nunca el token completo en producción
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
