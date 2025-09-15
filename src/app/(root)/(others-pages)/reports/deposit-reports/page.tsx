"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableDeposits from "@/components/tables/BasicTableDeposits";

export default function PlayerReportsPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Yatırım Raporları" />
      <div className="space-y-6">
          <BasicTableDeposits />
      </div>
    </div>
  );
}
