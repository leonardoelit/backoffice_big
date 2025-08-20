"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableWithdrawals from "@/components/tables/BasicTableWithdrawals";

export default function UsersPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Withdrawals" />
      <div className="space-y-6">
          <BasicTableWithdrawals />
      </div>
    </div>
  );
}
