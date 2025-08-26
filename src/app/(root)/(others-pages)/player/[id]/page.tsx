"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Statistic from "@/components/player-profile/Statistics";
import PlayerInfoCards from "@/components/player-profile/PlayerInfoCards";
import { Player } from "@/components/constants/types";
import { getPlayerDataId } from "@/components/lib/api";
import PlayerTransactionsTable from "@/components/player-profile/PlayerTransactionsTable";
import PlayerBonusTable from "@/components/player-profile/PlayerBonusTable";

export default function PlayerProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // <-- use this to get path params

  const id = params.id; // from /player/[id]
  const tabFromUrl = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [playerData, setPlayerData] = useState<Player>();
  const [isLoading, setIsLoading] = useState(true);

  // Sync tab from URL on mount
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  // Fetch player data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      const res = await getPlayerDataId(id);
      if (res.isSuccess) setPlayerData(res.playerData);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", tabKey);

    router.push(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <PlayerInfoCards playerData={playerData} isLoadingData={isLoading} />;
      case "istatistik":
        return <Statistic playerData={playerData} isLoadingData={isLoading} />;
      case "bonuslar":
        return <PlayerBonusTable playerId={id} />
      case "işlemler":
        return <PlayerTransactionsTable playerId={id} />;
      case "ayarlar":
        return (
          <div className="text-center p-10 text-gray-500 dark:text-gray-400">
            Ayarlar sekmesi içeriği yakında eklenecek.
          </div>
        );
      default:
        return null;
    }
  };
//playerData?.username 
  return (
    <div className="w-full">
    {/* Breadcrumb */}
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
    <a 
  href="/" 
  className="hover:text-blue-500 cursor-pointer"
>
  Dashboard
</a>  
      <span className="mx-2">/</span>
      <a 
  href="/players/all-players" 
  className="hover:text-blue-500 cursor-pointer"
>
  Players
</a>      <span className="mx-2">/</span>
      <span className="text-gray-900 dark:text-white font-medium">
        {playerData?.username || "Yükleniyor..."}
      </span>
      </div>

    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-3 mb-4 border-b border-gray-300 dark:border-gray-600">
        {[
          { key: "overview", label: "Genel Bakış" },
          { key: "istatistik", label: "İstatistikler" },
          { key: "bonuslar", label: "Bonuslar" },
          { key: "işlemler", label: "İşlemler" },
          { key: "ayarlar", label: "Ayarlar" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
    </div>
  );
}
