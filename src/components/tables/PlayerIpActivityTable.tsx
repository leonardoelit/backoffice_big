"use client";

import React, { useEffect, useState, useRef } from "react";
import { getIpLogsForPlayer, addIpToBlacklist, getIpLogsWithIp } from "@/components/lib/api";
import { BanIpRequest, Device, IpLogData } from "@/components/constants/types";
import { showToast } from "@/utils/toastUtil";
import { formatDateToDDMMYYYYHHMMSS } from "@/utils/utils";

const PlayerIpActivityTable = ({ playerId }: { playerId: string }) => {
  const [ipLogs, setIpLogs] = useState<IpLogData[]>([]);
  const [ipLogsOfIp, setIpLogsOfIp] = useState<IpLogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBaning, setIsBaning] = useState(false);
  const [infoIp, setInfoIp] = useState<string | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [expiredAt, setexpiredAt] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [banTargetIp, setBanTargetIp] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Fetch ip logs for player
  useEffect(() => {
    const fetchIpLogs = async () => {
      setLoading(true);
      const res = await getIpLogsForPlayer(playerId);
      if (res.isSuccess) {
        setIpLogs(res.ipLogs);
      } else {
        showToast(res.message || "Failed to load ip logs", "error");
      }
      setLoading(false);
    };
    fetchIpLogs();
  }, [playerId]);

  // Fetch ip logs for a specific IP
  useEffect(() => {
    const fetchIpLogsForIp = async () => {
      if (infoIp === null) return;
      setInfoLoading(true);
      const res = await getIpLogsWithIp(infoIp);
      if (res.isSuccess) {
        setIpLogsOfIp(res.ipLogs);
      } else {
        showToast(res.message || "Failed to load ip logs", "error");
      }
      setInfoLoading(false);
    };
    fetchIpLogsForIp();
  }, [infoIp]);

  // Close info modal on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setInfoIp(null);
        setIpLogsOfIp([]);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInfoIp(null);
    };
    if (infoIp) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [infoIp]);

  const handleBanOpen = (ip: string) => {
    setBanTargetIp(ip);
    setShowBanConfirm(true);
  };

  const handleBanConfirm = async () => {
    if (!banTargetIp) return;
    setShowBanConfirm(false);
    setIsBaning(true);
    
    const request: BanIpRequest = {
      playerId: Number(playerId),
      ip: banTargetIp,
      playerUsername: ipLogs[0].playerUsername,
    };

    if (reason) request.reason = reason;
    if (expiredAt) request.expiredAt = expiredAt;

    const res = await addIpToBlacklist(request);
    if (res.isSuccess) {
      showToast("IP blacklisted", "success");
    } else {
      showToast(res.message || "Failed to blacklist IP", "error");
    }
    setIsBaning(false);
  };

  if (loading) return <div>Loading ip activities...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100">
            <th className="border px-4 py-2 text-left">IP</th>
            <th className="border px-4 py-2 text-left">Login Date</th>
            <th className="border px-4 py-2 text-left">Device</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ipLogs.map((log, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-gray-100"
            >
              <td className="border px-4 py-2">{log.ip}</td>
              <td className="border px-4 py-2">{formatDateToDDMMYYYYHHMMSS(log.loginDate)}</td>
              <td className="border px-4 py-2">{Device[log.device]}</td>
              <td className="border px-4 py-2">
                <div className="flex flex-row items-start justify-start">
                  <button
                    disabled={isBaning}
                    className={`px-3 py-1 rounded text-white mr-2.5 ${
                      isBaning
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => {
                      setInfoLoading(true);
                      setInfoIp(log.ip);
                    }}
                  >
                    Info
                  </button>
                  <button
                    disabled={isBaning}
                    className={`px-3 py-1 rounded text-white ${
                      isBaning
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={() => handleBanOpen(log.ip)}
                  >
                    Ban
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Info Popup */}
      {infoIp && (
        <div className="fixed inset-0 z-[9999999999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 opacity-100"></div>
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100"
          >
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-gray-100">
              IP Activity: {infoIp}
            </h2>
            {infoLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700">
                    <tr className="text-black dark:text-gray-100">
                      <th className="border px-3 py-2 text-left">Player ID</th>
                      <th className="border px-3 py-2 text-left">Username</th>
                      <th className="border px-3 py-2 text-left">Login Date</th>
                      <th className="border px-3 py-2 text-left">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipLogsOfIp.map((log, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="border px-3 py-2">{log.playerId}</td>
                        <td className="border px-3 py-2">{log.playerUsername}</td>
                        <td className="border px-3 py-2">
                          {formatDateToDDMMYYYYHHMMSS(log.loginDate)}
                        </td>
                        <td className="border px-3 py-2">{Device[log.device]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                onClick={() => {
                  setInfoIp(null);
                  setIpLogsOfIp([]);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Ban */}
    {showBanConfirm && (
    <div
        className="fixed inset-0 z-[9999999999] flex items-center justify-center"
        onClick={() => setShowBanConfirm(false)}
    >
        <div className="absolute inset-0 bg-black/50"></div>
        <div
        className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
        >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Confirm Ban
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to ban IP: <strong>{banTargetIp}</strong>?
        </p>

        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Reason</label>
            <input
            type="text"
            value={reason || ""}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional reason"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Expired At</label>
            <input
            type="datetime-local"
            value={expiredAt || ""}
            onChange={(e) => setexpiredAt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="flex justify-end space-x-3">
            <button
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={() => setShowBanConfirm(false)}
            >
            Cancel
            </button>
            <button
            className="px-4 py-2 text-white rounded-md bg-red-600 hover:bg-red-700"
            onClick={handleBanConfirm}
            >
            Confirm
            </button>
        </div>
        </div>
    </div>
    )}
    </div>
  );
};

export default PlayerIpActivityTable;
