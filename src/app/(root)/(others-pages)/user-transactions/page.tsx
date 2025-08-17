import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableTransaction from "@/components/tables/BasicTableTransaction";
import React from "react";

export default function UserTransactions() {
  return (
    <div>
      <PageBreadcrumb pageTitle="İşlem Geçmişi" />
      <div className="space-y-6">
        <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          İşlem Geçmişi
        </h3>
      </div>


      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">
            <BasicTableTransaction />
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
