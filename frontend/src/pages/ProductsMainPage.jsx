import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  btn,
  btnModalCancel,
  btnModalSubmit,
  btnPrimary,
  btnSecondary,
  formLabel,
  formRequiredMark,
  inputBase,
  modalHeader,
  modalTitle,
  textareaBase,
} from "@/components/ui/styles";
import {
  buyAccountOptions,
  inventoryAccountOptions,
  productTaxOptions,
  productUnitOptions,
  sellAccountOptions,
  stockAdjustmentAccountOptions,
} from "@/data/productAccounts";
import { productCategoryOptions } from "@/data/productCategories";
import {
  CaretDown,
  CaretLeft,
  MagnifyingGlass,
  Funnel,
  Tray,
  X,
  Columns,
  ArrowSquareOut,
  Users,
  Package,
  Calendar,
  Image as ImageIcon,
  PencilSimple,
  UploadSimple,
  MinusCircle,
} from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";
import MultiSelect from "@/components/ui/MultiSelect";

function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function Modal({ title, onClose, children, footer, maxWidth = "max-w-[560px]" }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
      <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-700"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}

function Drawer({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="flex h-full max-h-[560px] w-full max-w-[480px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h2 className={modalTitle}>{title}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-[22px] py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}

function FilterFooter({ onReset, onApply }) {
  return (
    <>
      <button
        type="button"
        onClick={onReset}
        className="cursor-pointer text-[13px] font-semibold text-slate-500 hover:text-slate-700"
      >
        Reset filter
      </button>
      <button type="button" onClick={onApply} className={btnModalSubmit}>
        Apply
      </button>
    </>
  );
}

function InclusionModeRadios({ value, onChange }) {
  return (
    <div className="mb-4 flex items-center gap-5">
      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
        <input
          type="radio"
          name="inclusion-mode"
          checked={value === "includeAll"}
          onChange={() => onChange("includeAll")}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Include all
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
        <input
          type="radio"
          name="inclusion-mode"
          checked={value === "either"}
          onChange={() => onChange("either")}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Either
      </label>
    </div>
  );
}

function SearchSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => {
          setOpen(true);
          setQuery("");
        }}
        className={`${inputBase} flex cursor-pointer items-center justify-between pr-9 ${
          value ? "text-slate-900" : "text-slate-400"
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className={`${inputBase} h-9`}
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">No result found</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    option === value ? "font-semibold text-brand" : "text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OptionSelect({ value, onChange, options, placeholder, groups }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const selected = value;
  const flatOptions = groups ? groups.flatMap((g) => g.options) : options;

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} cursor-pointer pr-9 ${selected ? "text-slate-900" : "text-slate-400"}`}
      >
        {selected || placeholder}
      </div>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          {flatOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-400">No options</div>
          ) : groups ? (
            groups.map((group) => (
              <div key={group.group}>
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.group}
                </p>
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      option === selected ? "font-semibold text-brand" : "text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ))
          ) : (
            flatOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  option === selected ? "font-semibold text-brand" : "text-slate-700"
                }`}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Dropdown({ trigger, children, align = "left", width = "w-56" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div className="relative inline-block" ref={containerRef}>
      {trigger({ open, toggle: () => setOpen((prev) => !prev) })}
      {open && (
        <div
          className={`absolute z-50 mt-2 ${width} rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}

function CategoryInput({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(value.trim().toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={`${inputBase} pr-9`}
      />
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
      >
        <CaretDown size={14} weight="bold" />
      </button>
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          {filtered.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <MagnifyingGlass
        size={16}
        weight="bold"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputBase} w-56 pl-9`}
      />
    </div>
  );
}

function EmptyStateFolder({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src={emptyFolderImg} alt="" className="h-[128px] w-[128px] object-contain" />
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
      {description && <p className="mt-1 max-w-xl text-sm text-slate-500">{description}</p>}
    </div>
  );
}

const statCardConfigs = [
  { key: "available", label: "Available stock", tone: "green", report: "/reports/inventory_summary?product_stock=available" },
  { key: "low", label: "Low stock", tone: "amber", report: "/reports/inventory_summary?product_stock=minimum" },
  { key: "out", label: "Out of stock", tone: "red", report: "/reports/inventory_summary?product_stock=out" },
  { key: "warehouse", label: "Warehouse", tone: "indigo", sublabel: "Listed", report: "/reports/warehouse_stock_quantity" },
];

const statCardTone = {
  green: { card: "border-green-500", header: "bg-green-50" },
  amber: { card: "border-amber-400", header: "bg-amber-50" },
  red: { card: "border-red-400", header: "bg-red-50" },
  indigo: { card: "border-indigo-500", header: "bg-indigo-50" },
};

function WarehouseInfoPopover({ onClose, onSeeReport }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55" onClick={onClose}>
      <div
        className="w-[420px] rounded-xl border border-gray-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Total product in warehouse</p>
            <p className="mt-1 text-sm text-slate-600">
              Now, you can view the product quantity information in warehouse through the Warehouse Stock Quantity report.
            </p>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-700">
            <X size={16} weight="bold" />
          </button>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={`${btnSecondary} px-3 py-2 text-sm`}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onSeeReport}
            className={`${btn} px-3 py-2 text-sm`}
          >
            See report
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductStatCards() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {statCardConfigs.map((card) => (
        <div
          key={card.key}
          className={`overflow-hidden rounded-[4px] border bg-white ${statCardTone[card.tone].card}`}
        >
          <div className={`flex items-center justify-between px-3 py-2 ${statCardTone[card.tone].header}`}>
            <span className="text-[12px] font-bold text-slate-900">{card.label}</span>
            <Link
              to={card.report}
              title="View report"
              className="cursor-pointer text-slate-400 hover:text-slate-700"
            >
              <ArrowSquareOut size={14} weight="bold" />
            </Link>
          </div>
          <div className="px-3 py-2.5">
            <p className="text-[11px] text-slate-500">{card.sublabel ?? "Total product"}</p>
            <p className="mt-0.5 text-base font-bold text-slate-900">0</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCardsAndSubNav({ subTabs, activeSubTab, onSubTabChange }) {
  return (
    <div className="border-b border-gray-200 bg-slate-50 px-6 pt-5">
      <ProductStatCards />
      <p className="mt-3 text-xs text-slate-500">
        To show product summary, check Track stock for this item when adding new products
      </p>
      <div className="mt-5 flex gap-6">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSubTabChange(tab.key)}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeSubTab === tab.key
                ? "border-brand text-brand"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const productColumnsDefault = [
  { key: "totalProductInWarehouse", label: "Total product in warehouse", checked: false, hasLink: true },
  { key: "productImage", label: "Product image", checked: true },
  { key: "productName", label: "Product name", checked: true, disabled: true },
  { key: "productCode", label: "Product code", checked: true },
  { key: "barcode", label: "Barcode", checked: true },
  { key: "productCategory", label: "Product category", checked: true },
  { key: "totalStock", label: "Total stock", checked: true },
  { key: "availableQty", label: "Available qty", checked: true },
  { key: "minimumStock", label: "Minimum stock", checked: true },
  { key: "unit", label: "Unit", checked: true },
  { key: "lastBuyPrice", label: "Last buy price", checked: true },
  { key: "buyPrice", label: "Buy price", checked: true },
  { key: "sellPrice", label: "Sell price", checked: true },
];

function ColumnSelectorDropdown() {
  const [open, setOpen] = useState(false);
  const [showWarehousePopup, setShowWarehousePopup] = useState(false);
  const [columns, setColumns] = useState(productColumnsDefault);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(containerRef, () => setOpen(false));

  function toggleColumn(key) {
    if (key === "totalProductInWarehouse") {
      setOpen(false);
      setShowWarehousePopup(true);
      return;
    }
    setColumns((prev) =>
      prev.map((col) => (col.key === key && !col.disabled ? { ...col, checked: !col.checked } : col))
    );
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button type="button" onClick={() => setOpen((prev) => !prev)} className={`${btn} px-2.5`}>
        <Columns size={16} weight="bold" />
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          <div className="max-h-72 overflow-y-auto px-1">
            {columns.map((col) => (
              <label
                key={col.key}
                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                  col.disabled
                    ? "cursor-not-allowed text-slate-400"
                    : "cursor-pointer text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={col.checked}
                  disabled={col.disabled}
                  onChange={() => toggleColumn(col.key)}
                  className="h-4 w-4 accent-brand disabled:cursor-not-allowed"
                />
                <span className="flex-1">{col.label}</span>
                {col.hasLink && <ArrowSquareOut size={14} weight="bold" className="text-slate-400" />}
              </label>
            ))}
          </div>
        </div>
      )}
      {showWarehousePopup && (
        <WarehouseInfoPopover
          onClose={() => setShowWarehousePopup(false)}
          onSeeReport={() => {
            setShowWarehousePopup(false);
            navigate("/reports/warehouse_stock_quantity");
          }}
        />
      )}
    </div>
  );
}

function ManageCategoryModal({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  function handleAddCategory() {
    setIsAdding(true);
    setNewCategoryName("");
  }

  function handleSaveCategory() {
    if (!newCategoryName.trim()) return;
    setCategories((prev) => [...prev, { id: `cat-${Date.now()}`, name: newCategoryName.trim() }]);
    setIsAdding(false);
    setNewCategoryName("");
  }

  function handleDeleteCategory(id) {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h2 className={modalTitle}>Manage product category</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search category"
                className={`${inputBase} pl-9`}
              />
            </div>
            <button type="button" onClick={handleAddCategory} className={btnSecondary}>
              Add category
            </button>
          </div>

          {isAdding && (
            <div className="mb-4 flex items-center gap-2.5">
              <input
                type="text"
                autoFocus
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                className={`${inputBase} flex-1`}
              />
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="cursor-pointer whitespace-nowrap text-[13px] font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="cursor-pointer whitespace-nowrap text-[13px] font-semibold text-brand hover:text-brand-dark"
              >
                Save
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Tray size={48} weight="fill" className="text-brand" />
              <p className="mt-3 text-sm font-semibold text-slate-800">No category yet</p>
              <p className="mt-1 text-sm text-slate-500">Product category will appear here.</p>
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto">
              {filtered.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span>{category.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="cursor-pointer text-slate-400 hover:text-red-500"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
          <button type="button" onClick={onClose} className={btnModalSubmit}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductActionsMenu({ onSelect }) {
  return (
    <Dropdown
      align="right"
      trigger={({ toggle }) => (
        <button type="button" onClick={toggle} className={btnPrimary}>
          Actions
          <CaretDown size={14} weight="bold" />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Product
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect("addProduct");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Add new product
          </button>

          <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Warehouse
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect("addWarehouse");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Add new warehouse
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect("adjustStock");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Adjust stock (stock opname)
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect("transferWarehouse");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Transfer warehouse
          </button>

          <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Price rule
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect("createPriceRule");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Create new price rule
          </button>
        </>
      )}
    </Dropdown>
  );
}

function ProductHeader({ mainTab, onMainTabChange, onAction }) {
  const mainTabs = [
    { key: "goods", label: "Goods & services" },
    { key: "warehouses", label: "Warehouses" },
    { key: "priceRules", label: "Price rules" },
  ];

  return (
    <div className="border-b border-gray-200 bg-slate-50 px-6 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-slate-900">Product</h1>
        <ProductActionsMenu onSelect={onAction} />
      </div>
      <div id="product-main-tabs" className="mt-4 flex gap-6">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            id={`header-${tab.key}`}
            type="button"
            onClick={() => onMainTabChange(tab.key)}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors ${
              mainTab === tab.key
                ? "border-brand text-brand"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ImportDropdown({ onSelect }) {
  return (
    <Dropdown
      trigger={({ toggle }) => (
        <button type="button" onClick={toggle} className={`${btn} text-brand`}>
          Import
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Single
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect("importNewProducts");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Import new products
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect("updateImportProducts");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Update & import products
          </button>

          <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Bundle
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect("importNewBundles");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Import new bundles
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect("updateImportBundles");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Update & import bundles
          </button>
        </>
      )}
    </Dropdown>
  );
}

const exportAllProductsFields = [
  { key: "name", label: "Product name", defaultChecked: true, disabled: true },
  { key: "buyPrice", label: "Buy price", defaultChecked: true },
  { key: "buyTax", label: "Buy tax" },
  { key: "description", label: "Description" },
  { key: "sellPrice", label: "Sell price", defaultChecked: true },
  { key: "sellTax", label: "Sell tax" },
  { key: "code", label: "Product code", defaultChecked: true },
  { key: "barcode", label: "Barcode" },
  { key: "minimumLimit", label: "Minimum limit", defaultChecked: true },
  { key: "buyAccount", label: "Purchase account" },
  { key: "totalStock", label: "Total stock", defaultChecked: true },
  { key: "unit", label: "Unit", defaultChecked: true },
  { key: "sellAccount", label: "Sales account" },
  { key: "category", label: "Product category", defaultChecked: true },
  { key: "ignoreOutOfStock", label: "Exclude out-of-stock products" },
];

function ExportAllProductsModal({ onClose }) {
  const [checked, setChecked] = useState(() =>
    exportAllProductsFields.filter((f) => f.defaultChecked).map((f) => f.key)
  );

  function toggle(key, disabled) {
    if (disabled) return;
    setChecked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const allChecked = checked.length === exportAllProductsFields.length;

  function toggleAll() {
    setChecked(allChecked ? [] : exportAllProductsFields.map((f) => f.key));
  }

  function handleExport() {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: "Your file is being processed.",
          description: "Check the export list to download it.",
        },
      })
    );
    onClose();
  }

  return (
    <Drawer
      title="Export all products"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleExport} className={btnModalSubmit}>
            Export
          </button>
        </>
      }
    >
      <p className="mb-4 text-[13px] text-slate-500">
        Select the information you want to export.
      </p>
      <label className="flex cursor-pointer items-center gap-2.5 border-b border-gray-100 pb-3 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          className="h-4 w-4 accent-brand"
        />
        All information
      </label>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {exportAllProductsFields.map((field) => (
          <label
            key={field.key}
            className={`flex items-center gap-2.5 text-[13px] text-slate-700 ${
              field.disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={checked.includes(field.key)}
              onChange={() => toggle(field.key, field.disabled)}
              disabled={field.disabled}
              className="h-4 w-4 accent-brand"
            />
            {field.label}
          </label>
        ))}
      </div>
    </Drawer>
  );
}

function ExportDropdown() {
  const [showAllProducts, setShowAllProducts] = useState(false);

  function exportBundles() {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: "Your file is being processed.",
          description: "Check the export list to download it.",
        },
      })
    );
  }

  return (
    <>
      <Dropdown
        trigger={({ toggle }) => (
          <button type="button" onClick={toggle} className={`${btn} text-brand`}>
            Export
          </button>
        )}
      >
        {({ close }) => (
          <>
            <button
              type="button"
              onClick={() => {
                close();
                setShowAllProducts(true);
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              All products
            </button>
            <button
              type="button"
              onClick={() => {
                close();
                exportBundles();
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              Product bundles &amp; composition
            </button>
          </>
        )}
      </Dropdown>
      {showAllProducts && <ExportAllProductsModal onClose={() => setShowAllProducts(false)} />}
    </>
  );
}

const productTypeFilterOptions = ["Single", "Bundle", "Track", "Non-track"];

function ProductTypeMultiSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  function toggleOption(option) {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  }

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1.5 pr-9`}
      >
        {value.length === 0 && <span className="text-slate-400">Select type</span>}
        {value.map((option) => (
          <span
            key={option}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-brand"
          >
            {option}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleOption(option);
              }}
              className="cursor-pointer"
            >
              <X size={10} weight="bold" />
            </button>
          </span>
        ))}
      </div>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-[21px] -translate-y-1/2 text-slate-400"
      />

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          {productTypeFilterOptions.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggleOption(option)}
                className="h-4 w-4 accent-brand"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductListFilterDrawer({ onClose, onApply, onReset }) {
  const [keyword, setKeyword] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [inclusionMode, setInclusionMode] = useState("includeAll");
  const [category, setCategory] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  function handleReset() {
    setKeyword("");
    setProductTypes([]);
    setInclusionMode("includeAll");
    setCategory("");
    setShowArchived(false);
    onReset?.();
  }

  function handleApply() {
    onApply?.({ keyword, productTypes, inclusionMode, category, showArchived });
  }

  return (
    <Drawer
      title="Filter"
      onClose={onClose}
      footer={<FilterFooter onReset={handleReset} onApply={handleApply} />}
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Keyword</label>
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className={inputBase}
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Product type</label>
        <ProductTypeMultiSelect value={productTypes} onChange={setProductTypes} />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Product category</label>
        <OptionSelect value={category} onChange={setCategory} options={[]} placeholder="Select category" />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={() => setShowArchived((prev) => !prev)}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Show archived
      </label>
    </Drawer>
  );
}

function DateRangeFields({ startDate, endDate, onStartDateChange, onEndDateChange, required }) {
  return (
    <div className="mb-4 flex gap-4">
      <div className="flex-1">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
          From {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className={inputBase}
        />
      </div>
      <div className="flex-1">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
          To {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className={inputBase}
        />
      </div>
    </div>
  );
}

function StockAdjustmentFilterDrawer({ onClose, onApply, onReset }) {
  const [transactionNo, setTransactionNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [adjustmentCategories, setAdjustmentCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tags, setTags] = useState([]);
  const [inclusionMode, setInclusionMode] = useState("includeAll");

  function handleReset() {
    setTransactionNo("");
    setStartDate("");
    setEndDate("");
    setAdjustmentTypes([]);
    setAdjustmentCategories([]);
    setWarehouses([]);
    setTags([]);
    setInclusionMode("includeAll");
    onReset?.();
  }

  function handleApply() {
    onApply?.({
      transactionNo,
      startDate,
      endDate,
      adjustmentTypes,
      adjustmentCategories,
      warehouses,
      tags,
      inclusionMode,
    });
  }

  return (
    <Drawer
      title="Filter"
      onClose={onClose}
      footer={<FilterFooter onReset={handleReset} onApply={handleApply} />}
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Transaction no.</label>
        <input
          type="text"
          value={transactionNo}
          onChange={(event) => setTransactionNo(event.target.value)}
          className={inputBase}
        />
      </div>

      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        required
      />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Adjustment type</label>
        <MultiSelect
          selected={adjustmentTypes}
          onToggle={(option) =>
            setAdjustmentTypes((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Stock count", "In/out stock"]}
          placeholder="Select type"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Adjustment category</label>
        <MultiSelect
          selected={adjustmentCategories}
          onToggle={(option) =>
            setAdjustmentCategories((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["General", "Damaged goods", "Production", "Opening quantity"]}
          placeholder="Select category"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Warehouse</label>
        <MultiSelect
          selected={warehouses}
          onToggle={(option) =>
            setWarehouses((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Unassigned"]}
          placeholder=""
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tags</label>
        <MultiSelect
          selected={tags}
          onToggle={(option) =>
            setTags((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={[]}
          placeholder=""
        />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />
    </Drawer>
  );
}

function GoodsRequireApprovalFilterDrawer({ onClose, onApply, onReset }) {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tags, setTags] = useState([]);
  const [inclusionMode, setInclusionMode] = useState("includeAll");

  function handleReset() {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setTransactionTypes([]);
    setWarehouses([]);
    setTags([]);
    setInclusionMode("includeAll");
    onReset?.();
  }

  function handleApply() {
    onApply?.({
      keyword,
      startDate,
      endDate,
      transactionTypes,
      warehouses,
      tags,
      inclusionMode,
    });
  }

  return (
    <Drawer
      title="Filter"
      onClose={onClose}
      footer={<FilterFooter onReset={handleReset} onApply={handleApply} />}
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Keyword</label>
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className={inputBase}
        />
      </div>

      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Transaction type</label>
        <MultiSelect
          selected={transactionTypes}
          onToggle={(option) =>
            setTransactionTypes((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Stock count", "Product conversion", "In/out stock"]}
          placeholder="Select type"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Warehouse</label>
        <MultiSelect
          selected={warehouses}
          onToggle={(option) =>
            setWarehouses((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Unassigned"]}
          placeholder=""
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tags</label>
        <MultiSelect
          selected={tags}
          onToggle={(option) =>
            setTags((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={[]}
          placeholder=""
        />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />
    </Drawer>
  );
}

function StockAdjustmentExportModal({ onClose }) {
  const [transactionNo, setTransactionNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [adjustmentCategories, setAdjustmentCategories] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [tags, setTags] = useState("");
  const [inclusionMode, setInclusionMode] = useState("includeAll");
  const [fileFormat, setFileFormat] = useState("xlsx");

  return (
    <Drawer
      title="Export stock adjustment"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Reset
          </button>
          <button type="button" onClick={onClose} className={btnModalSubmit}>
            Export
          </button>
        </>
      }
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Transaction no.</label>
        <input
          type="text"
          value={transactionNo}
          onChange={(event) => setTransactionNo(event.target.value)}
          className={inputBase}
        />
      </div>

      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        required
      />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Adjustment type</label>
        <MultiSelect
          selected={adjustmentTypes}
          onToggle={(option) =>
            setAdjustmentTypes((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Stock count", "In/out stock"]}
          placeholder="Select type"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Adjustment category</label>
        <MultiSelect
          selected={adjustmentCategories}
          onToggle={(option) =>
            setAdjustmentCategories((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["General", "Damaged goods", "Production", "Opening quantity"]}
          placeholder="Select category"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Warehouse</label>
        <OptionSelect value={warehouse} onChange={setWarehouse} options={["Unassigned"]} placeholder="" />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tags</label>
        <OptionSelect
          value={tags}
          onChange={setTags}
          options={[]}
          placeholder=""
        />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />

      <div>
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">File format</label>
        <div className="flex items-center gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
            <input
              type="radio"
              name="export-format"
              checked={fileFormat === "xlsx"}
              onChange={() => setFileFormat("xlsx")}
              className="h-4 w-4 accent-brand"
            />
            XLSX
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
            <input
              type="radio"
              name="export-format"
              checked={fileFormat === "csv"}
              onChange={() => setFileFormat("csv")}
              className="h-4 w-4 accent-brand"
            />
            CSV
          </label>
        </div>
      </div>
    </Drawer>
  );
}

function ProductListPanel({ onOpenCategoryModal, onAction }) {
  const [search, setSearch] = useState("");
  const [products] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ColumnSelectorDropdown />
          <button type="button" onClick={onOpenCategoryModal} className={btnSecondary}>
            Manage product category
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <ImportDropdown onSelect={onAction} />
          <ExportDropdown />
          <SearchInput value={search} onChange={setSearch} placeholder="Search product" />
          <button type="button" onClick={() => setShowFilter(true)} className={`${btn} text-brand`}>
            <Funnel size={14} weight="bold" />
            Filter
          </button>
        </div>
      </div>

      {products.length === 0 && (
        <EmptyStateFolder
          title="Product list will show up here"
          description={
            <>
              Add the new product from <span className="font-semibold text-slate-700">Actions</span> button.
            </>
          }
        />
      )}

      {showFilter && (
        <ProductListFilterDrawer
          onClose={() => setShowFilter(false)}
          onApply={() => setShowFilter(false)}
          onReset={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}

function StockAdjustmentListPanel() {
  const [search, setSearch] = useState("");
  const [adjustments] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setShowExport(true)}
          className={`${btn} text-brand`}
        >
          Export
        </button>
        <SearchInput value={search} onChange={setSearch} placeholder="Search transaction" />
        <button type="button" onClick={() => setShowFilter(true)} className={`${btn} text-brand`}>
          <Funnel size={14} weight="bold" />
          Filter
        </button>
      </div>

      {adjustments.length === 0 && (
        <EmptyStateFolder
          title="Stock adjustment list will show up here"
          description={
            <>
              Record stock adjustment from <span className="font-semibold text-slate-700">Actions</span> button.
            </>
          }
        />
      )}

      {showFilter && (
        <StockAdjustmentFilterDrawer
          onClose={() => setShowFilter(false)}
          onApply={() => setShowFilter(false)}
          onReset={() => setShowFilter(false)}
        />
      )}

      {showExport && <StockAdjustmentExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}

function GoodsRequireApprovalPanel() {
  const [search, setSearch] = useState("");
  const [transactions] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search transaction" />
        <button type="button" onClick={() => setShowFilter(true)} className={`${btn} text-brand`}>
          <Funnel size={14} weight="bold" />
          Filter
        </button>
      </div>

      {transactions.length === 0 && (
        <EmptyStateFolder
          title="No transactions yet"
          description="Transactions that require approval will show up here."
        />
      )}

      {showFilter && (
        <GoodsRequireApprovalFilterDrawer
          onClose={() => setShowFilter(false)}
          onApply={() => setShowFilter(false)}
          onReset={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}

function GoodsServicesTab({ activeSubTab, onSubTabChange, onOpenCategoryModal, onAction }) {
  const subTabs = [
    { key: "productList", label: "Product list" },
    { key: "stockAdjustmentList", label: "Stock adjustment list" },
    { key: "requireApproval", label: "Require approval" },
  ];

  return (
    <div>
      <StatCardsAndSubNav subTabs={subTabs} activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />
      {activeSubTab === "productList" && (
        <ProductListPanel onOpenCategoryModal={onOpenCategoryModal} onAction={onAction} />
      )}
      {activeSubTab === "stockAdjustmentList" && <StockAdjustmentListPanel />}
      {activeSubTab === "requireApproval" && <GoodsRequireApprovalPanel />}
    </div>
  );
}

function WarehouseListPanel() {
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [warehouses] = useState([]);
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span
            role="switch"
            aria-checked={showInactive}
            onClick={() => setShowInactive((prev) => !prev)}
            className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
              showInactive ? "bg-brand" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                showInactive ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
          Show inactive warehouses
        </label>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className={`${btn} text-brand`}
          >
            Import
          </button>
          <SearchInput value={search} onChange={setSearch} placeholder="Search warehouse" />
        </div>
      </div>

      {warehouses.length === 0 && (
        <EmptyStateFolder
          title="Warehouse list will show up here"
          description={
            <>
              Add the new warehouse from <span className="font-semibold text-slate-700">Actions</span> button.
            </>
          }
        />
      )}

      {showImport && (
        <ImportProductModal title="Import warehouses" onClose={() => setShowImport(false)} />
      )}
    </div>
  );
}

function WarehouseTransferListPanel() {
  const [search, setSearch] = useState("");
  const [transfers] = useState([]);
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className={`${btn} text-brand`}
        >
          Import
        </button>
        <SearchInput value={search} onChange={setSearch} placeholder="Search transaction" />
      </div>

      {transfers.length === 0 && (
        <EmptyStateFolder
          title="Warehouse transfer list will show up here"
          description={
            <>
              Transfer the warehouse from <span className="font-semibold text-slate-700">Actions</span> button.
            </>
          }
        />
      )}

      {showImport && (
        <ImportProductModal
          title="Import warehouse transfer data"
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

function WarehouseRequireApprovalPanel() {
  const [search, setSearch] = useState("");
  const [transactions] = useState([]);
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className={`${btn} text-brand`}
        >
          Import
        </button>
        <SearchInput value={search} onChange={setSearch} placeholder="Search transaction" />
      </div>

      {transactions.length === 0 && (
        <EmptyStateFolder
          title="Warehouse transfer list will show up here"
          description="Transactions that require approval will show up here."
        />
      )}

      {showImport && (
        <ImportProductModal
          title="Import warehouse transfer data"
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

function WarehousesTab({ activeSubTab, onSubTabChange }) {
  const subTabs = [
    { key: "warehouseList", label: "Warehouse list" },
    { key: "warehouseTransferList", label: "Warehouse transfer list" },
    { key: "requireApproval", label: "Require approval" },
  ];

  return (
    <div>
      <StatCardsAndSubNav subTabs={subTabs} activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />
      {activeSubTab === "warehouseList" && <WarehouseListPanel />}
      {activeSubTab === "warehouseTransferList" && <WarehouseTransferListPanel />}
      {activeSubTab === "requireApproval" && <WarehouseRequireApprovalPanel />}
    </div>
  );
}

function PriceRulesTab({ onAction }) {
  const [priceRules] = useState([]);

  return (
    <div className="p-6">
      {priceRules.length === 0 && (
        <EmptyStateFolder
          title="Your price rule list will appear here"
          description={
            <>
              Create new price rule from the <span className="font-semibold text-slate-700">Actions</span> button.
            </>
          }
        />
      )}
    </div>
  );
}

function ActionPageShell({ title, subtitle, children, footer, onBack, maxWidth = "max-w-[1024px]" }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="mx-auto flex max-w-[1024px] items-start justify-between">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-1.5 flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-slate-500 hover:text-slate-800"
              >
                <CaretLeft size={14} weight="bold" />
                {subtitle}
              </button>
            )}
            <h1 className="text-[22px] font-bold text-slate-900">{title}</h1>
          </div>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className={`mx-auto ${maxWidth}`}>{children}</div>
      </div>
      {footer && (
        <div className="mt-6 border-t border-gray-200 px-6 py-4">
          <div className={`mx-auto flex max-w-[1024px] items-center justify-end gap-2.5`}>{footer}</div>
        </div>
      )}
    </div>
  );
}

function FormModalShell({ title, subtitle, onClose, children, footer, maxWidth = "max-w-[640px]" }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className={`flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]`}>
        <div className={modalHeader}>
          <div>
            <h2 className={modalTitle}>{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
function CheckboxField({ checked, onChange, label, description, disabled }) {
  return (
    <label className={`flex items-start gap-2.5 py-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(!checked)}
        className="mt-0.5 h-4 w-4 accent-brand disabled:cursor-not-allowed"
      />
      <span>
        <span className={`block text-sm font-semibold ${disabled ? "text-slate-400" : "text-slate-800"}`}>
          {label}
        </span>
        {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
      </span>
    </label>
  );
}



