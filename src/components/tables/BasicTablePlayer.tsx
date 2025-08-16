import React, { startTransition, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { addPlayerToFavPlayers } from "@/server/userActions";
import { showToast } from "@/utils/toastUtil";

export interface Player {
  Id: number;
  CurrencyId: string;
  Currencies: any;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Login: string;
  RegionId: number;
  Gender: number;
  PersonalId: string;
  Address: string;
  Email: string;
  Language: string;
  Phone: string;
  MobilePhone: string;
  BirthDate: string;
  TimeZone: any;
  NickName: string | null;
  DocNumber: string;
  IBAN: string | null;
  PromoCode: string | null;
  ProfileId: number | null;
  MaximalDailyBet: number | null;
  MaximalSingleBet: number | null;
  CasinoMaximalDailyBet: number | null;
  CasinoMaximalSingleBet: number | null;
  PreMatchSelectionLimit: number | null;
  LiveSelectionLimit: number | null;
  Excluded: boolean | null;
  ExcludedLocalDate: string | null;
  IsSubscribedToNewsletter: boolean;
  IsVerified: boolean;
  PartnerName: string;
  PartnerId: number;
  LastLoginIp: string;
  RegistrationIp: string;
  YesterdayBalance: number | null;
  CreditLimit: number;
  IsUsingCredit: boolean;
  LastLoginTime: string;
  LastLoginLocalDate: string;
  Balance: number;
  IsLocked: boolean;
  IsCasinoBlocked: boolean | null;
  IsSportBlocked: boolean | null;
  IsRMTBlocked: boolean | null;
  Password: string | null;
  SportsbookProfileId: number;
  CasinoProfileId: number | null;
  GlobalLiveDelay: number | null;
  Created: string;
  CreatedLocalDate: string;
  RFId: string | null;
  ResetExpireDate: string | null;
  ResetExpireDateLocal: string | null;
  DocIssuedBy: string | null;
  LoyaltyLevelId: number | null;
  IsUsingLoyaltyProgram: boolean;
  LoyaltyPoint: number;
  AffilateId: number | null;
  BTag: string;
  TermsAndConditionsVersion: string;
  TCVersionAcceptanceDate: string;
  TCVersionAcceptanceLocalDate: string;
  ExcludedLast: string | null;
  ExcludedLastLocal: string | null;
  UnplayedBalance: number;
  IsTest: boolean;
  ExternalId: string | null;
  AuthomaticWithdrawalAmount: number | null;
  AuthomaticWithdrawalMinLeftAmount: number | null;
  IsAutomaticWithdrawalEnabled: boolean | null;
  SwiftCode: string | null;
  Title: string | null;
  BirthCity: string | null;
  BirthDepartment: string | null;
  BirthRegionId: number | null;
  ZipCode: string | null;
  BirthRegionCode2: string | null;
  ActivationCode: string | null;
  ActivationCodeExpireDate: string | null;
  ActivationCodeExpireDateLocal: string | null;
  LastSportBetTime: string | null;
  LastSportBetTimeLocal: string | null;
  LastCasinoBetTime: string;
  LastCasinoBetTimeLocal: string;
  FirstDepositTime: string | null;
  FirstDepositDateLocal: string | null;
  LastDepositDateLocal: string | null;
  LastDepositTime: string | null;
  PasswordChangedLastLocal: string | null;
  PasswordChangedLast: string | null;
  ActivationState: number | null;
  ExcludeTypeId: number | null;
  DocIssueDate: string | null;
  DocIssueCode: string | null;
  Province: string | null;
  IsResident: boolean;
  RegistrationSource: number;
  IncomeSource: string | null;
  AccountHolder: string | null;
  CashDeskId: number | null;
  ClientCashDeskName: string | null;
  IsSubscribeToEmail: boolean;
  IsSubscribeToSMS: boolean;
  IsSubscribeToInternalMessage: boolean;
  IsSubscribeToPushNotification: boolean;
  IsSubscribeToPhoneCall: boolean;
  NotificationOptions: number;
  IsLoggedIn: boolean;
  City: string | null;
  CountryName: string;
  ClientVerificationDate: string | null;
  BankName: string | null;
  Status: number;
  IsNoBonus: boolean;
  IsTwoFactorAuthenticationEnabled: boolean | null;
  IsQRCodeUsed: boolean | null;
  PartnerClientCategoryId: number | null;
  WrongLoginBlockLocalTime: string | null;
  WrongLoginAttempts: number;
  LastWrongLoginTimeLocalDate: string | null;
  PepStatusId: number | null;
  SelectedPepStatuses: any;
  DocRegionId: number | null;
  DocRegionName: string | null;
  DocType: number | null;
  DocExpirationDate: string | null;
  AMLRisk: number | null;
  ExclusionReason: string | null;
  Citizenship: string | null;
  IsPhoneVerified: boolean;
  IsMobilePhoneVerified: boolean;
  IsEkengVerified: boolean;
  IsEmailVerified: boolean;
  OwnerId: number | null;
  ChildId: number | null;
  BirthName: string | null;
  StatusActiveDate: string | null;
  StatusActiveDateLocalTime: string | null;
  PartnerFlag: string | null;
  AdditionalAddress: string | null;
  TotalDeposit: number;
  TotalWithdrawal: number;
  DepositCount: number;
  WithdrawalCount:number;
}

type SortColumn = keyof Player | "NetProfit";

export default function BasicTablePlayer({ contentType }: { contentType: string }) {
  const { allPlayerData, allAffiliatesList, affiliatesListInSelectedTime, userInfo } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [trimmedAllPlayerData, setTrimmedAllPlayerData] = useState<Player[]>([])
  const [isAddToFavLoading, setIsAddToFavLoading] = useState(false)
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

  const paginatedAffiliates = trimmedAllPlayerData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const sortedPlayers = sortPlayers(trimmedAllPlayerData);
  const paginatedPlayers = sortedPlayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    formatListsByContentType()
  }, [allAffiliatesList, affiliatesListInSelectedTime])

  const handleAddToFav = async (playerName:string) => {
    setIsAddToFavLoading(true)
    const token = localStorage.getItem('authToken')
    if(token && userInfo){
      const res = await addPlayerToFavPlayers(token, userInfo.username, playerName)
      showToast(res.isSuccess ? 'Oyuncu başarı ile favorilere eklendi' : res.message, res.isSuccess ? 'success' : 'error');
    }
    setIsAddToFavLoading(false)
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
  
  const formatListsByContentType = () => {
    startTransition(() => {
      switch (contentType) {
          case 'Players Without Investment':
            const affiliateMap3 = new Map(
              allAffiliatesList.map(affiliate => [
                affiliate.Login,
                {
                  TotalDeposit: affiliate.TotalDeposit,
                  TotalWithdrawal: affiliate.TotalWithdrawal,
                  DepositCount: affiliate.DepositCount,
                  WithdrawalCount: affiliate.WithdrawalCount,
                },
              ])
            );
            // Filter and merge data
            const enrichedPlayers3 = allPlayerData
              .map(player => {
                const affiliateData = affiliateMap3.get(player.Login);

                return {
                  ...player,
                  TotalDeposit: affiliateData?.TotalDeposit ?? 0,
                  TotalWithdrawal: affiliateData?.TotalWithdrawal ?? 0,
                  DepositCount: affiliateData?.DepositCount ?? 0,
                  WithdrawalCount: affiliateData?.WithdrawalCount ?? 0,
                };
              });
            const zeroDeposits = enrichedPlayers3.filter(affiliate => affiliate.TotalDeposit === 0);
            setTrimmedAllPlayerData(zeroDeposits);
            
            break;
          case 'All Players':
            const affiliateMap = new Map(
              allAffiliatesList.map(affiliate => [
                affiliate.Login,
                {
                  TotalDeposit: affiliate.TotalDeposit,
                  TotalWithdrawal: affiliate.TotalWithdrawal,
                  DepositCount: affiliate.DepositCount,
                  WithdrawalCount: affiliate.WithdrawalCount,
                },
              ])
            );
            // Filter and merge data
            const enrichedPlayers = allPlayerData
              .map(player => {
                const affiliateData = affiliateMap.get(player.Login);

                return {
                  ...player,
                  TotalDeposit: affiliateData?.TotalDeposit ?? 0,
                  TotalWithdrawal: affiliateData?.TotalWithdrawal ?? 0,
                  DepositCount: affiliateData?.DepositCount ?? 0,
                  WithdrawalCount: affiliateData?.WithdrawalCount ?? 0,
                };
              });

            setTrimmedAllPlayerData(enrichedPlayers);
            break;
          case 'GGA':
            const affiliateMap1 = new Map(
              allAffiliatesList.map(affiliate => [
                affiliate.Login,
                {
                  TotalDeposit: affiliate.TotalDeposit,
                  TotalWithdrawal: affiliate.TotalWithdrawal,
                  DepositCount: affiliate.DepositCount,
                  WithdrawalCount: affiliate.WithdrawalCount,
                },
              ])
            );
            // Filter and merge data
            const enrichedPlayers1 = allPlayerData
              .map(player => {
                const affiliateData = affiliateMap1.get(player.Login);

                return {
                  ...player,
                  TotalDeposit: affiliateData?.TotalDeposit ?? 0,
                  TotalWithdrawal: affiliateData?.TotalWithdrawal ?? 0,
                  DepositCount: affiliateData?.DepositCount ?? 0,
                  WithdrawalCount: affiliateData?.WithdrawalCount ?? 0,
                };
              });
            const biggerZeroDeposits = enrichedPlayers1.filter(player => player.TotalDeposit > 0 || player.TotalWithdrawal > 0);
            setTrimmedAllPlayerData(biggerZeroDeposits);
            break;
          default:
            const affiliateMap2 = new Map(
              allAffiliatesList.map(affiliate => [
                affiliate.Login,
                {
                  TotalDeposit: affiliate.TotalDeposit,
                  TotalWithdrawal: affiliate.TotalWithdrawal,
                  DepositCount: affiliate.DepositCount,
                  WithdrawalCount: affiliate.WithdrawalCount,
                },
              ])
            );
            // Filter and merge data
            const enrichedPlayers2 = allPlayerData
              .map(player => {
                const affiliateData = affiliateMap2.get(player.Login);

                return {
                  ...player,
                  TotalDeposit: affiliateData?.TotalDeposit ?? 0,
                  TotalWithdrawal: affiliateData?.TotalWithdrawal ?? 0,
                  DepositCount: affiliateData?.DepositCount ?? 0,
                  WithdrawalCount: affiliateData?.WithdrawalCount ?? 0,
                };
              });
            const searchResults = enrichedPlayers2.filter(affiliate => affiliate.Login.includes(contentType) || affiliate.Id === Number(contentType));
            setTrimmedAllPlayerData(searchResults);
            break;
        }
        setIsLoading(false);
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginatedAffiliates.length} of {trimmedAllPlayerData.length} players
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Oyuncu</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">BTag</TableCell>
                {contentType !== 'GGA' && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("Balance")}>Bakiye{sortColumn === "Balance" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                )}
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("TotalDeposit")}>Yatırım Miktarı{sortColumn === "TotalDeposit" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("TotalWithdrawal")}>Çekim Miktarı{sortColumn === "TotalWithdrawal" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("NetProfit")}>{contentType === 'GGA' ? 'GGR' : 'Net Profit'}{sortColumn === "NetProfit" && (sortDirection === "asc" ? " 🔼" : " 🔽")}</TableCell>
                {contentType !== 'GGA' && (
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("LastDepositDateLocal")}>Son Yatırım</TableCell>
                )}
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Favori</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Risk</TableCell>

              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {isLoading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={contentType === 'GGA' ? 6 : 8} />
                  ))}
                </>
              ) : (paginatedPlayers.map((player) => {

                return (
                  <TableRow key={player.Id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                        <Link href={`/player/${player.Id}`}>
                        <span className="cursor-pointer block font-medium text-gray-800 text-theme-sm dark:text-white/90">{player.Id}</span>
                        </Link>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {player.CreatedLocalDate && formatDateToDDMMYYYY(player.CreatedLocalDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/player/${player.Id}`} className="cursor-pointer hover:text-gray-900">{player.Login}</Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{player.BTag}</TableCell>
                    {contentType !== 'GGA' && (
                      <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{player.Balance} TL</TableCell>
                    )}
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
                    {contentType !== 'GGA' && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {player.LastDepositDateLocal ? formatDateToDDMMYYYY(player.LastDepositDateLocal) : '-'}
                      </TableCell>
                    )}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button title="Add To Fav" className="inline-flex items-center justify-center text-red-600" onClick={()=>handleAddToFav(player.Login)} disabled={isAddToFavLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart w-6 h-6 hover:fill-red-600 disabled:fill-red-800"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      </button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button
  title="Add To Fav"
  className="inline-flex items-center justify-center text-purple-500"
  onClick={() => handleAddToFav(player.Login)}
  disabled={isAddToFavLoading}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-lightning w-6 h-6 hover:fill-yellow-600 disabled:fill-purple-800"
  >
    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
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
