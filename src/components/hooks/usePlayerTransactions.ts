"use client";

import { useEffect, useState } from "react";
import { GetPlayersTransactionHistoryResponse, PlayerTransactionFilter } from "../constants/types";
import { showToast } from "@/utils/toastUtil";
import { getPlayerTransactions } from "../lib/api";

export function usePlayerTransactions(initialFilter: PlayerTransactionFilter) {
  const [data, setData] = useState<GetPlayersTransactionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<PlayerTransactionFilter>({
    pageNumber: 1,
    pageSize: 25,
    eventTypes: [],
    timeStampFrom: undefined,
    timeStampTo: undefined,
    type: undefined,
    orderBy: undefined,
    orderDirection: undefined,
    ...initialFilter,
  });

  const fetchPlayerTransactions = async (customFilter?: Partial<PlayerTransactionFilter>) => {
    const effectiveFilter = { ...filter, ...customFilter };
    setLoading(true);
    setError(null);

    try {
      const result = await getPlayerTransactions(effectiveFilter);

      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to fetch player transactions');
      }

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch player transactions';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerTransactions();
  }, [filter]);

  return {
    transactions: data?.transactions || [],
    pagination: {
      currentPage: data?.currentPage || 1,
      totalPages: data?.totalPages || 1,
      totalCount: data?.totalCount || 0,
      pageSize: filter.pageSize || 25,
    },
    totalAmount: data?.totalAmount || 0,
    loading,
    error,
    filter,
    setFilter,
    refetch: fetchPlayerTransactions,
  };
}
