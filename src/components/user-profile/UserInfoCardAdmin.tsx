"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { getUserInfoAdmin } from "@/server/userActions";
import { showToast } from "@/utils/toastUtil";

interface UserInfo {
    username: string;
    fullname: string;
    lastname: string;
    role: string;
    email: string;
    btag: string;
    telegramLink: string;
    balance: number;
    totalDeposit: number,
    totalWithdrawal: number,
    TMTDeposit: number,
    TMTWithdrawal: number,
    userCount: number,
    pct: number;
    approved: boolean;
}

export default function UserInfoCardAdmin() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserInfo>({
    username: '',
    fullname: '',
    lastname: '',
    role: '',
    email: '',
    btag: '',
    telegramLink: '',
    balance: 0.0,
    totalDeposit: 0.00,
    totalWithdrawal: 0.00,
    TMTDeposit: 0.00,
    TMTWithdrawal: 0.00,
    userCount: 0,
    pct: 0,
    approved: false,
  });
  const params = useParams();
  const username = params.id as string;

  useEffect(() => {
        getSelectedUsersInfo()
  }, [])

  const getSelectedUsersInfo = async () => {
    const token = localStorage.getItem('authToken')
    if(token){
        const data: { isSuccess: boolean; userInfo: UserInfo } = await getUserInfoAdmin(token, username);
        if(data.isSuccess){
            setCurrentUser(data.userInfo)
            setIsLoading(false)
        }else{
            showToast('Kullanıcı bulunamadı 😔', 'error')
            setIsLoading(false)
        }
    }else{
        setIsLoading(false)
        logout();
    }
  }

  const formatCurrency = (value: number) => {
    const num = parseFloat(String(value));
    return isNaN(num)
        ? '-'
        : `${num.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ₺`
    };
  

  return (
    <div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
              Profil
            </h3>
            <div className="space-y-6">
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
                            {isLoading ? 'Yükleniyor...' : currentUser.fullname}
                        </p>
                        </div>

                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Soyisim
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : currentUser.lastname}
                        </p>
                        </div>

                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Rol
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : currentUser.role}
                        </p>
                        </div>

                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            BTag
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : currentUser.btag}
                        </p>
                        </div>
                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Email
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : currentUser.email}
                        </p>
                        </div>
                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Telegram Linki
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : !isLoading && currentUser.telegramLink === '' ? '-' : currentUser.telegramLink}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
              <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Finans Bilgileri
                    </h4>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Ortaklık Yüzdesi
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : currentUser.pct}%
                        </p>
                        </div>
                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Karlılık Oranı
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : Number((Number(currentUser.TMTDeposit) - Number(currentUser.TMTWithdrawal)) / currentUser.TMTDeposit * 100).toFixed(2) }%
                        </p>
                        </div>
                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Bu Ay Toplam Yatırım Miktarı
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : formatCurrency(currentUser.TMTDeposit)}
                        </p>
                        </div>

                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Bu Ay Toplam Çekim Miktarı
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : formatCurrency(currentUser.TMTWithdrawal)}
                        </p>
                        </div>

                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Toplam Yatırım Miktarı
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : formatCurrency(currentUser.totalDeposit)}
                        </p>
                        </div>

                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Toplam Çekim Miktarı
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : formatCurrency(currentUser.totalWithdrawal)}
                        </p>
                        </div>
                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Çekilebilir Bakiye
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : formatCurrency(currentUser.balance)}
                        </p>
                        </div>

                        <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Bu Ay Bekleyen Bakiye
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {isLoading ? 'Yükleniyor...' : formatCurrency((Number(currentUser.TMTDeposit) - Number(currentUser.TMTWithdrawal)) * currentUser.pct / 100)}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
          </div>
    </div>
  );
}
