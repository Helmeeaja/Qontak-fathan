export default function LoadingPopup({ open, message = "Loading..." }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/[0.04] backdrop-blur-[4px]"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{ touchAction: "none" }}
    >
      <div
        className="min-w-[220px] rounded-xl border border-[#E4ECFC] bg-white px-10 py-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand" />
          <div className="text-sm font-semibold text-slate-900">{message}</div>
        </div>
      </div>
    </div>
  );
}
