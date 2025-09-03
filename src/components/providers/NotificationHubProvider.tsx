"use client";

import * as signalR from "@microsoft/signalr";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { showToast } from "@/utils/toastUtil";
import { useNotifications } from "@/context/NotificationContext";

interface HubContextType {
  connection: signalR.HubConnection | null;
}

const HubContext = createContext<HubContextType | undefined>(undefined);

export const NotificationHubProvider = ({ children }: { children: React.ReactNode }) => {
  const { increment } = useNotifications();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (connectionRef.current) return; // Already connected

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notificationHub`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection.on("WithdrawRequest", (msg: string) => {
      increment("withdrawRequest");
      showToast(msg, "info");
    });

    connection.on("DepositRequest", (msg: string) => {
      increment("depositRequest");
      showToast(msg, "info");
    });

    connection.on("BonusRequest", (msg: string) => {
      increment("bonusRequest");
      showToast(msg, "info");
    });

    connection
      .start()
      .then(() => console.log("✅ SignalR connected"))
      .catch((err) => console.error("❌ SignalR connection error:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [increment]);

  return <HubContext.Provider value={{ connection: connectionRef.current }}>{children}</HubContext.Provider>;
};

export const useNotificationHub = () => {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error("useNotificationHub must be used within NotificationHubProvider");
  return ctx;
};