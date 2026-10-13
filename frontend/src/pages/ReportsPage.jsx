import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CaretDown,
  CaretLeft,
  DownloadSimple,
  Eye,
  Funnel,
  X,
} from "@phosphor-icons/react";
import emptyReportImg from "@/assets/empty-report.png";
import emptyWarehouseImg from "@/assets/empty-warehouse.png";
import {
  btn,
  btnModalCancel,
  btnModalSubmit,
  btnPrimary,
  formLabel,
  inputBase,
  modalHeader,
  modalTitle,
} from "@/components/ui/styles";

const periodOptions = [
  "Today",
  "This week",
  "This month",
  "This quarter",
  "This year",
  "Yesterday",
  "Last week",
  "Last month",
  "Last quarter",
  "Last year",
  "Custom",
];

const stockInfoOptions = [
  "All products",
  "Only out-of-stock products",
  "Only available-stock products",
  "Only products below minimum stock",
];

const sortOptionsInventory = [
  "Product name",
  "Product code / SKU",
  "Stock in warehouse",
  "Average price",
  "Value",
];

const sortOptionsWarehouse = ["Product code / SKU", "Product name", "Stock qty"];

const inventorySummaryConfig = {
  title: "Inventory summary",
  subtitle: "(in IDR)",
  emptyTitle: "No inventory summary at this date/period",
  emptyDescription: "Recheck the filter or choose another date/period.",
  emptyImage: emptyReportImg,
  showWarehouseSelect: false,
  showStockInfo: true,
  showInventoryAccount: true,
  showExcludeEmptyStock: false,
  showResetFilter: true,
  dateLabel: "Date",
  drawerTitle: "Report filter",
  sortOptions: sortOptionsInventory,
  defaultSortBy: "Product name",
  exportFormats: ["csv", "xls"],
  exportVariant: "filter",
};

const warehouseStockConfig = {
  title: "Warehouse stock quantity",
  subtitle: "",
  emptyTitle: "Report will appear here",
  emptyDescription: "Select a date or period and warehouse, then click Show.",
  emptyImage: emptyWarehouseImg,
  showWarehouseSelect: true,
  showStockInfo: false,
  showInventoryAccount: false,
  showExcludeEmptyStock: true,
  showResetFilter: false,
  dateLabel: "Per",
  drawerTitle: "Filter",
  sortOptions: sortOptionsWarehouse,
  defaultSortBy: "Product code / SKU",
  exportFormats: ["pdf", "csv", "xlsx"],
  exportVariant: "warehouse",
};

function periodToEndDate(period) {
  const now = new Date();
  const shift = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d;
  };
  const endOfMonth = (y, m) => new Date(y, m + 1, 0);
  const endOfWeek = (base) => {
    const d = new Date(base);
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
    return d;
  };
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (period) {
    case "Today":
      return now;
    case "Yesterday":
      return shift(-1);
    case "This week":
      return endOfWeek(now);
    case "Last week":
      return endOfWeek(shift(-7));
    case "This month":
      return endOfMonth(y, m);
    case "Last month":
      return endOfMonth(y, m - 1);
    case "This quarter":
      return endOfMonth(y, Math.floor(m / 3) * 3 + 2);
    case "Last quarter":
      return endOfMonth(y, Math.floor(m / 3) * 3 - 1);
    case "This year":
      return new Date(y, 11, 31);
    case "Last year":
      return new Date(y - 1, 11, 31);
    default:
      return null;
  }
}

