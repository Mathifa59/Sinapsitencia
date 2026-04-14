import { apiSuccess, apiError } from "@/lib/api";

/**
 * POST /api/ml/risk
 *
 * Proxy al endpoint de evaluación de riesgo del ML service.
 * Recibe datos del caso y retorna el análisis de riesgo.
 */
export async function POST(request: Request) {
  const mlUrl = process.env.ML_SERVICE_URL ?? "http://localhost:8000";

  try {
    const body = await request.json();

    const mlResponse = await fetch(`${mlUrl}/api/v1/risk-assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!mlResponse.ok) {
      const error = await mlResponse.json().catch(() => ({}));
      return apiError(
        error.detail ?? "Error en la evaluación de riesgo",
        mlResponse.status,
      );
    }

    const data = await mlResponse.json();

    return apiSuccess({
      caseId: data.case_id,
      riskScore: data.risk_score,
      riskLevel: data.risk_level,
      riskFactors: (data.risk_factors ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (f: any) => ({
          name: f.name,
          weight: f.weight,
          value: f.value,
          contribution: f.contribution,
          description: f.description,
        }),
      ),
      recommendations: data.recommendations ?? [],
      specialtyRiskBaseline: data.specialty_risk_baseline,
      modelVersion: data.model_version,
    });
  } catch {
    return apiError(
      "El servicio de evaluación de riesgo no está disponible. Intenta más tarde.",
      503,
    );
  }
}
