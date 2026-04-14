/** Base profile response from /api/profile */
export interface ProfileResponse<TProfessional = Record<string, unknown>> {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  professional: TProfessional | null;
}

export interface DoctorProfessional {
  id: string;
  user_id: string;
  cmp: string;
  specialty: string;
  hospital: string;
  phone: string;
  bio: string | null;
  years_experience: number;
}

export interface LawyerProfessional {
  id: string;
  user_id: string;
  cab: string;
  specialties: string[];
  medical_areas: string[];
  phone: string;
  bio: string | null;
  years_experience: number;
  rating: number;
  resolved_cases: number;
}
