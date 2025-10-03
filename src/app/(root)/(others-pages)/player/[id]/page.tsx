"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Statistic from "@/components/player-profile/Statistics";
import PlayerInfoCards from "@/components/player-profile/PlayerInfoCards";
import { Player } from "@/components/constants/types";
import { getPlayerDataId } from "@/components/lib/api";
import PlayerTransactionsTable from "@/components/player-profile/PlayerTransactionsTable";
import PlayerBonusTable from "@/components/player-profile/PlayerBonusTable";
import Link from "next/link";
import PlayerSettings from "@/components/player-profile/PlayerSettings";
import PlayerNotes from "@/components/player-profile/PlayerNotes";

export default function PlayerProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // <-- use this to get path params

  const id = params.id; // from /player/[id]
  const tabFromUrl = searchParams.get("tab") || "overview";

  const subTabFromUrl = searchParams.get("subtab") || "Profile"; // default subtab
  const [activeSubTab, setActiveSubTab] = useState(subTabFromUrl);
  

  // Sync subtab from URL
  useEffect(() => {
    setActiveSubTab(subTabFromUrl);
  }, [subTabFromUrl]);

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [playerData, setPlayerData] = useState<Player>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentVoucherCount, setCurrentVoucherCount] = useState<number>()
  
  // Sync tab from URL on mount
  useEffect(() => {
    if (!id) return;
  
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getPlayerDataId(id);
  
      if (res.isSuccess && res.playerData) {
        // Convert markedAsRisk to boolean
        res.playerData.markedAsRisk = Boolean(res.playerData.markedAsRisk);
        setPlayerData(res.playerData);
        setCurrentVoucherCount(res.playerData.wheelSpinChance)
      }
  
      setIsLoading(false);
    };
  
    fetchData();
  }, [id]);
  

  const handleTabClick = (tabKey: string, subTabKey?: string) => {
  setActiveTab(tabKey);

  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set("tab", tabKey);

  if (subTabKey) {
    newParams.set("subtab", subTabKey);
  } else {
    newParams.delete("subtab");
  }

  router.push(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });
};

const renderTabContent = () => {
  switch (activeTab) {
    case "overview":
      return <PlayerInfoCards playerData={playerData} isLoadingData={isLoading} />;
    case "statistics":
      return <Statistic playerData={playerData} isLoadingData={isLoading} />;
    case "bonuses":
      return <PlayerBonusTable playerId={id} isLoadingData={isLoading} currentVoucherCount={currentVoucherCount} setCurrentVoucherCount={setCurrentVoucherCount} />;
    case "reports":
      return <PlayerTransactionsTable playerId={id} />;
    case "settings":
      return (
        <PlayerSettings
          playerId={id}
          activeSubTab={activeSubTab}
          onSubTabChange={(subtab) => handleTabClick("settings", subtab)}
        />
      );
    case "notes": // ✅ lowercase to match your tab key
      return <PlayerNotes playerId={id} />; // ✅ pass id if needed
    default:
      return null;
  }
};

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 ">
        <Link href="/" className=" hidden md:block hover:text-blue-500 cursor-pointer">
          Dashboard
        </Link>  
        <span className="mx-2 hidden md:block">/</span>
        <Link href="/players/all-players" className="hover:text-blue-500 cursor-pointer">
          Players
        </Link>      
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">
          {playerData?.username || "Yükleniyor..."}
        </span>
  
        {/* Online & Risk Status */}
        {playerData && (
          
          <div className="flex ml-4 items-center gap-4">
            
            {/* Online Status */}
            <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-700 mr-3 dark:text-gray-300">
        |
      </span>
              <div
                className={`h-3 w-3 rounded-full ${
                  playerData.isOnline
                    ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)]"
                    : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {playerData.isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        |
      </span>
  {/* Risk */}
  <div className="flex items-center gap-1">

      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Risk Status:
      </span>
      <div
  className={`h-3 w-3 rounded-full ${
    playerData.markedAsRisk
      ? "bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.8)] soft-pulse-purple"
      : "bg-purple-300 shadow-[0_0_6px_rgba(192,132,252,0.7)]"
  }`}
></div>

    </div>
  </div>
)}
      </div>
  

    <div className="w-full">
 {/* Tabs */}
<div className="overflow-x-auto">
  <div className="flex space-x-3 mb-4 border-b border-gray-300 dark:border-gray-600 flex-nowrap">
    {[
      { key: "overview", label: "Genel Bakış" },
      { key: "statistics", label: "İstatistikler" },
      { key: "reports", label: "Raporlar" },
      { key: "bonuses", label: "Bonuslar" },
      { key: "notes", label: "Notlar" },
      { key: "communications", label: "İletişim" },
      { key: "verification", label: "Doğrulama" },
      { key: "settings", label: "Ayarlar" },
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => handleTabClick(tab.key)}
        className={`flex-shrink-0 py-2 px-4 text-sm font-medium ${
          activeTab === tab.key
            ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
</div>


      {/* Tab Content */}
      {renderTabContent()}
    </div>
    </div>
  );
}