function formatDisplay(d) {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function getConfig(pathname) {
  if (pathname.includes("warehouse_stock_quantity")) return warehouseStockConfig;
  return inventorySummaryConfig;
}

function getStockInfoDefault(pathname) {
  const productStock = new URLSearchParams(window.location.search).get("product_stock");
  if (productStock === "minimum") return stockInfoOptions[3];
  if (productStock === "out") return stockInfoOptions[1];
  return stockInfoOptions[0];
}

function getStockInfoLocked(pathname) {
  const productStock = new URLSearchParams(window.location.search).get("product_stock");
  return productStock === "minimum" || productStock === "out";
}

function getBackLabel(pathname) {
  if (pathname.includes("warehouse_stock_quantity")) return "Warehouse";
  const productStock = new URLSearchParams(window.location.search).get("product_stock");
  if (productStock === "minimum") return "Low stock";
  if (productStock === "out") return "Out of stock";
  return "Available stock";
}

function FormLabel({ children }) {
  return <label className={`${formLabel} mb-1.5 block`}>{children}</label>;
}

function FieldDate({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const display = typeof value === "string" ? value : formatDisplay(value);
  return (
    <div className="w-[172px]">
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <input
          type="text"
          value={display}
          readOnly
          onClick={() => setOpen((prev) => !prev)}
          className={`${inputBase} cursor-pointer pr-9`}
        />
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {open && (
          <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <CalendarPicker value={value} onChange={onChange} onClose={() => setOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarPicker({ value, onChange, onClose }) {
  const base = typeof value === "string" ? new Date() : new Date(value);
  const [view, setView] = useState(new Date(base.getFullYear(), base.getMonth(), 1));
  const y = view.getFullYear();
  const m = view.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevMonthDays = new Date(y, m, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - firstDay - daysInMonth + 1, current: false });
  }

  const selectedDay = typeof value === "string" ? null : value.getDate();

  return (
    <div className="w-[236px]">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(new Date(y, m - 1, 1))}
          className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100"
        >
          <CaretLeft size={14} weight="bold" />
        </button>
        <span className="text-[13px] font-semibold text-slate-800">
          {view.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() => setView(new Date(y, m + 1, 1))}
          className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100"
        >
          <CaretLeft size={14} weight="bold" className="rotate-180" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-slate-400">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => (
          <button
            key={i}
            type="button"
            disabled={!cell.current}
            onClick={() => {
              onChange(new Date(y, m, cell.day));
              onClose?.();
            }}
            className={`flex h-7 w-7 items-center justify-center rounded text-[12px] ${
              cell.current
                ? cell.day === selectedDay
                  ? "bg-brand font-semibold text-white"
                  : "cursor-pointer text-slate-700 hover:bg-slate-100"
                : "text-slate-300"
            }`}
          >
            {cell.day}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          onChange(new Date());
          onClose?.();
        }}
        className="mt-2 cursor-pointer text-[12px] font-semibold text-brand hover:text-brand-dark"
      >
        Today
      </button>
    </div>
  );
}

function FieldSelect({ label, value, onChange, options, placeholder, locked }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-[172px]">
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className={`${inputBase} flex cursor-pointer items-center pr-9 ${
            value ? "text-slate-900" : "text-slate-400"
          } ${locked ? "bg-slate-50 text-slate-500" : ""}`}
        >
          <span className="truncate">{value || placeholder}</span>
        </div>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {open && (
          <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
            {options.map((option) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MultiSelectField({ label, allOption, placeholder, selected, onToggle, width = "w-full" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const options = allOption ? [allOption] : [];
  const visible = options.filter((option) =>
    option.toLowerCase().includes(search.trim().toLowerCase())
  );
  const display = selected.length === 0 ? "" : selected.join(", ");

  return (
    <div className={width}>
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <div
          onClick={() => {
            setOpen((prev) => !prev);
            setSearch("");
          }}
          className={`${inputBase} flex cursor-pointer items-center pr-9 ${
            selected.length ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <span className="truncate">{display || placeholder}</span>
        </div>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {open && (
          <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
            <div className="px-2.5 pb-1.5">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {visible.length === 0 ? (
                <div className="px-3 py-2 text-sm text-slate-400">No options</div>
              ) : (
                visible.map((option) => (
                  <label
                    key={option}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() => onToggle(option)}
                      className="h-4 w-4 accent-brand"
                    />
                    {option}
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WarehouseSelect({ selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const options = ["Unassigned"];
  const display = selected.length === 0 ? "Select warehouse" : `${selected.length} selected`;
  return (
    <div className="w-[200px]">
      <FormLabel>Warehouse</FormLabel>
      <div className="relative">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className={`${inputBase} flex cursor-pointer items-center pr-9 ${
            selected.length ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <span className="truncate">{display}</span>
        </div>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {open && (
          <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
            {options.map((option) => (
              <label
                key={option}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onToggle(option)}
                  className="h-4 w-4 accent-brand"
                />
                {option}
              </label>
            ))}
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => options.forEach((o) => selected.includes(o) && onToggle(o))}
                className="block w-full cursor-pointer px-3 py-2 text-left text-[12px] font-semibold text-brand hover:bg-slate-50"
              >
                Clear all selections
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RadioButton({ name, value, checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-brand"
      />
      {children}
    </label>
  );
}

function FilterForm({ config, values, setField }) {
  const stockInfoLocked = getStockInfoLocked(window.location.pathname + window.location.search);
  return (
    <>
      <div className="mb-5">
        <FormLabel>{config.dateLabel}</FormLabel>
        <FieldDateInline
          value={values.date}
          onChange={(v) => setField("date", v)}
        />
      </div>
      <div className="mb-5">
        <FormLabel>Period</FormLabel>
        <FieldSelect
          label=""
          value={values.period}
          onChange={(v) => {
            setField("period", v);
            if (v === "Custom") {
              setField("date", typeof values.date === "string" ? values.date : values.date);
            } else {
              setField("date", periodToEndDate(v) || values.date);
            }
          }}
          options={periodOptions}
          placeholder="Select period"
        />
      </div>
      {config.showStockInfo && (
        <div className="mb-5">
          <FormLabel>Product stock info</FormLabel>
          <FieldSelect
            label=""
            value={values.stockInfo}
            onChange={(v) => setField("stockInfo", v)}
            options={stockInfoOptions}
            placeholder="Select stock info"
            locked={stockInfoLocked}
          />
        </div>
      )}
      <div className="mb-5">
        <MultiSelectField
          label="Product category"
          allOption="All product categories"
          placeholder="All product categories"
          selected={values.categories}
          onToggle={(o) =>
            setField(
              "categories",
              values.categories.includes(o)
                ? values.categories.filter((x) => x !== o)
                : [...values.categories, o]
            )
          }
        />
      </div>
      <div className="mb-5">
        <FormLabel>Inclusion</FormLabel>
        <div className="flex items-center gap-6">
          <RadioButton
            name="inclusion"
            checked={values.inclusion === "and"}
            onChange={() => setField("inclusion", "and")}
          >
            Include all
          </RadioButton>
          <RadioButton
            name="inclusion"
            checked={values.inclusion === "or"}
            onChange={() => setField("inclusion", "or")}
          >
            Either
          </RadioButton>
        </div>
      </div>
      <div className="mb-5">
        <MultiSelectField
          label="Product"
          allOption="All products"
          placeholder="All products"
          selected={values.products}
          onToggle={(o) =>
            setField(
              "products",
              values.products.includes(o)
                ? values.products.filter((x) => x !== o)
                : [...values.products, o]
            )
          }
        />
      </div>
      <div className="mb-5">
        <FormLabel>{config.showStockInfo ? "Sort by column" : "Column to sort by"}</FormLabel>
        <FieldSelect
          label=""
          value={values.sortBy}
          onChange={(v) => setField("sortBy", v)}
          options={config.sortOptions}
          placeholder="Select column"
        />
        <div className="mt-3 flex items-center gap-6">
          <RadioButton
            name="sort-dir"
            checked={values.sortDir === "asc"}
            onChange={() => setField("sortDir", "asc")}
          >
            Ascending
          </RadioButton>
          <RadioButton
            name="sort-dir"
            checked={values.sortDir === "desc"}
            onChange={() => setField("sortDir", "desc")}
          >
            Descending
          </RadioButton>
        </div>
      </div>
      {config.showInventoryAccount && (
        <label className="flex cursor-pointer items-center gap-2.5 py-2">
          <input
            type="checkbox"
            checked={values.showInventoryAccount}
            onChange={() => setField("showInventoryAccount", !values.showInventoryAccount)}
            className="h-4 w-4 accent-brand"
          />
          <span className="text-sm font-semibold text-slate-800">Show inventory account</span>
        </label>
      )}
      {config.showExcludeEmptyStock && (
        <label className="flex cursor-pointer items-center gap-2.5 py-2">
          <input
            type="checkbox"
            checked={values.excludeEmptyStock}
            onChange={() => setField("excludeEmptyStock", !values.excludeEmptyStock)}
            className="h-4 w-4 accent-brand"
          />
          <span className="text-sm font-semibold text-slate-800">Exclude empty stock</span>
        </label>
      )}
    </>
  );
}

function FieldDateInline({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const display = typeof value === "string" ? value : formatDisplay(value);
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={display}
        readOnly
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} w-full cursor-pointer pr-9`}
      />
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <CalendarPicker
            value={value}
            onChange={onChange}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function ReportPopup({ title, onClose, footer, children }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="flex max-h-[90vh] w-full max-w-[448px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h2 className={modalTitle}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-between gap-2.5 border-t border-gray-200 px-[22px] py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function ExportModal({ config, values, setField, onClose }) {
  const [dataType, setDataType] = useState("warehouseOnly");
  const [fileFormat, setFileFormat] = useState(config.exportFormats[0]);

  if (config.exportVariant === "warehouse") {
    return (
      <ReportPopup
        title="Export report"
        onClose={onClose}
        footer={
          <div className="ml-auto flex gap-2.5">
            <button type="button" onClick={onClose} className={btnModalCancel}>
              Cancel
            </button>
            <button type="button" onClick={onClose} className={btnModalSubmit}>
              Export
            </button>
          </div>
        }
      >
        <p className={formLabel}>Data to export</p>
        <div className="mb-5 flex flex-col gap-2">
          <RadioButton
            name="export-data"
            checked={dataType === "warehouseOnly"}
            onChange={() => setDataType("warehouseOnly")}
          >
            Warehouse only
          </RadioButton>
          <RadioButton
            name="export-data"
            checked={dataType === "warehouseAndLocation"}
            onChange={() => setDataType("warehouseAndLocation")}
          >
            Warehouse &amp; location
          </RadioButton>
        </div>
        <p className={formLabel}>File format</p>
        <div className="flex flex-col gap-2">
          {config.exportFormats.map((fmt) => (
            <RadioButton
              key={fmt}
              name="export-format"
              checked={fileFormat === fmt}
              onChange={() => setFileFormat(fmt)}
            >
              <span className="uppercase">{fmt}</span>
            </RadioButton>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-400">
          The exported report is based on the displayed data
        </p>
      </ReportPopup>
    );
  }

  return (
    <ReportPopup
      title="Export report"
      onClose={onClose}
      footer={
        <div className="ml-auto flex gap-2.5">
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={onClose} className={btnModalSubmit}>
            Export
          </button>
        </div>
      }
    >
      <FilterForm config={config} values={values} setField={setField} />
      <div className="mt-5">
        <p className={formLabel}>File format</p>
        <div className="flex items-center gap-6">
          {config.exportFormats.map((fmt) => (
            <RadioButton
              key={fmt}
              name="export-format"
              checked={fileFormat === fmt}
              onChange={() => setFileFormat(fmt)}
            >
              <span className="uppercase">{fmt}</span>
            </RadioButton>
          ))}
        </div>
      </div>
      <p className="mt-5 text-xs text-slate-400">
        The exported report is based on the displayed data
      </p>
    </ReportPopup>
  );
}

function FilterModal({ config, values, setField, onReset, onClose }) {
  return (
    <ReportPopup
      title={config.drawerTitle}
      onClose={onClose}
      footer={
        <>
          {config.showResetFilter ? (
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer text-[13px] font-semibold text-slate-500 hover:text-slate-700"
            >
              Reset filter
            </button>
          ) : (
            <span />
          )}
          <div className="ml-auto flex gap-2.5">
            <button type="button" onClick={onClose} className={btnModalCancel}>
              Cancel
            </button>
            <button type="button" onClick={onClose} className={btnModalSubmit}>
              Apply
            </button>
          </div>
        </>
      }
    >
      <FilterForm config={config} values={values} setField={setField} />
    </ReportPopup>
  );
}

function defaultFilterValues(config) {
  return {
    date: periodToEndDate("Today"),
    period: "Today",
    stockInfo: getStockInfoDefault(window.location.pathname + window.location.search),
    categories: ["All product categories"],
    inclusion: "and",
    products: ["All products"],
    sortBy: config.defaultSortBy,
    sortDir: "asc",
    showInventoryAccount: false,
    excludeEmptyStock: false,
  };
}

export default function ReportsPage() {
  const location = useLocation();
  const config = getConfig(location.pathname);
  const backLabel = getBackLabel(location.pathname);

  const [values, setValues] = useState(() => defaultFilterValues(config));
  const [warehouses, setWarehouses] = useState(["Unassigned"]);
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);

  function setField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setValues(defaultFilterValues(config));
  }

  function toggleWarehouse(option) {
    setWarehouses((current) =>
      current.includes(option) ? current.filter((x) => x !== option) : [...current, option]
    );
  }

  return (
    <div className="min-h-screen rounded-xl bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <Link
          to="/productsmain"
          className="mb-1.5 flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-slate-500 hover:text-slate-800"
        >
          <CaretLeft size={14} weight="bold" />
          {backLabel}
        </Link>
        <h1 className="text-[22px] font-bold text-slate-900">{config.title}</h1>
        {config.subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{config.subtitle}</p>
        )}
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <FieldDate
            label={config.dateLabel}
            value={values.period === "Custom" ? values.date : values.date}
            onChange={(v) => {
              setField("date", v);
              if (values.period !== "Custom") setField("period", "Custom");
            }}
          />
          <FieldSelect
            label="Period"
            value={values.period}
            onChange={(v) => {
              setField("period", v);
              if (v !== "Custom") setField("date", periodToEndDate(v));
            }}
            options={periodOptions}
            placeholder="Select period"
          />
          {config.showWarehouseSelect && (
            <WarehouseSelect selected={warehouses} onToggle={toggleWarehouse} />
          )}
          <button type="button" className={`${btnPrimary} px-4`}>
            Show
          </button>
          <button
            type="button"
            onClick={() => setShowFilter(true)}
            className={`${btn} flex items-center gap-1.5 px-3`}
          >
            <Funnel size={15} weight="bold" />
            Filter
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className={`${btn} flex items-center gap-1.5 px-3`}
            >
              <DownloadSimple size={15} weight="bold" />
              Export
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-brand hover:text-brand-dark"
            >
              <Eye size={15} weight="bold" />
              See example
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 px-4 py-16 text-center">
          <img src={config.emptyImage} alt="" className="mx-auto h-[128px] w-[128px] object-contain" />
          <p className="mt-3 text-sm font-semibold text-slate-800">{config.emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-500">{config.emptyDescription}</p>
        </div>
      </div>

      {showFilter && (
        <FilterModal
          config={config}
          values={values}
          setField={setField}
          onReset={handleReset}
          onClose={() => setShowFilter(false)}
        />
      )}
      {showExport && (
        <ExportModal
          config={config}
          values={values}
          setField={setField}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
