"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Statistic from "@/components/player-profile/Statistics";
import PlayerInfoCards from "@/components/player-profile/PlayerInfoCards";
import { Player } from "@/components/constants/types";
import { getPlayerDataId } from "@/components/lib/api";
import PlayerTransactionsTable from "@/components/player-profile/PlayerTransactionsTable";


export interface BonusTransaction {
  Amount: number;
  CreatedLocal: string;
  Name: string;
  Note: string;
}

export default function PlayerProfile() {
  const [playerData, setPlayerData] = useState<Player>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("overview");

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const getPlayerData = async () => {
      setIsLoading(true)
      const res = await getPlayerDataId(id)
      if(res.isSuccess){
        setPlayerData(res.playerData)
      }
      setIsLoading(false);
    }
    if(id !== null){
      getPlayerData();
    }
  }, [id]);
const renderTabContent = () => {
  switch (activeTab) {
    case "overview":
      return  <PlayerInfoCards playerData={playerData} isLoadingData={isLoading} />; 
        case "istatistik":
          return <Statistic playerData={playerData} isLoadingData={isLoading} />;
        case "bonuslar":
          return (
            <div className="text-center p-10 text-gray-500 dark:text-gray-400">
              Bonuslar sekmesi içeriği yakında eklenecek.
            </div>
          );
        case "işlemler":
          return  <PlayerTransactionsTable playerId={id} />;
          case "Ayarlar":
            return (
              <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                Ayarlar sekmesi içeriği yakında eklenecek.
              </div>
            );
        default:
          return null;
      }
    };
  
    return (
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
              onClick={() => setActiveTab(tab.key)}
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
    );
  }