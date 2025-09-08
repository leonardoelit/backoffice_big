"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
} from "../ui/table";
import { Bonus, UpdateBonusRequest } from "../constants/types";
import { getBonuses, createBonus, deleteBonus, updateBonus } from "../lib/api";
import { showToast } from "@/utils/toastUtil";
import { formatDateToDDMMYYYYHHMMSS } from "@/utils/utils";

type PopupMode = "create" | "update" | "delete";

export const bonusTypes = [
  { id: 1, name: "Freespin" },
  { id: 2, name: "Casino" },
  { id: 3, name: "Sport" },
];

const BasicTableBonuses = () => {
  const [bonusList, setBonusList] = useState<Bonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false)

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
    type: bonusTypes[0].id,
    name: "",
    min: 0,
    max: 0,
    isPercentage: false,
    percentage: 0,
    description: "",
  });

  const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null);
  const [updateFormData, setUpdateFormData] = useState<UpdateBonusRequest>({
    active: true,
    defId: "",
    type: bonusTypes[0].id,
    name: "",
    isPercentage: false,
    min: 0,
    max: 0,
    description: "",
  });

  const openCreatePopup = () => {
    setPopupMode("create");
    setFormData({
      type: bonusTypes[0].id,
      name: "",
      isPercentage: false,
      percentage: 0,
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

  useEffect(() => {
    getBonusesList();
  }, []);

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

  // close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPopup &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleCreateBonus = async () => {
    setIsCreating(true)
    try {
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
                  Percentage
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
                    <TableCell className="px-5 py-4">{bonus.isPercentage ? bonus.percentage : "-"}</TableCell>
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
                <label className="block text-sm mb-2">
                  Is Percentage
                  <input
                    type="checkbox"
                    checked={formData.isPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, isPercentage: e.target.checked })
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

                        // Allow only digits (and optional single decimal)
                        if (/^\d{0,3}(\.\d{0,2})?$/.test(val)) {
                          let num = Number(val);

                          // Clamp value between 0 and 100
                          //if (num > 100) num = 100;
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
                <label className="block text-sm mb-2">
                  DefId
                  <input
                    type="text"
                    value={updateFormData.defId}
                    disabled
                    className="w-full border px-2 py-1 rounded bg-gray-100"
                  />
                </label>
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
                {/* reuse create form fields */}
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
                      setUpdateFormData({ ...updateFormData, min: Number(e.target.value) })
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
                      setUpdateFormData({ ...updateFormData, max: Number(e.target.value) })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </label>
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
