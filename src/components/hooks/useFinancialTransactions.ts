// hooks/usePlayers.ts
"use client"

import { useEffect, useState } from "react";
import { GetAllFinancialTransactionsResponse, PlayerFinancialFilter } from "../constants/types";
import { showToast } from "@/utils/toastUtil";
import { getFinancialTransactions } from "../lib/api";

export function useFinancialTransactions(initialFilter: PlayerFinancialFilter) {
  const [data, setData] = useState<GetAllFinancialTransactionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Merge initialFilter with defaults for pagination
  const [filter, setFilter] = useState<PlayerFinancialFilter>({
    pageNumber: 1,
    pageSize: 25,
    accountNumber: undefined,
    amountFrom: undefined,
    amountTo: undefined,
    cryptoType: undefined,
    paymentName: undefined,
    playerFullName: undefined,
    playerUsername: undefined,
    playerId: undefined,
    status: undefined,
    timeStampFrom: undefined,
    timeStampTo: undefined,
    ...initialFilter,
  });

  const fetchFinancialTransactions = async (customFilter?: Partial<PlayerFinancialFilter>) => {
    const effectiveFilter = { ...filter, ...customFilter };
    setLoading(true);
    setError(null);

    try {
      const result = await getFinancialTransactions(effectiveFilter);
      
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
    fetchFinancialTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return {
    financialTransactions: data?.financialTransactions || [],
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
    refetch: fetchFinancialTransactions,
  };
}
