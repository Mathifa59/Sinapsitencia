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
import { mockMatchRecommendations, mockContactRequests } from "@/mocks/matching";
import { mockLawyerProfiles, mockDoctorProfiles } from "@/mocks/users";

function toLawyerEntity(raw: (typeof mockLawyerProfiles)[0]): LawyerProfileEntity {
  return {
    id: raw.id,
    userId: raw.userId,
    fullName: raw.user.name,
    email: raw.user.email,
    cab: raw.cab,
    specialties: raw.specialties,
    yearsExperience: raw.yearsExperience,
    phone: raw.phone,
    bio: raw.bio,
    available: raw.available,
    rating: raw.rating,
    casesHandled: raw.casesHandled,
  };
}

function toDoctorEntity(raw: (typeof mockDoctorProfiles)[0]): DoctorProfileEntity {
  return {
    id: raw.id,
    userId: raw.userId,
    fullName: raw.user.name,
    email: raw.user.email,
    cmp: raw.cmp,
    specialty: raw.specialty,
    hospital: raw.hospital,
    yearsExperience: raw.yearsExperience,
    phone: raw.phone,
    bio: raw.bio,
  };
}

function toRecommendationEntity(raw: (typeof mockMatchRecommendations)[0]): MatchRecommendationEntity {
  const lawyer = mockLawyerProfiles.find((l) => l.id === raw.lawyerId)!;
  return {
    id: raw.id,
    doctorId: raw.doctorId,
    lawyer: toLawyerEntity(lawyer),
    score: raw.score,
    reasons: raw.reasons,
    createdAt: new Date(raw.createdAt),
  };
}

function toRequestEntity(raw: (typeof mockContactRequests)[0]): ContactRequestEntity {
  return {
    id: raw.id,
    fromDoctorId: raw.fromDoctorId,
    fromDoctor: toDoctorEntity(raw.fromDoctor),
    toLawyerId: raw.toLawyerId,
    toLawyer: toLawyerEntity(raw.toLawyer),
    caseId: raw.caseId,
    caseTitle: raw.case?.title,
    status: raw.status,
    message: raw.message,
    responseMessage: raw.responseMessage,
    createdAt: new Date(raw.createdAt),
    respondedAt: raw.respondedAt ? new Date(raw.respondedAt) : undefined,
  };
}

export class MockMatchingRepository implements IMatchingRepository {
  private recommendations: MatchRecommendationEntity[] =
    mockMatchRecommendations.map(toRecommendationEntity);
  private requests: ContactRequestEntity[] =
    mockContactRequests.map(toRequestEntity);
  private lawyers: LawyerProfileEntity[] = mockLawyerProfiles.map(toLawyerEntity);
  private doctors: DoctorProfileEntity[] = mockDoctorProfiles.map(toDoctorEntity);

  async getRecommendationsForDoctor(doctorId: string) {
    await new Promise((r) => setTimeout(r, 250));
    return this.recommendations.filter((r) => r.doctorId === doctorId);
  }

  async getLawyerProfiles() {
    await new Promise((r) => setTimeout(r, 250));
    return this.lawyers;
  }

  async getDoctorProfiles() {
    await new Promise((r) => setTimeout(r, 250));
    return this.doctors;
  }

  async getContactRequestsForLawyer(lawyerId: string, status?: ContactRequestStatus) {
    await new Promise((r) => setTimeout(r, 250));
    let result = this.requests.filter((r) => r.toLawyerId === lawyerId);
    if (status) result = result.filter((r) => r.status === status);
    return result;
  }

  async getContactRequestsByDoctor(doctorId: string) {
    await new Promise((r) => setTimeout(r, 250));
    return this.requests.filter((r) => r.fromDoctorId === doctorId);
  }

  async sendContactRequest(input: SendContactRequestInput): Promise<ContactRequestEntity> {
    await new Promise((r) => setTimeout(r, 400));
    const doctor = this.doctors.find((d) => d.userId === input.fromDoctorId)
      ?? this.doctors[0];
    const lawyer = this.lawyers.find((l) => l.id === input.toLawyerId)
      ?? this.lawyers[0];

    const newRequest: ContactRequestEntity = {
      id: `req${Date.now()}`,
      fromDoctorId: input.fromDoctorId,
      fromDoctor: doctor,
      toLawyerId: input.toLawyerId,
      toLawyer: lawyer,
      caseId: input.caseId,
      status: "pendiente",
      message: input.message,
      createdAt: new Date(),
    };
    this.requests.push(newRequest);
    return newRequest;
  }

  async respondContactRequest(input: RespondContactRequestInput): Promise<ContactRequestEntity> {
    await new Promise((r) => setTimeout(r, 300));
    const idx = this.requests.findIndex((r) => r.id === input.requestId);
    if (idx === -1) throw new Error(`Solicitud "${input.requestId}" no encontrada`);
    this.requests[idx] = {
      ...this.requests[idx],
      status: input.status,
      responseMessage: input.responseMessage,
      respondedAt: new Date(),
    };
    return this.requests[idx];
  }
}
