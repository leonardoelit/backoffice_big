"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { createNewUser } from "@/server/userActions";
import React, { startTransition, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Select from "../form/Select";
import { showToast } from "@/utils/toastUtil";
import { EyeCloseIcon, EyeIcon } from "@/icons";

interface ExistError {
  usernameMatch: boolean;
  emailMatch: boolean;
  btagMatch: boolean;
}

export default function AddUserForm() {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string>('user');
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("")
  const [btag, setBtag] = useState<string>('');
  const [telegramLink, setTelegramLink] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
      fullname: false,
      lastname: false,
      username: false,
      email: false,
      btag: false,
      password: false,
    });
  const [existError, setExistError] = useState<ExistError>({
      usernameMatch: false,
      btagMatch: false,
      emailMatch: false,
    })
  const { userInfo } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    const errors = {
      fullname: fullname.trim() === '',
      lastname: lastname.trim() === '',
      username: username.trim() === '',
      email: email.trim() === '',
      btag: btag.trim() === '',
      password: password.trim() === '',
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) return;

    setLoading(true);
    setExistError({
      usernameMatch: false,
      btagMatch: false,
      emailMatch: false,
    });

    startTransition(async () => {
        const token = localStorage.getItem("authToken");
        if (!token || !userInfo) {
        return;
        }

        const response = await createNewUser(token, username, fullname, lastname, email, btag, telegramLink , password, role);

        if (response.isSuccess) {
        showToast('Kullanıcı başarı ile oluşturuldu!', 'success')
        router.push('/admin/users')
        } else {
        showToast('Bazı kullanıcı bilgileri sistemde mevcut!', 'error')
        if (!response.isSuccess) {
          setExistError({
            usernameMatch: response.existingCredentials.usernameMatch,
            btagMatch: response.existingCredentials.btagMatch,
            emailMatch: response.existingCredentials.emailMatch
          });
        }
        console.log(response.message);
        }

        setLoading(false);
    });
    };


  return (
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-10 rounded-md">
          <div className="mb-5 sm:mb-8">
            <h4 className="mb-2 font-semibold text-gray-800 dark:text-white/90 sm:text-title-md">
              Kullanıcı / Admin Ekle
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
                    Kullanıcı Adı <span className="text-error-500 text-xs">* {existError.usernameMatch && ' Kullanıcı adı sistemde mevcut.'} {formErrors.username && !existError.usernameMatch && ' Bu alan gereklidir.'}</span>{" "}
                  </Label>
                  <Input placeholder="" type="text" onChange={(e) => {
                        setUsername(e.target.value)
                        if (formErrors.username && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, username: false }));
                        }
                      }} />
                </div>
                <div>
                  <Label>
                    Rol <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Select options={[{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'Affiliate' }]} defaultValue="user" onChange={(e) => setRole(e)} />
                </div>
                <div>
                  <Label>
                    İsim <span className="text-error-500 text-xs">* {formErrors.fullname && ' Bu alan gereklidir.'}</span>{" "}
                  </Label>
                  <Input placeholder="" type="text" onChange={(e) => {
                        setFullname(e.target.value)
                        if (formErrors.fullname && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, fullname: false }));
                        }
                      }} />
                </div>
                <div>
                  <Label>
                    Soyisim <span className="text-error-500 text-xs">* {formErrors.lastname && ' Bu alan gereklidir.'}</span>{" "}
                  </Label>
                  <Input placeholder="" type="text" onChange={(e) => {
                        setLastname(e.target.value)
                        if (formErrors.lastname && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, lastname: false }));
                        }
                      }} />
                </div>
                <div>
                  <Label>
                    Email <span className="text-error-500 text-xs">* {existError.emailMatch && ' Email sistemde mevcut.'}{formErrors.email && !existError.emailMatch && ' Bu alan gereklidir.'}</span>{" "}
                  </Label>
                  <Input placeholder="" type="text" onChange={(e) => {
                        setEmail(e.target.value)
                        if (formErrors.email && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, email: false }));
                        }
                      }} />
                </div>
                <div>
                  <Label>
                    BTag <span className="text-error-500 text-xs">* {existError.btagMatch && ' Btag sistemde mevcut.'} {formErrors.btag && !existError.btagMatch && ' Bu alan gereklidir.'}</span>{" "}
                  </Label>
                  <Input placeholder="" type="text" onChange={(e) => {
                        setBtag(e.target.value)
                        if (formErrors.btag && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, btag: false }));
                        }
                      }} />
                </div>
                {/* Telegram Link */}
                <div>
                  <Label>
                    Telegram Link <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    onChange={(e) => setTelegramLink(e.target.value)}
                    placeholder="t.me/example"
                  />
                </div>
                <div>
                  <Label>
                    Şifre <span className="text-error-500 text-xs">* {formErrors.password && ' Bu alan gereklidir.'}</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Şifre"
                      error={formErrors.password}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (formErrors.password && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, password: false }));
                        }
                      }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
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
                      'Kullanıcı/Admin Oluştur'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
  );
}
