import { useEffect, useState } from "react";

export function Provider({ children }) {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const handler = (e) => { setToast(e.detail); setTimeout(() => setToast(null), 3000); };
    window.addEventListener("app-toast", handler);
    return () => window.removeEventListener("app-toast", handler);
  }, []);
  return (
    <>
      {children}
      {toast && (
        <div
          role="status"
          className="fixed right-5 top-5 z-[10000] min-w-[260px] rounded-[10px] border border-slate-200 bg-white px-[18px] py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
        >
          <strong className="mb-[3px] block">{toast.title}</strong>
          {toast.description && <div>{toast.description}</div>}
        </div>
      )}
    </>
  );
}