const inventoryTrackingOptions = [
  {
    key: "tracked",
    label: "Track",
    description: "The system will record the inventory value & product qty for all tracking types",
    bundleDescription: "The system will record the inventory value & qty of the bundle product and its components",
  },
  {
    key: "no_tracking",
    label: "Untrack",
    description: "The system will not record the inventory value & product qty",
    bundleDescription: "The system will not record the inventory value & qty of the bundle product",
  },
];

const trackModeOptions = [
  { key: "no_tracking", label: "Track qty only" },
  { key: "batch", label: "Track by batch" },
  { key: "serial_number", label: "Track by serial number" },
];

function AddProductPage({ onBack }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("Single");
  const [inventoryTracking, setInventoryTracking] = useState("tracked");
  const [trackMode, setTrackMode] = useState("no_tracking");
  const [buyChecked, setBuyChecked] = useState(true);
  const [sellChecked, setSellChecked] = useState(true);
  const [buyPrice, setBuyPrice] = useState("0");
  const [sellPrice, setSellPrice] = useState("0");
  const [buyAccount, setBuyAccount] = useState("5-50000 - Cost of Sales");
  const [sellAccount, setSellAccount] = useState("4-40000 - Service Revenue");
  const [buyTax, setBuyTax] = useState("");
  const [sellTax, setSellTax] = useState("");
  const [minimumStock, setMinimumStock] = useState("0");
  const [inventoryAccount, setInventoryAccount] = useState("1-10200 - Inventory");
  const [productImage, setProductImage] = useState(null);
  const fileInputRef = useRef(null);
  const [bundleComponents, setBundleComponents] = useState([
    { product: "", account: "" },
  ]);

  const isBundle = productType === "Bundle";

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (productImage) URL.revokeObjectURL(productImage);
    setProductImage(URL.createObjectURL(file));
  }

  function handleReplaceImage() {
    fileInputRef.current?.click();
  }

  function handleSave() {
    onBack();
  }

  return (
    <ActionPageShell
      title="Add new product"
      subtitle="Product list"
      onBack={onBack}
      footer={
        <>
          <button type="button" onClick={onBack} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} className={btnModalSubmit}>
            Save
          </button>
          <button type="button" onClick={handleSave} className={btnModalSubmit}>
            Save &amp; add new
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <label className={formLabel}>
            Product name <span className={formRequiredMark}>*</span>
          </label>
          <input
            type="text"
            maxLength={255}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputBase}
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{name.length} / 255</p>
        </div>
        <div className="row-span-3">
          <label className={formLabel}>Product image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
            className="hidden"
          />
          {productImage ? (
            <div className="group relative h-[200px] w-[200px] overflow-hidden rounded-lg border border-gray-200">
              <img
                src={productImage}
                alt="Product"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 hidden items-center justify-center bg-slate-900/40 group-hover:flex">
                <button
                  type="button"
                  onClick={handleReplaceImage}
                  className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-800 shadow"
                >
                  <PencilSimple size={13} weight="bold" />
                  Change
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[200px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-slate-50 text-slate-400 hover:bg-slate-100"
            >
              <ImageIcon size={28} weight="bold" />
              <span className="text-[11px] font-medium">Select product image</span>
            </button>
          )}
          <p className="mt-1.5 text-[11px] text-slate-400">JPG or PNG file (max. 5 MB)</p>
        </div>
        <div>
          <label className={formLabel}>Product code / SKU</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className={formLabel}>Barcode</label>
          <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className={formLabel}>
            Unit <span className={formRequiredMark}>*</span>
          </label>
          <OptionSelect
            value={unit}
            onChange={setUnit}
            options={productUnitOptions.map((u) => u.value)}
            placeholder="Select or enter unit"
          />
        </div>
        <div>
          <label className={formLabel}>Product category</label>
          <CategoryInput
            value={category}
            onChange={setCategory}
            options={productCategoryOptions.map((c) => c.name)}
            placeholder="Select or enter product category"
          />
        </div>
        <div className="col-span-2">
          <label className={formLabel}>Description</label>
          <textarea
            maxLength={6000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${textareaBase} min-h-[80px]`}
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{description.length}/6000</p>
        </div>
        <div className="col-span-2">
          <label className={formLabel}>
            Product type <span className={formRequiredMark}>*</span>
          </label>
          <OptionSelect
            value={productType}
            onChange={setProductType}
            options={["Single", "Bundle"]}
            placeholder="Select product type"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className={formLabel}>
          Inventory tracking <span className={formRequiredMark}>*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {inventoryTrackingOptions.map((opt) => (
            <label
              key={opt.key}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 ${
                isBundle ? "border-gray-200 bg-slate-50/60" : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="inv-tracking"
                checked={inventoryTracking === opt.key}
                onChange={() => setInventoryTracking(opt.key)}
                className="mt-0.5 h-4 w-4 accent-brand"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">{opt.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {isBundle ? opt.bundleDescription : opt.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {inventoryTracking === "tracked" && (
        <div className="mt-5 rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className={formLabel}>Minimum stock</label>
              <input
                type="number"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className={formLabel}>Default inventory account</label>
              <OptionSelect
                value={inventoryAccount}
                onChange={setInventoryAccount}
                options={inventoryAccountOptions.map((a) => `${a.number} - ${a.name}`)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={formLabel}>Track by</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {trackModeOptions.map((mode) => (
                <label
                  key={mode.key}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name="track-mode"
                    checked={trackMode === mode.key}
                    onChange={() => setTrackMode(mode.key)}
                    className="h-4 w-4 accent-brand"
                  />
                  {mode.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {isBundle && (
        <div className="mt-5">
          <label className={formLabel}>
            Bundle components <span className={formRequiredMark}>*</span>
          </label>
          <p className="mb-2 text-xs text-slate-500">
            Bundle components must consist of products tracked by qty.
          </p>
          <div className="rounded-lg border border-gray-200">
            <div className="grid grid-cols-12 gap-2 border-b border-gray-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span className="col-span-5">Product name</span>
              <span className="col-span-2">Qty</span>
              <span className="col-span-1">Unit</span>
              <span className="col-span-3">Price</span>
              <span className="col-span-1" />
            </div>
            {bundleComponents.map((comp, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center gap-2 border-b border-gray-100 px-4 py-3 last:border-b-0">
                <div className="col-span-5">
                  <SearchSelect
                    value={comp.product}
                    onChange={(v) =>
                      setBundleComponents((prev) =>
                        prev.map((c, i) => (i === idx ? { ...c, product: v } : c))
                      )
                    }
                    options={[]}
                    placeholder="Select product"
                  />
                </div>
                <div className="col-span-2" />
                <div className="col-span-1" />
                <div className="col-span-3" />
                <div className="col-span-1 flex justify-end">
                  {bundleComponents.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setBundleComponents((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="cursor-pointer text-slate-400 hover:text-red-500"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="border-b border-gray-100 px-4 py-3">
              <button
                type="button"
                onClick={() =>
                  setBundleComponents((prev) => [
                    ...prev,
                    { product: "", account: "" },
                  ])
                }
                className="cursor-pointer text-[13px] font-semibold text-brand hover:text-brand-dark"
              >
                + Add component
              </button>
            </div>
            <div className="px-4 py-3">
              <label className={formLabel}>Additional cost account for bundle components</label>
              <OptionSelect
                value={bundleComponents[0].account}
                onChange={(v) =>
                  setBundleComponents((prev) => prev.map((c) => ({ ...c, account: v })))
                }
                options={buyAccountOptions.map((a) => `${a.number} - ${a.name}`)}
                placeholder="Select account"
              />
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <span className="text-sm font-semibold text-slate-800">Total price</span>
              <span className="text-sm font-semibold text-slate-900">Rp0,00</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 pt-5">
        <p className="mb-3 text-[13px] font-semibold text-slate-800">Price &amp; inventory</p>
        {!isBundle && (
          <>
            <CheckboxField
              checked={buyChecked}
              onChange={setBuyChecked}
              label="I buy this product"
            />
            {buyChecked && (
              <div className="mb-4 ml-6 grid grid-cols-3 gap-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <label className={formLabel}>Buy price per unit</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
                <div>
                  <label className={formLabel}>Purchase account</label>
                  <OptionSelect
                    value={buyAccount}
                    onChange={setBuyAccount}
                    options={buyAccountOptions.map((a) => `${a.number} - ${a.name}`)}
                    placeholder="Select purchase account"
                  />
                </div>
                <div>
                  <label className={formLabel}>Purchase tax</label>
                  <OptionSelect
                    value={buyTax}
                    onChange={setBuyTax}
                    options={productTaxOptions.map((t) => t.value)}
                    placeholder="Select tax"
                  />
                </div>
              </div>
            )}
          </>
        )}
        <CheckboxField
          checked={sellChecked}
          onChange={setSellChecked}
          label="I sell this product"
        />
        {sellChecked && (
          <div className="mb-4 ml-6 grid grid-cols-3 gap-4 rounded-lg border border-gray-200 p-4">
            <div>
              <label className={formLabel}>Sell price per unit</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-500">Rp</span>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
            <div>
              <label className={formLabel}>Sales account</label>
              <OptionSelect
                value={sellAccount}
                onChange={setSellAccount}
                options={sellAccountOptions.map((a) => `${a.number} - ${a.name}`)}
                placeholder="Select sales account"
              />
            </div>
            <div>
              <label className={formLabel}>Sales tax</label>
              <OptionSelect
                value={sellTax}
                onChange={setSellTax}
                options={productTaxOptions.map((t) => t.value)}
                placeholder="Select tax"
              />
            </div>
          </div>
        )}
        <p className="text-xs text-slate-400">
          Need a discount account?{" "}
          <button
            type="button"
            onClick={() => navigate("/sales", { state: { defaultTab: "formSetting" } })}
            className="font-semibold text-brand hover:text-brand-dark"
          >
            Enable it now
          </button>
        </p>
      </div>
    </ActionPageShell>
  );
}

function AddWarehousePage({ onBack }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pic, setPic] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  return (
    <ActionPageShell
      title="Add new warehouse"
      subtitle="Warehouse list"
      onBack={onBack}
      footer={
        <>
          <button type="button" onClick={onBack} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={onBack} className={btnModalSubmit}>
            Save
          </button>
        </>
      }
    >
      <div className="max-w-[720px] space-y-4">
        <div>
          <label className={formLabel}>
            Warehouse name <span className={formRequiredMark}>*</span>
          </label>
          <input
            type="text"
            maxLength={255}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputBase}
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{name.length}/255</p>
        </div>
        <div>
          <label className={formLabel}>Warehouse code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className={formLabel}>Person in charge ({pic ? 1 : 0}/5)</label>
          <OptionSelect value={pic} onChange={setPic} options={[]} placeholder="Select person in charge" />
          <p className="mt-1.5 text-xs text-slate-500">
            Selected users will receive email reminders for products that have reached the minimum stock
            limit, as well as batches that are about to expire or have expired
          </p>
        </div>
        <div>
          <label className={formLabel}>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className={formLabel}>Notes</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${textareaBase} min-h-[70px]`}
          />
        </div>
      </div>
    </ActionPageShell>
  );
}

