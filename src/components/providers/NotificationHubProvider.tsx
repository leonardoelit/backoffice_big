"use client";

import * as signalR from "@microsoft/signalr";
import React, { createContext, useCallback, useEffect, useRef } from "react";
import { showToast } from "@/utils/toastUtil";
import { useNotifications } from "@/context/NotificationContext";

interface HubContextType {
  connection: signalR.HubConnection | null;
}

const HubContext = createContext<HubContextType | undefined>(undefined);

export const NotificationHubProvider = ({ children }: { children: React.ReactNode }) => {
  const { increment } = useNotifications();
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
    // Only create connection if it doesn't exist
    if (!connectionRef.current) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notificationHub`, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

      connectionRef.current = connection;
    }

    const connection = connectionRef.current;

    // Only register listeners once
    if (!listenersRegisteredRef.current) {
      const playSound = () => {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => console.warn("Unable to play sound:", err));
        }
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

      listenersRegisteredRef.current = true;
    }

    // Only attempt to start if disconnected
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      startConnectionWithRetry(connection);
    }

    // Cleanup function
    return () => {
      // Don't disconnect as we want to maintain the connection
      // This cleanup only runs if the provider unmounts completely
    };
  }, [increment, startConnectionWithRetry]); // Add dependencies

  return <HubContext.Provider value={{ connection: connectionRef.current }}>{children}</HubContext.Provider>;
};