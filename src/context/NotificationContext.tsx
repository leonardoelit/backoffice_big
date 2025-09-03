// contexts/NotificationContext.tsx
"use client";

import React, { createContext, useState, useContext } from "react";

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

  const increment = (type: keyof NotificationCounts) => {
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const reset = (type: keyof NotificationCounts) => {
    setCounts((prev) => ({ ...prev, [type]: 0 }));
  };

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
