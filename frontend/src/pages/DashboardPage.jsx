import { useEffect, useState } from "react";
import { Users, UserPlus, ShieldCheck } from "@phosphor-icons/react";
import api from "@/services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/stats/")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setError("Dashboard gagal dimuat.");
      });
  }, []);

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-4 text-[#b91c1c]">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-gray-500">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.total_users,
      icon: Users,
    },
    {
      label: "Total Agents",
      value: stats.total_agents,
      icon: UserPlus,
    },
    {
      label: "Total Managers",
      value: stats.total_managers,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="m-0 text-[28px] font-bold text-gray-700 max-md:text-2xl">
          Dashboard
        </h1>
        <p className="m-0 mt-1.5 text-sm text-gray-500">
          {stats.company_name || "QontakSales"}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            key={label}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-gray-500">
                  {label}
                </span>

                <strong className="text-[30px] leading-none text-gray-900">
                  {value}
                </strong>
              </div>

              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-blue-600/10 text-brand">
                <Icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
