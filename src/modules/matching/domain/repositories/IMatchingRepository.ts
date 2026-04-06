import type {
  MatchRecommendationEntity,
  ContactRequestEntity,
  ContactRequestStatus,
  LawyerProfileEntity,
  DoctorProfileEntity,
} from "../entities/matching.entity";

export interface SendContactRequestInput {
  fromDoctorId: string;
  toLawyerId: string;
  message: string;
  caseId?: string;
}

export interface RespondContactRequestInput {
  requestId: string;
  status: "aceptado" | "rechazado";
  responseMessage?: string;
}

export interface IMatchingRepository {
  getRecommendationsForDoctor(doctorId: string): Promise<MatchRecommendationEntity[]>;
  getLawyerProfiles(): Promise<LawyerProfileEntity[]>;
  getDoctorProfiles(): Promise<DoctorProfileEntity[]>;
  getContactRequestsForLawyer(lawyerId: string, status?: ContactRequestStatus): Promise<ContactRequestEntity[]>;
  getContactRequestsByDoctor(doctorId: string): Promise<ContactRequestEntity[]>;
  sendContactRequest(input: SendContactRequestInput): Promise<ContactRequestEntity>;
  respondContactRequest(input: RespondContactRequestInput): Promise<ContactRequestEntity>;
}
