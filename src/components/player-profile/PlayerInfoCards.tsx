// components/PlayerInfoCards.tsx
import { PencilIcon } from "@/icons";
import { showToast } from "@/utils/toastUtil";
import React from "react";

const InfoSection = ({ title, data }: { title: string; data: { label: string; value?: string | boolean }[] }) => (
  <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700 dark:text-gray-300">
      {data.map((item, idx) => (
        <div key={idx} className="flex justify-between">
          <span>{item.label}</span>
          <span className="font-medium text-right">
            {typeof item.value === "boolean" ? (
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

const PlayerInfoCards = () => {
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
          title="Personal Info"
          data={[
            { label: "First Name", value: "Yalçın" },
            { label: "Middle Name", value: "" },
            { label: "Last Name", value: "Şeremet" },
            { label: "Birthday", value: "1990-01-01" },
            { label: "Birth City", value: "Istanbul" },
            { label: "Gender", value: "Male" },
            { label: "Document Number", value: "****" },
            { label: "Personal ID", value: "" },
            { label: "Document Expiration Date", value: "" },
            { label: "Document Issue Date", value: "" },
            { label: "Document Issued By", value: "" },
            { label: "Document Issue Code", value: "" },
          ]}
        />

        <InfoSection
          title="Contact Info"
          data={[
            { label: "Region", value: "Türkiye" },
            { label: "Email", value: "user@hotmail.com" },
            { label: "City", value: "Istanbul" },
            { label: "Phone", value: "05556872537" },
            { label: "Address", value: "" },
            { label: "Additional Address", value: "" },
            { label: "Mobile", value: "" },
            { label: "Zip-Code", value: "" },
          ]}
        />

        <InfoSection
          title="Promotional Info"
          data={[
            { label: "Is Using Loyalty Program", value: false },
            { label: "Loyalty Level", value: "None" },
            { label: "Loyalty Point", value: "0" },
            { label: "XP (experience points)", value: "0" },
            { label: "Excluded From Bonuses", value: false },
          ]}
        />

        <InfoSection
          title="Account Info"
          data={[
            { label: "Player ID", value: "123123" },
            { label: "Username", value: "yalcinnn" },
            { label: "External ID", value: "" },
            { label: "Account Status", value: "Open" },
            { label: "Verified", value: false },
            { label: "Partner", value: "toz-47324" },
            { label: "Date Registered", value: "2025-08-07 08:51" },
            { label: "Balance (TRY)", value: "₺0.00" },
            { label: "Affiliate Id", value: "" },
            { label: "Is Casino Blocked", value: false },
            { label: "Is Sport Blocked", value: false },
            { label: "Is RMT Blocked", value: false },
            { label: "State", value: "Temporary" },
            { label: "Status", value: "Online" },
            { label: "Player Category", value: "New User" },
            { label: "Casino Profile", value: "" },
            { label: "Language", value: "Turkish" },
            { label: "BTag", value: "" },
            { label: "Promo Code", value: "" },
            { label: "Custom Player Category", value: "" },
            { label: "QR code is applied", value: false },
            { label: "Wrong Login Block Time", value: "" },
            { label: "Wrong Login Attempts", value: "0" },
            { label: "AML Status", value: "None" },
            { label: "Registration Source", value: "New Mobile" },
            { label: "Is Test", value: false },
            { label: "Title", value: "" },
            { label: "Rfid", value: "" },
            { label: "Two factor authentication", value: false },
          ]}
        />

        <InfoSection
          title="Financial Info"
          data={[
            { label: "Bank Name", value: "" },
            { label: "IBAN", value: "" },
            { label: "SwiftCode", value: "" },
            { label: "Account Holder", value: "" },
          ]}
        />

        <InfoSection
          title="Social Preferences"
          data={[
            { label: "Subscribed To Email", value: true },
            { label: "Subscribed To SMS", value: true },
            { label: "Subscribed To Push Notifications", value: true },
            { label: "Subscribed To Phone Call", value: true },
            { label: "Subscribed To Newsletter", value: false },
            { label: "Subscribed To Internal Message", value: false },
            { label: "TCVersion Acceptance Date", value: "" },
            { label: "Terms And Conditions Version", value: "" },
          ]}
        />
      </div>
    </div>
  );
};

export default PlayerInfoCards;
