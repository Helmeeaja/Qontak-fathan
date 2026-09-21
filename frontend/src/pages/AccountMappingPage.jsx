import { useState } from "react";
import {
  CaretDown,
  CaretUp,
  Check,
  MagnifyingGlass,
} from "@phosphor-icons/react";

import { mappingGroups } from "@/data/accountMapping";
import {
  btnModalSubmit,
  buttonSpinner,
  formLabel,
  formRequiredMark,
} from "@/components/ui/styles";

function AccountSelect({ row, value, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = row.options || [];

  const filtered = query.trim()
    ? options.filter((o) =>
        o.text.toLowerCase().includes(query.trim().toLowerCase())
      )
    : options;

  const selected = options.find((o) => o.id === value);
  const display = selected ? selected.text : "Select account";

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen(!open);
          setQuery("");
        }}
        className="flex h-[38px] w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 text-left transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        <span className="truncate text-sm text-gray-900">{display}</span>
        <CaretDown size={15} className="flex-shrink-0 text-slate-500" />
      </button>

      {open && !disabled && (
        <>
          <div
            className="fixed inset-0 z-[900]"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 right-0 top-full z-[950] mt-1.5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <div className="border-b border-gray-100 p-2">
              <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5">
                <MagnifyingGlass size={14} className="text-slate-400" />
                <input
                  type="text"
                  value={query}
                  autoFocus
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`${filtered.length} results are available`}
                  className="m-0 w-full border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="max-h-[220px] overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="m-0 px-3 py-4 text-center text-sm text-slate-500">
                  No account found
                </p>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      onChange(row.id, o.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                      o.id === value
                        ? "font-medium text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {o.id === value && <Check size={14} weight="bold" />}
                    <span className="truncate">{o.text}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GroupAccordion({ group, values, onChange }) {
  const [open, setOpen] = useState(group.id === "sales");

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-gray-900">
          {group.label}
        </span>

        <span className="ml-auto flex h-7 w-7 items-center justify-center text-slate-500">
          {open ? <CaretUp size={16} /> : <CaretDown size={16} />}
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 px-5 pb-7 md:grid-cols-2">
          {group.rows.map((row) => (
            <div key={row.id}>
              <label className={formLabel}>
                {row.label}
                {row.locked ? null : (
                  <span className={formRequiredMark}>*</span>
                )}
              </label>

              {row.tooltip && (
                <p className="m-0 mb-1.5 text-xs text-slate-400">
                  {row.tooltip}
                </p>
              )}

              <AccountSelect
                row={row}
                value={values[row.id] ?? row.value}
                disabled={!!row.locked}
                onChange={onChange}
              />

              {row.locked && row.note && (
                <p className="m-0 mt-1.5 text-xs text-slate-500">
                  {row.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountMappingPage() {
  const [values, setValues] = useState(() => {
    const init = {};
    mappingGroups.forEach((g) =>
      g.rows.forEach((r) => {
        init[r.id] = r.value;
      })
    );
    return init;
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (rowId, accountId) => {
    setValues((prev) => ({ ...prev, [rowId]: accountId }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaved(false);
      await new Promise((r) => setTimeout(r, 700));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] p-6 max-md:p-4">
      <div className="mb-5">
        <h1 className="m-0 text-[28px] font-bold text-gray-900">
          Account Mapping
        </h1>
        <p className="m-0 mt-1.5 text-sm text-slate-500">
          Choose default account for each label to help the system create your
          journal entry automatically from transactions.
        </p>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="m-0 text-lg text-gray-900">Mapping List</h2>
          <p className="m-0 mt-[5px] text-[13px] italic text-slate-500">
            All fields are required
          </p>
        </div>

        <form onSubmit={handleSave}>
          {mappingGroups.map((g) => (
            <GroupAccordion
              key={g.id}
              group={g}
              values={values}
              onChange={handleChange}
            />
          ))}

          <div className="flex flex-col gap-4 p-5 max-md:items-stretch md:flex-row md:items-center md:justify-between">
            <p className="m-0 max-w-[420px] text-[13px] text-slate-500">
              Reset account will take effect after you submit this account
              mapping
            </p>

            <button
              type="submit"
              className={btnModalSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className={buttonSpinner} />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check size={16} weight="bold" />
                  Saved
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