function AdjustStockImportDrawer({ onClose }) {
  const [fileName, setFileName] = useState("");
  const [showConditions, setShowConditions] = useState(false);

  return (
    <Drawer
      title="Import stock data"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => fileName && onClose()}
            disabled={!fileName}
            className={btnModalSubmit}
          >
            Continue
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            1
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Download the template file</p>
            <p className="mt-1 text-xs text-slate-500">
              To import data correctly, avoid using templates other than the ones provided.
              This template file has been aligned with the system requirements.
            </p>
            <button type="button" className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark">
              Download file template
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            2
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Fill in the data in the template file</p>
            <p className="mt-1 text-xs text-slate-500">
              Make sure the data you fill in matches the filling conditions. Please do not edit
              or change the columns to avoid data import issues.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Need an example or a filling tutorial?{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark">
                See example
              </button>{" "}
              or{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark">
                learn the tutorial
              </button>
            </p>
            <button
              type="button"
              onClick={() => setShowConditions((prev) => !prev)}
              className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark"
            >
              {showConditions ? "Hide" : "Show"} filling conditions
            </button>
            {showConditions && (
              <div className="mt-3 space-y-2 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Filling conditions</p>
                <p>Date format is dd/mm/yyyy (day/month/year)</p>
                <p>Maximum transaction row is 1.000 rows</p>
                <p>For thousands, no comma or period needed</p>
                <p>To separate decimals, use a period</p>
                <p>No need to enter currency symbols (Rp, $, etc.)</p>
                <p className="font-semibold text-slate-800">Filling tips</p>
                <p>
                  If you fill in number data with Microsoft Excel, add a (`) sign before the
                  numbers. Example: `6-6003 or `11-02-2016
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            3
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Upload the template file</p>
            <p className="mt-1 text-xs text-slate-500">
              You can upload the previously filled template file without changing its format
              (.csv). If you need to change it, please use .xls or .xlsx
            </p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Choose file
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </label>
            <span className="ml-2 text-xs text-slate-500">{fileName || "No file selected"}</span>
            <p className="mt-2 text-xs text-slate-500">
              Make sure the products you have updated are available
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function AdjustStockSetupPage({ onBack }) {
  const [adjustmentType, setAdjustmentType] = useState("stock_count");
  const [category, setCategory] = useState("General");
  const [account, setAccount] = useState("8-80100 - Inventory Adjustment");
  const [date, setDate] = useState("2026-09-28");
  const [warehouse, setWarehouse] = useState("Unassigned");
  const [showImport, setShowImport] = useState(false);

  const defaultAccountByCategory = {
    General: "8-80100 - Inventory Adjustment",
    "Damaged goods": "6-60216 - Damaged Goods Expense",
    Production: "5-50500 - Production Cost",
    "Opening quantity": "1-10200 - Inventory",
  };

  function handleChangeCategory(value) {
    setCategory(value);
    setAccount(defaultAccountByCategory[value]);
  }

  return (
    <ActionPageShell
      title="Stock adjustment setup"
      subtitle="Stock adjustment list"
      onBack={onBack}
      footer={
        <>
          <button type="button" onClick={onBack} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={onBack} className={btnModalSubmit}>
            Continue
          </button>
        </>
      }
    >
      <div className="max-w-[720px]">
        <div className="mb-4">
          <label className={formLabel}>Adjustment type</label>
          <div className="flex gap-3">
            <label
              className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm font-semibold transition-colors ${
                adjustmentType === "stock_count"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-gray-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="adjustment-type"
                checked={adjustmentType === "stock_count"}
                onChange={() => setAdjustmentType("stock_count")}
                className="h-4 w-4 accent-brand"
              />
              Stock count
            </label>
            <label
              className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm font-semibold transition-colors ${
                adjustmentType === "in_out"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-gray-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="adjustment-type"
                checked={adjustmentType === "in_out"}
                onChange={() => setAdjustmentType("in_out")}
                className="h-4 w-4 accent-brand"
              />
              In/out stock
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className={formLabel}>Adjustment category</label>
            <OptionSelect
              value={category}
              onChange={handleChangeCategory}
              options={["General", "Damaged goods", "Production", "Opening quantity"]}
            />
          </div>
          <div>
            <label className={formLabel}>Account</label>
            <OptionSelect
              value={account}
              onChange={setAccount}
              options={stockAdjustmentAccountOptions.map(
                (a) => `${a.number} - ${a.name}`
              )}
            />
          </div>
          <div>
            <label className={formLabel}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className={formLabel}>Warehouse</label>
            <OptionSelect value={warehouse} onChange={setWarehouse} options={["Unassigned"]} />
          </div>
          <p className="text-xs text-slate-500">
            Need to adjust all at once?{" "}
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="font-semibold text-brand hover:text-brand-dark"
            >
              Import data
            </button>
          </p>
        </div>
      </div>
      {showImport && <AdjustStockImportDrawer onClose={() => setShowImport(false)} />}
    </ActionPageShell>
  );
}

function TransferWarehousePage({ onBack }) {
  const [transactionNo, setTransactionNo] = useState("");
  const [date, setDate] = useState("2026-09-28");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [memo, setMemo] = useState("");
  const [attachments, setAttachments] = useState([]);

  const productOptions = ["No products available"];

  function handleUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const accepted = files.filter((f) =>
      /\.(xlsx|xls|docx?|pdf|jpe?g|png|zip)$/i.test(f.name)
    );
    setAttachments((prev) => [
      ...prev,
      ...accepted.slice(0, Math.max(0, 5 - prev.length)).map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}`,
        name: f.name,
        size: f.size,
      })),
    ]);
    event.target.value = "";
  }

  function removeAttachment(id) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function formatSize(bytes) {
    return bytes < 1024 ? `${bytes} B` : `${Math.ceil(bytes / 1024)} KB`;
  }

  return (
    <ActionPageShell
      title="Transfer warehouse"
      subtitle="Warehouse transfer list"
      onBack={onBack}
      footer={
        <>
          <button type="button" onClick={onBack} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={onBack} className={btnModalSubmit}>
            Transfer
          </button>
        </>
      }
    >
      <div className="max-w-[960px]">
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className={formLabel}>
              Transaction no. <span className={formRequiredMark}>*</span>
            </label>
            <input
              type="text"
              value={transactionNo}
              onChange={(e) => setTransactionNo(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className={formLabel}>Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputBase} pr-9`}
              />
              <Calendar
                size={16}
                weight="regular"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
          <div>
            <label className={formLabel}>From warehouse</label>
            <OptionSelect value={fromWarehouse} onChange={setFromWarehouse} options={["Unassigned"]} placeholder="Select warehouse" />
          </div>
          <div>
            <label className={formLabel}>To warehouse</label>
            <OptionSelect value={toWarehouse} onChange={setToWarehouse} options={["Unassigned"]} placeholder="Select warehouse" />
          </div>
          <div className="col-span-2">
            <label className={formLabel}>Memo</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={`${textareaBase} min-h-[70px]`}
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {["Product name", "Warehouse", "Qty before", "Qty after", "Total transfer"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t border-gray-100 p-2">
                    <SearchSelect
                      value=""
                      onChange={() => {}}
                      options={productOptions}
                      placeholder="Select product"
                    />
                  </td>
                  <td className="border-t border-gray-100 p-2" />
                  <td className="border-t border-gray-100 p-2" />
                  <td className="border-t border-gray-100 p-2" />
                  <td className="border-t border-gray-100 p-2" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5">
          <p className={formLabel}>
            Attachment{attachments.length > 0 && ` (${attachments.length})`}
          </p>
          <div className="rounded-lg border border-dashed border-gray-300 bg-slate-50 px-4 py-6">
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <Tray size={24} weight="bold" className="text-slate-400" />
              <label className="cursor-pointer text-sm font-semibold text-brand hover:text-brand-dark">
                Choose file
                <input
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.docx,.doc,.pdf,.jpg,.jpeg,.png,.zip"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
              <p className="text-[11px] text-slate-400">or drag &amp; drop files here</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Files can be Excel, Word, PDF, JPG, PNG, or ZIP (maximum 5 files and 10 MB per file).
              </p>
            </div>
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <img src={emptyFolderImg} alt="" className="h-6 w-6 shrink-0 object-contain" />
                      {file.name}
                      <span className="text-[11px] text-slate-400">{formatSize(file.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.id)}
                      className="cursor-pointer text-slate-400 hover:text-red-500"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ActionPageShell>
  );
}

const priceRuleTypeGroups = [
  {
    group: "DISCOUNT",
    options: [
      "Percentage discount",
      "Fixed amount discount",
      "Tiered percentage discount",
      "Sales subtotal discount",
      "Final price discount",
    ],
  },
  {
    group: "MARKUP",
    options: ["Percentage markup", "Fixed amount markup"],
  },
];

function RulePeriodDateRange({ value, onChange }) {
  const [startDate, setStartDate] = useState(value.split(" - ")[0] || "");
  const [endDate, setEndDate] = useState(value.split(" - ")[1] || "");

  function formatDate(raw) {
    if (!raw) return "";
    const [year, month, day] = raw.split("-");
    return `${day}/${month}/${year}`;
  }

  function startChange(e) {
    setStartDate(e.target.value);
    onChange(`${formatDate(e.target.value)} - ${formatDate(endDate)}`);
  }

  function endChange(e) {
    setEndDate(e.target.value);
    onChange(`${formatDate(startDate)} - ${formatDate(e.target.value)}`);
  }

  return (
    <div className="flex">
      <div className="relative flex-1">
        <input
          type="date"
          value={startDate}
          onChange={startChange}
          className={`${inputBase} rounded-r-none`}
        />
        <Calendar
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      <div className="relative flex-1">
        <input
          type="date"
          value={endDate}
          onChange={endChange}
          className={`${inputBase} rounded-l-none border-l-0`}
        />
        <Calendar
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

function ContactPickerPopup({ onClose, onSave, selected, setSelected }) {
  const [tab, setTab] = useState("individual");
  const [search, setSearch] = useState("");

  const list = tab === "individual" ? [] : [];

  return (
    <Modal
      title="Add contact"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={onSave} className={btnModalSubmit}>
            Save
          </button>
        </>
      }
    >
      <p className="mb-3 text-[13px] text-slate-500">
        Determine who will receive the price rule.
      </p>
      <div className="mb-3 inline-flex rounded-lg bg-slate-100 p-0.5">
        {[
          { key: "individual", label: "Individual" },
          { key: "group", label: "Group" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              tab === t.key ? "bg-white text-brand shadow-sm" : "text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search contacts"
      />
      <p className="mb-2 mt-4 text-[13px] font-semibold text-slate-800">Contact list</p>
      {list.length === 0 ? (
        <div className="rounded-lg bg-slate-50 px-4 py-6 text-center">
          <Users size={56} weight="light" className="mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700">No contacts selected yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Please select contacts from the list. When you select, the contacts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {list.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() =>
                  setSelected((prev) =>
                    prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                  )
                }
                className="h-4 w-4 accent-brand"
              />
              {item.name}
            </label>
          ))}
        </div>
      )}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-[13px] text-slate-600">
          {selected.length} contact{selected.length === 1 ? "" : "s"} selected
        </p>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[13px] text-slate-600">
          <input type="checkbox" className="h-4 w-4 accent-brand" />
          Select all 0 contacts
        </label>
        <p className="mt-2 text-xs text-slate-400">
          If there are new contacts, the price rule will automatically apply to those contacts.
        </p>
      </div>
    </Modal>
  );
}

function ProductPickerPopup({ onClose, onSave, selected, setSelected }) {
  const [search, setSearch] = useState("");

  const list = [];

  return (
    <Modal
      title="Add product"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={onSave} className={btnModalSubmit}>
            Save
          </button>
        </>
      }
    >
      <p className="mb-3 text-[13px] text-slate-500">
        Determine which products will be subject to the price rule.
      </p>
      <SearchInput value={search} onChange={setSearch} placeholder="Search products" />
      <p className="mb-2 mt-4 text-[13px] font-semibold text-slate-800">Product list</p>
      {list.length === 0 ? (
        <div className="rounded-lg bg-slate-50 px-4 py-6 text-center">
          <Package size={56} weight="light" className="mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700">No products selected yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Please select products from the list. When you select, the products will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {list.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() =>
                  setSelected((prev) =>
                    prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                  )
                }
                className="h-4 w-4 accent-brand"
              />
              {item.name}
            </label>
          ))}
        </div>
      )}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-[13px] text-slate-600">
          {selected.length} product{selected.length === 1 ? "" : "s"} selected
        </p>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[13px] text-slate-600">
          <input type="checkbox" className="h-4 w-4 accent-brand" />
          Select all 0 products
        </label>
        <p className="mt-2 text-xs text-slate-400">
          If there are new products, the price rule will automatically apply to those products.
        </p>
      </div>
    </Modal>
  );
}

function CreatePriceRulePage({ onBack }) {
  const [ruleName, setRuleName] = useState("");
  const [rulePeriod, setRulePeriod] = useState("");
  const [ruleType, setRuleType] = useState("Percentage discount");
  const [discountValue, setDiscountValue] = useState("0");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);

  const isPercentage =
    ruleType.includes("Percentage") || ruleType.includes("percentage") || ruleType.includes("subtotal");

  return (
    <ActionPageShell
      title="Create new price rule"
      subtitle="Price rules"
      onBack={onBack}
      footer={
        <>
          <button type="button" onClick={onBack} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={onBack} className={btnModalSubmit}>
            Save
          </button>
        </>
      }
    >
      <div className="max-w-[960px]">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              1
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Fill in the price rule information</p>
              <p className="text-xs text-slate-500">
                Please fill in and select the name, period, and type of price rule you want to apply.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className={formLabel}>Rule name</label>
              <input
                type="text"
                maxLength={250}
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className={inputBase}
              />
              <p className="mt-1 text-right text-[11px] text-slate-400">{ruleName.length} / 250</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={formLabel}>Rule period</label>
                <RulePeriodDateRange value={rulePeriod} onChange={setRulePeriod} />
              </div>
              <div>
                <label className={formLabel}>Rule type</label>
                <OptionSelect
                  value={ruleType}
                  onChange={setRuleType}
                  groups={priceRuleTypeGroups}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700">
                {ruleType.replace(/discount|markup/i, "").trim() || "Discount"}
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className={`${inputBase} w-32`}
              />
              {isPercentage && <span className="text-sm font-semibold text-slate-700">%</span>}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              2
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Select contacts</p>
              <p className="text-xs text-slate-500">
                Determine who will receive the price rule according to the period you selected.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <SearchInput value={contactSearch} onChange={setContactSearch} placeholder="Search contacts" />
            <button
              type="button"
              onClick={() => setShowContactPopup(true)}
              className={btnSecondary}
            >
              Add contact
            </button>
          </div>
          {selectedContacts.length === 0 ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <Users size={24} weight="fill" className="shrink-0 text-brand" />
              No contacts selected yet
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedContacts.map((c) => (
                <div
                  key={c}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => setSelectedContacts((prev) => prev.filter((x) => x !== c))}
                    className="cursor-pointer text-slate-400 hover:text-red-500"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showContactPopup && (
            <ContactPickerPopup
              onClose={() => setShowContactPopup(false)}
              onSave={() => setShowContactPopup(false)}
              selected={selectedContacts}
              setSelected={setSelectedContacts}
            />
          )}
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              3
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Select products</p>
              <p className="text-xs text-slate-500">
                Determine which products will be subject to the price rule. You can see the final price below.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <SearchInput value={productSearch} onChange={setProductSearch} placeholder="Search products" />
            <button
              type="button"
              onClick={() => setShowProductPopup(true)}
              className={btnSecondary}
            >
              Add product
            </button>
          </div>
          {selectedProducts.length === 0 ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <Package size={24} weight="fill" className="shrink-0 text-brand" />
              No products selected yet
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedProducts.map((p) => (
                <div
                  key={p}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => setSelectedProducts((prev) => prev.filter((x) => x !== p))}
                    className="cursor-pointer text-slate-400 hover:text-red-500"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showProductPopup && (
            <ProductPickerPopup
              onClose={() => setShowProductPopup(false)}
              onSave={() => setShowProductPopup(false)}
              selected={selectedProducts}
              setSelected={setSelectedProducts}
            />
          )}
        </div>
      </div>
    </ActionPageShell>
  );
}

function ImportProductModal({ onClose, title = "Import new products" }) {
  const [fileName, setFileName] = useState("");
  const [showConditions, setShowConditions] = useState(false);

  return (
    <Drawer
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => fileName && onClose()}
            disabled={!fileName}
            className={btnModalSubmit}
          >
            Continue
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            1
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Download the template file</p>
            <p className="text-xs text-slate-500">
              To import data correctly, avoid using templates other than the ones provided. This template
              file has been aligned with the system requirements.
            </p>
            <button type="button" className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark">
              Download template
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            2
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Fill in the data in the template file</p>
            <p className="text-xs text-slate-500">
              Make sure the data you fill in matches the filling conditions. Please do not edit or change
              the columns to avoid data import issues.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Need an example or a filling tutorial?{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark">
                See example
              </button>{" "}
              or{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark">
                learn the tutorial
              </button>
            </p>
            <button
              type="button"
              onClick={() => setShowConditions((prev) => !prev)}
              className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark"
            >
              {showConditions ? "Hide" : "Show"} filling conditions
            </button>
            {showConditions && (
              <div className="mt-3 space-y-2 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Filling conditions</p>
                <p>Date format is dd/mm/yyyy (day/month/year)</p>
                <p>Maximum transaction row is 1.000 rows</p>
                <p>For thousands, no comma or period needed</p>
                <p>To separate decimals, use a period</p>
                <p>No need to enter currency symbols (Rp, $, etc.)</p>
                <p className="font-semibold text-slate-800">Filling tips</p>
                <p>
                  If you fill in number data with Microsoft Excel, add a (`) sign before the
                  numbers. Example: `6-6003 or `11-02-2016
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            3
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Upload the template file</p>
            <p className="text-xs text-slate-500">
              You can upload the previously filled template file without changing its format (.csv). If you
              need to change it, please use .xls or .xlsx
            </p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Choose file
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </label>
            <span className="ml-2 text-xs text-slate-500">{fileName || "No file selected"}</span>
            <p className="mt-2 text-xs text-slate-500">
              Make sure the products you have updated are available
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default function ProductPage() {
  const [mainTab, setMainTab] = useState("goods");
  const [goodsSubTab, setGoodsSubTab] = useState("productList");
  const [warehouseSubTab, setWarehouseSubTab] = useState("warehouseList");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [actionPage, setActionPage] = useState(null);

  function handleAction(action) {
    setActionPage(action);
  }

  function closeActionPage() {
    setActionPage(null);
  }

  return (
    <div className="min-h-screen bg-white">
      {actionPage ? (
        <>
          {actionPage === "addProduct" && <AddProductPage onBack={closeActionPage} />}
          {actionPage === "addWarehouse" && <AddWarehousePage onBack={closeActionPage} />}
          {actionPage === "adjustStock" && <AdjustStockSetupPage onBack={closeActionPage} />}
          {actionPage === "transferWarehouse" && <TransferWarehousePage onBack={closeActionPage} />}
          {actionPage === "createPriceRule" && <CreatePriceRulePage onBack={closeActionPage} />}
        </>
      ) : (
        <>
          <ProductHeader mainTab={mainTab} onMainTabChange={setMainTab} onAction={handleAction} />

          {mainTab === "goods" && (
            <GoodsServicesTab
              activeSubTab={goodsSubTab}
              onSubTabChange={setGoodsSubTab}
              onOpenCategoryModal={() => setShowCategoryModal(true)}
              onAction={handleAction}
            />
          )}

          {mainTab === "warehouses" && (
            <WarehousesTab activeSubTab={warehouseSubTab} onSubTabChange={setWarehouseSubTab} />
          )}

          {mainTab === "priceRules" && <PriceRulesTab onAction={handleAction} />}

          {showCategoryModal && <ManageCategoryModal onClose={() => setShowCategoryModal(false)} />}
        </>
      )}

      {actionPage === "importNewProducts" && (
        <ImportProductModal onClose={closeActionPage} title="Import new products" />
      )}
      {actionPage === "updateImportProducts" && (
        <ImportProductModal onClose={closeActionPage} title="Update & import products" />
      )}
      {actionPage === "importNewBundles" && (
        <ImportProductModal onClose={closeActionPage} title="Import new bundles" />
      )}
      {actionPage === "updateImportBundles" && (
        <ImportProductModal onClose={closeActionPage} title="Update & import bundles" />
      )}
    </div>
  );
}