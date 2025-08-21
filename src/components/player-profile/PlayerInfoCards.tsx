import { PencilIcon } from "@/icons";
import { showToast } from "@/utils/toastUtil";
import React from "react";
import { Player } from "../constants/types";
import { formatDateToDDMMYYYY } from "@/utils/utils";

// Skeleton component
const Skeleton = ({ width = "w-24" }: { width?: string }) => (
  <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${width}`} />
);

const InfoSection = ({
  title,
  data,
  isLoading,
}: {
  title: string;
  data: { label: string; value?: string | boolean }[];
  isLoading: boolean;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700 dark:text-gray-300">
      {data.map((item, idx) => (
        <div key={idx} className="flex justify-between">
          <span>{item.label}</span>
          <span className="font-medium text-right">
            {isLoading ? (
              <Skeleton width="w-28" />
            ) : typeof item.value === "boolean" ? (
              <input type="checkbox" checked={item.value} readOnly className="accent-blue-500" />
            ) : (
              item.value || "-"
            )}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const InfoSection2 = ({
  title,
  data,
  isLoading,
  cols = 1
}: {
  title: string;
  data: { label: string; value?: string | boolean }[];
  isLoading: boolean;
  cols?: 1 | 2;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
    <h3 className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
      {title}
    </h3>
    <div className={`grid grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : ''} gap-4 text-sm text-gray-700 dark:text-gray-300`}>
      {data.map((item, idx) => (
        <div key={idx} className="flex flex-col">
          <span className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-xs uppercase tracking-wide">
            {item.label}
          </span>
          <span className="font-medium break-words min-h-[1.5rem]">
            {isLoading ? (
              <Skeleton width="w-28" />
            ) : typeof item.value === "boolean" ? (
              <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={item.value} 
                  readOnly 
                  className="accent-blue-500 scale-125" 
                />
              </div>
            ) : (
              item.value || "-"
            )}
          </span>
        </div>
      ))}
    </div>
  </div>
);


interface PlayerInfoCardsProps {
  playerData?: Player;
  isLoadingData: boolean;
}

const PlayerInfoCards: React.FC<PlayerInfoCardsProps> = ({ playerData, isLoadingData }) => {
  if (!playerData && !isLoadingData) {
    return <div className="p-6 text-gray-500 dark:text-gray-400">No player data found.</div>;
  }
  return (
    <div className="px-4 py-6">
    {/* Top bar with icon-only edit button */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Player Information</h2>

      <button
  onClick={() => showToast("Edit clicked!", "info")}
  className="bg-gray-200 dark:bg-gray-700 p-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
  aria-label="Edit"
>
  <PencilIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
</button>

    </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <InfoSection
        isLoading={isLoadingData}
          title="Personal Info"
          data={[
            { label: "İsim", value: isLoadingData ? "Loading..." : playerData?.firstName },
            { label: "İkinci İsim", value: isLoadingData ? "Loading..." : playerData?.middleName },
            { label: "Soyisim", value: isLoadingData ? "Loading..." : playerData?.lastName },
            { label: "Doğum Günü", value: isLoadingData ? "Loading..." : formatDateToDDMMYYYY(playerData.birthday) },
            { label: "Şehir", value: isLoadingData ? "Loading..." : playerData?.city },
            { label: "Cinsiyer", value: isLoadingData ? "Loading..." : playerData?.gender },
            { label: "TCID", value: isLoadingData ? "Loading..." : playerData?.documentNumber },
            { label: "Personal ID", value: isLoadingData ? "Loading..." : "" },
            { label: "Document Expiration Date", value: isLoadingData ? "Loading..." : "" },
            { label: "Document Issue Date", value: isLoadingData ? "Loading..." : "" },
            { label: "Document Issued By", value: isLoadingData ? "Loading..." : "" },
            { label: "Document Issue Code", value: isLoadingData ? "Loading..." : "" },
          ]}
        />

        <InfoSection2
          isLoading={isLoadingData}
          title="Contact Info"
          cols={1}
          data={[
            { label: "Ülke", value: isLoadingData ? "Loading..." : playerData?.country },
            { label: "Email", value: isLoadingData ? "Loading..." : playerData?.email },
            { label: "Şehir", value: isLoadingData ? "Loading..." : playerData?.city },
            { label: "Tel No", value: isLoadingData ? "Loading..." : playerData?.mobileNumber },
            { label: "Adres", value: isLoadingData ? "Loading..." : playerData?.address }
          ]}
        />

        <InfoSection
        isLoading={isLoadingData}
          title="Promotional Info"
          data={[
            { label: "Is Using Loyalty Program", value: isLoadingData ? "Loading..." : false },
            { label: "Loyalty Level", value: isLoadingData ? "Loading..." : "None" },
            { label: "Loyalty Point", value: isLoadingData ? "Loading..." : "0" },
            { label: "XP (experience points)", value: isLoadingData ? "Loading..." : "0" },
            { label: "Excluded From Bonuses", value: isLoadingData ? "Loading..." : false },
          ]}
        />

        <InfoSection
        isLoading={isLoadingData}
          title="Account Info"
          data={[
            { label: "Player ID", value: isLoadingData ? "Loading..." : playerData?.playerId.toString() },
            { label: "Username", value: isLoadingData ? "Loading..." : playerData?.username },
            { label: "Hesap Durumu", value: isLoadingData ? "Loading..." : "" },
            { label: "Verified", value: isLoadingData ? "Loading..." : playerData?.verificationStatus },
            { label: "Kayıt Tarihi", value: isLoadingData ? "Loading..." : formatDateToDDMMYYYY(playerData.registrationDateTime) },
            { label: "Bakiye (TRY)", value: isLoadingData ? "Loading..." : `₺${playerData?.balance.toLocaleString()}` },
            { label: "Affiliate Id", value: isLoadingData ? "Loading..." : "" },
            { label: "Is Casino Blocked", value: isLoadingData ? "Loading..." : false },
            { label: "Is Sport Blocked", value: isLoadingData ? "Loading..." : false },
            { label: "Is RMT Blocked", value: isLoadingData ? "Loading..." : false },
            { label: "Durum", value: isLoadingData ? "Loading..." : "Temporary not real" },
            { label: "Statü", value: isLoadingData ? "Loading..." : "Online not real" },
            { label: "Oyuncu Kategorisi", value: isLoadingData ? "Loading..." : playerData?.playerCategory },
            { label: "Casino Profili", value: isLoadingData ? "Loading..." : "" },
            { label: "Dil", value: isLoadingData ? "Loading..." : "Türkçe" },
            { label: "BTag", value: isLoadingData ? "Loading..." : playerData?.promoCode },
            { label: "Promo Code", value: isLoadingData ? "Loading..." : "" },
            { label: "Custom Player Category", value: isLoadingData ? "Loading..." : "" },
            { label: "QR code is applied", value: isLoadingData ? "Loading..." : "Sonra halledicem" },
            { label: "Wrong Login Block Time", value: isLoadingData ? "Loading..." : "" },
            { label: "Wrong Login Attempts", value: isLoadingData ? "Loading..." : "" },
            { label: "AML Status", value: isLoadingData ? "Loading..." : "None" },
            { label: "Registration Source", value: isLoadingData ? "Loading..." : "New Mobile" },
            { label: "Is Test", value: isLoadingData ? "Loading..." : false },
            { label: "Title", value: isLoadingData ? "Loading..." : "" },
            { label: "Rfid", value: isLoadingData ? "Loading..." : "" },
            { label: "Two factor authentication", value: isLoadingData ? "Loading..." : false },
          ]}
        />

        <InfoSection2
        isLoading={isLoadingData}
          title="Financial Info"
          cols={1}
          data={[
            { label: "Bank Name", value: isLoadingData ? "Loading..." : "" },
            { label: "IBAN", value: isLoadingData ? "Loading..." : "" },
            { label: "SwiftCode", value: isLoadingData ? "Loading..." : "" },
            { label: "Account Holder", value: isLoadingData ? "Loading..." : "" },
          ]}
        />

        <InfoSection2
        isLoading={isLoadingData}
          title="Social Preferences"
          cols={1}
          data={[
            { label: "Subscribed To Email", value: isLoadingData ? "Loading..." : true },
            { label: "Subscribed To SMS", value: isLoadingData ? "Loading..." : true },
            { label: "Subscribed To Push Notifications", value: isLoadingData ? "Loading..." : true },
            { label: "Subscribed To Phone Call", value: isLoadingData ? "Loading..." : true },
            { label: "Subscribed To Newsletter", value: isLoadingData ? "Loading..." : false },
            { label: "Subscribed To Internal Message", value: isLoadingData ? "Loading..." : false },
            { label: "TCVersion Acceptance Date", value: isLoadingData ? "Loading..." : "" },
            { label: "Terms And Conditions Version", value: isLoadingData ? "Loading..." : "" },
          ]}
        />
      </div>
    </div>
  );
};

export default PlayerInfoCards