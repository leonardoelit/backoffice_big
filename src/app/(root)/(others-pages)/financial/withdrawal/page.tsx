"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTablePendingWithdrawals from "@/components/tables/BasicTablePendingWithdrawals";

export default function UsersPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Çekim Talepleri" />
      <div className="space-y-6">
        <BasicTablePendingWithdrawals />
      </div>
    </div>
  );
}
