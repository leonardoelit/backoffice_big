"use client";

import * as signalR from "@microsoft/signalr";
import React, { createContext, useCallback, useEffect, useRef } from "react";
import { showToast } from "@/utils/toastUtil";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

interface HubContextType {
  connection: signalR.HubConnection | null;
}

const HubContext = createContext<HubContextType | undefined>(undefined);

export const NotificationHubProvider = ({ children }: { children: React.ReactNode }) => {
  const { increment } = useNotifications();
  const { clientId } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const listenersRegisteredRef = useRef(false);
  const isConnectingRef = useRef(false); // Track connection status

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.mp3");
    }
  }, []);

  // Memoize the connection start function
  const startConnectionWithRetry = useCallback(async (connection: signalR.HubConnection) => {
    if (isConnectingRef.current) return; // Prevent multiple connection attempts
    
    isConnectingRef.current = true;
    const maxRetries = 5;
    const delayMs = 5000;
    let attempt = 0;

    while (attempt < maxRetries) {
      if (document.visibilityState === "hidden") {
        await new Promise((resolve) => {
          const handleVisibility = () => {
            if (document.visibilityState === "visible") {
              document.removeEventListener("visibilitychange", handleVisibility);
              resolve(null);
            }
          };
          document.addEventListener("visibilitychange", handleVisibility);
        });
      }

      try {
        await connection.start();
        console.log("✅ SignalR connected");
        isConnectingRef.current = false;
        return;
      } catch (err) {
        attempt++;
        console.warn(`SignalR connection attempt ${attempt} failed`, err);
        if (attempt >= maxRetries) {
          showToast("Cannot connect to server for notifications", "info");
          isConnectingRef.current = false;
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }, []);

  useEffect(() => {
  if (!clientId) return; // Wait until clientId exists

  // Always create a new connection when clientId changes
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(
      `${process.env.NEXT_PUBLIC_API_URL}/notificationHub?clientId=${encodeURIComponent(clientId)}`,
      { withCredentials: true }
    )
    .withAutomaticReconnect()
    .build();

  connectionRef.current = connection;

  // Register listeners
  const playSound = () => {
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };

  connection.on("WithdrawalRequest", (msg: string) => {
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

  // Start connection with retry
  startConnectionWithRetry(connection);

  // Cleanup on unmount or clientId change
  return () => {
    connection.stop().catch(() => {});
    listenersRegisteredRef.current = false;
  };
}, [clientId, increment, startConnectionWithRetry]);



  return <HubContext.Provider value={{ connection: connectionRef.current }}>{children}</HubContext.Provider>;
};