"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionsTable from "@/components/tables/TransactionsTable";

export default function PlayerReportsPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Oyuncu Raporları" />
      <div className="space-y-6">
          <TransactionsTable />
      </div>
    </div>
  );
}
