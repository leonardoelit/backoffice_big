"use client";

import { useParams } from "next/navigation";
import { ClientKpi, Player, useAuth } from "@/context/AuthContext";
import { startTransition, useEffect, useState } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { getPlayerHistory } from "@/server/userActions";
import Statistic from "@/components/player-profile/Statistics";
import PlayerInfoCards from "@/components/player-profile/PlayerInfoCards";


export interface BonusTransaction {
  Amount: number;
  CreatedLocal: string;
  Name: string;
  Note: string;
}

export default function PlayerProfile() {
  const { allAffiliatesList, allPlayerData } = useAuth();
  const [playerData, setPlayerData] = useState<Player>();
  const [playerAffiliate, setPlayerAffiliate] = useState<ClientKpi>();
  const [playerHistory, setPlayerHistory] = useState<BonusTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setisLoadingHistory] = useState(true);
  const [playerNotFound, setPlayerNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (allAffiliatesList.length && allPlayerData.length) {
      getPlayer();
    }
  }, [allAffiliatesList.length, allPlayerData.length]);

  useEffect(() => {
    if (playerHistory.length) {
      setisLoadingHistory(false);
    }
  }, [playerHistory]);

  const getPlayer = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token || !allAffiliatesList.length) {
      setIsLoading(false);
      setPlayerNotFound(true);
      return;
    }

    const affiliateWithPlayerId = allAffiliatesList.find(
      (affiliate) => affiliate.ClientId === Number(id)
    );

    if (!affiliateWithPlayerId) {
      setPlayerNotFound(true);
      setIsLoading(false);
      return;
    }

    const playerDataResult = allPlayerData.find(
      (player) => player.Login === affiliateWithPlayerId.Login
    );
    setPlayerAffiliate(affiliateWithPlayerId);
    setPlayerData(playerDataResult);

    try {
      const historyResponse = await getPlayerHistory(token, id);
      if (historyResponse.isSuccess) {
        startTransition(() => {
          setPlayerHistory(historyResponse.playerHistory);
        });
      }
    } catch (err) {
      console.error("❌ Error fetching history", err);
    }
    setIsLoading(false);
  };

  const reverseString = (string: string) => {
    return string.split(" ").reverse().join(" ");
  };

  const calculateProfitLossPercentage = (): string => {
    const totalDeposit = playerAffiliate?.TotalDeposit ?? 0;
    const totalWithdrawal = playerAffiliate?.TotalWithdrawal ?? 0;
    if (totalWithdrawal === 0) return "0%";
    const percentage =
      ((totalDeposit - totalWithdrawal) / totalWithdrawal) * 100;
    return `${percentage.toFixed(2)}%`;
  };

const renderTabContent = () => {
  switch (activeTab) {
    case "overview":
      return  <PlayerInfoCards />; 
        case "istatistik":
          return <Statistic />;
        case "bonuslar":
          return (
            <div className="text-center p-10 text-gray-500 dark:text-gray-400">
              Bonuslar sekmesi içeriği yakında eklenecek.
            </div>
          );
        case "İşlemler":
          return  <PlayerInfoCards />;
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