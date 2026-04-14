import { apiSuccess, apiError } from "@/lib/api";

/**
 * GET /api/ml/health
 *
 * Verifica el estado del ML service.
 * Útil para mostrar indicadores de disponibilidad en el frontend.
 */
export async function GET() {
  const mlUrl = process.env.ML_SERVICE_URL ?? "http://localhost:8000";

  try {
    const [healthRes, modelRes] = await Promise.all([
      fetch(`${mlUrl}/health`, { signal: AbortSignal.timeout(3000) }),
      fetch(`${mlUrl}/api/v1/model/info`, { signal: AbortSignal.timeout(3000) }),
    ]);

    const health = await healthRes.json();
    const model = await modelRes.json();

    return apiSuccess({
      status: "online",
      service: health.service,
      version: health.version,
      model: {
        status: model.status,
        modelVersion: model.model_version ?? null,
        contentModel: model.content_model,
        collaborativeModel: model.collaborative_model,
        riskModel: model.risk_model,
      },
    });
  } catch {
    return apiSuccess({
      status: "offline",
      message: "El servicio ML no está disponible",
    });
  }
}
