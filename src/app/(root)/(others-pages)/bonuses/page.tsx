"use client"
import BonusesTabs from "@/components/bonus/BonusesTabs";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function BonusesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bonuses / Wheel Prizes" />
      <BonusesTabs />
    </div>
  );
}
