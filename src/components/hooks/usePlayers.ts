// hooks/usePlayers.ts
"use client"

import { useEffect, useState } from "react";
import { GetAllPlayersResponse, PlayerFilter } from "../constants/types";
import { showToast } from "@/utils/toastUtil";
import { getPlayers } from "../lib/api";

export function usePlayers(token: string, initialFilter: PlayerFilter = {}) {
  const [data, setData] = useState<GetAllPlayersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Merge initialFilter with defaults for pagination
  const [filter, setFilter] = useState<PlayerFilter>({
    pageNumber: 1,
    pageSize: 25,
    playerId: undefined,
    username: undefined,
    promoCode: undefined,
    firstDepositDateFrom: undefined,
    firstDepositDateTo: undefined,
    lastDepositDateFrom: undefined,
    lastDepositDateTo: undefined,
    firstWithdrawalDateFrom: undefined,
    firstWithdrawalDateTo: undefined,
    lastWithdrawalDateFrom: undefined,
    lastWithdrawalDateTo: undefined,
    hasWithdrawal: undefined,
    hasDeposit: undefined,
    registrationDateFrom: undefined,
    registrationDateTo: undefined,
    documentNumber: undefined,
    mobileNumber: undefined,
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    ...initialFilter,
  });

  const fetchPlayers = async (customFilter?: Partial<PlayerFilter>) => {
    const effectiveFilter = { ...filter, ...customFilter };
    setLoading(true);
    setError(null);

    try {
      const result = await getPlayers(effectiveFilter);
      
      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to fetch players');
      }

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch players';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return {
    players: data?.players || [],
    pagination: {
      currentPage: data?.currentPage || 1,
      totalPages: data?.totalPages || 1,
      totalCount: data?.totalCount || 0,
      pageSize: filter.pageSize || 25,
    },
    loading,
    error,
    filter,
    setFilter,
    refetch: fetchPlayers,
  };
}
