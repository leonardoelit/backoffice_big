"use client";

import AddUserForm from "@/components/auth/AddUserForm";
import AdminPageBreadcrumb from "@/components/common/AdminPageBreadcrumb";

export default function AddUserPage() {

  return (
    <div>
      <AdminPageBreadcrumb pageTitle="Kullanıcı Ekle" />
      <div className="space-y-6">
          <AddUserForm />
      </div>
    </div>
  );
}
