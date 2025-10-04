"use client";
import React from "react";
import PlayerBonusSettings from "./settings/PlayerBonusSettings";
import PlayerIpActivityTable from "../tables/PlayerIpActivityTable";
import { Player } from "../constants/types";
import PlayerPermissions from "./settings/PlayerPermissions";

const PlayerSettings = ({
  playerId,
  playerData,
  isLoadingData,
  activeSubTab,
  onSubTabChange,
}: {
  playerId: string;
  activeSubTab: string;
  playerData?: Player;
  isLoadingData: boolean;
  onSubTabChange: (subtab: string) => void;
}) => {
  const subTabs = ["Permissions", "BonusSettings", "Security", "Notifications", "Activity"];

  return (
    <div className="flex h-[600px]">
      {/* Sidebar */}
      <div className="w-48 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-4 flex flex-col space-y-2">
        {subTabs.map((sub) => (
          <button
            key={sub}
            onClick={() => onSubTabChange(sub)}
            className={`text-left px-3 py-2 rounded-md font-medium transition-colors ${
              activeSubTab === sub
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {sub === "BonusSettings" ? "Bonus Settings" : sub}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 ml-4 rounded-md shadow">
        {activeSubTab === "Permissions" && <PlayerPermissions isLoadingData={isLoadingData} playerData={playerData} />}
        {activeSubTab === "BonusSettings" && <PlayerBonusSettings playerId={playerId} />}
        {activeSubTab === "Security" && <div>Security content for player {playerId}</div>}
        {activeSubTab === "Notifications" && <div>Notifications content for player {playerId}</div>}
        {activeSubTab === "Activity" && <PlayerIpActivityTable playerId={playerId} />}
      </div>
    </div>
  );
};

export default PlayerSettings;
