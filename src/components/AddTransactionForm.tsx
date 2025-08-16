"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { createTransaction } from "@/server/userActions";
import React, { startTransition, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Select from "./form/Select";
import Alert from "./ui/alert/Alert";
import { showToast } from "@/utils/toastUtil";

export default function AddTransactionForm() {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<string>('Balance Addition');
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState<number>(Number);
  const [category, setCategory] = useState<string>("Accounting")
  const [alert, setAlert] = useState<{
  variant: "success" | "error";
  title: string;
  message: string;
} | null>(null);
  const { userInfo, allUsersList, getAllUsersAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getAllUsersAdmin()
  }, [])
  

  const handleSubmit = () => {
    setLoading(true);

    startTransition(async () => {
        const token = localStorage.getItem("authToken");
        if (!token || !userInfo) {
        return;
        }

        const response = await createTransaction(token, type, username, amount, category, userInfo.username);

        if (response.isSuccess) {
        showToast('İşlem başarı ile oluşturuldu!', 'success')
        router.push('/admin/all-transactions')
        } else {
        setAlert({
            variant: "error",
            title: "İşlem Oluşturma",
            message: response.message,
        });
        console.log(response.message);
        }

        setLoading(false);
    });
    };


  return (
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-10 rounded-md">
          <div className="mb-5 sm:mb-8">
            <h4 className="mb-2 font-semibold text-gray-800 dark:text-white/90 sm:text-title-md">
              İşlem Oluştur
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
                    İşlem Tipi <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Select options={[{ value: 'Balance Addition', label: 'Bakiye Ekleme' }, { value: 'Balance Reduction', label: 'Bakiye Azaltma' }]} defaultValue="Balance Addition" onChange={(e) => setType(e)} />
                </div>
                {allUsersList.length > 0 ? (
                    <div>
                        <Label>
                            Kullanıcı adı  <span className="text-error-500">*</span>{" "}
                        </Label>
                        <Select options={allUsersList.map((user) => ({ value: user.username, label: user.username }))} defaultValue="" onChange={(e) => setUsername(e)} />
                    </div>
                ) : (
                    <div>
                        <Label>
                            Kullanıcı adı <span className="text-error-500">*</span>{" "}
                        </Label>
                        <Input placeholder="" type="" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                )}
                <div>
                    <Label>
                        Kategori<span className="text-error-500">*</span>{" "}
                    </Label>
                    <Select options={[{ value: 'Advance Payment', label: 'Avans' },{ value: 'Accounting', label: 'Muhasebe' },]} defaultValue="Accounting" onChange={(e) => setCategory(e)} />
                </div>
                <div>
                  <Label>
                    Miktar <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="" type="number" onChange={(e) => setAmount(Number(e.target.value))} />
                </div>
                {alert && (
                    <Alert
                        variant={alert.variant}
                        title={alert.title}
                        message={alert.message}
                    />
                )}
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
                      'İşlem Oluştur'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
  );
}
