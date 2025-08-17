import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GenerateUrlForm from "@/components/GenerateUrlForm";
import React from "react";

export default function NewWithdrawal() {
  return (
    <div>
        <PageBreadcrumb pageTitle="URL Oluştur" />
      <div className="space-y-6">
    </div>
        <GenerateUrlForm />
    </div>
  );
}
