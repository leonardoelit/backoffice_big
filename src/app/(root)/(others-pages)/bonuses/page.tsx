"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableBonuses from "@/components/tables/BasicTableBonuses";
import BasicTableWheelPrizes from "@/components/tables/BasicTableWheelPrizes";

export default function BonusesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tab, setTabState] = useState<"bonuses" | "wheelPrizes">("bonuses");

  // Initialize tab after client hydration
  useEffect(() => {
    const param = searchParams.get("tab");
    if (param === "wheelPrizes") setTabState("wheelPrizes");
    else setTabState("bonuses");
  }, [searchParams]);

  // Update URL without page reload
  const setTab = (value: "bonuses" | "wheelPrizes") => {
    setTabState(value);

    // Update URL query without full reload
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);

    router.replace(`${url.pathname}?${url.searchParams.toString()}`);
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
