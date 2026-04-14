"use client";

import { useState } from "react";
import { Search, Star, Scale, Send, CheckCircle, Loader2 } from "lucide-react";
import {
  useMatchRecommendations,
  useLawyerProfiles,
  useSendContactRequest,
  useContactRequestsByDoctor,
} from "@/modules/matching/presentation/hooks/useMatching";
import { useAuthStore } from "@/store/auth.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import type { LawyerProfileEntity } from "@/modules/matching/domain/entities/matching.entity";

export default function DoctorLawyersPage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: lawyerProfiles = [], isLoading } = useLawyerProfiles();
  const { data: matchRecommendations = [] } = useMatchRecommendations(user?.id ?? "");
  const { data: existingRequests = [] } = useContactRequestsByDoctor(user?.id ?? "");
  const { mutate: sendContactRequest, isPending: isSending } = useSendContactRequest();

  const filteredLawyers = lawyerProfiles.filter(
    (lawyer) =>
      lawyer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMatchScore = (lawyerId: string) =>
    matchRecommendations.find((rec) => rec.lawyer.id === lawyerId)?.score;

  const getMatchReasons = (lawyerId: string) =>
    matchRecommendations.find((rec) => rec.lawyer.id === lawyerId)?.reasons ?? [];

  const hasActiveRequest = (lawyerId: string) =>
    existingRequests.some(
      (r) => r.toLawyerId === lawyerId && (r.status === "pendiente" || r.status === "aceptado")
    );

  const handleSendContactRequest = (lawyer: LawyerProfileEntity) => {
    if (!user) return;
    sendContactRequest({
      fromDoctorId: user.id,
      toLawyerId: lawyer.id,
      message: `Hola ${lawyer.fullName}, me gustaría contactarle para revisar un caso.`,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Abogados sugeridos</h1>
        <p className="text-slate-500 text-sm mt-1">Profesionales compatibles con tu perfil y casos activos</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nombre o especialidad..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Cargando abogados...</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {filteredLawyers.map((lawyer) => {
          const matchScore = getMatchScore(lawyer.id);
          const matchReasons = getMatchReasons(lawyer.id);
          const alreadyRequested = hasActiveRequest(lawyer.id);

          const isHighMatch = matchScore !== undefined && matchScore >= 80;

          return (
            <div key={lawyer.id} className={`bg-white rounded-lg border p-5 space-y-4 ${isHighMatch ? "border-amber-300 ring-1 ring-amber-200 bg-amber-50/30" : "border-slate-200"}`}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                  {getInitials(lawyer.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{lawyer.fullName}</p>
                      <p className="text-xs text-slate-500">CAB: {lawyer.cab}</p>
                    </div>
                    {matchScore !== undefined && (
                      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${isHighMatch ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                        {isHighMatch && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                        <Scale className="h-3 w-3" />
                        {matchScore}% match
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {lawyer.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">{specialty}</Badge>
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

              {matchReasons.length > 0 && (
                <div className="bg-slate-50 rounded-md p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Por qué es compatible</p>
                  <ul className="space-y-1">
                    {matchReasons.map((reason) => (
                      <li key={reason} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lawyer.bio && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{lawyer.bio}</p>
              )}

              <Button
                variant={alreadyRequested ? "secondary" : "primary"}
                size="sm"
                className="w-full gap-2"
                onClick={() => handleSendContactRequest(lawyer)}
                disabled={alreadyRequested || isSending}
              >
                {alreadyRequested ? (
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
