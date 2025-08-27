import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { Player } from "../constants/types";

interface FavPlayer {
    username:string;
    playerName:string;
}

type SortColumn = keyof Player | "NetProfit";

export default function BasicTableFavPlayers() {

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [trimmedAllPlayerData, setTrimmedAllPlayerData] = useState<Player[]>([])
  const [favPlayerList, setFavPlayerList] = useState<FavPlayer[]>([])
  const [isRemoveFromFavLoading, setIsRemoveFromFavLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(trimmedAllPlayerData.length / rowsPerPage);

  const sortPlayers = (data: Player[]) => {
  if (!sortColumn) return data;

  return [...data].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    if (sortColumn === "NetProfit") {
      aValue = (a.TotalDeposit || 0) - (a.TotalWithdrawal || 0);
      bValue = (b.TotalDeposit || 0) - (b.TotalWithdrawal || 0);
    } else {
      aValue = a[sortColumn];
      bValue = b[sortColumn];
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
};

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const paginatedAffiliates = trimmedAllAffiliatesList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const sortedPlayers = sortPlayers(trimmedAllPlayerData);
  const paginatedPlayers = sortedPlayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  

  const handleRemoveFromFav = async (playerName:string) => {
    setIsRemoveFromFavLoading(true)
    // const token = localStorage.getItem('authToken')
    // if(token && userInfo){
    //   const res = await removePlayerFromFavPlayers(token, userInfo.username ,playerName)
    //   showToast(res.isSuccess ? 'Oyuncu favorilerden çıkarıldı' : res.message, res.isSuccess ? 'info' : 'error');
    //   await getFavPlayersAsync()
    // }
    setIsRemoveFromFavLoading(false)
  }

  const SkeletonRow = ({ columns }: { columns: number }) => (
  <TableRow>
    {Array.from({ length: columns }).map((_, index) => (
      <TableCell key={index} className="px-5 py-4">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </TableCell>
    ))}
  </TableRow>
);

  const handleSort = (column: keyof Player | "NetProfit") => {
  if (sortColumn === column) {
    setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortColumn(column);
    setSortDirection("asc");
  }
  };

  const getFavPlayersAsync = async () => {
    // const token = localStorage.getItem("authToken");
    // if(token){
    //     const favPlayersResponse = await getFavPlayers(token);
    //     if(favPlayersResponse.isSuccess){
    //         setFavPlayerList(favPlayersResponse.favPlayers)
    //     }
    // }
  }
  
//   const formatListsByContentType = () => {
//   startTransition(() => {
//     // Create affiliate lookup
//     const affiliateMap = new Map(
//       allAffiliatesList.map(affiliate => [
//         affiliate.Login,
//         {
//           TotalDeposit: affiliate.TotalDeposit,
//           TotalWithdrawal: affiliate.TotalWithdrawal,
//           DepositCount: affiliate.DepositCount,
//           WithdrawalCount: affiliate.WithdrawalCount,
//         },
//       ])
//     );

//     // Create favorite players lookup
//     const favPlayersMap = new Set(favPlayerList.map(fav => fav.playerName));

//     // Filter and enrich
//     const enrichedPlayers = allPlayerData
//       .filter(player => affiliateMap.has(player.Login) && favPlayersMap.has(player.Login))
//       .map(player => {
//         const affiliateData = affiliateMap.get(player.Login);

//         return {
//           ...player,
//           TotalDeposit: affiliateData?.TotalDeposit ?? 0,
//           TotalWithdrawal: affiliateData?.TotalWithdrawal ?? 0,
//           DepositCount: affiliateData?.DepositCount ?? 0,
//           WithdrawalCount: affiliateData?.WithdrawalCount ?? 0,
//           isFavorite: true, // optional: flag favorites
//         };
//       });

//     setTrimmedAllPlayerData(enrichedPlayers);
//     settrimmedAllAffiliatesList(allAffiliatesList);
//     setIsLoading(false);
//   });

// };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginatedAffiliates.length} of {trimmedAllAffiliatesList.length} players
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="text-sm rounded-md border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            {[25, 50, 75, 100].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px] min-h-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("CreatedLocalDate")}>ID{sortColumn === "CreatedLocalDate" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Oyuncu Adı</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">BTag</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("Balance")}>Bakiye{sortColumn === "Balance" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("TotalDeposit")}>Yatırım Miktarı{sortColumn === "TotalDeposit" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("TotalWithdrawal")}>Çekim Miktarı{sortColumn === "TotalWithdrawal" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("NetProfit")}>Net Kazanç{sortColumn === "NetProfit" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("LastDepositDateLocal")}>Son Yatırım</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">İşlemler</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {isLoading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={8} />
                  ))}
                </>
              ) : (paginatedPlayers.map((player) => {

                return (
                  <TableRow key={player.Id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{player.Id}</span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {player.CreatedLocalDate && formatDateToDDMMYYYY(player.CreatedLocalDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/player/${player.Id}`} className="cursor-pointer hover:text-gray-900">{player.Login}</Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{player.BTag}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{player.Balance} TL</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <div className="flex flex-row items-center justify-between">
                        <span className="text-green-600">
                          {player.TotalDeposit} TL
                        </span>
                        <div className="flex w-[20px] items-center justify-center text-white dark:text-gray-900 bg-green-600 rounded-md py-[2px] px-[8px] mr-8">
                          {player.DepositCount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                      <div className="flex flex-row items-center justify-between">
                        <span className="text-error-600">
                          {player.TotalWithdrawal} TL
                        </span>
                        <div className="flex w-[20px] items-center justify-center text-white dark:text-gray-900 bg-error-600 rounded-md py-[2px] px-[8px] mr-8">
                          {player.WithdrawalCount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {(player.TotalDeposit || 0) - (player.TotalWithdrawal || 0)} TL
                    </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {player.LastDepositDateLocal ? formatDateToDDMMYYYY(player.LastDepositDateLocal) : '-'}
                      </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button title="Add To Fav" className="inline-flex items-center justify-center text-red-600" onClick={()=>handleRemoveFromFav(player.Login)} disabled={isRemoveFromFavLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart w-6 h-6 hover:fill-red-600 disabled:fill-red-800"><line x1="2" y1="2" x2="22" y2="22"/><path d="M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35"/><path d="M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17"/></svg>
                      </button>
                    </TableCell>
                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
}
