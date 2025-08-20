"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableDeposits from "@/components/tables/BasicTableDeposits";

export default function UsersPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Deposits" />
      <div className="space-y-6">
          <BasicTableDeposits />
      </div>
    </div>
  );
}
