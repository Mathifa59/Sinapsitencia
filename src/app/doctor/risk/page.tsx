"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Activity,
  FileWarning,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { MEDICAL_SPECIALTIES } from "@/constants";

// ─── Tipos ────────────────────────────────────────────────────────────────────

const riskSchema = z.object({
  specialty: z.string().min(1, "La especialidad es requerida"),
  procedure_complexity: z.enum(["baja", "media", "alta"]),
  priority: z.enum(["baja", "media", "alta", "critica"]),
  documentation_complete: z.boolean(),
  informed_consent: z.boolean(),
  has_prior_complaints: z.boolean(),
  time_since_incident_days: z
    .number({ error: "Ingresa un número válido" })
    .int()
    .min(0)
    .optional()
    .or(z.literal(NaN).transform(() => undefined)),
  description: z.string().optional(),
});

type RiskForm = z.infer<typeof riskSchema>;

interface RiskFactor {
  name: string;
  weight: number;
  value: number;
  contribution: number;
  description: string;
}

interface RiskResult {
  riskScore: number;
  riskLevel: "bajo" | "moderado" | "alto" | "critico";
  riskFactors: RiskFactor[];
  recommendations: string[];
  specialtyRiskBaseline: number;
  modelVersion: string;
}

// ─── Configuración visual por nivel ───────────────────────────────────────────

const RISK_LEVEL_CONFIG = {
  bajo: {
    label: "Riesgo Bajo",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bar: "bg-emerald-500",
    Icon: ShieldCheck,
  },
  moderado: {
    label: "Riesgo Moderado",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bar: "bg-yellow-500",
    Icon: AlertTriangle,
  },
  alto: {
    label: "Riesgo Alto",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    bar: "bg-orange-500",
    Icon: ShieldAlert,
  },
  critico: {
    label: "Riesgo Crítico",
    color: "bg-red-100 text-red-800 border-red-200",
    bar: "bg-red-500",
    Icon: XCircle,
  },
};

