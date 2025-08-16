'use client';

import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/utils/toastUtil';
import { useEffect, useState } from 'react';

export default function AffiliateCard() {
  const { userInfo } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isLoading, setisLoading] = useState(true)
  const affiliateLink = !isLoading
    ? `${process.env.NEXT_PUBLIC_URL}/tr/?btag=${userInfo.btag}`
    : 'Lütfen bekleyin...';

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    showToast('Link Kopyalandı! 🙂', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if(userInfo.btag !== ''){
      setisLoading(false)
    }
  }, [userInfo.btag])
  

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl">
        {/* Header */}
        <div className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-t-xl">
          Yeni oyuncular davet et ve kazanmaya başla!
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6">
          {/* Icon */}
          <div className="bg-red-100 p-4 rounded-full text-orange-500 text-2xl self-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-link text-black"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>

          {/* Text & Link */}
          <div className="flex-1 w-full">
            <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white text-center md:text-left">
              Ortaklık Linkiniz !!!
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-2 md:gap-0">
              <input
                type="text"
                readOnly
                value={affiliateLink}
                className="flex-1 px-4 py-2 rounded-md sm:rounded-l-md sm:rounded-r-none border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-white"
              />
              <button
                onClick={handleCopy}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 md:py-[8px] rounded-md sm:rounded-r-md sm:rounded-l-none text-sm flex items-center justify-center"
              >
                {copied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clipboard-check"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="m9 14 2 2 4-4" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-copy"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
