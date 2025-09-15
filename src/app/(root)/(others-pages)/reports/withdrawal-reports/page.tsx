"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableWithdrawals from "@/components/tables/BasicTableWithdrawals";

export default function PlayerReportsPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Yatırım Raporları" />
      <div className="space-y-6">
          <BasicTableWithdrawals />
      </div>
    </div>
  );
}
