import { useState } from "react";
import { Pencil } from "@phosphor-icons/react";
import {
  btnModalCancel,
  btnModalSubmit,
  btnSecondary,
  formLabel,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";

const initalPurchase = {
  purchasesTerm: "Net 30",
  purchaseRequest: false,
  shipping: false,
  discount: false,
  discountPerLine: false,
  deposit: false,
  defaultPurchase: "",
};
const purchasesTermOption = ["Net 15", "Net 30", "Net 50", "Cash On Delivery", "Custom"];

function CheckRow({ label, checked, disabled, onChange }) {
  return (
    <label className={`flex select-none items-start gap-2.5 ${disabled ? "" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span>
        <span className="block text-sm text-gray-700">{label}</span>
      </span>
    </label>
  );
}

function EditField({ label, full, children }) {
  return (
    <div className={full ? "col-span-full" : ""}>
      <label className={formLabel}>{label}</label>
      {children}
    </div>
  );
}

export default function PurchasesPage() {
  const [draft, setDraft] = useState(initalPurchase);
  const [save, setSave] = useState(initalPurchase);
  const [editing, setEditing] = useState(false);

  const readOnly = !editing;

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleField = (field) => {
    setDraft((current) => ({ ...current, [field]: !current[field] }));
  };

  const startEdit = () => {
    setDraft(save);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(save);
  };

  const saving = () => {
    setSave(draft);
    setEditing(false);
  };
  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Purchase</h2>
      </div>

      <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 className="m-0 text-[19px] font-bold text-gray-900">Pengaturan Pembelian</h2>
          {!editing && (
            <button type="button" className={btnSecondary} onClick={startEdit}>
              <Pencil size={14} />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
          <EditField label="Termin pembayaran invoice">
            <select
              className={selectBase}
              value={draft.purchasesTerm}
              disabled={readOnly}
              onChange={(e) => setField("purchasesTerm", e.target.value)}
            >
              {purchasesTermOption.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </EditField>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-[18px] gap-y-3.5 max-md:grid-cols-1">
          <CheckRow
            label="Activate Suplier in purchase request"
            checked={draft.purchaseRequest}
            disabled={readOnly}
            onChange={() => toggleField("purchaseRequest")}
          />
          <CheckRow
            label="Shipping"
            checked={draft.shipping}
            disabled={readOnly}
            onChange={() => toggleField("shipping")}
          />
          <CheckRow
            label="Discount"
            checked={draft.discount}
            disabled={readOnly}
            onChange={() => toggleField("discount")}
          />
          <CheckRow
            label="discount per lines"
            checked={draft.discountPerLine}
            disabled={readOnly}
            onChange={() => toggleField("discountPerLine")}
          />
          <CheckRow
            label="Deposit"
            checked={draft.deposit}
            disabled={readOnly}
            onChange={() => toggleField("deposit")}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-[18px]">
          <EditField label="Defaul purchase message" full>
            <textarea
              rows="3"
              className={textareaBase}
              placeholder="Pesan yang tampil secara default pada form penjualan"
              value={draft.defaultPurchase}
              disabled={readOnly}
              onChange={(e) => setField("defaultPurchase", e.target.value)}
            />
          </EditField>
        </div>

        {editing && (
          <div className="mt-6 flex justify-end gap-2.5 border-t border-gray-200 pt-5">
            <button type="button" className={btnModalCancel} onClick={cancelEdit}>
              Batal
            </button>
            <button type="button" className={btnModalSubmit} onClick={saving}>
              Simpan perubahan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
