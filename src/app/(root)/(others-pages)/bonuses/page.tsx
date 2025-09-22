"use client";

import { useSearchParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableBonuses from "@/components/tables/BasicTableBonuses";
import BasicTableWheelPrizes from "@/components/tables/BasicTableWheelPrizes";

export default function BonusesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // read from ?tab=bonuses or ?tab=wheelPrizes, default to bonuses
  const tab = (searchParams.get("tab") as "bonuses" | "wheelPrizes") || "bonuses";

  // helper to update the query string
  const setTab = (value: "bonuses" | "wheelPrizes") => {
    const newUrl = `?tab=${value}`;
    router.push(newUrl); // updates URL without full page reload
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Bonuses / Wheel Prizes" />

      {/* Tabs header */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("bonuses")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "bonuses"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Bonuses
        </button>
        <button
          onClick={() => setTab("wheelPrizes")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "wheelPrizes"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Wheel Prizes
        </button>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {tab === "bonuses" && <BasicTableBonuses />}
        {tab === "wheelPrizes" && <BasicTableWheelPrizes />}
      </div>
    </div>
  );
}
