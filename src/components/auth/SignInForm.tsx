"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { authenticateUser } from "@/server/userActions";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";

export default function SignInForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const { login, isLoadingSignIn, isAuthenticated } = useAuth();
  const router = useRouter()

// Check if already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('authToken');
      if (token && isAuthenticated) {
        router.push('/');
      }
    };
    
    checkAuth();
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authenticateUser(email, password);

      if (response.isSuccess) {
        // Set cookie with proper options
        setCookie('authToken', response.token, {
          maxAge: 60 * 60 * 24,
          path: '/',
          sameSite: 'lax',
        });

        // Update auth state
        login(response);
        setPassword('');
        
        // Force a reload to ensure middleware sees the cookie
        window.location.href = '/';
      } else {
        setLoading(false);
        setError(response.message);
      }
    } catch (err) {
      console.log(err)
      setError('Unexpected error occurred.');
    }
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Giriş Yap
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kullanıcı adı ve şifrenizi girip giriş yapın!
            </p>
          </div>
          <div>
            <form onSubmit={(e) => {
              e.preventDefault(); // This stops the page from reloading
              handleLogin();      // Call your login logic
            }}>
              <div className="space-y-6">
                <div>
                  <Label>
                    E-Mail <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="partner@tozgaming.com" type="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label>
                    Şifre <span className="text-error-500 text-xs"></span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifre"
                      onChange={(e) => setPassword(e.target.value)}
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
                {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
                </div>
                <div>
                  <Button className="w-full flex items-center justify-center gap-2" size="sm" type="submit" disabled={loading || isLoadingSignIn}>
                    {loading || isLoadingSignIn ? (
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
                        Giriş Yapılıyor...
                      </>
                    ) : (
                      'Giriş Yap'
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-2">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
