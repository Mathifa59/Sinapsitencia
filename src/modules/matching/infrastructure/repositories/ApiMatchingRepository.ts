import { apiFetch } from "@/lib/api";
import type {
  IMatchingRepository,
  SendContactRequestInput,
  RespondContactRequestInput,
} from "../../domain/repositories/IMatchingRepository";
import type {
  MatchRecommendationEntity,
  ContactRequestEntity,
  ContactRequestStatus,
  LawyerProfileEntity,
  DoctorProfileEntity,
} from "../../domain/entities/matching.entity";

// Raw types from API — must match the shape returned by the API routes
interface LawyerProfileRaw {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  cab: string;
  specialties: string[];
  yearsExperience: number;
  phone: string;
  bio?: string;
  available: boolean;
  rating: number;
  resolvedCases?: number;
}

interface DoctorProfileRaw {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  cmp: string;
  specialty: string;
  hospital: string;
  yearsExperience: number;
  phone: string;
  bio?: string;
}

interface RecommendationRaw {
  id: string;
  doctorId: string;
  lawyer: LawyerProfileRaw;
  score: number;
  reasons: string[];
  createdAt: string;
}

interface RecommendationsResponse {
  recommendations: RecommendationRaw[];
  modelInfo: Record<string, unknown>;
}

interface ContactRequestRaw {
  id: string;
  fromDoctorId: string;
  fromDoctor: DoctorProfileRaw;
  toLawyerId: string;
  toLawyer: LawyerProfileRaw;
  caseTitle?: string;
  status: ContactRequestStatus;
  message: string;
  responseMessage?: string;
  createdAt: string;
  respondedAt?: string;
}

function toLawyerEntity(raw: LawyerProfileRaw): LawyerProfileEntity {
  return {
    id: raw.id,
    userId: raw.userId,
    fullName: raw.fullName,
    email: raw.email,
    cab: raw.cab,
    specialties: raw.specialties,
    yearsExperience: raw.yearsExperience,
    phone: raw.phone,
    bio: raw.bio,
    available: raw.available,
    rating: raw.rating,
    casesHandled: raw.resolvedCases ?? 0,
  };
}

function toDoctorEntity(raw: DoctorProfileRaw): DoctorProfileEntity {
  return {
    id: raw.id,
    userId: raw.userId,
    fullName: raw.fullName,
    email: raw.email,
    cmp: raw.cmp,
    specialty: raw.specialty,
    hospital: raw.hospital,
    yearsExperience: raw.yearsExperience,
    phone: raw.phone,
    bio: raw.bio,
  };
}

function toRecommendation(raw: RecommendationRaw): MatchRecommendationEntity {
  return {
    id: raw.id,
    doctorId: raw.doctorId,
    lawyer: toLawyerEntity(raw.lawyer),
    score: raw.score,
    reasons: raw.reasons,
    createdAt: new Date(raw.createdAt),
  };
}

function toContactRequest(raw: ContactRequestRaw): ContactRequestEntity {
  return {
    id: raw.id,
    fromDoctorId: raw.fromDoctorId,
    fromDoctor: toDoctorEntity(raw.fromDoctor),
    toLawyerId: raw.toLawyerId,
    toLawyer: toLawyerEntity(raw.toLawyer),
    caseTitle: raw.caseTitle,
    status: raw.status,
    message: raw.message,
    responseMessage: raw.responseMessage,
    createdAt: new Date(raw.createdAt),
    respondedAt: raw.respondedAt ? new Date(raw.respondedAt) : undefined,
  };
}

export class ApiMatchingRepository implements IMatchingRepository {
  async getRecommendationsForDoctor(doctorId: string): Promise<MatchRecommendationEntity[]> {
    const data = await apiFetch<RecommendationsResponse>(`/api/matching/lawyers?doctorId=${doctorId}`);
    return data.recommendations.map(toRecommendation);
  }

  async getLawyerProfiles(): Promise<LawyerProfileEntity[]> {
    const data = await apiFetch<LawyerProfileRaw[]>("/api/matching/lawyers");
    return data.map(toLawyerEntity);
  }

  async getDoctorProfiles(): Promise<DoctorProfileEntity[]> {
    const data = await apiFetch<DoctorProfileRaw[]>("/api/matching/doctors");
    return data.map(toDoctorEntity);
  }

  async getContactRequestsForLawyer(lawyerId: string, status?: ContactRequestStatus): Promise<ContactRequestEntity[]> {
    const params = new URLSearchParams({ lawyerId });
    if (status) params.set("status", status);
    const data = await apiFetch<ContactRequestRaw[]>(`/api/matching/contact-requests?${params}`);
    return data.map(toContactRequest);
  }

  async getContactRequestsByDoctor(doctorId: string): Promise<ContactRequestEntity[]> {
    const data = await apiFetch<ContactRequestRaw[]>(`/api/matching/contact-requests?doctorId=${doctorId}`);
    return data.map(toContactRequest);
  }

  async sendContactRequest(input: SendContactRequestInput): Promise<ContactRequestEntity> {
    const raw = await apiFetch<ContactRequestRaw>("/api/matching/contact-requests", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return toContactRequest(raw);
  }

  async respondContactRequest(input: RespondContactRequestInput): Promise<ContactRequestEntity> {
    const raw = await apiFetch<ContactRequestRaw>("/api/matching/contact-requests", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return toContactRequest(raw);
  }
}
