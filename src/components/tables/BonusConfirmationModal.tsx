"use client";
import { showToast } from "@/utils/toastUtil";
import React, { useState, useEffect } from "react";

const BonusConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, note: string) => void;
  action: "accept" | "reject";
}) => {
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setNote("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleConfirm = () => {
    const numericAmount = Number(amount);

    if (action === "accept" && (isNaN(numericAmount) || numericAmount <= 0)) {
      showToast("Miktar 0 dan büyük olmalıdır", "info");
      return;
    }

    onConfirm(numericAmount, note);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={handleContentClick}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {action === "accept" ? "Accept Request" : "Reject Request"}
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={action === "reject"}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              placeholder="Optional note..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-md ${
              action === "accept"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {action === "accept" ? "Confirm Accept" : "Confirm Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BonusConfirmationModal;
