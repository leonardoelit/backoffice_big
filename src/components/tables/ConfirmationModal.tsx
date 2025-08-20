"use client";
import React from "react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  action: "accept" | "reject";
}) => {
  if (!isOpen) return null;

  // stop propagation inside modal content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]"
      onClick={onClose} // clicking background closes
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={handleContentClick} // clicking inside doesn’t close
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {action === "accept" ? "Accept Request" : "Reject Request"}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to {action} this request?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md ${
              action === "accept" 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Confirm {action === "accept" ? "Accept" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
