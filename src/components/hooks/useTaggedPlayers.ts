"use client";

import { useEffect, useState } from "react";
import { GetTaggedPlayersRequest, GetTaggedPlayersResponse } from "../constants/types";
import { showToast } from "@/utils/toastUtil";
import { getTaggedPlayers } from "../lib/api";

export function useTaggedPlayers(initialFilter: GetTaggedPlayersRequest) {
  const [data, setData] = useState<GetTaggedPlayersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<GetTaggedPlayersRequest>({
    pageNumber: 1,
    pageSize: 25,
    ...initialFilter,
  });

  const fetchTaggedPlayers = async (customFilter?: Partial<GetTaggedPlayersRequest>) => {
    const effectiveFilter = { ...filter, ...customFilter };
    setLoading(true);
    setError(null);

    try {
      const result = await getTaggedPlayers(effectiveFilter);

      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to fetch tagged players');
      }

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tagged players';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaggedPlayers();
  }, [filter]);

  return {
    data: data?.data || [],
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
    refetch: fetchTaggedPlayers,
  };
}
