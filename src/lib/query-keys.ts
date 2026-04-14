/**
 * Query keys centralizadas para TanStack Query.
 * Seguir esta jerarquía garantiza invalidaciones precisas
 * y evita strings mágicos dispersos por el código.
 */
export const queryKeys = {
  cases: {
    all: ["cases"] as const,
    byDoctor: (doctorId: string) =>
      ["cases", "doctor", doctorId] as const,
    byDoctorFiltered: (doctorId: string, filters: object) =>
      ["cases", "doctor", doctorId, filters] as const,
    detail: (id: string) => ["cases", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: (filters: object) => ["documents", "list", filters] as const,
    detail: (id: string) => ["documents", id] as const,
    byPatient: (patientId: string) => ["documents", "patient", patientId] as const,
  },
  matching: {
    recommendations: (doctorId: string) =>
      ["matching", "recommendations", doctorId] as const,
    contactRequests: (userId: string) =>
      ["matching", "requests", userId] as const,
    contactRequestsByDoctor: (doctorId: string) =>
      ["matching", "requests", "doctor", doctorId] as const,
  },
  audit: {
    logs: (filters: object) => ["audit", "logs", filters] as const,
  },
  users: {
    all: ["users"] as const,
    doctorProfiles: () => ["users", "doctors"] as const,
    doctorProfile: (userId: string) => ["users", "doctor", userId] as const,
    lawyerProfiles: () => ["users", "lawyers"] as const,
    lawyerProfile: (userId: string) => ["users", "lawyer", userId] as const,
    adminProfiles: () => ["users", "admins"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (filters: object) => ["patients", "list", filters] as const,
    detail: (id: string) => ["patients", id] as const,
  },
  episodes: {
    all: ["episodes"] as const,
  },
} as const;