const FACTOR_LABELS: Record<string, string> = {
  specialty_risk: "Riesgo por especialidad",
  procedure_complexity: "Complejidad del procedimiento",
  documentation: "Estado de la documentación",
  informed_consent: "Consentimiento informado",
  prior_complaints: "Historial de quejas",
  time_factor: "Tiempo desde el incidente",
  priority: "Prioridad del caso",
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function RiskAssessmentPage() {
  const [result, setResult] = useState<RiskResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RiskForm>({
    resolver: zodResolver(riskSchema),
    defaultValues: {
      procedure_complexity: "media",
      priority: "media",
      documentation_complete: true,
      informed_consent: true,
      has_prior_complaints: false,
    },
  });

  const onSubmit = async (data: RiskForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        specialty: data.specialty,
        procedure_complexity: data.procedure_complexity,
        priority: data.priority,
        documentation_complete: data.documentation_complete,
        informed_consent: data.informed_consent,
        has_prior_complaints: data.has_prior_complaints,
        time_since_incident_days: data.time_since_incident_days ?? undefined,
        description: data.description ?? "",
      };

      const res = await apiFetch<RiskResult>("/api/ml/risk", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setResult(res);
    } catch {
      setError(
        "No se pudo conectar con el servicio de evaluación. Verifica que el servicio ML esté activo (puerto 8000).",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setError(null);
  };

  const levelCfg =
    result
      ? (RISK_LEVEL_CONFIG[result.riskLevel] ?? RISK_LEVEL_CONFIG.moderado)
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Evaluación de Riesgo Médico-Legal
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Analiza el nivel de riesgo legal de un caso basándose en factores
          clínicos y procesales
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* ─── Formulario ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-600" />
            Datos del caso
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Especialidad */}
            <div className="space-y-1.5">
              <Label>Especialidad médica *</Label>
              <select
                {...register("specialty")}
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
              >
                <option value="">Selecciona especialidad</option>
                {MEDICAL_SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.specialty && (
                <p className="text-xs text-red-600">{errors.specialty.message}</p>
              )}
            </div>

            {/* Complejidad + Prioridad */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Complejidad del procedimiento</Label>
                <select
                  {...register("procedure_complexity")}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Prioridad del caso</Label>
                <select
                  {...register("priority")}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>

            {/* Días desde el incidente */}
            <div className="space-y-1.5">
              <Label>Días transcurridos desde el incidente (opcional)</Label>
              <Input
                type="number"
                min={0}
                placeholder="Ej: 30"
                {...register("time_since_incident_days", {
                  valueAsNumber: true,
                })}
              />
              {errors.time_since_incident_days && (
                <p className="text-xs text-red-600">
                  {errors.time_since_incident_days.message}
                </p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 py-1">
              <p className="text-sm font-medium text-slate-700">
                Estado del caso
              </p>
              <div className="space-y-2.5">
                {(
                  [
                    {
                      field: "documentation_complete" as const,
                      label: "Documentación clínica completa",
                    },
                    {
                      field: "informed_consent" as const,
                      label: "Consentimiento informado firmado",
                    },
                    {
                      field: "has_prior_complaints" as const,
                      label: "Existen quejas previas contra el médico",
                    },
                  ] as const
                ).map(({ field, label }) => (
                  <label
                    key={field}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      {...register(field)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <Label>Descripción del caso (opcional)</Label>
              <Textarea
                rows={3}
                placeholder="Describe brevemente el contexto del caso..."
                {...register("description")}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2.5">
                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                variant="primary"
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Evaluando...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    Evaluar riesgo
                  </>
                )}
              </Button>
              {result && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Nueva
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* ─── Resultado / Estado vacío ─────────────────────────────────────── */}
        {result && levelCfg ? (
          <div className="space-y-4">
            {/* Score principal */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Resultado
                </h2>
                <span
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${levelCfg.color}`}
                >
                  <levelCfg.Icon className="h-4 w-4" />
                  {levelCfg.label}
                </span>
              </div>

              <div className="text-center py-4">
                <p className="text-6xl font-black text-slate-900">
                  {Math.round(result.riskScore * 100)}
                  <span className="text-2xl font-semibold text-slate-400">
                    %
                  </span>
                </p>
                <p className="text-sm text-slate-500 mt-1">Score de riesgo global</p>
              </div>

              {/* Barra de riesgo segmentada */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Bajo</span>
                  <span>Moderado</span>
                  <span>Alto</span>
                  <span>Crítico</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden relative">
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 border-r border-white/60" />
                    <div className="flex-1 border-r border-white/60" />
                    <div className="flex-1 border-r border-white/60" />
                    <div className="flex-1" />
                  </div>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${levelCfg.bar}`}
                    style={{ width: `${Math.round(result.riskScore * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Riesgo base de la especialidad:{" "}
                  {Math.round(result.specialtyRiskBaseline * 100)}%
                </span>
                <span>Modelo v{result.modelVersion}</span>
              </div>
            </div>

            {/* Factores de riesgo */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-slate-500" />
                Desglose por factor
              </h3>
              <div className="space-y-3.5">
                {[...result.riskFactors]
                  .sort((a, b) => b.contribution - a.contribution)
                  .map((factor) => (
                    <div key={factor.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700">
                          {FACTOR_LABELS[factor.name] ?? factor.name}
                        </span>
                        <span className="text-xs tabular-nums text-slate-500">
                          {Math.round(factor.value * 100)}%{" "}
                          <span className="text-slate-400">
                            (peso {Math.round(factor.weight * 100)}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${Math.round(factor.value * 100)}%` }}
                        />
                      </div>
                      {factor.description && (
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {factor.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* Estado vacío */
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center min-h-[320px]">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              Sin evaluación aún
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Completa el formulario y haz clic en &quot;Evaluar riesgo&quot;
            </p>
          </div>
        )}
      </div>

      {/* ─── Recomendaciones de mitigación ────────────────────────────────────── */}
      {result && result.recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Recomendaciones para mitigar el riesgo
          </h3>
          <ul className="space-y-2.5">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
