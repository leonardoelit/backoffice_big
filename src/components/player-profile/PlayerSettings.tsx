"use client";
import React from "react";
import PlayerBonusSettings from "./settings/PlayerBonusSettings";

const PlayerSettings = ({
  playerId,
  activeSubTab,
  onSubTabChange,
}: {
  playerId: string;
  activeSubTab: string;
  onSubTabChange: (subtab: string) => void;
}) => {
  const subTabs = ["Profile", "BonusSettings", "Security", "Notifications", "Activity"];

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
        {activeSubTab === "Profile" && <div>Profile content for player {playerId}</div>}
        {activeSubTab === "BonusSettings" && <PlayerBonusSettings playerId={playerId} />}
        {activeSubTab === "Security" && <div>Security content for player {playerId}</div>}
        {activeSubTab === "Notifications" && <div>Notifications content for player {playerId}</div>}
        {activeSubTab === "Activity" && <div>Activity content for player {playerId}</div>}
      </div>
    </div>
  );
};

export default PlayerSettings;
