// hooks/usePlayers.ts
"use client"

import { useEffect, useState } from "react";
import { GetBonusRequestsResponse, PlayerBonusRequestFilter } from "../constants/types";
import { showToast } from "@/utils/toastUtil";
import { getBonusRequests } from "../lib/api";

export function useBonusRequests(initialFilter: PlayerBonusRequestFilter) {
  const [data, setData] = useState<GetBonusRequestsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Merge initialFilter with defaults for pagination
  const [filter, setFilter] = useState<PlayerBonusRequestFilter>({
    pageNumber: 1,
    pageSize: 25,
    bonusName: undefined,
    defId: undefined,
    playerId: undefined,
    status: undefined,
    type: undefined,
    updatedAtFrom: undefined,
    updatedAtTo: undefined,
    username: undefined,
    ...initialFilter,
  });

  const fetchBonusRequests = async (customFilter?: Partial<PlayerBonusRequestFilter>) => {
    const effectiveFilter = { ...filter, ...customFilter };
    setLoading(true);
    setError(null);

    try {
      const result = await getBonusRequests(effectiveFilter);
      
      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to fetch players');
      }
      console.log(result)
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
    fetchBonusRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return {
    bonusRequests: data?.bonusRequestList || [],
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
    refetch: fetchBonusRequests,
  };
}
