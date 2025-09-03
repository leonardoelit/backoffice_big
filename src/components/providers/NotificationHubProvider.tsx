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
  const listenersRegisteredRef = useRef(false); // only register once

  // Create audio element once
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (!audioRef.current) {
    audioRef.current = new Audio("/sounds/notification.mp3"); // <-- put your sound file in public/sounds/
  }

  useEffect(() => {
    if (!connectionRef.current) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notificationHub`, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

      connectionRef.current = connection;
    }

    const connection = connectionRef.current;

    if (!listenersRegisteredRef.current) {
      const playSound = () => {
        audioRef.current?.play().catch((err) => console.warn("Unable to play sound:", err));
      };

      connection.on("WithdrawRequest", (msg: string) => {
        increment("withdrawRequest");
        showToast(msg, "info");
        playSound();
      });

      connection.on("DepositRequest", (msg: string) => {
        increment("depositRequest");
        showToast(msg, "info");
        playSound();
      });

      connection.on("BonusRequest", (msg: string) => {
        increment("bonusRequest");
        showToast(msg, "info");
        playSound();
      });

      listenersRegisteredRef.current = true;
    }

    if (connection.state !== signalR.HubConnectionState.Connected) {
      connection
        .start()
        .then(() => console.log("✅ SignalR connected"))
        .catch((err) => console.error("❌ SignalR connection error:", err));
    }

    return () => {
      // don't stop connection here
    };
  }, [increment]);

  return <HubContext.Provider value={{ connection: connectionRef.current }}>{children}</HubContext.Provider>;
};

export const useNotificationHub = () => {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error("useNotificationHub must be used within NotificationHubProvider");
  return ctx;
};
