"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PlayerStatsWithTimeTable from "@/components/tables/PlayerStatsWithTimeTable";

export default function PlayerReportsPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Oyuncu Raporları" />
      <div className="space-y-6">
          <PlayerStatsWithTimeTable />
      </div>
    </div>
  );
}
