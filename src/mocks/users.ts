import type { User, DoctorProfile, LawyerProfile, AdminProfile } from "@/types";

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "dr.ramirez@hospital.pe",
    name: "Dr. Carlos Ramírez",
    role: "doctor",
    createdAt: "2024-01-15T10:00:00Z",
    isActive: true,
  },
  {
    id: "u2",
    email: "dr.torres@hospital.pe",
    name: "Dra. Ana Torres",
    role: "doctor",
    createdAt: "2024-02-10T09:00:00Z",
    isActive: true,
  },
  {
    id: "u3",
    email: "abg.vasquez@legal.pe",
    name: "Abg. Miguel Vásquez",
    role: "lawyer",
    createdAt: "2024-01-20T11:00:00Z",
    isActive: true,
  },
  {
    id: "u4",
    email: "abg.flores@legal.pe",
    name: "Abg. Patricia Flores",
    role: "lawyer",
    createdAt: "2024-03-05T08:30:00Z",
    isActive: true,
  },
  {
    id: "u5",
    email: "admin@hngai.pe",
    name: "Secretaría Hospitalaria",
    role: "admin",
    createdAt: "2024-01-01T08:00:00Z",
    isActive: true,
  },
];

export const mockDoctorProfiles: DoctorProfile[] = [
  {
    id: "dp1",
    userId: "u1",
    user: mockUsers[0],
    cmp: "CMP-45892",
    specialty: "Cirugía General",
    hospital: "Hospital Nacional Guillermo Almenara",
    hospitalId: "h1",
    yearsExperience: 12,
    phone: "+51 987 654 321",
    bio: "Cirujano general con especialización en cirugía laparoscópica y manejo de urgencias quirúrgicas.",
  },
  {
    id: "dp2",
    userId: "u2",
    user: mockUsers[1],
    cmp: "CMP-38741",
    specialty: "Cardiología",
    hospital: "Hospital Nacional Guillermo Almenara",
    hospitalId: "h1",
    yearsExperience: 8,
    phone: "+51 976 543 210",
    bio: "Cardióloga clínica con enfoque en insuficiencia cardíaca y rehabilitación cardiovascular.",
  },
];

export const mockLawyerProfiles: LawyerProfile[] = [
  {
    id: "lp1",
    userId: "u3",
    user: mockUsers[2],
    cab: "CAL-28945",
    specialties: ["Derecho Médico", "Responsabilidad Civil Médica"],
    yearsExperience: 10,
    phone: "+51 965 432 109",
    bio: "Abogado especialista en derecho médico y sanitario, con amplia experiencia en defensa de profesionales de la salud.",
    available: true,
    rating: 4.8,
    casesHandled: 47,
  },
  {
    id: "lp2",
    userId: "u4",
    user: mockUsers[3],
    cab: "CAL-31567",
    specialties: ["Negligencia Médica", "Consentimiento Informado", "Bioética y Derecho"],
    yearsExperience: 7,
    phone: "+51 954 321 098",
    bio: "Especialista en negligencia médica y bioética legal. Amplia experiencia en arbitraje médico.",
    available: true,
    rating: 4.6,
    casesHandled: 31,
  },
];

export const mockAdminProfile: AdminProfile = {
  id: "ap1",
  userId: "u5",
  user: mockUsers[4],
  hospital: "Hospital Nacional Guillermo Almenara",
  hospitalId: "h1",
  department: "Secretaría General",
};

// Convenience: current session user (mock auth)
export const MOCK_SESSION: Record<string, User> = {
  doctor: mockUsers[0],
  lawyer: mockUsers[2],
  admin: mockUsers[4],
};
