"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GameReportsTable from "@/components/tables/GameReportsTable";

export default function GameReportsPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Oyun Raporları" />
      <div className="space-y-6">
          <GameReportsTable />
      </div>
    </div>
  );
}
