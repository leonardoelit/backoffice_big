"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
} from "../ui/table";
import { Bonus, GameData, UpdateBonusRequest } from "../constants/types";
import { getBonuses, createBonus, deleteBonus, updateBonus } from "../lib/api";
import { showToast } from "@/utils/toastUtil";
import { formatDateToDDMMYYYYHHMMSS } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";
import { freespinProviders } from "../constants";

type PopupMode = "create" | "update" | "delete";

export const bonusTypes = [
  { id: 0, name: "Freespin" },
  { id: 1, name: "Casino" },
  { id: 2, name: "Sport" },
];

const BasicTableBonuses = () => {
  const { games } = useAuth();
  const [bonusList, setBonusList] = useState<Bonus[]>([]);
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
  const [sortField, setSortField] = useState<keyof Bonus | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState<PopupMode>("create");
  const popupRef = useRef<HTMLDivElement>(null);

  // form state
  const [formData, setFormData] = useState({
    type: bonusTypes[1].id,
    name: "",
    min: 0,
    max: 0,
    bonusId: "",
    bonusBet: "",
    bonusRounds: "",
    isPercentage: false,
    percentage: 0,
    description: "",
  });

  const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null);
  const [updateFormData, setUpdateFormData] = useState<UpdateBonusRequest>({
    active: true,
    defId: "",
    type: bonusTypes[1].id,
    name: "",
    isPercentage: false,
    bonusId: undefined,
    bonusBet: undefined,
    bonusRounds: undefined,
    min: 0,
    max: 0,
    description: "",
  });

  const openCreatePopup = () => {
    setPopupMode("create");
    setFormData({
      type: bonusTypes[1].id,
      name: "",
      isPercentage: false,
      percentage: 0,
      bonusId: "",
      bonusBet: "",
      bonusRounds: "",
      min: 0,
      max: 0,
      description: "",
    });
    setShowPopup(true);
  };

  const openUpdatePopup = (bonus: Bonus) => {
    setPopupMode("update");
    setSelectedBonus(bonus);
    setUpdateFormData({
      defId: bonus.defId,
      active: bonus.active,
      type: bonus.type,
      name: bonus.name,
      isPercentage: bonus.isPercentage,
      percentage: bonus.percentage,
      bonusId: bonus.bonusId,
      bonusBet: bonus.bonusBet,
      bonusRounds: bonus.bonusRounds,
      min: bonus.min,
      max: bonus.max,
      description: bonus.description,
    });
    setShowPopup(true);
  };

  const openDeletePopup = (bonus: Bonus) => {
    setPopupMode("delete");
    setSelectedBonus(bonus);
    setShowPopup(true);
  };

  const handleUpdateBonus = async () => {
    if (!selectedBonus) return;
    setIsCreating(true)
    try {
      const response = await updateBonus(updateFormData);
      if (!response.isSuccess) {
        showToast(response.message ?? "Failed to update bonus", "error");
        setIsCreating(false)
        return;
      }
      showToast("Bonus updated successfully!", "success");
      setShowPopup(false);
      setIsCreating(false)
      getBonusesList();
    } catch {
      showToast("Unexpected error updating bonus", "error");
    }
  };

  const handleDeleteBonus = async () => {
    if (!selectedBonus) return;
    setIsCreating(true)
    try {
      const response = await deleteBonus(selectedBonus.defId);
      if (!response.isSuccess) {
        showToast(response.message ?? "Failed to delete bonus", "error");
        setIsCreating(false)
        return;
      }
      showToast("Bonus deleted successfully!", "success");
      setShowPopup(false);
      setIsCreating(false)
      getBonusesList();
    } catch {
      showToast("Unexpected error deleting bonus", "error");
    }
  };

  const filterGames = () => {
    const filteredGamesList = games.filter((g) => freespinProviders.includes(g.providerId))
    setFilteredGames(filteredGamesList)
  }

  useEffect(() => {
    getBonusesList();
  }, []);

  useEffect(() => {
    if(games.length > 0){
      filterGames();
    }
  }, [games]);

  useEffect(() => {
  if (updateFormData.bonusId) {
    const selectedGame = filteredGames.find((g) => g.id.toString() === updateFormData.bonusId);
    setUpdateSearchQuery(selectedGame ? selectedGame.name : "");
  }
}, [updateFormData.bonusId, filteredGames]);

  const getBonusesList = async () => {
    setIsLoading(true);
    const bonusesResponse = await getBonuses();
    if (!bonusesResponse.isSuccess) {
      showToast(
        bonusesResponse.message ??
          "Something went wrong while getting bonus list",
        "error"
      );
    } else {
      setBonusList(bonusesResponse.bonuses ?? []);
    }
    setIsLoading(false);
  };

  const handleSort = (field: keyof Bonus) => {
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
      if(formData.type === 0){
        formData.min = 0;
        formData.max = 1000000
      }
      const response = await createBonus(formData);
      if (!response.isSuccess) {
        showToast(response.message ?? "Failed to create bonus", "error");
        setIsCreating(false)
        return;
      }
      showToast("Bonus created successfully!", "success");
      setShowPopup(false);
      setFormData({
        type: bonusTypes[0].id,
        name: "",
        isPercentage: false,
        percentage: 0,
        bonusId: "",
        bonusBet: "",
        bonusRounds: "",
        min: 0,
        max: 0,
        description: "",
      });
    setIsCreating(false)
      getBonusesList();
    } catch (error) {
      showToast("Unexpected error creating bonus", "error");
    }
  };

  // apply sorting
  let sortedList = [...bonusList];
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
      {/* Header controls */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginatedList.length} of {bonusList.length} bonuses
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreatePopup}
            className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-700"
          >
            + Add Bonus
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
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("name")}>
                  Name
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("type")}>
                  Type
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("type")}>
                  Percentage/Freespin Info
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500">
                  Active
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("min")}>
                  Min
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("max")}>
                  Max
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500">
                  Description
                </TableCell>
                <TableCell isHeader className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => handleSort("createdAt")}>
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
                  <SkeletonRow key={i} columns={9} />
                ))
              ) : paginatedList.length > 0 ? (
                paginatedList.map((bonus) => (
                  <TableRow key={bonus.defId}>
                    <TableCell className="px-5 py-4">{bonus.name}</TableCell>
                    <TableCell className="px-5 py-4">
                      {bonusTypes.find((t) => t.id === bonus.type)?.name ??
                        bonus.type}
                    </TableCell>
                    <TableCell className="px-5 py-4">{bonus.isPercentage ? bonus.percentage : bonus.bonusId !== null ? (
                      <div className="flex flex-col items-start justify-start">
                        <p>{filteredGames.find((g) => g.id.toString() === bonus.bonusId)?.name}</p>
                        <p>{bonus.bonusBet} Bet</p>
                        <p>{bonus.bonusRounds} Rounds</p>
                      </div>
                    ) : "-"}</TableCell>
                    <TableCell className="px-5 py-4">
                      {bonus.active ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4">{bonus.min}</TableCell>
                    <TableCell className="px-5 py-4">{bonus.max}</TableCell>
                    <TableCell className="px-5 py-4">
                      {bonus.description || "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {formatDateToDDMMYYYYHHMMSS(bonus.createdAt)}
                    </TableCell>
                    <TableCell className="px-5 py-4 flex gap-2">
                      <button
                        onClick={() => openUpdatePopup(bonus)}
                        className="text-blue-600 hover:text-blue-800"
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
                        onClick={() => openDeletePopup(bonus)}
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
                    No bonuses found
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
                <h2 className="text-lg font-semibold mb-4">Create Bonus</h2>
                {/* Bonus Type Select */}
                <label className="block text-sm mb-2">
                  Type
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: parseInt(e.target.value),
                      })
                    }
                    className="w-full border px-2 py-1 rounded"
                  >
                    {bonusTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
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
                {formData.type === 0 ? (
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
                            filteredGames.find((g) => g.id.toString() === formData.bonusId)?.name ||
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
                                    setFormData({ ...formData, bonusId: game.id.toString() });
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
                        value={formData.bonusBet || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, bonusBet: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                    <label className="block text-sm mb-2">
                      Bonus Rounds
                      <input
                        type="text"
                        value={formData.bonusRounds || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, bonusRounds: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    {/* Normal Bonus fields */}
                    <label className="block text-sm mb-2">
                      Is Percentage
                      <input
                        type="checkbox"
                        checked={formData.isPercentage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPercentage: e.target.checked,
                          })
                        }
                        className="ml-2"
                      />
                    </label>

                    {formData.isPercentage && (
                      <label className="block text-sm mb-2">
                        Percentage
                        <input
                          type="text"
                          value={formData.percentage}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d{0,3}(\.\d{0,2})?$/.test(val)) {
                              let num = Number(val);
                              if (num < 0) num = 0;
                              setFormData({ ...formData, percentage: num });
                            }
                          }}
                          className="w-full border px-2 py-1 rounded"
                          placeholder="Enter percentage (0-100)"
                        />
                      </label>
                    )}

                    <label className="block text-sm mb-2">
                      Min
                      <input
                        type="number"
                        value={formData.min}
                        onChange={(e) =>
                          setFormData({ ...formData, min: Number(e.target.value) })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                    <label className="block text-sm mb-2">
                      Max
                      <input
                        type="number"
                        value={formData.max}
                        onChange={(e) =>
                          setFormData({ ...formData, max: Number(e.target.value) })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                  </>
                )}

                {/* Description - common */}
                <label className="block text-sm mb-2">
                  Description
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </label>

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
                  DefId
                  <input
                    type="text"
                    value={updateFormData.defId}
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

                {/* Type */}
                <label className="block text-sm mb-2">
                  Type
                  <select
                    value={updateFormData.type}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        type: parseInt(e.target.value),
                      })
                    }
                    className="w-full border px-2 py-1 rounded"
                  >
                    {bonusTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
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

                {/* Conditional rendering based on type */}
                {updateFormData.type === 0 ? (
                  <>
                    {/* Free Spin Bonus field - Bonus Id (update popup with searchable select) */}
                    <label className="text-sm">Bonus Game</label>
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
                                    bonusId: game.id.toString(),
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
                      Bonus Bet
                      <input
                        type="text"
                        value={updateFormData.bonusBet || ""}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, bonusBet: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                    <label className="block text-sm mb-2">
                      Bonus Rounds
                      <input
                        type="text"
                        value={updateFormData.bonusRounds || ""}
                        onChange={(e) =>
                          setUpdateFormData({
                            ...updateFormData,
                            bonusRounds: e.target.value,
                          })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    {/* Normal Bonus fields */}
                    <label className="block text-sm mb-2">
                      Is Percentage
                      <input
                        type="checkbox"
                        checked={updateFormData.isPercentage}
                        onChange={(e) =>
                          setUpdateFormData({
                            ...updateFormData,
                            isPercentage: e.target.checked,
                          })
                        }
                        className="ml-2"
                      />
                    </label>

                    {updateFormData.isPercentage && (
                      <label className="block text-sm mb-2">
                        Percentage
                        <input
                          type="text"
                          value={updateFormData.percentage}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d{0,3}(\.\d{0,2})?$/.test(val)) {
                              let num = Number(val);
                              if (num < 0) num = 0;
                              setUpdateFormData({ ...updateFormData, percentage: num });
                            }
                          }}
                          className="w-full border px-2 py-1 rounded"
                          placeholder="Enter percentage (0-100)"
                        />
                      </label>
                    )}

                    <label className="block text-sm mb-2">
                      Min
                      <input
                        type="number"
                        value={updateFormData.min}
                        onChange={(e) =>
                          setUpdateFormData({
                            ...updateFormData,
                            min: Number(e.target.value),
                          })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                    <label className="block text-sm mb-2">
                      Max
                      <input
                        type="number"
                        value={updateFormData.max}
                        onChange={(e) =>
                          setUpdateFormData({
                            ...updateFormData,
                            max: Number(e.target.value),
                          })
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </label>
                  </>
                )}

                {/* Description (common) */}
                <label className="block text-sm mb-2">
                  Description
                  <textarea
                    value={updateFormData.description}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </label>

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
                    onClick={handleUpdateBonus}
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
                  <b>{selectedBonus?.name}</b>?
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
                    onClick={handleDeleteBonus}
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

export default BasicTableBonuses;
