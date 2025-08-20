"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableDeposits from "@/components/tables/BasicTableDeposits";
import BasicTablePendingDeposits from "@/components/tables/BasicTablePendingDeposits";

export default function UsersPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Deposits" />
      <div className="space-y-6">
          <BasicTablePendingDeposits />
          <BasicTableDeposits />
      </div>
    </div>
  );
}
