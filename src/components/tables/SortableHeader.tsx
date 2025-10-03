"use client";
import React from "react";

interface SortableHeaderProps {
  children: React.ReactNode;
  column: string; // column name
  orderBy?: string; // currently sorted column
  orderDirection?: "asc" | "desc" | undefined; // current direction
  onSortChange: (column: string, direction?: "asc" | "desc") => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  children,
  column,
  orderBy,
  orderDirection,
  onSortChange,
  className,
}) => {
const handleClick = () => {
  let newDirection: "asc" | "desc" | undefined;
  let newOrderBy: string | undefined;

  if (orderBy !== column) {
    // New column clicked → start with desc
    newOrderBy = column;
    newDirection = "desc";
  } else {
    // Same column clicked → cycle
    if (orderDirection === "desc") {
      newOrderBy = column;
      newDirection = "asc";
    } else if (orderDirection === "asc") {
      // Third click → reset both
      newOrderBy = undefined;
      newDirection = undefined;
    } else {
      // first click on same column (should not happen, fallback)
      newOrderBy = column;
      newDirection = "desc";
    }
  }

  onSortChange(newOrderBy, newDirection);
};



  const arrow =
    orderBy === column
      ? orderDirection === "asc"
        ? "▲"
        : orderDirection === "desc"
        ? "▼"
        : null
      : null;

  return (
    <th
      className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer select-none ${className}`}
      onClick={handleClick}
    >
      {children} {arrow && <span className="ml-1">{arrow}</span>}
    </th>
  );
};

export default SortableHeader;
