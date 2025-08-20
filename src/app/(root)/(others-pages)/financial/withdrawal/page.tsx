"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTablePendingWithdrawals from "@/components/tables/BasicTablePendingWithdrawals";
import BasicTableWithdrawals from "@/components/tables/BasicTableWithdrawals";

export default function UsersPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Withdrawals" />
      <div className="space-y-6">
        <BasicTablePendingWithdrawals />
        <BasicTableWithdrawals />
      </div>
    </div>
  );
}
