import { useEffect } from "react";

interface RiskPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  isMarking: boolean;
  onSubmit: (value: string) => void;
}

export default function RiskPopUp({ isOpen, onClose, isMarking, onSubmit }: RiskPopUpProps) {
  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputValue = (e.currentTarget.elements.namedItem("riskInput") as HTMLTextAreaElement).value;
    onSubmit(inputValue);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999]">
      {/* Popup box */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative z-[1001]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Risk Check
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="riskInput"
            placeholder="Risk kontrolü için lütfen oyuncunun kontrole gönderilme sebebini yazınız..."
            rows={5} // 5–6 lines
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
          />

          <button
            type="submit"
            disabled={isMarking}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            {isMarking ? (<span className="loading-dots">Gönderiliyor</span>) : "Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}
