// contexts/NotificationContext.tsx
"use client";

import React, { createContext, useState, useContext, useCallback } from "react";

export interface NotificationCounts {
  withdrawRequest: number;
  depositRequest: number;
  bonusRequest: number;
}

interface NotificationContextType {
  counts: NotificationCounts;
  increment: (type: keyof NotificationCounts) => void;
  reset: (type: keyof NotificationCounts) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [counts, setCounts] = useState<NotificationCounts>({
    withdrawRequest: 0,
    depositRequest: 0,
    bonusRequest: 0,
  });

  // Use useCallback to memoize the increment function
  const increment = useCallback((type: keyof NotificationCounts) => {
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  }, []);

  // Use useCallback to memoize the reset function
  const reset = useCallback((type: keyof NotificationCounts) => {
    setCounts((prev) => ({ ...prev, [type]: 0 }));
  }, []);

  return (
    <NotificationContext.Provider value={{ counts, increment, reset }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
