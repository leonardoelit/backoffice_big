import React, { useEffect, useMemo, useState } from "react";
import { PencilIcon } from "@/icons";
import { showToast } from "@/utils/toastUtil";
import { Player } from "../constants/types";
import { formatDateToDDMMYYYY } from "@/utils/utils";
import { updatePlayersData } from "../lib/api";
import RiskPopUp from "@/components/player-profile/RiskPopUp";

// ---------- helpers ----------
type EditableType = "text" | "email" | "date" | "checkbox";
type UpdatableKey =
  | "username"
  | "firstName"
  | "middleName"
  | "lastName"
  | "country"
  | "city"
  | "birthday"
  | "address"
  | "gender"
  | "documentNumber"
  | "mobileNumber"
  | "email"
  | "password"
  | "btag"
  | "promoCode"
  | "emailSubscription"
  | "smsSubscription";

const toInputDate = (value?: string | Date | null) => {
  if (!value) return "";
  const d = new Date(value as any);
  if (isNaN(d.getTime())) {
    // already yyyy-mm-dd?
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    return "";
  }
  return d.toISOString().slice(0, 10);
};

// ---------- Skeleton ----------
const Skeleton = ({ width = "w-24" }: { width?: string }) => (
  <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${width}`} />
);

// ---------- Generic row with edit support ----------
interface EditableCellProps {
  label: string;
  type?: EditableType;
  value?: string | boolean | null;
  field?: UpdatableKey;
  isLoading: boolean;
  draft: Partial<Record<UpdatableKey, any>>;
  overrides: Partial<Record<UpdatableKey, any>>;
  onFieldChange: (field: UpdatableKey, value: any) => void;
  alignRight?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  label,
  type = "text",
  value,
  field,
  isLoading,
  draft,
  overrides,
  onFieldChange,
  alignRight = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // current raw value respects draft > overrides > base value
  const currentRaw = useMemo(() => {
    if (field && draft[field] !== undefined) return draft[field];
    if (field && overrides[field] !== undefined) return overrides[field];
    return value;
  }, [draft, overrides, field, value]);

  // display value (string rendering)
  const displayValue = useMemo(() => {
    if (isLoading) return <Skeleton width="w-28" />;
    if (type === "checkbox") {
      return (
        <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
          <input
            type="checkbox"
            className="accent-blue-500 scale-125"
            checked={Boolean(currentRaw)}
            readOnly
          />
        </div>
      );
    }
    if (type === "date") {
      return currentRaw ? formatDateToDDMMYYYY(currentRaw as any) : "-";
    }
    return (currentRaw as any) || "-";
  }, [currentRaw, isLoading, type]);

  // editable renderer
  const renderEditor = () => {
    if (!field) return displayValue;

    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          className="accent-blue-500 w-5 h-5 cursor-pointer"
          checked={Boolean(currentRaw)}
          onChange={(e) => onFieldChange(field, e.target.checked)}
        />
      );
    }

    if (!isEditing) {
      return (
        <div className={`flex items-center ${alignRight ? "justify-end" : ""} gap-2`}>
          <span className="font-medium text-gray-900 dark:text-white">{displayValue}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Edit ${label}`}
          >
            <PencilIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </button>
        </div>
      );
    }

    return (
      <input
        type={type}
        className="border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        value={
          type === "date"
            ? toInputDate(currentRaw as any)
            : String(currentRaw ?? "")
        }
        onChange={(e) => onFieldChange(field, type === "date" ? e.target.value : e.target.value)}
        onBlur={() => setIsEditing(false)}
        autoFocus
      />
    );
  };

  return (
    <div className={`flex ${alignRight ? "justify-between" : "flex-col"} items-start py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}>
      <span className={`${alignRight ? "" : "text-gray-500 dark:text-gray-400 font-medium mb-1 text-xs uppercase tracking-wide"}`}>
        {label}
      </span>
      <span className={`${alignRight ? "font-medium text-right" : "font-medium break-words min-h-[1.5rem]"} text-gray-900 dark:text-white`}>
        {isLoading ? <Skeleton width="w-28" /> : renderEditor()}
      </span>
    </div>
  );
};

// ---------- Sections (extended to support edit) ----------
type DataItem = {
  label: string;
  value?: string | boolean | null;
  editable?: boolean;
  type?: EditableType;
  field?: UpdatableKey;
};

const InfoSection = ({
  title,
  data,
  isLoading,
  draft,
  overrides,
  onFieldChange,
}: {
  title: string;
  data: DataItem[];
  isLoading: boolean;
  draft: Partial<Record<UpdatableKey, any>>;
  overrides: Partial<Record<UpdatableKey, any>>;
  onFieldChange: (field: UpdatableKey, value: any) => void;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-all hover:shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
      <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      {data.map((item, idx) => (
        <EditableCell
          key={idx}
          label={item.label}
          value={item.value}
          field={item.editable ? item.field : undefined}
          type={item.type}
          isLoading={isLoading}
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          alignRight
        />
      ))}
    </div>
  </div>
);

const InfoSection2 = ({
  title,
  data,
  isLoading,
  cols = 1,
  draft,
  overrides,
  onFieldChange,
}: {
  title: string;
  data: DataItem[];
  isLoading: boolean;
  cols?: 1 | 2;
  draft: Partial<Record<UpdatableKey, any>>;
  overrides: Partial<Record<UpdatableKey, any>>;
  onFieldChange: (field: UpdatableKey, value: any) => void;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-all hover:shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
      <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
      {title}
    </h3>
    <div
      className={`grid grid-cols-1 ${
        cols === 2 ? "md:grid-cols-2" : ""
      } gap-2 text-sm`}
    >
      {data.map((item, idx) => (
        <EditableCell
          key={idx}
          label={item.label}
          value={item.value}
          field={item.editable ? item.field : undefined}
          type={item.type}
          isLoading={isLoading}
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          alignRight={false}
        />
      ))}
    </div>
  </div>
);

// ---------- Main ----------
interface PlayerInfoCardsProps {
  playerData?: Player;
  isLoadingData: boolean;
}

const PlayerInfoCards: React.FC<PlayerInfoCardsProps> = ({ playerData, isLoadingData }) => {
  const [isRiskOpen, setRiskOpen] = useState(false); // Risk popup state
  // Collect unsaved changes here
  const [draft, setDraft] = useState<Partial<Record<UpdatableKey, any>>>({});
  // Persist saved overrides so UI reflects successful save even if parent hasn't refetched yet
  const [overrides, setOverrides] = useState<Partial<Record<UpdatableKey, any>>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const base = (k: keyof typeof playerData) => (playerData ? playerData[k] : undefined);

  useEffect(() => {
    // Reset when player changes
    setDraft({});
    setOverrides({});
  }, [playerData?.playerId]);

  const onFieldChange = (field: UpdatableKey, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanges = Object.keys(draft).length > 0;

  const handleSave = async () => {
    if (!playerData) return;
    setIsUpdating(true);

    const body: any = {
      playerId: playerData.playerId.toString(),
      ...draft,
    };

    const res = await updatePlayersData(body);
    if (res.isSuccess) {
      setOverrides((prev) => ({ ...prev, ...draft }));
      setDraft({});
      showToast("Oyuncu bilgileri güncellendi.", "success");
    } else {
      showToast(res.message ?? "Update failed", "error");
    }
    setIsUpdating(false)
  };

  const handleUndo = () => {
    setDraft({});
    showToast("Değişiklikler geri alındı.", "info");
  };

  if (!playerData && !isLoadingData) {
    return <div className="p-6 text-gray-500 dark:text-gray-400">Oyuncu bilgisi bulunamadı.</div>;
  }


  return (
    <div className="px-6 py-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Oyuncu Bilgileri
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Oyuncu bilgilerini görüntüle ve değiştir
      </p>
    </div>

    {/* Action buttons container */}
    <div className="flex items-center gap-3">

      {/* Add to Favorites button */}
      <button
        title="Add to Favorites"
        className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-yellow-500"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </button>

      {/* Risk button */}
      <button
        title="Risk Analysis"
        onClick={() => setRiskOpen(true)}
        className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-lightning w-5 h-5 text-purple-500 hover:fill-yellow-600"
        >
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </button>
      <button
        aria-label="Edit"
        className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <PencilIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
       {/* Risk Popup */}
       <RiskPopUp
        isOpen={isRiskOpen}
        onClose={() => setRiskOpen(false)}
        onSubmit={(value) => console.log("Risk input:", value)}
      />
  </div>


      {/* Info Grid (all original info preserved) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Personal Info */}
        <InfoSection
          isLoading={isLoadingData}
          title="Kişisel Bilgiler"
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          data={[
            { label: "İsim", value: base("firstName"), editable: true, type: "text", field: "firstName" },
            { label: "İkinci İsim", value: base("middleName"), editable: true, type: "text", field: "middleName" },
            { label: "Soyisim", value: base("lastName"), editable: true, type: "text", field: "lastName" },
            { label: "Doğum Günü", value: base("birthday") as any, editable: true, type: "date", field: "birthday" },
            { label: "Şehir", value: base("city"), editable: true, type: "text", field: "city" },
            { label: "Cinsiyet", value: (base("gender") as any) ?? "-", editable: false },
            { label: "TCID", value: base("documentNumber"), editable: true, type: "text", field: "documentNumber" },
            { label: "Personal ID", value: "" },
            { label: "Document Expiration Date", value: "" },
            { label: "Document Issue Date", value: "" },
            { label: "Document Issued By", value: "" },
            { label: "Document Issue Code", value: "" },
          ]}
        />

        {/* Contact Info */}
        <InfoSection2
          isLoading={isLoadingData}
          title="İletişim Bilgileri"
          cols={1}
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          data={[
            { label: "Ülke", value: base("country"), editable: true, type: "text", field: "country" },
            { label: "Email", value: base("email"), editable: true, type: "email", field: "email" },
            { label: "Şehir", value: base("city") }, // read-only here (already editable above)
            { label: "Tel No", value: base("mobileNumber"), editable: true, type: "text", field: "mobileNumber" },
            { label: "Adres", value: base("address"), editable: true, type: "text", field: "address" },
          ]}
        />

        {/* Promotional Info (kept as-is / placeholders) */}
        <InfoSection
          isLoading={isLoadingData}
          title="Promosyon Bilgileri"
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          data={[
            { label: "Is Using Loyalty Program", value: false },
            { label: "Loyalty Level", value: "None" },
            { label: "Loyalty Point", value: "0" },
            { label: "XP (experience points)", value: "0" },
            { label: "Excluded From Bonuses", value: false },
          ]}
        />

        {/* Account Info */}
        <InfoSection
          isLoading={isLoadingData}
          title="Hesap Bilgileri"
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          data={[
            { label: "Player ID", value: playerData?.playerId ? String(playerData.playerId) : "" },
            { label: "Username", value: base("username"), editable: true, type: "text", field: "username" },
            { label: "Bakiye (TRY)", value: playerData?.balance !== undefined ? `₺${playerData.balance.toLocaleString()}` : "" },
            { label: "Verified", value: (base("verificationStatus") as any) ?? "" },
            { label: "Kayıt Tarihi", value: playerData?.registrationDateTime ? formatDateToDDMMYYYY(playerData.registrationDateTime as any) : "" },
            { label: "Hesap Durumu", value: "" },
            { label: "Affiliate Id", value: "" },
            { label: "Is Casino Blocked", value: false },
            { label: "Is Sport Blocked", value: false },
            { label: "Is RMT Blocked", value: false },
            { label: "Durum", value: "Temporary not real" },
            { label: "Statü", value: playerData?.isOnline ? "Online" : "Offline" },
            { label: "Oyuncu Kategorisi", value: base("playerCategory") },
            { label: "Casino Profili", value: "" },
            { label: "Dil", value: "Türkçe" },
            { label: "BTag", value: base("btag"), editable: true, type: "text", field: "btag" },
            { label: "Promo Code", value: base("promoCode"), editable: true, type: "text", field: "promoCode" },
            { label: "Custom Player Category", value: "" },
            { label: "QR code is applied", value: "Sonra halledicem" },
            { label: "Wrong Login Block Time", value: "" },
            { label: "Wrong Login Attempts", value: "" },
            { label: "AML Status", value: "None" },
            { label: "Registration Source", value: "New Mobile" },
            { label: "Is Test", value: false },
            { label: "Title", value: "" },
            { label: "Rfid", value: "" },
            { label: "Two factor authentication", value: false },
          ]}
        />

        {/* Financial Info (kept) */}
        <InfoSection2
          isLoading={isLoadingData}
          title="Financial Info"
          cols={1}
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          data={[
            { label: "Bank Name", value: "" },
            { label: "IBAN", value: "" },
            { label: "SwiftCode", value: "" },
            { label: "Account Holder", value: "" },
          ]}
        />

        {/* Social Preferences (email/sms only are updatable per backend DTO) */}
        <InfoSection2
          isLoading={isLoadingData}
          title="Social Preferences"
          cols={1}
          draft={draft}
          overrides={overrides}
          onFieldChange={onFieldChange}
          data={[
            {
              label: "Subscribed To Email",
              value: (playerData as any)?.emailSubscription ?? false,
              editable: true,
              type: "checkbox",
              field: "emailSubscription",
            },
            {
              label: "Subscribed To SMS",
              value: (playerData as any)?.smsSubscription ?? false,
              editable: true,
              type: "checkbox",
              field: "smsSubscription",
            },
            { label: "Subscribed To Push Notifications", value: true },
            { label: "Subscribed To Phone Call", value: true },
            { label: "Subscribed To Newsletter", value: false },
            { label: "Subscribed To Internal Message", value: false },
            { label: "TCVersion Acceptance Date", value: "" },
            { label: "Terms And Conditions Version", value: "" },
          ]}
        />
      </div>

      {/* Sticky Save/Undo bar when there are unsaved changes */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 flex gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-4 z-50">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Kaydedilmemiş değişiklikler mevcut
          </span>
          <button
            disabled={isUpdating}
            onClick={handleUndo}
            className="px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:bg-gray-300 dark:hover:bg-gray-600 dark:disabled:bg-gray-600 transition text-gray-700 dark:text-gray-300 font-medium"
          >
            Geri Al
          </button>
          <button
            disabled={isUpdating}
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-700 transition shadow-md"
          >
            {isUpdating ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerInfoCards;