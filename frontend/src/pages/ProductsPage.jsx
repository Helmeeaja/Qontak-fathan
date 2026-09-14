import { useState } from "react";
import { Info, MagnifyingGlass, Pencil, PencilSimple, Trash, X } from "@phosphor-icons/react";
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  inputBase,
  textareaBase,
} from "@/components/ui/styles";

const initialSubfeatures = {
  stockInfo: false,
  barcode: false,
  variant: false,
  serialTracking: true,
  batchTracking: true,
};

const subfeatureLabels = [
  ["stockInfo", "Stock info on sales & purchases"],
  ["barcode", "Barcode scanning"],
  ["variant", "Product variant"],
  ["serialTracking", "Serial number tracking"],
  ["batchTracking", "Batch tracking"],
];

function MainTab({ mainPage, setMainPage }) {
  return (
    <div className="flex gap-3">
      <button
        className={
          mainPage
            ? "border-b border-brand bg-white p-2 text-brand"
            : "p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
        }
        onClick={() => setMainPage(true)}
      >
        Goods & services
      </button>

      <button
        className={
          !mainPage
            ? "border-b border-brand bg-white p-2 text-brand"
            : "p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
        }
        onClick={() => setMainPage(false)}
      >
        Warehouse
      </button>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3.5 last:border-b-0">
      <span className={`${formLabel} m-0`}>{label}</span>
      {children}
    </div>
  );
}

function SectionHeading({ title, editing, onEdit }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 pt-5 first:pt-0">
      <h3 className="m-0 text-[15px] font-bold text-gray-900">{title}</h3>
      {onEdit && !editing && (
        <button
          type="button"
          className="cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100"
          onClick={onEdit}
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-3">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="relative h-[22px] w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[18px]"></span>
    </label>
  );
}

function SetLink({ children, onClick }) {
  return (
    <button
      type="button"
      className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-brand hover:underline"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StatusText({ active }) {
  return (
    <span className="text-sm text-gray-900">{active ? "Active" : "Inactive"}</span>
  );
}

function ModalShell({ title, children, footer }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="border-b border-gray-200 px-[22px] py-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">{title}</h3>
        </div>
        <div className="px-[22px] py-5">{children}</div>
        <div className="flex justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}

function ListSetModal({ title, nameLabel, addLabel, searchPlaceholder, noun, onClose }) {
  const [rows, setRows] = useState([
    { id: 1, name: noun === "product category" ? "baba" : "Pcs", amount: 0 },
  ]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

  const visibleRows = rows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase()),
  );

  const confirmAdd = () => {
    if (newName.trim() === "") return;
    setRows((current) => [...current, { id: nextId, name: newName.trim(), amount: 0 }]);
    setNewName("");
    setAdding(false);
  };

  const confirmEdit = (row) => {
    if (editName.trim() === "") return;
    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, name: editName.trim() } : item)),
    );
    setEditingId(null);
  };

  const confirmDelete = (row) => {
    setRows((current) => current.filter((item) => item.id !== row.id));
    setDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="relative shrink-0 border-b border-gray-200 px-[22px] py-[18px] pr-[52px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            className="absolute right-4 top-[18px] cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[22px] py-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
              <MagnifyingGlass size={17} className="shrink-0 text-slate-500" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full border-0 text-sm text-gray-900 outline-none placeholder:text-slate-400"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
              onClick={() => {
                setAdding(true);
                setEditingId(null);
                setDeleteId(null);
              }}
            >
              {addLabel}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className={`${formLabel} flex-1 m-0`}>{nameLabel}</div>
            <div className={`${formLabel} w-[90px] m-0`}>
              <span className="inline-flex items-center gap-1">
                Amount
                <Info size={14} className="text-slate-400" />
              </span>
            </div>
            <div className="w-[76px]"></div>
          </div>

          <div className="flex flex-col">
            {adding && (
              <div className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                />
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[13px] font-semibold text-slate-600 hover:text-black"
                  onClick={() => {
                    setAdding(false);
                    setNewName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[13px] font-semibold text-brand hover:underline"
                  onClick={confirmAdd}
                >
                  Save
                </button>
              </div>
            )}

            {visibleRows.map((row) => (
              <div key={row.id} className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5">
                <div className="flex-1">
                  {editingId === row.id ? (
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{row.name}</span>
                  )}
                </div>
                <div className="w-[90px] text-sm text-slate-500">{row.amount}</div>
                <div className="flex w-[76px] justify-end gap-1">
                  {editingId === row.id ? (
                    <>
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[13px] font-semibold text-slate-600 hover:text-black"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[13px] font-semibold text-brand hover:underline"
                        onClick={() => confirmEdit(row)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
                        onClick={() => {
                          setEditingId(row.id);
                          setEditName(row.name);
                          setAdding(false);
                          setDeleteId(null);
                        }}
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                          setDeleteId(deleteId === row.id ? null : row.id);
                          setEditingId(null);
                          setAdding(false);
                        }}
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {deleteId !== null && (
              <div className="border-b border-slate-100 px-3 py-2.5">
                <div className="rounded-lg bg-red-50 px-3.5 py-2.5">
                  <div className="text-sm font-semibold text-red-700">
                    Delete {noun}?
                  </div>
                  <p className="m-0 mt-0.5 text-[13px] text-red-600">
                    The deleted {noun} cannot be restored.
                  </p>
                  <div className="mt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[13px] font-semibold text-slate-600 hover:text-black"
                      onClick={() => setDeleteId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer rounded-lg border-0 bg-red-600 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-700"
                      onClick={() =>
                        confirmDelete(rows.find((item) => item.id === deleteId))
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t border-gray-200 px-[22px] py-4">
          <button type="button" className={btnModalSubmit} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function BatchReminderModal({ onClose }) {
  const [reminders, setReminders] = useState([
    {
      title: "Reminder 1",
      days: "2",
      unit: "Day",
      when: "Before expiration",
      subject: "Product batch nearing expiration",
      body: "There is a product batch that will expire on [TanggalKedaluwarsa].",
    },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = reminders[selectedIndex];

  const setField = (field, value) => {
    setReminders((rows) =>
      rows.map((row, i) => (i === selectedIndex ? { ...row, [field]: value } : row)),
    );
  };

  const addReminder = () => {
    const next = reminders.length + 1;
    setReminders((rows) => [
      ...rows,
      {
        title: `Reminder ${next}`,
        days: "1",
        unit: "Day",
        when: "Before expiration",
        subject: "",
        body: "",
      },
    ]);
    setSelectedIndex(reminders.length);
  };

  const deleteReminder = () => {
    if (reminders.length === 1) return;
    const remaining = reminders.filter((row, i) => i !== selectedIndex);
    setReminders(remaining);
    setSelectedIndex(0);
  };

  return (
    <ModalShell
      title="Set batch reminder"
      footer={
        <>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Batal
          </button>
          <button type="button" className={btnModalSubmit} onClick={onClose}>
            Simpan
          </button>
        </>
      }
    >
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-[240px] shrink-0 border-r border-slate-100 pr-4 max-md:w-full max-md:border-r-0 max-md:border-b max-md:pr-0 max-md:pb-4">
          {reminders.map((row, index) => (
            <button
              key={index}
              type="button"
              className={
                index === selectedIndex
                  ? "mb-2 block w-full cursor-pointer rounded-lg border border-brand bg-brand/5 px-3.5 py-2.5 text-left"
                  : "mb-2 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50"
              }
              onClick={() => setSelectedIndex(index)}
            >
              <span className="block text-sm font-bold text-gray-900">{row.title}</span>
              <span className="mt-0.5 block text-[13px] text-slate-500">
                {row.days} {row.unit.toLowerCase()}
                {Number(row.days) > 1 ? "s" : ""}{" "}
                {row.when === "Before expiration" ? "before" : "after"} expiration
              </span>
            </button>
          ))}

          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-brand hover:underline"
            onClick={addReminder}
          >
            Add new reminder
          </button>
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div className="flex-1">
              <div className="mb-[7px] flex items-center justify-between">
                <label className={`${formLabel} m-0`}>Reminder title</label>
                <span className="text-xs text-slate-400">{current.title.length}/40</span>
              </div>
              <input
                type="text"
                maxLength={40}
                className={inputBase}
                value={current.title}
                onChange={(event) => setField("title", event.target.value)}
              />
            </div>
            <button
              type="button"
              className="mb-2.5 cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              disabled={reminders.length === 1}
              onClick={deleteReminder}
            >
              Delete reminder
            </button>
          </div>

          <div className="mb-4">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Send reminder
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="number"
                min="1"
                className="w-[80px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                value={current.days}
                onChange={(event) => setField("days", event.target.value)}
              />
              <select
                className="w-[110px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                value={current.unit}
                onChange={(event) => setField("unit", event.target.value)}
              >
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
              </select>
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="reminder-when"
                  className="h-4 w-4 accent-brand"
                  checked={current.when === "Before expiration"}
                  onChange={() => setField("when", "Before expiration")}
                />
                Before expiration
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="reminder-when"
                  className="h-4 w-4 accent-brand"
                  checked={current.when === "After expiration"}
                  onChange={() => setField("when", "After expiration")}
                />
                After expiration
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Email subject
            </label>
            <input
              type="text"
              className={inputBase}
              value={current.subject}
              onChange={(event) => setField("subject", event.target.value)}
            />
          </div>

          <div className="mb-0">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Email body
            </label>
            <textarea
              rows="5"
              className={textareaBase}
              value={current.body}
              onChange={(event) => setField("body", event.target.value)}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function GoodsAndServicesTab() {
  const [savedSubfeatures, setSavedSubfeatures] = useState(initialSubfeatures);
  const [subfeatureDraft, setSubfeatureDraft] = useState(initialSubfeatures);
  const [subfeatureEditing, setSubfeatureEditing] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [batchReminderModalOpen, setBatchReminderModalOpen] = useState(false);

  const startSubfeatureEdit = () => {
    setSubfeatureDraft(savedSubfeatures);
    setSubfeatureEditing(true);
  };

  const cancelSubfeatureEdit = () => {
    setSubfeatureEditing(false);
    setSubfeatureDraft(savedSubfeatures);
  };

  const saveSubfeatureEdit = () => {
    setSavedSubfeatures(subfeatureDraft);
    setSubfeatureEditing(false);
  };

  const toggleSubfeature = (key) => {
    setSubfeatureDraft((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <SectionHeading title="Basic settings" />
      <SettingRow label="Product category">
        <SetLink onClick={() => setCategoryModalOpen(true)}>Set product category</SetLink>
      </SettingRow>
      <SettingRow label="Product unit">
        <SetLink onClick={() => setUnitModalOpen(true)}>Set unit</SetLink>
      </SettingRow>
      <SettingRow label="Inventory costing method">
        <span className="text-sm text-gray-900">Average cost</span>
      </SettingRow>

      <SectionHeading
        title="Subfeature settings"
        editing={subfeatureEditing}
        onEdit={startSubfeatureEdit}
      />
      {subfeatureLabels.map(([key, label]) => (
        <SettingRow key={key} label={label}>
          {subfeatureEditing ? (
            <ToggleSwitch
              checked={subfeatureDraft[key]}
              onChange={() => toggleSubfeature(key)}
            />
          ) : (
            <StatusText active={savedSubfeatures[key]} />
          )}
        </SettingRow>
      ))}
      {subfeatureEditing && (
        <div className="flex justify-end gap-2.5 pt-4">
          <button type="button" className={btnModalCancel} onClick={cancelSubfeatureEdit}>
            Batal
          </button>
          <button type="button" className={btnModalSubmit} onClick={saveSubfeatureEdit}>
            Simpan perubahan
          </button>
        </div>
      )}

      <SectionHeading title="Other settings" />
      <SettingRow label="Batch reminder">
        <SetLink onClick={() => setBatchReminderModalOpen(true)}>Set batch reminder</SetLink>
      </SettingRow>

      {categoryModalOpen && (
        <ListSetModal
          title="Set product category"
          nameLabel="Product category"
          addLabel="Add category"
          searchPlaceholder="Search product category"
          noun="product category"
          onClose={() => setCategoryModalOpen(false)}
        />
      )}

      {unitModalOpen && (
        <ListSetModal
          title="Set unit"
          nameLabel="Unit"
          addLabel="Add unit"
          searchPlaceholder="Search unit"
          noun="unit"
          onClose={() => setUnitModalOpen(false)}
        />
      )}

      {batchReminderModalOpen && (
        <BatchReminderModal onClose={() => setBatchReminderModalOpen(false)} />
      )}
    </div>
  );
}

function WarehouseTab() {
  const [savedStatus, setSavedStatus] = useState(false);
  const [draftStatus, setDraftStatus] = useState(false);
  const [editing, setEditing] = useState(false);

  const startEdit = () => {
    setDraftStatus(savedStatus);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraftStatus(savedStatus);
  };

  const saveEdit = () => {
    setSavedStatus(draftStatus);
    setEditing(false);
  };

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <SectionHeading title="Storage location" editing={editing} onEdit={startEdit} />
      <p className="m-0 py-3.5 text-[13px] leading-relaxed text-slate-500">
        By activating this feature, you can manage storage locations in your warehouses at a
        specific level, such as area, rack, or bin.
      </p>
      <SettingRow label="Feature status">
        {editing ? (
          <ToggleSwitch checked={draftStatus} onChange={() => setDraftStatus(!draftStatus)} />
        ) : (
          <StatusText active={savedStatus} />
        )}
      </SettingRow>
      {editing && (
        <div className="flex justify-end gap-2.5 pt-4">
          <button type="button" className={btnModalCancel} onClick={cancelEdit}>
            Batal
          </button>
          <button type="button" className={btnModalSubmit} onClick={saveEdit}>
            Simpan perubahan
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [mainPage, setMainPage] = useState(true);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Products</h2>
      </div>

      <MainTab mainPage={mainPage} setMainPage={setMainPage} />

      {mainPage ? <GoodsAndServicesTab /> : <WarehouseTab />}
    </div>
  );
}
