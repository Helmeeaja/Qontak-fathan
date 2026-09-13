import { useState } from "react";
import {
  btnModalSubmit,
  formLabel,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";

const initialSalesSettings = {
  invoiceTerm: "Net 30",
  shipping: false,
  discount: false,
  discountPerLine: false,
  discountAccountPerProduct: false,
  downPayment: false,
  showProfitOnInvoice: false,
  blockSalesOnLowStock: false,
  priceRuleForSalePrice: false,
  defaultSalesMessage: "",
  defaultDeliveryOrderMessage: "",
};

const invoiceTermOptions = ["Net 15", "Net 30", "Net 60", "Cash On Delivery", "Custom"];

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
        Form setting
      </button>

      <button
        className={
          !mainPage
            ? "border-b border-brand bg-white p-2 text-brand"
            : "p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
        }
        onClick={() => setMainPage(false)}
      >
        Invoice reminder
      </button>
    </div>
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

function CheckRow({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-start gap-2.5">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 cursor-pointer accent-brand"
        checked={checked}
        onChange={onChange}
      />
      <span>
        <span className="block text-sm text-gray-700">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[13px] text-slate-500">{description}</span>
        )}
      </span>
    </label>
  );
}

function FormSetting() {
  const [savedSettings, setSavedSettings] = useState(initialSalesSettings);
  const [draft, setDraft] = useState(initialSalesSettings);

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleField = (field) => {
    setDraft((current) => ({ ...current, [field]: !current[field] }));
  };

  const handleSave = () => {
    setSavedSettings(draft);
  };

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <h2 className="m-0 text-[19px] font-bold text-gray-900">Pengaturan Penjualan</h2>
      <p className="m-0 mt-1 text-sm text-slate-500">
        Atur opsi default yang dipakai saat membuat penawaran dan invoice penjualan.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
        <EditField label="Termin pembayaran invoice">
          <select
            className={selectBase}
            value={draft.invoiceTerm}
            onChange={(e) => setField("invoiceTerm", e.target.value)}
          >
            {invoiceTermOptions.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </EditField>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-[18px] gap-y-3.5 max-md:grid-cols-1">
        <CheckRow
          label="Pengiriman"
          checked={draft.shipping}
          onChange={() => toggleField("shipping")}
        />
        <CheckRow
          label="Diskon"
          checked={draft.discount}
          onChange={() => toggleField("discount")}
        />
        <CheckRow
          label="Diskon per baris"
          checked={draft.discountPerLine}
          onChange={() => toggleField("discountPerLine")}
        />
        <CheckRow
          label="Akun diskon per produk"
          checked={draft.discountAccountPerProduct}
          onChange={() => toggleField("discountAccountPerProduct")}
        />
        <CheckRow
          label="Uang muka"
          checked={draft.downPayment}
          onChange={() => toggleField("downPayment")}
        />
        <CheckRow
          label="Tampilkan profit % pada form invoice"
          checked={draft.showProfitOnInvoice}
          onChange={() => toggleField("showProfitOnInvoice")}
        />
        <CheckRow
          label="Nonaktifkan penjualan jika stok tidak mencukupi"
          description="Sistem menolak pembuatan invoice penjualan ketika stok produk tidak tersedia atau tidak mencukupi."
          checked={draft.blockSalesOnLowStock}
          onChange={() => toggleField("blockSalesOnLowStock")}
        />
        <CheckRow
          label="Harga jual menggunakan aturan harga"
          checked={draft.priceRuleForSalePrice}
          onChange={() => toggleField("priceRuleForSalePrice")}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-[18px]">
        <EditField label="Pesan penjualan default" full>
          <textarea
            rows="3"
            className={textareaBase}
            placeholder="Pesan yang tampil secara default pada form penjualan"
            value={draft.defaultSalesMessage}
            onChange={(e) => setField("defaultSalesMessage", e.target.value)}
          />
        </EditField>

        <EditField label="Pesan surat jalan default" full>
          <textarea
            rows="3"
            className={textareaBase}
            placeholder="Pesan yang tampil secara default pada surat jalan"
            value={draft.defaultDeliveryOrderMessage}
            onChange={(e) => setField("defaultDeliveryOrderMessage", e.target.value)}
          />
        </EditField>
      </div>

      <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
        <button type="button" className={btnModalSubmit} onClick={handleSave}>
          Simpan perubahan
        </button>
      </div>
    </div>
  );
}

