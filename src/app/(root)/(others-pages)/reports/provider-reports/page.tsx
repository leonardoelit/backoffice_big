"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProviderReportsTable from "@/components/tables/ProviderReportsTable";

export default function ProviderReportsPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Oyun Raporları" />
      <div className="space-y-6">
          <ProviderReportsTable />
      </div>
    </div>
  );
}
