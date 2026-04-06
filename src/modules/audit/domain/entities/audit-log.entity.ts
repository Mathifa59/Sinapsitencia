export type AuditAction =
  | "login" | "logout" | "create" | "update"
  | "delete" | "view" | "sign" | "download" | "share";

export interface AuditLogEntity {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  description: string;
  ipAddress: string;
  createdAt: Date;
}
