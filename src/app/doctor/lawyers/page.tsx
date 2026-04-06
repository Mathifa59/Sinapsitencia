"use client";

import { useState } from "react";
import { Search, Star, Scale, Send, CheckCircle } from "lucide-react";
import { mockMatchRecommendations } from "@/mocks/matching";
import { mockLawyerProfiles } from "@/mocks/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DoctorLawyersPage() {
  const [search, setSearch] = useState("");
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const lawyers = mockLawyerProfiles.filter(
    (l) =>
      l.user.name.toLowerCase().includes(search.toLowerCase()) ||
      l.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const getScore = (lawyerId: string) =>
    mockMatchRecommendations.find((r) => r.lawyerId === lawyerId)?.score;

  const getReasons = (lawyerId: string) =>
    mockMatchRecommendations.find((r) => r.lawyerId === lawyerId)?.reasons ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Abogados sugeridos</h1>
        <p className="text-slate-500 text-sm mt-1">Profesionales compatibles con tu perfil y casos activos</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar por nombre o especialidad..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {lawyers.map((lawyer) => {
          const score = getScore(lawyer.id);
          const reasons = getReasons(lawyer.id);
          const isRequested = requested.has(lawyer.id);

          return (
            <div key={lawyer.id} className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                  {lawyer.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{lawyer.user.name}</p>
                      <p className="text-xs text-slate-500">CAB: {lawyer.cab}</p>
                    </div>
                    {score && (
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100 shrink-0">
                        <Scale className="h-3 w-3" />
                        {score}% match
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {lawyer.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    {lawyer.rating} / 5.0
                  </span>
                  <span>{lawyer.yearsExperience} años de experiencia</span>
                  <span>{lawyer.casesHandled} casos</span>
                </div>
              </div>

              {reasons.length > 0 && (
                <div className="bg-slate-50 rounded-md p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Por qué es compatible</p>
                  <ul className="space-y-1">
                    {reasons.map((r) => (
                      <li key={r} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lawyer.bio && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{lawyer.bio}</p>
              )}

              <Button
                variant={isRequested ? "secondary" : "primary"}
                size="sm"
                className="w-full gap-2"
                onClick={() => setRequested((prev) => new Set([...prev, lawyer.id]))}
                disabled={isRequested}
              >
                {isRequested ? (
                  <><CheckCircle className="h-4 w-4" />Solicitud enviada</>
                ) : (
                  <><Send className="h-4 w-4" />Solicitar contacto</>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
