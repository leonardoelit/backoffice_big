"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function UserInfoCard() {
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(userInfo){
      setIsLoading(false)
    }
  }, [userInfo])
  

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Kişisel Bilgiler
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tam İsim
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {isLoading ? 'Yükleniyor...' : userInfo.fullName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Soyisim
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {isLoading ? 'Yükleniyor...' : userInfo.lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Rol
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {isLoading ? 'Yükleniyor...' : userInfo.role}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                BTag
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {isLoading ? 'Yükleniyor...' : userInfo.btag}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ortaklık Yüzdesi
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {isLoading ? 'Yükleniyor...' : userInfo.pct}%
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Telegram Linki
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {isLoading ? 'Yükleniyor...' : !isLoading && userInfo.telegramLink === '' ? '-' : userInfo.telegramLink}
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
