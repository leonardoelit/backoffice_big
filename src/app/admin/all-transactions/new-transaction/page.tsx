"use client";

import AddTransactionForm from "@/components/AddTransactionForm";
import AdminPageBreadcrumb from "@/components/common/AdminPageBreadcrumb";

export default function AddUserPage() {

  return (
    <div>
      <AdminPageBreadcrumb pageTitle="İşlem Oluştur" />
      <div className="space-y-6">
          <AddTransactionForm />
      </div>
    </div>
  );
}
