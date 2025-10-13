"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
} from "../ui/table";
import { GameData, PrizeData, PrizeType, UpdateWheelPrizeRequest } from "../constants/types";
import { updateWheelPrize, deleteWheelPrize, getWheelPrizes, createWheelPrize } from "../lib/api";
import { showToast } from "@/utils/toastUtil";
import { formatDateToDDMMYYYYHHMMSS } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";
import { freespinProviders } from "../constants";

type PopupMode = "create" | "update" | "delete";

const BasicTableVipWheelPrizes = () => {
  const { games } = useAuth();
  const [prizeList, setPrizeList] = useState<PrizeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false)
  const [filteredGames, setFilteredGames] = useState<GameData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [updateSearchQuery, setUpdateSearchQuery] = useState("");
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // sorting
  const [sortField, setSortField] = useState<keyof PrizeData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState<PopupMode>("create");
  const popupRef = useRef<HTMLDivElement>(null);

  // form state
  const [formData, setFormData] = useState({
    name: "",
    prizeAmount: 0,
    percentage: 0,
    prizeType: PrizeType.Cash,
    gameId: "",
    gameBet: "",
    isVip: true,
  });

  const [selectedPrize, setSelectedPrize] = useState<PrizeData | null>(null);
  const [updateFormData, setUpdateFormData] = useState<UpdateWheelPrizeRequest>({
    id: 0,
    active: true,
    prizeType: PrizeType.Cash,
    percentage: 0,
    name: "",
    prizeAmount: 0,
    isVip: true
  });

  const [isPercentageInvalid, setIsPercentageInvalid] = useState(false);

  // Recalculate percentages whenever prizeList changes
  useEffect(() => {
    if(prizeList.length > 0){
      const totalPercentage = prizeList.reduce(
        (sum, prize) => sum + (prize.percentage || 0),
        0
      );
      setIsPercentageInvalid(totalPercentage !== 100);
    }
  }, [prizeList]);

  const openCreatePopup = () => {
    setPopupMode("create");
    setFormData({
      name: "",
      prizeAmount: 0,
      prizeType: PrizeType.Cash,
      percentage: 0,
      gameId: "",
      gameBet: "",
      isVip: true
    });
    setShowPopup(true);
  };

  const openUpdatePopup = (prize: PrizeData) => {
    setPopupMode("update");
    setSelectedPrize(prize);
    setUpdateFormData({
      id: prize.id,
      active: prize.active,
      name: prize.name,
      percentage: prize.percentage,
      prizeAmount: prize.prizeAmount,
      prizeType: prize.prizeType,
      gameBet: prize.gameBet,
      gameId: prize.gameId
    });
    setShowPopup(true);
  };

  const openDeletePopup = (prize: PrizeData) => {
    setPopupMode("delete");
    setSelectedPrize(prize);
    setShowPopup(true);
  };

  const handleUpdatePrize = async () => {
    if (!selectedPrize) return;
    setIsCreating(true)
    try {
      const response = await updateWheelPrize(updateFormData);
      if (!response.isSuccess) {
        showToast(response.message ?? "Failed to update wheel prize", "error");
        setIsCreating(false)
        return;
      }
      showToast("Prize updated successfully!", "success");
      setShowPopup(false);
      setIsCreating(false)
      getWheelPrizeList();
    } catch {
      showToast("Unexpected error updating wheel prize", "error");
    }
  };

  const handleDeletePrize = async () => {
    if (!selectedPrize) return;
    setIsCreating(true)
    try {
      const response = await deleteWheelPrize(selectedPrize.id);
      if (!response.isSuccess) {
        showToast(response.message ?? "Failed to delete prize", "error");
        setIsCreating(false)
        return;
      }
      showToast("Prize deleted successfully!", "success");
      setShowPopup(false);
      setIsCreating(false)
      getWheelPrizeList();
    } catch {
      showToast("Unexpected error deleting wheel prize", "error");
    }
  };

  const filterGames = () => {
    const filteredGamesList = games.filter((g) => freespinProviders.includes(g.providerId))
    setFilteredGames(filteredGamesList)
  }

  useEffect(() => {
    getWheelPrizeList();
  }, []);

  useEffect(() => {
    if(games.length > 0){
      filterGames();
    }
  }, [games]);

  useEffect(() => {
  if (updateFormData.gameId) {
    const selectedGame = filteredGames.find((g) => g.id.toString() === updateFormData.gameId);
    setUpdateSearchQuery(selectedGame ? selectedGame.name : "");
  }
}, [updateFormData.gameId, filteredGames]);

  const getWheelPrizeList = async () => {
    setIsLoading(true);
    const bonusesResponse = await getWheelPrizes();
    if (!bonusesResponse.isSuccess) {
      showToast(
        bonusesResponse.message ??
          "Something went wrong while getting prize list",
        "error"
      );
    } else {
      setPrizeList(bonusesResponse.prizes?.filter((p) => p.isVip === true) ?? []);
    }
    setIsLoading(false);
  };

  const handleSort = (field: keyof PrizeData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const updateSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPopup &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        // Don't close if click is inside the update dropdown
        if (updateSelectRef.current?.contains(event.target as Node)) return;

        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);


  const handleCreateBonus = async () => {
    setIsCreating(true)
    try {
      const response = await createWheelPrize(formData);
      if (!response.isSuccess) {
        showToast(response.message ?? "Failed to create bonus", "error");
        setIsCreating(false)
        return;
      }
      showToast("Bonus created successfully!", "success");
      setShowPopup(false);
      setFormData({
        name: "",
        prizeAmount: 0,
        prizeType: PrizeType.Cash,
        percentage: 0,
        gameId: "",
        gameBet: "",
        isVip: true
      });
    setIsCreating(false)
      getWheelPrizeList();
    } catch (error) {
      showToast("Unexpected error creating bonus", "error");
    }
  };

  // apply sorting
  let sortedList = [...prizeList];
  if (sortField) {
    sortedList.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // pagination logic
  const totalPages = Math.ceil(sortedList.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedList = sortedList.slice(startIndex, startIndex + rowsPerPage);

  const SkeletonRow = ({ columns }: { columns: number }) => (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="px-5 py-4">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
      {/* 🚨 Error Banner */}
    {isPercentageInvalid && (
      <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-center font-medium">
        Sum of all the prizes percentages must be 100 for the wheel to work
      </div>
    )}
      {/* Header controls */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginatedList.length} of {prizeList.length} prizes
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreatePopup}
            className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-700"
          >
            + Add Prize
          </button>
          <label
            htmlFor="rowsPerPage"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="text-sm rounded-md border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            {[25, 50, 75, 100].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px] min-h-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("orderNumber")}>
                  Order
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("name")}>
                  Name
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("prizeType")}>
                  Type
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("prizeAmount")}>
                  Amount / Freespin Info
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("percentage")}>
                  Percentage
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500">
                  Active
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("updatedAt")}>
                  Created At
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 ">
                    Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody
              className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <SkeletonRow key={i} columns={8} />
                ))
              ) : paginatedList.length > 0 ? (
                paginatedList.map((prize) => (
                  <TableRow key={prize.id}>
                    <TableCell className="px-5 py-4">{prize.orderNumber}</TableCell>
                    <TableCell className="px-5 py-4">{prize.name}</TableCell>
                    <TableCell className="px-5 py-4">
                      {PrizeType[prize.prizeType]}
                    </TableCell>
                    <TableCell className="px-5 py-4">{prize.prizeType === 1 ? `₺${prize.prizeAmount}` : (
                      <div className="flex flex-col items-start justify-start">
                        <p>{filteredGames.find((g) => g.id.toString() === prize.gameId)?.name}</p>
                        <p>{prize.gameBet} Bet</p>
                        <p>{prize.prizeAmount} Rounds</p>
                      </div>
                    )}</TableCell>
                    <TableCell className="px-5 py-4">{prize.percentage}%</TableCell>
                    <TableCell className="px-5 py-4">
                      {prize.active ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {formatDateToDDMMYYYYHHMMSS(prize.updatedAt)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <button
                        onClick={() => openUpdatePopup(prize)}
                        className="text-blue-600 hover:text-blue-800 mr-1"
                        title="Update"
                        >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                        >
                            {/* Primary shape uses currentColor so you can color via CSS/Tailwind */}
                            <path
                            d="M21.71,10.29a1,1,0,0,0-1.42,0L19,11.59V7a3,3,0,0,0-3-3H6A1,1,0,0,0,6,6H16a1,1,0,0,1,1,1v4.59l-1.29-1.3a1,1,0,0,0-1.42,1.42l3,3a1,1,0,0,0,1.42,0l3-3A1,1,0,0,0,21.71,10.29Z"
                            fill="#000"
                            />
                            {/* Secondary accent (customizable via prop) */}
                            <path
                            d="M18,18H8a1,1,0,0,1-1-1V12.41l1.29,1.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-3-3a1,1,0,0,0-1.42,0l-3,3a1,1,0,0,0,1.42,1.42L5,12.41V17a3,3,0,0,0,3,3H18a1,1,0,0,0,0-2Z"
                            fill="currentColor"
                            />
                        </svg>
                        </button>
                        <button
                        onClick={() => openDeletePopup(prize)}
                        className="text-black hover:text-red-700 transition-colors"
                        title="Delete"
                        >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                        >
                            <path d="M10 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="px-5 py-4 text-center">
                    No prizes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Popup modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999999]">
          <div
            ref={popupRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96"
          >
            {popupMode === "create" && (
              <>
                <h2 className="text-lg font-semibold mb-4">Create VIP Prize</h2>
                {/* Bonus Type Select */}
                <label className="block text-sm mb-2">
                    Type
                    <select
                        value={formData.prizeType}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            prizeType: Number(e.target.value),
                        })
                        }
                        className="w-full border px-2 py-1 rounded"
                    >
                        {Object.entries(PrizeType)
                        .filter(([key, value]) => !isNaN(Number(value))) // only numeric values
                        .map(([key, value]) => (
                            <option key={value} value={value}>
                            {key}
                            </option>
                        ))}
                    </select>
                </label>


                {/* Name input - common */}
                <label className="block text-sm mb-2">
                  Name
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </label>

                {/* Conditional rendering based on type */}
                {formData.prizeType === 0 ? (
                  <>
                    {/* Free Spin Bonus field - Bonus Id (searchable select) */}
                    <label className="block text-sm mb-2">
                      Bonus Game
                      <div className="relative">
                        {/* Search input */}
                        <input
                          type="text"
                          placeholder="Search game..."
                          value={
                            filteredGames.find((g) => g.id.toString() === formData.gameId)?.name ||
                            searchQuery
                          }
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full border px-2 py-1 rounded"
                        />

                        {/* Dropdown list */}
                        {searchQuery && (
                          <ul className="absolute z-10 bg-white border rounded mt-1 max-h-40 overflow-y-auto w-full">
                            {filteredGames
                              .filter((game) =>
                                game.name.toLowerCase().includes(searchQuery.toLowerCase())
                              )
                              .map((game) => (
                                <li
                                  key={game.id}
                                  onClick={() => {
                                    setFormData({ ...formData, gameId: game.id.toString() });
                                    setSearchQuery(""); // clear search after selection
                                  }}
                                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                                >
                                  {game.name}
                                </li>
                              ))}

                            {/* No results */}
                            {filteredGames.filter((g) =>
                              g.name.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length === 0 && (
                              <li className="px-2 py-1 text-gray-500">No results</li>
                            )}
                          </ul>
                        )}
                      </div>
                    </label>

                    <label className="block text-sm mb-2">
                      Bonus Bet
                      <input
                        type="text"
                        value={formData.gameBet || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, gameBet: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                    <label className="block text-sm mb-2">
                        Bonus Rounds
                        <input
                            type="number"
                            value={formData.prizeAmount ?? ""}
                            onChange={(e) =>
                            setFormData({
                                ...formData,
                                prizeAmount: e.target.value ? parseInt(e.target.value) : 0,
                            })
                            }
                            className="w-full border px-2 py-1 rounded"
                            min={0} // optional: prevent negative numbers
                        />
                    </label>
                    <label className="block text-sm mb-2">
                        Percentage
                        <input
                            type="number"
                            value={formData.percentage ?? ""}
                            onChange={(e) =>
                            setFormData({
                                ...formData,
                                percentage: e.target.value ? parseInt(e.target.value) : 0,
                            })
                            }
                            className="w-full border px-2 py-1 rounded"
                            min={0} // optional: prevent negative numbers
                        />
                    </label>
                  </>
                ) : (
                  <>
                  <label className="block text-sm mb-2">
                        Cash Amount
                        <input
                            type="number"
                            value={formData.prizeAmount ?? ""}
                            onChange={(e) =>
                            setFormData({
                                ...formData,
                                prizeAmount: e.target.value ? parseInt(e.target.value) : 0,
                            })
                            }
                            className="w-full border px-2 py-1 rounded"
                            min={0} // optional: prevent negative numbers
                        />
                    </label>
                    <label className="block text-sm mb-2">
                        Percentage
                        <input
                            type="number"
                            value={formData.percentage ?? ""}
                            onChange={(e) =>
                            setFormData({
                                ...formData,
                                percentage: e.target.value ? parseInt(e.target.value) : 0,
                            })
                            }
                            className="w-full border px-2 py-1 rounded"
                            min={0} // optional: prevent negative numbers
                        />
                    </label>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-1 rounded bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateBonus}
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {popupMode === "update" && (
              <>
                <h2 className="text-lg font-semibold mb-4">Update Bonus</h2>

                {/* DefId (read-only) */}
                <label className="block text-sm mb-2">
                  Id
                  <input
                    type="text"
                    value={updateFormData.id}
                    disabled
                    className="w-full border px-2 py-1 rounded bg-gray-100"
                  />
                </label>

                {/* Active */}
                <label className="block text-sm mb-2">
                  Active
                  <select
                    value={updateFormData.active ? "true" : "false"}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        active: e.target.value === "true",
                      })
                    }
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </label>

                {/* Name */}
                <label className="block text-sm mb-2">
                  Name
                  <input
                    type="text"
                    value={updateFormData.name}
                    onChange={(e) =>
                      setUpdateFormData({ ...updateFormData, name: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </label>

                {/* Type */}
                <label className="block text-sm mb-2">
                Type
                <select
                    value={updateFormData.prizeType}
                    onChange={(e) =>
                    setUpdateFormData({
                        ...updateFormData,
                        prizeType: Number(e.target.value),
                    })
                    }
                    className="w-full border px-2 py-1 rounded"
                >
                    {Object.entries(PrizeType)
                    .filter(([key, value]) => !isNaN(Number(value)))
                    .map(([key, value]) => (
                        <option key={value} value={value}>
                        {key}
                        </option>
                    ))}
                </select>
                </label>

                {/* Conditional rendering based on type */}
                {updateFormData.prizeType === 0 ? (
                  <>
                    {/* Free Spin Bonus field - Bonus Id (update popup with searchable select) */}
                    <label className="text-sm">Prize Game</label>
                    <div
                      className="relative text-sm mb-2"
                      ref={updateSelectRef} // ✅ add this
                      onMouseDown={(e) => e.stopPropagation()} // optional, ensures the dropdown click doesn't bubble
                    >
                      <input
                        type="text"
                        placeholder="Search game..."
                        value={updateSearchQuery}
                        onFocus={() => setIsUpdateDropdownOpen(true)}
                        onChange={(e) => {
                          setUpdateSearchQuery(e.target.value);
                          setIsUpdateDropdownOpen(true);
                        }}
                        className="w-full border px-2 py-1 rounded"
                      />
                      {isUpdateDropdownOpen && (
                        <ul className="absolute z-10 bg-white border rounded mt-1 max-h-40 overflow-y-auto w-full">
                          {filteredGames
                            .filter((game) =>
                              game.name.toLowerCase().includes(updateSearchQuery.toLowerCase())
                            )
                            .map((game) => (
                              <li
                                key={game.id}
                                onClick={() => {
                                  setUpdateFormData({
                                    ...updateFormData,
                                    gameId: game.id.toString(),
                                  });
                                  setUpdateSearchQuery(game.name);
                                  setIsUpdateDropdownOpen(false);
                                }}
                                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                              >
                                {game.name}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>


                    <label className="block text-sm mb-2">
                      Prize Bet
                      <input
                        type="text"
                        value={updateFormData.gameBet || ""}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, gameBet: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                    <label className="block text-sm mb-2">
                        Bonus Rounds
                        <input
                            type="number"
                            value={updateFormData.prizeAmount ?? ""}
                            onChange={(e) =>
                            setUpdateFormData({
                                ...updateFormData,
                                prizeAmount: e.target.value ? parseInt(e.target.value) : 0,
                            })
                            }
                            className="w-full border px-2 py-1 rounded"
                            min={0} // optional, prevent negative numbers
                        />
                    </label>
                    <label className="block text-sm mb-2">
                        Percentage
                        <input
                            type="number"
                            value={updateFormData.percentage ?? ""}
                            onChange={(e) =>
                            setUpdateFormData({
                                ...updateFormData,
                                percentage: e.target.value ? parseInt(e.target.value) : 0,
                            })
                            }
                            className="w-full border px-2 py-1 rounded"
                            min={0} // optional: prevent negative numbers
                        />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="block text-sm mb-2">
                    Cash Amount
                    <input
                        type="number"
                        value={updateFormData.prizeAmount ?? ""}
                        onChange={(e) =>
                        setUpdateFormData({
                            ...updateFormData,
                            prizeAmount: e.target.value ? parseInt(e.target.value) : 0,
                        })
                        }
                        className="w-full border px-2 py-1 rounded"
                        min={0}
                    />
                    </label>
                    <label className="block text-sm mb-2">
                        Percentage
                        <input
                            type="number"
                            value={updateFormData.percentage ?? ""}
                            onChange={(e) =>
                            setUpdateFormData({
                                ...updateFormData,
                                percentage: e.target.value ? parseInt(e.target.value) : 0,
                            })
                            }
                            className="w-full border px-2 py-1 rounded"
                            min={0} // optional: prevent negative numbers
                        />
                    </label>
                  </>
                )}


                {/* Action buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    disabled={isCreating}
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-1 rounded bg-gray-200 disabled:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isCreating}
                    onClick={handleUpdatePrize}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white"
                  >
                    Update
                  </button>
                </div>
              </>
            )}

            {popupMode === "delete" && (
              <>
                <h2 className="text-lg font-semibold mb-4">Delete Bonus</h2>
                <p>
                  Are you sure you want to delete{" "}
                  <b>{selectedPrize?.name}</b>?
                </p>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    disabled={isCreating}
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-1 rounded bg-gray-200 disabled:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    disabled = {isCreating}
                    onClick={handleDeletePrize}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 dark:bg-red-800 text-white"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicTableVipWheelPrizes;
