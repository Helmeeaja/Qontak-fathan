import { useEffect, useState } from "react";
import { List, SignOut } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

import api from "@/services/api";

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/profile/")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const userName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "User";

  return (
    <header className="flex h-[72px] min-h-[72px] w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <button
        type="button"
        className="hidden h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 max-md:flex"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <List size={22} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5 max-[576px]:hidden">
          <div className="text-sm font-semibold text-gray-900">
            {userName}
          </div>

          <div className="text-xs text-gray-500">
            {user?.role || ""}
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-semibold text-white">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>
              {userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
          onClick={logout}
          title="Logout"
          aria-label="Logout"
        >
          <SignOut size={18} />
        </button>
      </div>
    </header>
  );
}
