"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTablePendingDeposits from "@/components/tables/BasicTablePendingDeposits";

export default function UsersPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Yatırım Talepleri" />
      <div className="space-y-6">
          <BasicTablePendingDeposits />
      </div>
    </div>
  );
}
