"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RoleGuard } from "@/modules/auth/presentation/components/RoleGuard";

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="lawyer">
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
