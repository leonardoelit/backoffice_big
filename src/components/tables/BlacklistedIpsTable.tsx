"use client";

import React, { useEffect, useState } from "react";
import { addIpToBlacklist, getBlackListedIps, removeIpFromBlacklist } from "@/components/lib/api";
import { BanIpRequest, BlackListData } from "@/components/constants/types";
import { showToast } from "@/utils/toastUtil";
import { formatDateToDDMMYYYYHHMMSS } from "@/utils/utils";

const BlacklistedIpsTable = () => {
  const [ipLogs, setIpLogs] = useState<BlackListData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBaning, setIsBaning] = useState(false);
  const [removeBanId, setRemoveBanId] = useState<number | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [expiredAt, setexpiredAt] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [banTargetIp, setBanTargetIp] = useState<string | null>(null);
  const [removeTargetIp, setRemoveTargetIp] = useState<string | null>(null);

  const fetchIpLogs = async () => {
      setLoading(true);
      const res = await getBlackListedIps();
      if (res.isSuccess) {
        setIpLogs(res.blacklist);
      } else {
        showToast(res.message || "Failed to load blacklisted ips", "error");
      }
      setLoading(false);
    };

  // Fetch ip logs for player
  useEffect(() => {
    fetchIpLogs();
  }, []);

  const handleBanOpen = () => {
    setShowBanConfirm(true);
  };

  const handleRemoveBanOpen = (id: number, ip:string) => {
    setRemoveBanId(id);
    setRemoveTargetIp(ip)
    setRemoveOpen(true);
  };

  const handleBanConfirm = async () => {
    if (!banTargetIp) {
        showToast("Lütfen ip giriniz", "info")
        return;
    }
    setShowBanConfirm(false);
    setIsBaning(true);
    
    const request: BanIpRequest = {
      ip: banTargetIp
    };

    if (reason) request.reason = reason;
    if (expiredAt) request.expiredAt = expiredAt;

    const res = await addIpToBlacklist(request);
    if (res.isSuccess) {
      showToast("IP blacklisted", "success");
      fetchIpLogs();
    } else {
      showToast(res.message || "Failed to blacklist IP", "error");
    }
    setIsBaning(false);
  };

  const handleRemoveFromBlacklist = async () => {
    if(removeBanId === null){
        showToast("Ip alınamadı, lütfen tekrar deneyin", "info");
        setRemoveOpen(false);
        return;
    }

    setIsSubmitting(true)

    try {
        const res = await removeIpFromBlacklist(removeBanId);
        if(res.isSuccess){
            showToast(res.message ? res.message : "Ip blacklist ten kaldırıldı", "success")
            setRemoveOpen(false);
            fetchIpLogs();
        }else{
            showToast(res.message ? res.message : "Ip blacklist ten kaldırılırken hata", "error")
        }
        setIsSubmitting(false)
    } catch (error) {
        console.log(error)
        showToast("Ip blacklist ten kaldırılırken hata", "error")
    }
  }

  if (loading) {
  // Show skeleton table
  return (
    <div className="overflow-x-auto">
        <div className="w-full flex justify-end items-center mb-4">
            <button
                disabled={isBaning}
                className="px-3 py-2 border-gray-400 dark:border-gray-600 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-800"
                onClick={handleBanOpen}
            >
                Add To Blacklist
            </button>
        </div>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100">
            {["IP", "Employee Name", "Player ID", "Player Username", "Reason", "Created At", "Expires At", "Active", "Actions"].map((th, i) => (
              <th key={i} className="border px-4 py-2 text-left">{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => ( // 5 skeleton rows
            <tr key={i} className="animate-pulse">
              {Array(9).fill(0).map((_, j) => (
                <td key={j} className="border px-4 py-2">
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

  return (
    <div className="overflow-x-auto max-h-[600px]">
        <div className="w-full flex justify-end items-center mb-4">
            <button
                disabled={isBaning}
                className="px-3 py-2 border-gray-400 dark:border-gray-600 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-800"
                onClick={handleBanOpen}
            >
                Add To Blacklist
            </button>
        </div>


      
  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
    <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
          <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100">
            <th className="border px-4 py-2 text-left">IP</th>
            <th className="border px-4 py-2 text-left">Employee Name</th>
            <th className="border px-4 py-2 text-left">Player ID</th>
            <th className="border px-4 py-2 text-left">Player Username</th>
            <th className="border px-4 py-2 text-left">Reason</th>
            <th className="border px-4 py-2 text-left">Created At</th>
            <th className="border px-4 py-2 text-left">Expires At</th>
            <th className="border px-4 py-2 text-left">Active</th>
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
              <td className="border px-4 py-2">{log.employeeName}</td>
              <td className="border px-4 py-2">{log.playerId}</td>
              <td className="border px-4 py-2">{log.playerUsername}</td>
              <td className="border px-4 py-2">{log.reason}</td>
              <td className="border px-4 py-2">{formatDateToDDMMYYYYHHMMSS(log.createdAt)}</td>
              <td className="border px-4 py-2">{log.expiresAt === null || log.expiresAt === undefined ? "Infinite" : formatDateToDDMMYYYYHHMMSS(log.expiresAt)}</td>
              <td className="px-4 py-3 text-center border">
                <div className="relative group inline-flex items-center justify-center h-6 w-6">
                    
                    <span
                        className={`absolute inline-flex h-full w-full rounded-full ${
                            log.isActive
                                ? "bg-green-400 opacity-75 animate-pulse"
                                : "hidden"
                        }`}
                    ></span>
                    <span
                        className={`relative inline-flex h-3 w-3 rounded-full shadow-lg transition-colors duration-300 ${
                            log.isActive ? "hidden" : "bg-red-600"
                        }`}
                    ></span>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block px-3 py-1 text-xs rounded-md bg-gray-800 text-white shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        {log.isActive ? "Active" : "Inactive"}
                    </span>
                    
                </div>
              </td>
              <td className="border px-4 py-2">
                  <button
                    disabled={isSubmitting}
                    className={`px-3 py-1 rounded text-white ${
                      isBaning
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={() => handleRemoveBanOpen(log.id, log.ip)}
                  >
                    Remove
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
            Manual Ban
        </h3>

        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Ip</label>
            <input
            type="text"
            value={banTargetIp || ""}
            onChange={(e) => setBanTargetIp(e.target.value)}
            placeholder="Ip"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

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

    {removeOpen && (
    <div
        className="fixed inset-0 z-[9999999999] flex items-center justify-center"
        onClick={() => setRemoveOpen(false)}
    >
        <div className="absolute inset-0 bg-black/50"></div>
        <div
        className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
        >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Remove Ip From Blacklist
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to whitelist IP: <strong>{removeTargetIp}</strong>?
        </p>

        <div className="flex justify-end space-x-3">
            <button
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={() => setRemoveOpen(false)}
            >
            Cancel
            </button>
            <button
            className="px-4 py-2 text-white rounded-md bg-red-600 hover:bg-red-700"
            onClick={() => handleRemoveFromBlacklist()}
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

export default BlacklistedIpsTable;
