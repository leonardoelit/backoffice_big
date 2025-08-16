import AdminPageBreadcrumb from "@/components/common/AdminPageBreadcrumb";
import BasicTableAllTransactions from "@/components/tables/BasicTableAllTransactions";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React from "react";

export default function AllTransactions() {
  return (
    <div>
      <AdminPageBreadcrumb pageTitle="Tüm İşlemler" />
      <div className="space-y-6">
        <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          Tüm İşlmeler
        </h3>
        <Link href="/admin/all-transactions/new-transaction">
            <Button className="w-auto h-auto px-2 py-1">Yeni İşlem</Button>
        </Link>
      </div>


      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">
            <BasicTableAllTransactions />
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
