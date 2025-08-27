"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Button from "../ui/button/Button";

interface ExistError {
  usernameMatch: boolean;
  emailMatch: boolean;
  btagMatch: boolean;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [btag, setBtag] = useState('');
  const [existError, setExistError] = useState<ExistError>({
    usernameMatch: false,
    btagMatch: false,
    emailMatch: false,
  })
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    lastname: false,
    username: false,
    email: false,
    btag: false,
    password: false,
  });

  const handleRegister = () => {
    const errors = {
      fullName: fullName.trim() === '',
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

    // startTransition(async () => {
    //   const response = await registerAction(username, fullName, lastname, email, btag, telegramLink, password);
    //   if (!response.isSuccess) {
    //     setExistError({
    //       usernameMatch: response.existingCredentials.usernameMatch,
    //       btagMatch: response.existingCredentials.btagMatch,
    //       emailMatch: response.existingCredentials.emailMatch
    //     });
    //     setError(response.message);
    //   }
    //   showToast(
    //     response.isSuccess
    //       ? "Hesabınız oluşturuldu ancak kullanmaya başlamadan önce bir yetkili tarafından onaylanması gerekiyor. 😔"
    //       : response.message,
    //     response.isSuccess ? 'success' : 'error'
    //   );
    //   setLoading(false);
    // });
  };



  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Hesap Oluştur
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hesap oluşturmak için kullanıcı adı, email ve şifre giriniz!
            </p>
          </div>
          <div>
            <form onSubmit={(e) => {
              e.preventDefault(); // This stops the page from reloading
              handleRegister();
            }}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Full Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Tam İsim <span className="text-error-500 text-xs">* {formErrors.fullName && ' Bu alan gereklidir.'}</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Tam isim"
                      error={formErrors.fullName}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        if (formErrors.fullName && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, fullName: false }));
                        }
                      }}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Soyisim <span className="text-error-500 text-xs">* {formErrors.lastname && ' Bu alan gereklidir.'}</span>
                    </Label>
                    <Input
                      type="text"
                      error={formErrors.lastname}
                      onChange={(e) => {
                        setLastname(e.target.value)
                        if (formErrors.lastname && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, lastname: false }));
                        }
                      }}
                      placeholder="Soyisim"
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email <span className="text-error-500 text-xs">* {existError.emailMatch && ' Email sistemde mevcut.'}{formErrors.email && !existError.emailMatch && ' Bu alan gereklidir.'}</span>
                  </Label>
                  <Input
                    type="email"
                    error={formErrors.email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (formErrors.email && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, email: false }));
                        }
                      }}
                    placeholder="example@gmail.com"
                  />
                  <span className="text-error-500 text-sm">{existError.emailMatch && '* Email sistemde mevcut.'}</span>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Username --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Kullanıcı Adı <span className="text-error-500 text-xs">* {existError.usernameMatch && ' Kullanıcı adı sistemde mevcut.'} {formErrors.username && !existError.usernameMatch && ' Bu alan gereklidir.'}</span>
                    </Label>
                    <Input
                      type="text"
                      error={formErrors.username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                        if (formErrors.username && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, username: false }));
                        }
                      }}
                      placeholder="Kullanıcı adı"
                    />
                  </div>
                  {/* <!-- BTAG --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      BTag <span className="text-error-500 text-xs">* {existError.btagMatch && ' Btag sistemde mevcut.'} {formErrors.btag && !existError.btagMatch && ' Bu alan gereklidir.'}</span>
                    </Label>
                    <Input
                      type="text"
                      error={formErrors.btag}
                      placeholder="BTag"
                      onChange={(e) => {
                        setBtag(e.target.value)
                        if (formErrors.btag && e.target.value.trim() !== '') {
                          setFormErrors(prev => ({ ...prev, btag: false }));
                        }
                      }}
                    />
                  </div>
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
                {/* <!-- Password --> */}
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
                  <span className="text-error-500 text-sm">{error !== '' && error}</span>
                </div>
                {/* <!-- Button --> */}
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
                        Kayıt Olunuyor...
                      </>
                    ) : (
                      'Kayıt Ol'
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Hesabınız var mı ? {" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Giriş Yap
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
