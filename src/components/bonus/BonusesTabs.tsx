"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BasicTableBonuses from "@/components/tables/BasicTableBonuses";
import BasicTableWheelPrizes from "@/components/tables/BasicTableWheelPrizes";
import BasicTableVipWheelPrizes from "../tables/BasicTableVipWheelPrizes";

type TabType = "bonuses" | "wheelPrizes" | "vipPrizes";

export default function BonusesTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [tab, setTab] = useState<TabType>("bonuses");

  // Initialize tab from URL on mount
  useEffect(() => {
    const param = searchParams.get("tab");
    if (param === "wheelPrizes" || param === "vipPrizes" || param === "bonuses") {
      setTab(param as TabType);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "bonuses");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleTabChange = (value: TabType) => {
    setTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      {/* Tabs header */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabChange("bonuses")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "bonuses"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Bonuses
        </button>

        <button
          onClick={() => handleTabChange("wheelPrizes")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "wheelPrizes"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Wheel Prizes
        </button>

        <button
          onClick={() => handleTabChange("vipPrizes")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "vipPrizes"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          VIP Prizes
        </button>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {tab === "bonuses" && <BasicTableBonuses />}
        {tab === "wheelPrizes" && <BasicTableWheelPrizes />}
        {tab === "vipPrizes" && <BasicTableVipWheelPrizes />}
      </div>
    </div>
  );
}
