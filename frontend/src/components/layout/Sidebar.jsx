import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  House,
  UserPlus,
  ChartBar,
  Users,
  Buildings,
  UsersThree,
  X,
  Tag,
  ShoppingCart,
  Package,
  Factory
} from "@phosphor-icons/react";

import brandLogo from "@/assets/brand.png";

const navItems = [
  {
    label: "Dashboard",
    icon: House,
    path: "/dashboard",
  },
  {
    label: "Agents",
    icon: UserPlus,
    path: "/agents",
    managerOnly: true,
  },
  {
    label: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    label: "Chart of Accounts",
    icon: ChartBar,
    path: "/coa",
  },
  {
    label: "Company",
    icon: Buildings,
    path: "/company",
  },
  {
    label: "UserManagement",
    icon: UsersThree,
    path: "/usermanagement",
  },
  {
    label: "Sales",
    icon: Tag,
    path: "/sales"
  },
  {
    label: "Purchases",
    icon: ShoppingCart,
    path:"/purchases"
  },
  {
    label: "Products",
    icon: Package,
    path: "/products"
  },
  {
    label: "Productions",
    icon: Factory,
    path: "/productions"
  }
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const isManager =
    localStorage.getItem("user_role") === "MANAGER";

  const visibleItems = navItems.filter(
    (item) => !item.managerOnly || isManager
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 hidden max-md:block"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
          onClick={onClose}
        />
      )}

      <aside
        className={`
          z-50 flex h-screen w-[260px] flex-shrink-0 flex-col border-r border-gray-200 bg-white
          max-md:fixed max-md:inset-y-0 max-md:left-0
          max-md:shadow-[4px_0_16px_rgba(0,0,0,0.12)]
          max-md:transition-transform max-md:duration-200
          ${open ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-6">
          <img
            src={brandLogo}
            alt="QontakSales"
            className="h-7 w-auto object-contain"
          />

          <button
            type="button"
            className="hidden items-center justify-center rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-gray-900 max-md:flex"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <RouterLink
                key={item.path}
                to={item.path}
                className={`
                  flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm no-underline transition-all
                  ${
                    active
                      ? "bg-brand font-semibold text-white hover:bg-brand hover:text-white"
                      : "text-gray-700 hover:bg-slate-100 hover:text-gray-900"
                  }
                `}
                onClick={onClose}
              >
                <Icon size={20} weight={active ? "fill" : "regular"} />

                <span>{item.label}</span>
              </RouterLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
