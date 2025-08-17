"use client";

import AdminPageBreadcrumb from "@/components/common/AdminPageBreadcrumb";
import BasicTablePendingUser from "@/components/tables/BasicTablePendingUser";
import BasicTableUser from "@/components/tables/BasicTableUser";

export default function UsersPage() {

  return (
    <div>
      <AdminPageBreadcrumb pageTitle="Kullanıcılar" />
      <div className="space-y-6">
          <BasicTablePendingUser />
          <BasicTableUser />
      </div>
    </div>
  );
}
