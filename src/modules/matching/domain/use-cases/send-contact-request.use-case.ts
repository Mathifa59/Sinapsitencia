import type { IMatchingRepository, SendContactRequestInput } from "../repositories/IMatchingRepository";
import type { ContactRequestEntity } from "../entities/matching.entity";

export async function sendContactRequestUseCase(
  repository: IMatchingRepository,
  input: SendContactRequestInput
): Promise<ContactRequestEntity> {
  if (!input.message.trim()) {
    throw new Error("El mensaje de la solicitud no puede estar vacío");
  }
  if (input.message.length < 20) {
    throw new Error("El mensaje debe tener al menos 20 caracteres");
  }

  // Verificar que no haya una solicitud pendiente duplicada
  const existing = await repository.getContactRequestsByDoctor(input.fromDoctorId);
  const duplicate = existing.find(
    (r) => r.toLawyerId === input.toLawyerId && r.status === "pendiente"
  );
  if (duplicate) {
    throw new Error("Ya tienes una solicitud pendiente con este abogado");
  }

  return repository.sendContactRequest(input);
}
