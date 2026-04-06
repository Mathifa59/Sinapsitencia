import type { MatchRecommendation, ContactRequest } from "@/types";
import { mockDoctorProfiles, mockLawyerProfiles } from "./users";
import { mockCases } from "./cases";

export const mockMatchRecommendations: MatchRecommendation[] = [
  {
    id: "mr1",
    doctorId: "dp1",
    lawyerId: "lp1",
    lawyer: mockLawyerProfiles[0],
    score: 96,
    reasons: [
      "Especialidad en Derecho Médico compatible con el caso",
      "Experiencia en cirugía y responsabilidad civil",
      "10 años de trayectoria en casos similares",
      "Alta tasa de resolución favorable",
    ],
    createdAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "mr2",
    doctorId: "dp1",
    lawyerId: "lp2",
    lawyer: mockLawyerProfiles[1],
    score: 84,
    reasons: [
      "Especialista en Consentimiento Informado",
      "Conocimiento en bioética y derecho médico",
      "Experiencia en casos de documentación clínica",
    ],
    createdAt: "2025-03-01T00:00:00Z",
  },
];

export const mockContactRequests: ContactRequest[] = [
  {
    id: "req1",
    fromDoctorId: "dp1",
    fromDoctor: mockDoctorProfiles[0],
    toLawyerId: "lp1",
    toLawyer: mockLawyerProfiles[0],
    caseId: "c1",
    case: mockCases[0],
    status: "aceptado",
    message:
      "Estimado Abg. Vásquez, me encuentro enfrentando una reclamación post-operatoria y necesito asesoría especializada. Adjunto la información del caso para su evaluación.",
    responseMessage:
      "Dr. Ramírez, he revisado el caso y puedo asistirle. Coordinaremos una reunión para revisar la documentación completa.",
    createdAt: "2025-01-12T10:00:00Z",
    respondedAt: "2025-01-13T09:30:00Z",
  },
  {
    id: "req2",
    fromDoctorId: "dp2",
    fromDoctor: mockDoctorProfiles[1],
    toLawyerId: "lp2",
    toLawyer: mockLawyerProfiles[1],
    status: "pendiente",
    message:
      "Abg. Flores, necesito orientación sobre un proceso de revisión de consentimientos informados en mi área.",
    createdAt: "2025-03-30T14:00:00Z",
  },
];