function IntervalReminderModal({ onClose }) {
  const [days, setDays] = useState(7);
  const [timing, setTiming] = useState("Sebelum");
  const [emailSubject, setEmailSubject] = useState(
    "[NamaPerusahaan] - Invoice [NomorInvoice] jatuh tempo pada [TanggalJatuhTempo]",
  );
  const [emailBody, setEmailBody] = useState(
    "Kepada [NamaPelanggan],\n\nKami ingin mengingatkan bahwa invoice Anda dengan nomor [NomorInvoice] sebesar [SisaTagihan] belum dibayar dan jatuh tempo pada [TanggalJatuhTempo]. Mohon segera melakukan pembayaran.\n\nJika pembayaran sudah dilakukan, silakan abaikan email ini. Jika ada pertanyaan, hubungi kami di [EmailPerusahaan].\n\nSalam,\n[NamaPerusahaan]",
  );
  const [attachInvoicePdf, setAttachInvoicePdf] = useState(true);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-[22px] py-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">Tambah interval pengingat</h3>
        </div>

        <div className="px-[22px] py-5">
          <div className="mb-5">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Kirim pengingat
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                name="reminderDays"
                type="number"
                min="1"
                className="w-[80px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                value={days}
                onChange={(event) => setDays(event.target.value)}
              />
              <span className="text-sm text-gray-700">hari</span>
              <select
                name="reminderTiming"
                className="w-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                value={timing}
                onChange={(event) => setTiming(event.target.value)}
              >
                <option value="Sebelum">Sebelum</option>
                <option value="Sesudah">Sesudah</option>
              </select>
              <span className="text-sm text-gray-700">tanggal jatuh tempo invoice</span>
            </div>
          </div>

          <div className="mb-2">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Template email
            </label>
            <p className="m-0 mb-3 text-[13px] text-slate-500">
              Gunakan placeholder sebagai bagian dari isi email.
            </p>

            <input
              name="emailSubject"
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              value={emailSubject}
              onChange={(event) => setEmailSubject(event.target.value)}
            />

            <textarea
              name="emailBody"
              rows="8"
              className="mt-3 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-[11px] text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              value={emailBody}
              onChange={(event) => setEmailBody(event.target.value)}
            />
          </div>

          <label className="mt-1 flex cursor-pointer select-none items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer accent-brand"
              checked={attachInvoicePdf}
              onChange={() => setAttachInvoicePdf(!attachInvoicePdf)}
            />
            <span className="text-sm text-gray-700">
              Lampirkan PDF invoice pada email
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border border-gray-300 bg-white px-[15px] py-[9px] text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
            onClick={onClose}
          >
            Kembali
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-brand px-[15px] py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
            onClick={onClose}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function InvoiceReminder() {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [saleType, setSaleType] = useState("Invoice penjualan");
  const [intervalPopupOpen, setIntervalPopupOpen] = useState(false);
  const [nominalBelow, setNominalBelow] = useState("");
  const [disableLowNominal, setDisableLowNominal] = useState(false);
  const [disableSelectedCustomers, setDisableSelectedCustomers] = useState(false);
  const [disableSelectedInvoices, setDisableSelectedInvoices] = useState(false);

  const handleSave = () => {
    setIntervalPopupOpen(false);
  };

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer select-none items-center gap-3">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={reminderEnabled}
            onChange={() => setReminderEnabled(!reminderEnabled)}
          />
          <span className="relative h-[22px] w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[18px]"></span>
          <span className="text-sm font-semibold text-gray-700">
            Kirim email pengingat invoice
          </span>
        </label>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
            Jenis penjualan
          </label>
          <select
            name="saleType"
            className={selectBase}
            value={saleType}
            disabled={!reminderEnabled}
            onChange={(event) => setSaleType(event.target.value)}
          >
            <option value="Invoice penjualan">Invoice penjualan</option>
            <option value="Pesanan penjualan">Pesanan penjualan</option>
            <option value="Keduanya">Keduanya</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <label className={`${formLabel} m-0`}>Interval</label>
        <button
          type="button"
          className="border-0 bg-transparent p-0 text-[13px] font-semibold text-brand enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!reminderEnabled}
          onClick={() => setIntervalPopupOpen(true)}
        >
          + Tambah interval
        </button>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Nonaktifkan pengingat untuk :</label>
      </div>

      <div className="mt-3 flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex select-none items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              checked={disableLowNominal}
              disabled={!reminderEnabled}
              onChange={() => setDisableLowNominal(!disableLowNominal)}
            />
            <span className="text-sm text-gray-700">Nominal di bawah</span>
          </label>
          <input
            type="text"
            placeholder="Rp.0,00"
            className="w-[160px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100"
            value={nominalBelow}
            disabled={!reminderEnabled}
            onChange={(event) => setNominalBelow(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex select-none items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              checked={disableSelectedCustomers}
              disabled={!reminderEnabled}
              onChange={() => setDisableSelectedCustomers(!disableSelectedCustomers)}
            />
            <span className="text-sm text-gray-700">0 pelanggan terpilih</span>
          </label>
          <span className="text-[13px] text-slate-500">(lihat tambah daftar)</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex select-none items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              checked={disableSelectedInvoices}
              disabled={!reminderEnabled}
              onChange={() => setDisableSelectedInvoices(!disableSelectedInvoices)}
            />
            <span className="text-sm text-gray-700">0 invoice terpilih</span>
          </label>
          <span className="text-[13px] text-slate-500">(lihat tambah daftar)</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
        <button type="button" className={btnModalSubmit} onClick={handleSave}>
          Simpan perubahan
        </button>
      </div>

      {intervalPopupOpen && (
        <IntervalReminderModal onClose={() => setIntervalPopupOpen(false)} />
      )}
    </div>
  );
}

export default function SalesPage() {
  const [mainPage, setMainPage] = useState(true);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Sales</h2>
      </div>

      <MainTab mainPage={mainPage} setMainPage={setMainPage} />

      {mainPage ? <FormSetting /> : <InvoiceReminder />}
    </div>
  );
}
