"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { createWithdrawalRequest } from "@/server/userActions";
import React, { startTransition, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Select from "./form/Select";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toastUtil";

export default function WithdrawalForm() {
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<string>('IBAN');
  const [amount, setAmount] = useState(0);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const { userInfo } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);

    startTransition(async () => {
        const token = localStorage.getItem("authToken");
        if (!token || !userInfo) {
        return;
        }

        const response = await createWithdrawalRequest(
        token,
        userInfo.username,
        method,
        amount,
        accountNumber
        );

        if (response.isSuccess) {
        showToast('Çekim talebi iletildi', 'success')
        router.push('/user-withdrawal-requests')
        } else {
        showToast(response.message, 'error')
        }

        setLoading(false);
    });
    };


  return (
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-10 rounded-md">
          <div className="mb-5 sm:mb-8">
            <h4 className="mb-2 font-semibold text-gray-800 dark:text-white/90 sm:text-title-md">
              Yeni Çekim Talebi
            </h4>
          </div>
          <div>
            <form onSubmit={(e) => {
              e.preventDefault(); 
              handleSubmit();      
            }}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Çekim Yöntemi <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Select placeholder="Bir yöntem seçin" options={[{ value: 'IBAN', label: 'IBAN' }, { value: 'PAPARA', label: 'PAPARA' }, { value: 'TRC20 USDT', label: 'TRC20 USDT' }]} defaultValue="IBAN" onChange={(e) => setMethod(e)} />
                </div>
                <div>
                  <Label>
                    Hesap Numarası<span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="" type="text" onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
                <div>
                  <Label>
                    Çekim Miktarı <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="" type="number" onChange={(e) => setAmount(Number(e.target.value))} />
                </div>
                <div>
                  <Button className="w-full flex items-center justify-center gap-2" size="sm" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Oluşturuluyor...
                      </>
                    ) : (
                      'Oluştur'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
  );
}
