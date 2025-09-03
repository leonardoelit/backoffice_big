"use client";

import React, { useEffect, useState } from "react";
import { getPlayerBonusSettings, changePlayerBonusSetting } from "@/components/lib/api";
import { BonusSettingData, ChangePlayersBonusSettingRequest } from "@/components/constants/types";
import { showToast } from "@/utils/toastUtil";
import { bonusTypes } from "@/components/constants";

const PlayerBonusSettings = ({ playerId }: { playerId: string }) => {
  const [bonusList, setBonusList] = useState<BonusSettingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingBonusId, setEditingBonusId] = useState<number | null>(null);
  const [newPercentage, setNewPercentage] = useState<number | null>(null);

  // Fetch bonus settings
  useEffect(() => {
    const fetchBonusSettings = async () => {
      setLoading(true);
      const res = await getPlayerBonusSettings(playerId);
      if (res.isSuccess) {
        setBonusList(res.bonusSettingList);
      } else {
        showToast(res.message || "Failed to load bonus settings", "error");
      }
      setLoading(false);
    };

    fetchBonusSettings();
  }, [playerId]);

  const handleEditClick = (bonus: BonusSettingData) => {
    setEditingBonusId(bonus.bonusId);
    setNewPercentage(bonus.percentage ?? 0);
  };

  const handleSaveClick = async (bonusId: number) => {
    if (newPercentage === null || isNaN(newPercentage)) {
      showToast("Please enter a valid number", "info");
      return;
    }

    setIsSubmitting(true);

    const request: ChangePlayersBonusSettingRequest = {
      playerId: Number(playerId),
      bonusId,
      percentage: newPercentage,
    };

    const res = await changePlayerBonusSetting(request);
    if (res.isSuccess) {
      showToast("Bonus updated successfully", "success");
      setBonusList((prev) =>
        prev.map((b) =>
          b.bonusId === bonusId ? { ...b, percentage: newPercentage } : b
        )
      );
      setEditingBonusId(null);
      setNewPercentage(null);
    } else {
      showToast(res.message || "Failed to update bonus", "error");
    }

    setIsSubmitting(false);
  };

  if (loading) return <div>Loading bonus settings...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Type</th>
            <th className="border px-4 py-2 text-left">Default</th>
            <th className="border px-4 py-2 text-left">Percentage</th>
            <th className="border px-4 py-2 text-left">Note</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bonusList
            .filter((b) => b.isPercentage === true)
            .map((bonus) => {
              const isEditing = editingBonusId === bonus.bonusId;
              const isOtherEditing = editingBonusId !== null && !isEditing;

              return (
                <tr
                  key={bonus.bonusId}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    isEditing ? "bg-blue-100 dark:bg-blue-900" : ""
                  }`}
                >
                  <td className="border px-4 py-2">{bonus.name}</td>
                  <td className="border px-4 py-2">{bonusTypes.find((p) => p.id === bonus.type)?.name}</td>
                  <td className="border px-4 py-2">{bonus.defaultPercentage ? bonus.defaultPercentage : "-"}</td>
                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <input
                        type="number"
                        className="border px-2 py-1 rounded w-20"
                        value={newPercentage ?? 0}
                        onChange={(e) => setNewPercentage(Number(e.target.value))}
                      />
                    ) : (
                      bonus.percentage ?? "-"
                    )}
                  </td>
                  <td className="border px-4 py-2">{bonus.note ?? "-"}</td>
                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <>
                        <button
                          disabled={isSubmitting}
                          className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-800"
                          onClick={() => handleSaveClick(bonus.bonusId)}
                        >
                          Save
                        </button>
                        <button
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:bg-gray-500"
                          onClick={() => setEditingBonusId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        disabled={isOtherEditing}
                        className={`px-3 py-1 rounded text-white ${
                          isOtherEditing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        onClick={() => handleEditClick(bonus)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerBonusSettings;
