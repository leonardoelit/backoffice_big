import React, { FC, useEffect, useMemo, useState } from "react";
import { PencilIcon, UserCircleIcon } from "@/icons";
import { showToast } from "@/utils/toastUtil";
import { Player, PlayerCategory, RiskOrFavorite } from "../constants/types";
import { formatDateToDDMMYYYY } from "@/utils/utils";
import { loginAsPlayer, markPlayer, updatePlayerCategory, updatePlayersData } from "../lib/api";
import RiskPopUp from "@/components/player-profile/RiskPopUp";
import { Crown, Gem, Loader2, Star, User, X } from "lucide-react";

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

const categoryConfig = {
  [PlayerCategory.Regular]: {
    label: 'Regular',
    icon: <User className="w-4 h-4" />,
    badgeClasses: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    buttonClasses: 'hover:bg-slate-100 dark:hover:bg-slate-800',
    selectedClasses: 'ring-2 ring-slate-500 bg-slate-100 dark:bg-slate-800',
  },
  [PlayerCategory.VIP]: {
    label: 'VIP',
    icon: <Crown className="w-4 h-4" />,
    badgeClasses: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400',
    buttonClasses: 'hover:bg-amber-100 dark:hover:bg-amber-900/50',
    selectedClasses: 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900/50',
  },
  [PlayerCategory.HighRoller]: {
    label: 'High Roller',
    icon: <Gem className="w-4 h-4" />,
    badgeClasses: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400',
    buttonClasses: 'hover:bg-purple-100 dark:hover:bg-purple-900/50',
    selectedClasses: 'ring-2 ring-purple-500 bg-purple-100 dark:bg-purple-900/50',
  },
};

// ---------- Main ----------
interface PlayerInfoCardsProps {
  playerData?: Player;
  isLoadingData: boolean;
}

interface PlayerCategoryManagerProps {
  playerData: Player;
}

const PlayerCategoryManager: FC<PlayerCategoryManagerProps> = ({ playerData }) => {
  const [currentCategory, setCurrentCategory] = useState<PlayerCategory>(playerData.playerCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PlayerCategory>(playerData.playerCategory);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateCategory = async () => {
    if (selectedCategory === currentCategory) {
      // MODIFIED: Using your showToast function
      showToast("No change detected.", "info");
      return;
    }
    setIsLoading(true);
    const response = await updatePlayerCategory(playerData.playerId, selectedCategory);
    setIsLoading(false);

    if (response.isSuccess) {
      // MODIFIED: Using your showToast function
      showToast(response.message || "Category updated successfully!", "success");
      setCurrentCategory(selectedCategory);
      setIsModalOpen(false);
    } else {
      // MODIFIED: Using your showToast function
      showToast(response.message || "Failed to update category.", "error");
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
      >
        {currentCategory === PlayerCategory.Regular ? (
          <User size={16} className="text-gray-500" />
        ) : currentCategory === PlayerCategory.VIP ? (
          <Crown size={16} className="text-yellow-500" />
        ) : currentCategory === PlayerCategory.HighRoller ? (
          <Gem size={16} className="text-purple-500" />
        ) : (
          "-"
        )}
        <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
          {PlayerCategory[currentCategory]}
        </span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 m-4">
            <div className="flex items-start justify-between">
                <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Change Player Category
                </h2>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Select a new category for the player. This may affect their perks and access.
            </p>

            <div className="mt-6 space-y-3">
              {Object.values(PlayerCategory)
                .filter(value => typeof value === 'number')
                .map((catValue) => {
                  const categoryValue = catValue as PlayerCategory;
                  const config = categoryConfig[categoryValue];
                  return (
                    <button
                      key={categoryValue}
                      onClick={() => setSelectedCategory(categoryValue)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 dark:border-slate-700 transition-all duration-200 text-left ${selectedCategory === categoryValue ? config.selectedClasses + ' border-transparent' : 'border-slate-200 ' + config.buttonClasses}`}
                    >
                      <div className={`p-2 rounded-full ${config.badgeClasses}`}>
                        {config.icon}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{config.label}</span>
                    </button>
                  );
                })}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateCategory}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PlayerInfoCards: React.FC<PlayerInfoCardsProps> = ({ playerData, isLoadingData }) => {
  const [isRiskOpen, setRiskOpen] = useState(false); // Risk popup state
  const [isLoggingToPlayerAccount, setIsLoggingToPlayerAccount] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  const [isMarkingPlayer, setIsMarkingPlayer] = useState(false)
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

    const handleLoginAsUser = async () => {
      if (!playerData) return;
      setIsLoggingToPlayerAccount(true)

      try {
        const result = await loginAsPlayer(playerData.playerId.toString());
        if (!result.isSuccess) {
          showToast(result.message || "Login failed", "error");
          return;
        }

        // Open the login endpoint in a new tab
        window.open(
          `${result.url}`,
          "_blank"
        );

        showToast(`Oyuncu hesabına giriş yapılıyor: ${playerData.username}`, "success");
      } catch (err) {
        showToast("Oyuncu hesabına giriş yaparken hata", "error");
        console.error(err);
      }
      setIsLoggingToPlayerAccount(false)
    };

    const handleMarkPlayer = async (type:RiskOrFavorite, note:string) => {
      if(!playerData?.playerId) return;
      setIsMarkingPlayer(true)

      const result = await markPlayer({ playerId: playerData.playerId.toString(), type: type, note: note });

      if(result.isSuccess){
        showToast("Oyuncu risk listesine eklendi", "success")
      }else{
        showToast(result.message ? result.message : "Oyuncuyu risk listesine eklerken hata", "error")
      }
      setRiskOpen(false);
      setIsMarkingPlayer(false);
    }

    const handleAddToFavorites = async () => {
      if(!playerData?.playerId) return;
      setIsAddingToFavorites(true)

      const res = await markPlayer({ playerId: playerData.playerId.toString(), type: RiskOrFavorite.Favorite })
      if(res.isSuccess){
        showToast("Oyuncu favorilere eklendi", "success")
      }else{
        showToast(res.message ? res.message : "Oyuncuyu favorilere eklerken hata")
      }
      setIsAddingToFavorites(false)
    }

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
        disabled={isAddingToFavorites}
        onClick={handleAddToFavorites}
        className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-yellow-50 disabled:bg-yellow-200 dark:hover:bg-yellow-900 dark:disabled:bg-yellow-900 transition-colors"
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
        disabled={isMarkingPlayer}
        className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-purple-50 disabled:bg-purple-300 dark:hover:bg-purple-900 dark:disabled:bg-purple-900 transition-colors"
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
        title="Login As User"
        disabled={isLoggingToPlayerAccount}
        onClick={handleLoginAsUser}
        className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 dark:disabled:bg-gray-700 hover:bg-gray-50 disabled:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <UserCircleIcon className="text-blue-600" />
      </button>
    </div>
       {/* Risk Popup */}
       <RiskPopUp
        isOpen={isRiskOpen}
        onClose={() => setRiskOpen(false)}
        isMarking={isMarkingPlayer}
        onSubmit={(value) => handleMarkPlayer(RiskOrFavorite.Risk, value)}
      />
  </div>

      <div className="mt-8 max-w-lg">
        {playerData && <PlayerCategoryManager playerData={playerData} />}
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
            { label: "Password", value: base("password"), editable: true, type: "text", field: "password" },
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