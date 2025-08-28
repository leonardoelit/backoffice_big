import React, { useState } from "react";
import { PencilIcon } from "@/icons";
import { updatePlayersData } from "@/lib/api";
import { showToast } from "@/utils/toastUtil";
import { Player } from "../constants/types";

interface EditableFieldProps {
  label: string;
  value?: string | boolean;
  fieldName: keyof Player; // must match your Player type
  player: Player;
  type?: "text" | "email" | "date" | "checkbox"; // NEW
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  fieldName,
  player,
  type = "text",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (newValue: any) => {
    setLoading(true);
    try {
      const body: any = {
        playerId: player.playerId,
        [fieldName]: newValue,
      };

      const res = await updatePlayersData(body);

      if (res.isSuccess) {
        showToast(`${label} updated successfully`, "success");
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  // checkbox toggle
  if (type === "checkbox") {
    return (
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          disabled={loading}
          onChange={(e) => handleSave(e.target.checked)}
          className="accent-blue-500 w-5 h-5 cursor-pointer"
        />
      </div>
    );
  }

  // text/date/email
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <input
            type={type}
            className="border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:text-white"
            value={String(inputValue)}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => handleSave(inputValue)}
            disabled={loading}
            autoFocus
          />
        ) : (
          <span className="font-medium">{value?.toString() || "-"}</span>
        )}

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default EditableField;
