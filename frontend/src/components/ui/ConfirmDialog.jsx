import { Trash, Archive, ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

const ACTION_CONFIG = {
  delete: {
    icon: Trash,
    text: "text-red-600",
    bg: "bg-red-50",
    button: "bg-red-600 hover:bg-red-600/90",
    confirmText: "Delete",
  },
  archive: {
    icon: Archive,
    text: "text-orange-600",
    bg: "bg-orange-50",
    button: "bg-orange-600 hover:bg-orange-600/90",
    confirmText: "Archive",
  },
  restore: {
    icon: ArrowClockwise,
    text: "text-green-600",
    bg: "bg-green-50",
    button: "bg-green-600 hover:bg-green-600/90",
    confirmText: "Restore",
  },
  warning: {
    icon: WarningCircle,
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    button: "bg-yellow-600 hover:bg-yellow-600/90",
    confirmText: "Confirm",
  },
};

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, action = "warning", loading = false }) {
  if (!open) return null;

  const config = ACTION_CONFIG[action] || ACTION_CONFIG.warning;
  const IconComp = config.icon;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/45 p-5">
      <div className="max-h-[90vh] w-full max-w-[400px] overflow-auto rounded-[14px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="border-b border-slate-200 p-5">
          <h3 className="m-0 text-xl font-bold text-slate-900">{title}</h3>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4">
            <span className={`inline-flex ${config.text}`}>
              <IconComp />
            </span>
            <p className="m-0 text-sm leading-relaxed text-slate-900/70">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-slate-200 p-5">
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-md px-3.5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${config.button}`}
            disabled={loading}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {loading ? "Loading..." : config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
