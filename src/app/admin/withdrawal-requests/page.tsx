import AdminPageBreadcrumb from "@/components/common/AdminPageBreadcrumb";
import BasicTableWithdrawalRequests from "@/components/tables/BasicTableWithdrawalRequests";
import React from "react";

export default function WithdrawalRequests() {
  return (
    <div>
      <AdminPageBreadcrumb pageTitle="Çekim Talepleri" />
      <div className="space-y-6">
        <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          Çekim Talepleri
        </h3>
      </div>


      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">
            <BasicTableWithdrawalRequests status="pending" />
            <BasicTableWithdrawalRequests status="concluded" />
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
