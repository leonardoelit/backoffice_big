"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableBonuses from "@/components/tables/BasicTableBonuses";

export default function BonusesPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Bonuslar" />
      <div className="space-y-6">
          <BasicTableBonuses />
      </div>
    </div>
  );
}
