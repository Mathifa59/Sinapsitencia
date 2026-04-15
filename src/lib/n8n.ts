/**
 * Utilidad para disparar webhooks de n8n.
 *
 * El disparo es fire-and-forget: si n8n no está disponible el backend
 * sigue funcionando normalmente — n8n es un complemento, no una dependencia.
 */

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

interface RiskAlertPayload {
  caseId?: string;
  riskScore: number;
  riskLevel: string;
  riskFactors: { name: string; weight: number; value: number; contribution: number; description: string }[];
  recommendations: string[];
  specialty: string;
  doctorName: string;
  doctorEmail: string;
  documentationComplete: boolean;
  informedConsent: boolean;
  evaluatedAt: string;
}

/**
 * Dispara el webhook de alerta de riesgo alto hacia n8n.
 *
 * - No lanza excepciones: si falla, logea y continúa.
 * - Timeout de 3 s para no bloquear la respuesta al cliente.
 */
export async function triggerRiskAlert(payload: RiskAlertPayload): Promise<void> {
  if (!N8N_WEBHOOK_URL) {
    console.warn("[n8n] N8N_WEBHOOK_URL no configurada — webhook omitido");
    return;
  }

  try {
    const res = await fetch(`${N8N_WEBHOOK_URL}/webhook/risk-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      console.error(`[n8n] Webhook respondió ${res.status}: ${res.statusText}`);
    }
  } catch (err) {
    console.error("[n8n] Error al disparar webhook:", err);
  }
}
