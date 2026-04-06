"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RoleGuard } from "@/modules/auth/presentation/components/RoleGuard";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="doctor">
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
