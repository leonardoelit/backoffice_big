// hooks/useNotificationHub.ts
"use client";

import * as signalR from "@microsoft/signalr";
import { useEffect } from "react";
import { showToast } from "@/utils/toastUtil";
import { useNotifications } from "@/context/NotificationContext";

export const useNotificationHub = () => {
  const { increment } = useNotifications();

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notificationHub`, {
        withCredentials:true
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("SignalR connected"))
      .catch((err) => console.error("SignalR connection error:", err));

    connection.on("WithdrawRequest", (message: string) => {
      increment("withdrawRequest");
      showToast(message, "info");
    });

    connection.on("DepositRequest", (message: string) => {
      increment("depositRequest");
      showToast(message, "info");
    });

    connection.on("BonusRequest", (message: string) => {
      increment("bonusRequest");
      showToast(message, "info");
    });

    return () => {
      connection.stop();
    };
  }, [increment]);
};
