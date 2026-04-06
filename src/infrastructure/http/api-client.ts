/**
 * API Client — wrapper de fetch para el futuro backend.
 * Hoy no se usa (los MockRepositories no pasan por aquí),
 * pero cuando lleguen los ApiRepositories, todos usarán este cliente.
 *
 * Centraliza: base URL, headers de autenticación, manejo de errores HTTP.
 */

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: RequestOptions["params"]): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getAuthHeaders(): Record<string, string> {
    // TODO: leer token JWT de localStorage / cookie cuando haya auth real
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("sinapsistencia-token")
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        body.message ?? `HTTP ${response.status}`,
        body.code
      );
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, params?: RequestOptions["params"]): Promise<T> {
    return this.request<T>(path, { method: "GET", params });
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

// Instancia global — usar esta en todos los ApiRepositories
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"
);
