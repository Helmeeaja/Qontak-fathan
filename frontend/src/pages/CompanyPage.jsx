import { useState } from "react";
import { Pencil } from "@phosphor-icons/react";
import {
  btnModalCancel,
  btnModalSubmit,
  btnSecondary,
  formLabel,
  inputBase,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";
import RegionSelects from "@/components/ui/RegionSelects";
import brandLogo from "@/assets/brand.png";
import {
  baseCurrencyOptions,
  companySizeOptions,
  currencyFormatOptions,
  featureLabels,
  industryOptions,
  initialCompany,
} from "@/data/dummy";

function Card({ title, editing, onEdit, children }) {
  return (
    <section className="rounded-[10px] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 className="m-0 text-[19px] font-bold text-gray-900">{title}</h2>
        {!editing && (
          <button type="button" className={btnSecondary} onClick={onEdit}>
            <Pencil size={14} />
            <span>Edit</span>
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function InfoField({ label, value, full }) {
  return (
    <div className={full ? "col-span-full" : ""}>
      <div className="text-[13px] text-slate-500">{label}</div>
      <div className="mt-0.5 break-words text-sm font-medium text-gray-900">
        {value || "-"}
      </div>
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

function CheckRow({ label, checked, disabled, onChange }) {
  return (
    <label className="flex select-none items-center gap-2.5 text-sm text-gray-700">
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer accent-brand disabled:cursor-not-allowed disabled:opacity-60"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

function EditActions({ onCancel, onSave }) {
  return (
    <div className="col-span-full mt-[6px] flex justify-end gap-2.5">
      <button type="button" className={btnModalCancel} onClick={onCancel}>
        Batal
      </button>
      <button type="button" className={btnModalSubmit} onClick={onSave}>
        Simpan
      </button>
    </div>
  );
}

function CompanyInfoCard({ company, draft, editing, onEdit, setField, setDraft, onCancel, onSave }) {
  return (
    <Card title="Informasi Perusahaan" editing={editing} onEdit={onEdit}>
      {editing ? (
        <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
          <EditField label="Nama perusahaan">
            <input
              className={inputBase}
              value={draft.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </EditField>

          <EditField label="Email perusahaan">
            <input
              type="email"
              className={inputBase}
              value={draft.companyEmail}
              onChange={(e) => setField("companyEmail", e.target.value)}
            />
          </EditField>

          <EditField label="Nomor telepon">
            <input
              className={inputBase}
              value={draft.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </EditField>

          <EditField label="Jenis industri">
            <select
              className={selectBase}
              value={draft.industry}
              onChange={(e) => setField("industry", e.target.value)}
            >
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </EditField>

          {draft.industry === "Lainnya" && (
            <EditField label="Sebutkan industri">
              <input
                className={inputBase}
                value={draft.industryOther}
                placeholder="Tulis jenis industri usaha"
                onChange={(e) => setField("industryOther", e.target.value)}
              />
            </EditField>
          )}

          <EditField label="Alamat perusahaan" full>
            <textarea
              rows="2"
              className={textareaBase}
              value={draft.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </EditField>

          <RegionSelects
            value={{ province: draft.province, city: draft.city }}
            onChange={(region) => setDraft((current) => ({ ...current, ...region }))}
            fields={["province", "city"]}
          />

          <EditField label="Kode pos">
            <input
              className={inputBase}
              value={draft.postalCode}
              onChange={(e) => setField("postalCode", e.target.value)}
            />
          </EditField>

          <EditField label="Ukuran perusahaan">
            <select
              className={selectBase}
              value={draft.companySize}
              onChange={(e) => setField("companySize", e.target.value)}
            >
              {companySizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </EditField>

          <EditActions onCancel={onCancel} onSave={onSave} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-4 max-md:grid-cols-1">
          <InfoField label="Nama perusahaan" value={company.name} />
          <InfoField label="Email perusahaan" value={company.companyEmail} />
          <InfoField label="Nomor telepon" value={company.phone} />
          <InfoField
            label="Jenis industri"
            value={
              company.industry === "Lainnya"
                ? company.industryOther || "Lainnya"
                : company.industry
            }
          />
          <InfoField label="Alamat perusahaan" value={company.address} full />
          <InfoField label="Provinsi" value={company.province} />
          <InfoField label="Kota/Kabupaten" value={company.city} />
          <InfoField label="Kode pos" value={company.postalCode} />
          <InfoField label="Ukuran perusahaan" value={company.companySize} />
        </div>
      )}
    </Card>
  );
}

function BankInfoCard({ company, draft, editing, onEdit, setField, onCancel, onSave }) {
  return (
    <Card title="Informasi Rekening Bank" editing={editing} onEdit={onEdit}>
      {editing ? (
        <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
          <EditField label="Nama bank">
            <input
              className={inputBase}
              value={draft.bankName}
              onChange={(e) => setField("bankName", e.target.value)}
            />
          </EditField>

          <EditField label="Kode SWIFT">
            <input
              className={inputBase}
              value={draft.swiftCode}
              onChange={(e) => setField("swiftCode", e.target.value)}
            />
          </EditField>

          <EditField label="Kantor cabang" full>
            <input
              className={inputBase}
              value={draft.branchOffice}
              onChange={(e) => setField("branchOffice", e.target.value)}
            />
          </EditField>

          <EditField label="Alamat cabang" full>
            <input
              className={inputBase}
              value={draft.branchAddress}
              onChange={(e) => setField("branchAddress", e.target.value)}
            />
          </EditField>

          <EditField label="Nomor rekening">
            <input
              className={inputBase}
              value={draft.accountNumber}
              onChange={(e) => setField("accountNumber", e.target.value)}
            />
          </EditField>

          <EditField label="Nama pemilik rekening">
            <input
              className={inputBase}
              value={draft.accountHolder}
              onChange={(e) => setField("accountHolder", e.target.value)}
            />
          </EditField>

          <EditActions onCancel={onCancel} onSave={onSave} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-4 max-md:grid-cols-1">
          <InfoField label="Nama bank" value={company.bankName} />
          <InfoField label="Kode SWIFT" value={company.swiftCode} />
          <InfoField label="Kantor cabang" value={company.branchOffice} />
          <InfoField label="Alamat cabang" value={company.branchAddress} full />
          <InfoField label="Nomor rekening" value={company.accountNumber} />
          <InfoField label="Nama pemilik rekening" value={company.accountHolder} />
        </div>
      )}
    </Card>
  );
}

function OtherInfoCard({ company, draft, editing, onEdit, setField, onLogoPick, onCancel, onSave }) {
  return (
    <Card title="Informasi Lainnya" editing={editing} onEdit={onEdit}>
      {editing ? (
        <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
          <EditField label="Logo perusahaan">
            <input
              type="file"
              accept="image/*"
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-slate-500 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700"
              onChange={onLogoPick}
            />
            <div className="mt-2 flex items-center gap-2.5">
              <img
                src={brandLogo}
                alt="Logo perusahaan"
                className="h-9 w-9 rounded-md object-contain"
              />
              <span className="text-sm text-slate-500">
                {draft.logoName || "Belum ada logo"}
              </span>
            </div>
          </EditField>

          <EditField label="Nomor fax">
            <input
              className={inputBase}
              value={draft.fax}
              onChange={(e) => setField("fax", e.target.value)}
            />
          </EditField>

          <EditField label="Alamat pengiriman" full>
            <input
              className={inputBase}
              value={draft.shippingAddress}
              onChange={(e) => setField("shippingAddress", e.target.value)}
            />
          </EditField>

          <EditField label="Alamat penagihan" full>
            <input
              className={inputBase}
              value={draft.billingAddress}
              onChange={(e) => setField("billingAddress", e.target.value)}
            />
          </EditField>

          <EditField label="Nomor Pokok Wajib Pajak (NPWP)">
            <input
              className={inputBase}
              value={draft.tin}
              onChange={(e) => setField("tin", e.target.value)}
            />
          </EditField>

          <EditField label="Situs web">
            <input
              className={inputBase}
              value={draft.website}
              onChange={(e) => setField("website", e.target.value)}
            />
          </EditField>

          <EditField label="Email">
            <input
              type="email"
              className={inputBase}
              value={draft.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </EditField>

          <div className="flex items-center">
            <CheckRow
              label="Tampilkan logo di laporan"
              checked={draft.showLogoInReport}
              onChange={() => setField("showLogoInReport", !draft.showLogoInReport)}
            />
          </div>

          <EditActions onCancel={onCancel} onSave={onSave} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-4 max-md:grid-cols-1">
          <div className="col-span-full">
            <div className="text-[13px] text-slate-500">Company logo</div>
            <div className="mt-1.5 flex items-center gap-2.5">
              <img
                src={brandLogo}
                alt="Logo perusahaan"
                className="h-10 w-10 rounded-md object-contain"
              />
              <span className="text-sm font-medium text-gray-900">
                {company.logoName || "-"}
              </span>
            </div>
          </div>

          <InfoField label="Alamat pengiriman" value={company.shippingAddress} full />
          <InfoField label="Alamat penagihan" value={company.billingAddress} full />
          <InfoField label="Nomor Pokok Wajib Pajak (NPWP)" value={company.tin} />
          <InfoField label="Nomor fax" value={company.fax} />
          <InfoField label="Situs web" value={company.website} />
          <InfoField label="Email" value={company.email} />

          <div className="col-span-full">
            <CheckRow
              label="Tampilkan logo di laporan"
              checked={company.showLogoInReport}
              disabled
              onChange={() => {}}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

function FeaturesCard({ company, draft, editing, onEdit, setField, toggleFeature, onCancel, onSave }) {
  return (
    <Card title="Pengaturan Fitur Tambahan" editing={editing} onEdit={onEdit}>
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-3 max-md:grid-cols-1">
        {featureLabels.map(([key, label]) => (
          <CheckRow
            key={key}
            label={label}
            checked={editing ? draft.features[key] : company.features[key]}
            disabled={!editing}
            onChange={() => toggleFeature(key)}
          />
        ))}
      </div>

      {editing ? (
        <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
          <EditField label="Mata uang dasar">
            <select
              className={selectBase}
              value={draft.baseCurrency}
              onChange={(e) => setField("baseCurrency", e.target.value)}
            >
              {baseCurrencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </EditField>

          <EditField label="Format mata uang">
            <select
              className={selectBase}
              value={draft.currencyFormat}
              onChange={(e) => setField("currencyFormat", e.target.value)}
            >
              {currencyFormatOptions.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </EditField>

          <EditActions onCancel={onCancel} onSave={onSave} />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-x-[18px] gap-y-4 max-md:grid-cols-1">
          <InfoField label="Mata uang dasar" value={company.baseCurrency} />
          <InfoField label="Format mata uang" value={company.currencyFormat} />
        </div>
      )}
    </Card>
  );
}

export default function CompanyPage() {
  const [company, setCompany] = useState(initialCompany);
  const [editingCard, setEditingCard] = useState(null);
  const [draft, setDraft] = useState(null);

  const startEdit = (card) => {
    setDraft({ ...company, features: { ...company.features } });
    setEditingCard(card);
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setDraft(null);
  };

  const saveEdit = () => {
    setCompany(draft);
    setEditingCard(null);
    setDraft(null);
  };

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleFeature = (key) => {
    setDraft((current) => ({
      ...current,
      features: { ...current.features, [key]: !current.features[key] },
    }));
  };

  const onLogoPick = (event) => {
    const file = event.target.files?.[0];
    if (file) setField("logoName", file.name);
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6">
        <h1 className="m-0 text-[28px] font-bold text-gray-900">Company</h1>
        <p className="m-0 mt-1.5 text-slate-500">
          Kelola informasi perusahaan QontakSales.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <CompanyInfoCard
          company={company}
          draft={draft}
          editing={editingCard === "company"}
          onEdit={() => startEdit("company")}
          setField={setField}
          setDraft={setDraft}
          onCancel={cancelEdit}
          onSave={saveEdit}
        />

        <BankInfoCard
          company={company}
          draft={draft}
          editing={editingCard === "bank"}
          onEdit={() => startEdit("bank")}
          setField={setField}
          onCancel={cancelEdit}
          onSave={saveEdit}
        />

        <OtherInfoCard
          company={company}
          draft={draft}
          editing={editingCard === "other"}
          onEdit={() => startEdit("other")}
          setField={setField}
          onLogoPick={onLogoPick}
          onCancel={cancelEdit}
          onSave={saveEdit}
        />

        <FeaturesCard
          company={company}
          draft={draft}
          editing={editingCard === "features"}
          onEdit={() => startEdit("features")}
          setField={setField}
          toggleFeature={toggleFeature}
          onCancel={cancelEdit}
          onSave={saveEdit}
        />
      </div>
    </div>
  );
}
