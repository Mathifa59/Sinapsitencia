import { apiSuccess, apiError } from "@/lib/api";
import { triggerRiskAlert } from "@/lib/n8n";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * POST /api/ml/risk
 *
 * Proxy al endpoint de evaluación de riesgo del ML service.
 * Recibe datos del caso y retorna el análisis de riesgo.
 *
 * Si el resultado es riesgo "alto" o "critico", dispara un webhook
 * hacia n8n para ejecutar el flujo de alertas automatizadas.
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

    const result = {
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
    };

    // ── n8n: disparar alerta si riesgo alto o crítico ──────────────────
    if (result.riskLevel === "alto" || result.riskLevel === "critico") {
      const user = await getAuthenticatedUser();
      let doctorName = "No identificado";
      let doctorEmail = "";

      if (user) {
        const admin = createSupabaseAdmin();
        const { data: profile } = await admin
          .from("profiles")
          .select("name, email")
          .eq("id", user.id)
          .single();

        if (profile) {
          doctorName = profile.name ?? user.email ?? doctorName;
          doctorEmail = profile.email ?? user.email ?? "";
        }
      }

      // Fire-and-forget: no bloquea la respuesta al cliente
      triggerRiskAlert({
        caseId: result.caseId,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        riskFactors: result.riskFactors,
        recommendations: result.recommendations,
        specialty: body.specialty ?? "No especificada",
        doctorName,
        doctorEmail,
        documentationComplete: body.documentation_complete ?? false,
        informedConsent: body.informed_consent ?? false,
        evaluatedAt: new Date().toISOString(),
      });
    }

    return apiSuccess(result);
  } catch {
    return apiError(
      "El servicio de evaluación de riesgo no está disponible. Intenta más tarde.",
      503,
    );
  }
}
