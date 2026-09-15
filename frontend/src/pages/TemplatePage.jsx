import { useState } from "react";
import { CaretDown, Trash, Info } from "@phosphor-icons/react";
import {
  selectBase,
  inputBase,
  formLabel,
  textareaBase,
  btnModalCancel,
  btnModalSubmit,
} from "@/components/ui/styles";
import {
  Envelope,
  FilePdf,
  WhatsappLogo,
} from  "@phosphor-icons/react";
import { PdfPaper } from "@/components/pdf/PdfPapers";
const TabEmail = ["Sales Invoice", "Sales Quote", "Sales Order", "Purchase Order"];
const TabPDF = ["General Setting", "Customize PDF"];
const TabWA = ["Sales Template Message", "Order Template Message"];

function TabNav({
  tab,
  setTab,
  emailTemplate,
  setEmailTemplate,
  pdfTemplate,
  setPdfTemplate,
  whatsappTemplate,
  setWhatsappTemplate,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <label className={formLabel}>Email Template</label>
        <select
          className={selectBase}
          value={tab === "email" ? emailTemplate : ""}
          onChange={(event) => {
            setEmailTemplate(event.target.value);
            setTab("email");
          }}
        >
          <option value="" disabled>
            Pilih template
          </option>
          {TabEmail.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={formLabel}>PDF Template</label>
        <select
          className={selectBase}
          value={tab === "pdf" ? pdfTemplate : ""}
          onChange={(event) => {
            setPdfTemplate(event.target.value);
            setTab("pdf");
          }}
        >
          <option value="" disabled>
            Pilih template
          </option>
          {TabPDF.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={formLabel}>WhatsApp Template</label>
        <select
          className={selectBase}
          value={tab === "whatsapp" ? whatsappTemplate : ""}
          onChange={(event) => {
            setWhatsappTemplate(event.target.value);
            setTab("whatsapp");
          }}
        >
          <option value="" disabled>
            Pilih template
          </option>
          {TabWA.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-gray-600">{title}</h2>
      <hr className="border border-slate-300" />
    </div>
  );
}

function SavedNote({ saved }) {
  if (!saved) return null;
  return (
    <p className="m-0 text-[13px] font-semibold text-green-600">
      Template tersimpan.
    </p>
  );
}

function SalesInvoice() {
  const [subject, setSubject] = useState("Faktur Penjualan #[NomorTransaksi]");
  const [message, setMessage] = useState(
    "Yth. [NamaCustomer],\nTerima kasih atas bisnis Anda.\n\nBerikut adalah Faktur #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]"
  );
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="Sales Invoice Email Template" />
      <div className="mt-2 pt-3">
        <div className="flex gap-15 items-center mt-3 pt-5">
          <label className={formLabel}>Subject</label>
          <input
            type="text"
            className={inputBase}
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex gap-15 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="10"
            className={textareaBase}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Variabel</label>
          <p>
            [NamaCustomer] [PerusahaanCustomer] [NomorTransaksi]
            [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan]
            [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <SavedNote saved={saved} />
          <button className={btnModalSubmit} onClick={() => setSaved(true)}>
            Update Template
          </button>
        </div>
      </div>
    </div>
  );
}

function SalesQuote() {
  const [subject, setSubject] = useState(
    "Penawaran Penjualan #[NomorTransaksi]"
  );
  const [message, setMessage] = useState(
    "Yth. [NamaCustomer],\nTerima kasih atas permintaan penawaran Anda.\n\nBerikut adalah penawaran #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]"
  );
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="Sales Quote Email Template" />
      <div className="mt-2 pt-3">
        <div className="flex gap-15 items-center mt-3 pt-5">
          <label className={formLabel}>Subject</label>
          <input
            type="text"
            className={inputBase}
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex gap-15 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="10"
            className={textareaBase}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Variabel</label>
          <p>
            [NamaCustomer] [PerusahaanCustomer] [NomorTransaksi]
            [TanggalTransaksi] [TanggalExpiry] [NamaPerusahaan]
            [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <SavedNote saved={saved} />
          <button className={btnModalSubmit} onClick={() => setSaved(true)}>
            Update Template
          </button>
        </div>
      </div>
    </div>
  );
}

function SalesOrder() {
  const [subject, setSubject] = useState(
    "Pemesanan Penjualan #[NomorTransaksi]"
  );
  const [message, setMessage] = useState(
    "Yth. [NamaCustomer],\nTerima kasih atas bisnis Anda.\n\nBerikut adalah Pemesanan Penjualan #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]"
  );
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="Sales Order Email Template" />
      <div className="mt-2 pt-3">
        <div className="flex gap-15 items-center mt-3 pt-5">
          <label className={formLabel}>Subject</label>
          <input
            type="text"
            className={inputBase}
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex gap-15 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="10"
            className={textareaBase}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Variabel</label>
          <p>
            [NamaCustomer] [PerusahaanCustomer] [NomorTransaksi]
            [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan]
            [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <SavedNote saved={saved} />
          <button className={btnModalSubmit} onClick={() => setSaved(true)}>
            Update Template
          </button>
        </div>
      </div>
    </div>
  );
}

function PurchaseOrder() {
  const [subject, setSubject] = useState(
    "Pemesanan Pembelian #[NomorTransaksi]"
  );
  const [message, setMessage] = useState(
    "Yth. [NamaVendor],\nBerikut adalah Pemesanan Pembelian #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]"
  );
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="Purchase Order Email Template" />
      <div className="mt-2 pt-3">
        <div className="flex gap-15 items-center mt-3 pt-5">
          <label className={formLabel}>Subject</label>
          <input
            type="text"
            className={inputBase}
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex gap-15 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="10"
            className={textareaBase}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Variabel</label>
          <p>
            [NamaVendor] [PerusahaanVendor] [NomorTransaksi]
            [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan]
            [EmailPerusahaan] [AlamatPengirimianPerusahaan] [SisaTagihan]
            [TanggalHariIni]
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <SavedNote saved={saved} />
          <button className={btnModalSubmit} onClick={() => setSaved(true)}>
            Update Template
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckboxRow({ label, checked, onChange, disabled }) {
  return (
    <label
      className={
        disabled
          ? "flex items-center gap-2.5 py-2 text-sm text-slate-400"
          : "flex cursor-pointer items-center gap-2.5 py-2 text-sm text-slate-700"
      }
    >
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center">
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

function ToggleRow({ label, info, checked, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="flex items-center gap-2">
        <ToggleSwitch checked={checked} onChange={onChange} />
        {info && <Info size={16} className="text-slate-400" />}
      </span>
    </div>
  );
}

function SignatureForSelect({ selected, setSelected, saved, setSaved }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const options = [
    "Sales Invoice",
    "Sales Order",
    "Sales Quote",
    "Sales Return",
    "Receive Payment",
    "Sales Order Payment",
    "Purchase Invoice",
    "Purchase Order",
    "Purchase Return",
    "Payment",
  ];
  const visible = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="flex min-h-[42px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2 py-1.5"
        onClick={() => setOpen(!open)}
      >
        {selected.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[13px] font-semibold text-brand"
          >
            {item}
            <span
              className="cursor-pointer font-bold text-blue-400"
              onClick={(event) => {
                event.stopPropagation();
                setSelected(selected.filter((value) => value !== item));
                setSaved(false);
              }}
            >
              ×
            </span>
          </span>
        ))}
        {selected.length === 0 && (
          <span className="px-1 text-sm text-slate-400">
            Pilih dokumen
          </span>
        )}
        <CaretDown size={16} className="ml-auto text-slate-400" />
      </div>

      {open && (
        <div className="absolute left-0 top-full z-[100] mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <input
            type="text"
            className="m-2 w-[calc(100%-16px)] rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-brand"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div
            className="flex cursor-pointer items-center justify-between border-y border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600"
            onClick={() => {
              setSelected(selected.length === options.length ? [] : options);
              setSaved(false);
            }}
          >
            All
            {selected.length === options.length && (
              <span className="text-brand">✓</span>
            )}
          </div>
          <div className="max-h-[220px] overflow-y-auto">
            {visible.map((item) => (
              <div
                key={item}
                className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  if (selected.includes(item)) {
                    setSelected(selected.filter((value) => value !== item));
                  } else {
                    setSelected([...selected, item]);
                  }
                  setSaved(false);
                }}
              >
                {item}
                {selected.includes(item) && (
                  <span className="text-brand">✓</span>
                )}
              </div>
            ))}
            {visible.length === 0 && (
              <p className="px-3 py-2 text-sm text-slate-400">
                No matches found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GeneralSetting() {
  const [useFooter, setUseFooter] = useState(true);
  const [useSignature, setUseSignature] = useState(false);
  const [useDraftWatermark, setUseDraftWatermark] = useState(false);
  const [useQrMekariPay, setUseQrMekariPay] = useState(false);
  const [signatureTypes, setSignatureTypes] = useState([]);
  const [signatureName, setSignatureName] = useState("");
  const [signatureRows, setSignatureRows] = useState([
    { option: "", text: "" },
    { option: "", text: "" },
    { option: "", text: "" },
  ]);
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="PDF Setup" />
      <div className="mt-2 pt-3">
        <ToggleRow
          label="Use Footer"
          info
          checked={useFooter}
          onChange={() => {
            setUseFooter(!useFooter);
            setSaved(false);
          }}
        />
        <ToggleRow
          label="Use Signature"
          checked={useSignature}
          onChange={() => {
            setUseSignature(!useSignature);
            setSaved(false);
          }}
        />
        <ToggleRow
          label="Use Draft Watermark"
          info
          checked={useDraftWatermark}
          onChange={() => {
            setUseDraftWatermark(!useDraftWatermark);
            setSaved(false);
          }}
        />
        <ToggleRow
          label="Use QR Code Mekaripay"
          info
          checked={useQrMekariPay}
          onChange={() => {
            setUseQrMekariPay(!useQrMekariPay);
            setSaved(false);
          }}
        />

        {useSignature && (
          <div>
            <div className="mt-5 flex items-center justify-end">
              <span className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700">
                <Trash size={15} />
                Delete
              </span>
            </div>

            <div className="mt-3">
              <label className={formLabel}>Use this signature for</label>
              <SignatureForSelect
                selected={signatureTypes}
                setSelected={setSignatureTypes}
                setSaved={setSaved}
              />
            </div>

            <div className="mt-4 flex flex-col gap-5 lg:flex-row">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-6">
                <label className="cursor-pointer text-sm font-semibold text-brand hover:underline">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      setSignatureName(file ? file.name : "");
                      setSaved(false);
                    }}
                  />
                </label>
                {signatureName && (
                  <span className="mt-1 text-[13px] text-slate-600">
                    {signatureName}
                  </span>
                )}
                <p className="mt-2 m-0 text-[13px] text-slate-500">
                  recommended size:
                  <br />
                  100x100 (px)
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {signatureRows.map((row, index) => (
                  <div key={index} className="flex gap-3">
                    <select
                      className={selectBase}
                      value={row.option}
                      onChange={(event) => {
                        const next = [...signatureRows];
                        next[index] = {
                          ...next[index],
                          option: event.target.value,
                        };
                        setSignatureRows(next);
                        setSaved(false);
                      }}
                    >
                      <option value="">Custom (Type Manually)</option>
                      <option value="[User Name]">[User Name]</option>
                      <option value="[Company Name]">[Company Name]</option>
                    </select>
                    <input
                      type="text"
                      className={inputBase}
                      value={row.text}
                      disabled={row.option !== ""}
                      onChange={(event) => {
                        const next = [...signatureRows];
                        next[index] = {
                          ...next[index],
                          text: event.target.value,
                        };
                        setSignatureRows(next);
                        setSaved(false);
                      }}
                    />
                  </div>
                ))}
                <span className="self-end text-sm font-semibold text-brand">
                  Preview
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex cursor-pointer items-center rounded-md border-0 bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
              onClick={() => {
                setSignatureRows([...signatureRows, { option: "", text: "" }]);
                setSaved(false);
              }}
            >
              + Add Other Signature
            </button>
          </div>
        )}

        <hr className="mt-5 border-slate-200" />
        <p className="mt-4 text-[13px] text-slate-500">
          Note : We cannot guarantee that printed digital signature from this
          feature has complied with legislations or has been certified legally.
          For more information please visit{" "}
          <span className="cursor-pointer text-brand hover:underline">
            here
          </span>
        </p>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <SavedNote saved={saved} />
          <button
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-green-600 px-[15px] py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-green-700"
            onClick={() => setSaved(true)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const PdfDateFormats = [
  "28-08-2023",
  "28 Aug 2023",
  "28 August 2023",
  "08/28/2023",
  "08-28-2023",
];

function defaultPdfHeader() {
  return {
    showLogo: true,
    logoPosition: "Left",
    titleId: "",
    titleEn: "",
    applyForBoth: false,
    showCompanyName: true,
    showCompanyAddress: true,
    showCompanyEmail: true,
    labelCompanyEmail: "",
    showCompanyPhone: true,
    labelCompanyPhone: "",
    showCompanyWeb: true,
    showCompanyFax: true,
    showCompanyTax: true,
    showRecipientName: true,
    labelRecipientName: "",
    showRecipientCompany: true,
    labelRecipientCompany: "",
    showRecipientFullName: true,
    labelRecipientFullName: "",
    showRecipientAddress: true,
    labelRecipientAddress: "",
    showRecipientTelephone: true,
    labelRecipientTelephone: "",
    showRecipientEmail: true,
    labelRecipientEmail: "",
    showCustomFields: false,
    contentSize: "Large",
  };
}

function defaultPdfContent() {
  return {
    dateFormat: "28-08-2023",
    showCustomerRef: true,
    labelCustomerRef: "",
    showOtherDpp: false,
    showTags: true,
    showWarehouse: true,
    showTableProduct: true,
    showTableDescription: true,
    showTableQty: true,
    labelTableQty: "",
    showTablePrice: true,
    labelTablePrice: "",
    showTableDiscount: true,
    labelTableDiscount: "",
    showTableTax: true,
    labelTableTax: "",
    showMessage: true,
    showMemo: false,
    showPaymentInfo: true,
    showAmountInWords: true,
    amountNominal: "Total",
    showSignature: true,
    showFooter: true,
    showFootnote: true,
    footnoteText: "",
  };
}

function defaultPdfSettings() {
  return {
    "Sales Invoice": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
    "Sales Order": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
    "Purchase Invoice": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
  };
}

function CustomizePdf() {
  const [documentType, setDocumentType] = useState("");
  const [contentTab, setContentTab] = useState("Header");
  const [previewTemplate, setPreviewTemplate] = useState("Template 1");
  const [draft, setDraft] = useState(defaultPdfSettings);
  const [rendered, setRendered] = useState(defaultPdfSettings);
  const [lastPreviewed, setLastPreviewed] = useState(defaultPdfSettings);
  const [editingCompanyInfo, setEditingCompanyInfo] = useState(false);
  const [companyInfoSnapshot, setCompanyInfoSnapshot] = useState(null);
  const [editingTransactionInfo, setEditingTransactionInfo] = useState(false);
  const [transactionInfoSnapshot, setTransactionInfoSnapshot] = useState(null);
  const [saved, setSaved] = useState(false);

  const draftHeader =
    documentType === "" ? defaultPdfHeader() : draft[documentType].header;
  const draftContent =
    documentType === "" ? defaultPdfContent() : draft[documentType].content;
  const isDirty = JSON.stringify(draft) !== JSON.stringify(lastPreviewed);

  const templateOptions =
    documentType === "Sales Invoice"
      ? ["Template 1", "Template 6", "Template 7", "Template 10", "Template 12"]
      : ["Template 1", "Template 6", "Template 7", "Template 10"];

  function updateHeader(field, value) {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        header: { ...current[documentType].header, [field]: value },
      },
    }));
    setSaved(false);
  }

  function updateContent(field, value) {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        content: { ...current[documentType].content, [field]: value },
      },
    }));
    setSaved(false);
  }

  function startEditCompanyInfo() {
    setCompanyInfoSnapshot(JSON.stringify(draftHeader));
    setEditingCompanyInfo(true);
  }

  function cancelEditCompanyInfo() {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        header: JSON.parse(companyInfoSnapshot),
      },
    }));
    setEditingCompanyInfo(false);
  }

  function saveEditCompanyInfo() {
    setEditingCompanyInfo(false);
  }

  function startEditTransactionInfo() {
    setTransactionInfoSnapshot(JSON.stringify(draftContent));
    setEditingTransactionInfo(true);
  }

  function cancelEditTransactionInfo() {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        content: JSON.parse(transactionInfoSnapshot),
      },
    }));
    setEditingTransactionInfo(false);
  }

  function saveEditTransactionInfo() {
    setEditingTransactionInfo(false);
  }

  if (documentType === "") {
    return (
      <div>
        <SectionTitle title="Customize PDF" />
        <div className="mt-2 pt-3">
          <div className="flex gap-15 items-center mt-3 pt-5">
            <label className={formLabel}>Document type</label>
            <select
              className={selectBase}
              value={documentType}
              onChange={(event) => {
                setDocumentType(event.target.value);
                setContentTab("Header");
                setEditingCompanyInfo(false);
                setEditingTransactionInfo(false);
                setPreviewTemplate("Template 1");
              }}
            >
              <option value="" disabled>
                Select document
              </option>
              <optgroup label="SALES">
                <option value="Sales Invoice">Sales Invoice</option>
                <option value="Sales Order">Sales Order</option>
              </optgroup>
              <optgroup label="PURCHASES">
                <option value="Purchase Invoice">Purchase Invoice</option>
              </optgroup>
            </select>
          </div>
          <div className="mt-5 flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-slate-300">
            <p className="m-0 text-sm text-slate-500">
              PDF template will appear here. Select document type to set PDF
              template.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Customize PDF" />
      <div className="mt-2 pt-3">
        <div className="flex gap-15 items-center mt-3 pt-5">
          <label className={formLabel}>Document type</label>
          <select
            className={selectBase}
            value={documentType}
            onChange={(event) => {
              setDocumentType(event.target.value);
              setContentTab("Header");
              setEditingCompanyInfo(false);
              setEditingTransactionInfo(false);
              setPreviewTemplate("Template 1");
            }}
          >
            <option value="" disabled>
              Select document
            </option>
            <optgroup label="SALES">
              <option value="Sales Invoice">Sales Invoice</option>
              <option value="Sales Order">Sales Order</option>
            </optgroup>
            <optgroup label="PURCHASES">
              <option value="Purchase Invoice">Purchase Invoice</option>
            </optgroup>
          </select>
        </div>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                className={
                  contentTab === "Header"
                    ? "flex-1 cursor-pointer rounded-md border-0 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow"
                    : "flex-1 cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-sm font-semibold text-slate-500"
                }
                onClick={() => setContentTab("Header")}
              >
                Header
              </button>
              <button
                type="button"
                className={
                  contentTab === "Content"
                    ? "flex-1 cursor-pointer rounded-md border-0 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow"
                    : "flex-1 cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-sm font-semibold text-slate-500"
                }
                onClick={() => setContentTab("Content")}
              >
                Content
              </button>
            </div>



            {contentTab === "Header" && (
              <div className="mt-5 flex flex-col gap-4">
                <ToggleRow
                  label="Show company logo in PDF"
                  checked={draftHeader.showLogo}
                  onChange={() =>
                    updateHeader("showLogo", !draftHeader.showLogo)
                  }
                />
                {draftHeader.showLogo && (
                  <div>
                    <label className={formLabel}>Logo position</label>
                    <div className="flex gap-6">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="logo_position"
                          className="h-4 w-4 cursor-pointer accent-blue-600"
                          checked={draftHeader.logoPosition === "Left"}
                          onChange={() => updateHeader("logoPosition", "Left")}
                        />
                        Left
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="logo_position"
                          className="h-4 w-4 cursor-pointer accent-blue-600"
                          checked={draftHeader.logoPosition === "Center"}
                          onChange={() =>
                            updateHeader("logoPosition", "Center")
                          }
                        />
                        Center
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="logo_position"
                          className="h-4 w-4 cursor-pointer accent-blue-600"
                          checked={draftHeader.logoPosition === "Right"}
                          onChange={() =>
                            updateHeader("logoPosition", "Right")
                          }
                        />
                        Right
                      </label>
                    </div>
                  </div>
                )}
                <div>
                  <label className={formLabel}>Title document</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="ID"
                      value={draftHeader.titleId}
                      onChange={(event) =>
                        updateHeader("titleId", event.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="EN"
                      value={draftHeader.titleEn}
                      onChange={(event) =>
                        updateHeader("titleEn", event.target.value)
                      }
                    />
                  </div>
                  <CheckboxRow
                    label="Apply for both"
                    checked={draftHeader.applyForBoth}
                    onChange={() =>
                      updateHeader("applyForBoth", !draftHeader.applyForBoth)
                    }
                  />
                </div>

                <hr className="border-slate-200" />

                <div className="flex items-center justify-between">
                  <label className={formLabel + " m-0"}>Company info</label>
                  {editingCompanyInfo ? (
                    <span className="flex gap-2">
                      <button
                        type="button"
                        className={btnModalCancel}
                        onClick={cancelEditCompanyInfo}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={btnModalSubmit}
                        onClick={saveEditCompanyInfo}
                      >
                        Save
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-brand hover:underline"
                      onClick={startEditCompanyInfo}
                    >
                      Edit info
                    </button>
                  )}
                </div>
                {editingCompanyInfo && (
                  <p className="m-0 text-[13px] text-slate-500">
                    Edited company and recipient info will only available in one
                    language version.
                  </p>
                )}

                <CheckboxRow
                  label="Company Name"
                  checked={draftHeader.showCompanyName}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyName", !draftHeader.showCompanyName)
                  }
                />
                <CheckboxRow
                  label="Address"
                  checked={draftHeader.showCompanyAddress}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyAddress", !draftHeader.showCompanyAddress)
                  }
                />
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Email"
                    checked={draftHeader.showCompanyEmail}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader("showCompanyEmail", !draftHeader.showCompanyEmail)
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Email"
                      maxLength={30}
                      value={draftHeader.labelCompanyEmail}
                      onChange={(event) =>
                        updateHeader("labelCompanyEmail", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Telephone"
                    checked={draftHeader.showCompanyPhone}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader("showCompanyPhone", !draftHeader.showCompanyPhone)
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Telephone"
                      maxLength={30}
                      value={draftHeader.labelCompanyPhone}
                      onChange={(event) =>
                        updateHeader("labelCompanyPhone", event.target.value)
                      }
                    />
                  )}
                </div>
                <CheckboxRow
                  label="Website"
                  checked={draftHeader.showCompanyWeb}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyWeb", !draftHeader.showCompanyWeb)
                  }
                />
                <CheckboxRow
                  label="Fax"
                  checked={draftHeader.showCompanyFax}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyFax", !draftHeader.showCompanyFax)
                  }
                />
                <CheckboxRow
                  label="NPWP"
                  checked={draftHeader.showCompanyTax}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyTax", !draftHeader.showCompanyTax)
                  }
                />

                <label className={formLabel + " mt-2"}>Recipient info</label>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Name"
                    checked={draftHeader.showRecipientName}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader("showRecipientName", !draftHeader.showRecipientName)
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Name"
                      maxLength={30}
                      value={draftHeader.labelRecipientName}
                      onChange={(event) =>
                        updateHeader("labelRecipientName", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Company Name"
                    checked={draftHeader.showRecipientCompany}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientCompany",
                        !draftHeader.showRecipientCompany
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Company Name"
                      maxLength={30}
                      value={draftHeader.labelRecipientCompany}
                      onChange={(event) =>
                        updateHeader("labelRecipientCompany", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Full Name"
                    checked={draftHeader.showRecipientFullName}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientFullName",
                        !draftHeader.showRecipientFullName
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Full Name"
                      maxLength={30}
                      value={draftHeader.labelRecipientFullName}
                      onChange={(event) =>
                        updateHeader("labelRecipientFullName", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Address"
                    checked={draftHeader.showRecipientAddress}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientAddress",
                        !draftHeader.showRecipientAddress
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Address"
                      maxLength={30}
                      value={draftHeader.labelRecipientAddress}
                      onChange={(event) =>
                        updateHeader("labelRecipientAddress", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Telephone"
                    checked={draftHeader.showRecipientTelephone}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientTelephone",
                        !draftHeader.showRecipientTelephone
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Telephone"
                      maxLength={30}
                      value={draftHeader.labelRecipientTelephone}
                      onChange={(event) =>
                        updateHeader("labelRecipientTelephone", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Email"
                    checked={draftHeader.showRecipientEmail}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientEmail",
                        !draftHeader.showRecipientEmail
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Email"
                      maxLength={30}
                      value={draftHeader.labelRecipientEmail}
                      onChange={(event) =>
                        updateHeader("labelRecipientEmail", event.target.value)
                      }
                    />
                  )}
                </div>

                <div className="mt-2">
                  <CheckboxRow
                    label="Custom fields"
                    checked={draftHeader.showCustomFields}
                    onChange={() =>
                      updateHeader("showCustomFields", !draftHeader.showCustomFields)
                    }
                  />
                  <p className="m-0 pl-7 text-[13px] text-slate-500">
                    All active custom fields will appear on reports.
                  </p>
                </div>

                <div className="flex gap-15 items-center mt-2">
                  <label className={formLabel}>Content size</label>
                  <select
                    className={selectBase}
                    value={draftHeader.contentSize}
                    onChange={(event) =>
                      updateHeader("contentSize", event.target.value)
                    }
                  >
                    <option value="Large">Large</option>
                    <option value="Medium">Medium</option>
                    <option value="Small">Small</option>
                  </select>
                </div>
              </div>
            )}

            {contentTab === "Content" && (
              <div className="mt-5 flex flex-col gap-1">
                <div className="flex gap-15 items-center py-2">
                  <label className={formLabel}>Date format</label>
                  <select
                    className={selectBase}
                    value={draftContent.dateFormat}
                    onChange={(event) =>
                      updateContent("dateFormat", event.target.value)
                    }
                  >
                    {PdfDateFormats.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className={formLabel + " m-0"}>Transaction info</label>
                  {editingTransactionInfo ? (
                    <span className="flex gap-2">
                      <button
                        type="button"
                        className={btnModalCancel}
                        onClick={cancelEditTransactionInfo}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={btnModalSubmit}
                        onClick={saveEditTransactionInfo}
                      >
                        Save
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-brand hover:underline"
                      onClick={startEditTransactionInfo}
                    >
                      Edit info
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Customer Ref."
                    checked={draftContent.showCustomerRef}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent(
                        "showCustomerRef",
                        !draftContent.showCustomerRef
                      )
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Customer Ref."
                      maxLength={30}
                      value={draftContent.labelCustomerRef}
                      onChange={(event) =>
                        updateContent("labelCustomerRef", event.target.value)
                      }
                    />
                  )}
                </div>
                <CheckboxRow
                  label="DPP Nilai Lain"
                  checked={draftContent.showOtherDpp}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showOtherDpp", !draftContent.showOtherDpp)
                  }
                />
                <CheckboxRow
                  label="Tags"
                  checked={draftContent.showTags}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showTags", !draftContent.showTags)
                  }
                />
                <CheckboxRow
                  label="Warehouse"
                  checked={draftContent.showWarehouse}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showWarehouse", !draftContent.showWarehouse)
                  }
                />

                <label className={formLabel + " mt-4"}>Table</label>
                <CheckboxRow
                  label="Product Code"
                  checked={draftContent.showTableProduct}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent(
                      "showTableProduct",
                      !draftContent.showTableProduct
                    )
                  }
                />
                <CheckboxRow
                  label="Description"
                  checked={draftContent.showTableDescription}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent(
                      "showTableDescription",
                      !draftContent.showTableDescription
                    )
                  }
                />
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Quantity and unit"
                    checked={draftContent.showTableQty}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent("showTableQty", !draftContent.showTableQty)
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Quantity and unit"
                      maxLength={20}
                      value={draftContent.labelTableQty}
                      onChange={(event) =>
                        updateContent("labelTableQty", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Price per unit"
                    checked={draftContent.showTablePrice}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent(
                        "showTablePrice",
                        !draftContent.showTablePrice
                      )
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Price per unit"
                      maxLength={20}
                      value={draftContent.labelTablePrice}
                      onChange={(event) =>
                        updateContent("labelTablePrice", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Discount"
                    checked={draftContent.showTableDiscount}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent(
                        "showTableDiscount",
                        !draftContent.showTableDiscount
                      )
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Discount"
                      maxLength={20}
                      value={draftContent.labelTableDiscount}
                      onChange={(event) =>
                        updateContent("labelTableDiscount", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Tax"
                    checked={draftContent.showTableTax}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent("showTableTax", !draftContent.showTableTax)
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Tax"
                      maxLength={20}
                      value={draftContent.labelTableTax}
                      onChange={(event) =>
                        updateContent("labelTableTax", event.target.value)
                      }
                    />
                  )}
                </div>

                <label className={formLabel + " mt-4"}>Message and memo</label>
                <CheckboxRow
                  label="Message"
                  checked={draftContent.showMessage}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showMessage", !draftContent.showMessage)
                  }
                />
                <CheckboxRow
                  label="Memo"
                  checked={draftContent.showMemo}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showMemo", !draftContent.showMemo)
                  }
                />

                <CheckboxRow
                  label="Payment info"
                  checked={draftContent.showPaymentInfo}
                  onChange={() =>
                    updateContent(
                      "showPaymentInfo",
                      !draftContent.showPaymentInfo
                    )
                  }
                />
                <CheckboxRow
                  label="Amount in words"
                  checked={draftContent.showAmountInWords}
                  onChange={() =>
                    updateContent(
                      "showAmountInWords",
                      !draftContent.showAmountInWords
                    )
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  Choose nominal to be shown in the document.
                </p>
                <div className="flex gap-6 pl-7">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="amount_nominal"
                      className="h-4 w-4 cursor-pointer accent-blue-600"
                      checked={draftContent.amountNominal === "Total"}
                      onChange={() =>
                        updateContent("amountNominal", "Total")
                      }
                    />
                    Total
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="amount_nominal"
                      className="h-4 w-4 cursor-pointer accent-blue-600"
                      checked={draftContent.amountNominal === "Balance due"}
                      onChange={() =>
                        updateContent("amountNominal", "Balance due")
                      }
                    />
                    Balance due
                  </label>
                </div>

                <CheckboxRow
                  label="Signature"
                  checked={draftContent.showSignature}
                  onChange={() =>
                    updateContent("showSignature", !draftContent.showSignature)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  You can upload signature in PDF setting
                </p>

                <CheckboxRow
                  label="Footer"
                  checked={draftContent.showFooter}
                  onChange={() =>
                    updateContent("showFooter", !draftContent.showFooter)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  Showing transaction number and page number
                </p>

                <CheckboxRow
                  label="Footnote"
                  checked={draftContent.showFootnote}
                  onChange={() =>
                    updateContent("showFootnote", !draftContent.showFootnote)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  Additional note in the bottom of the document.
                </p>
                <textarea
                  rows="2"
                  className={
                    inputBase +
                    " mt-1 ml-7 w-auto disabled:bg-slate-100 disabled:text-slate-500"
                  }
                  placeholder="Enter footnote"
                  maxLength={30}
                  value={draftContent.footnoteText}
                  disabled={!draftContent.showFootnote}
                  onChange={(event) =>
                    updateContent("footnoteText", event.target.value)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-400">
                  {draftContent.footnoteText.length} / 30
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="m-0 text-sm font-semibold text-slate-700">
                  Preview template
                </label>
                <select
                  className={selectBase + " max-w-[180px]"}
                  value={previewTemplate}
                  onChange={(event) => setPreviewTemplate(event.target.value)}
                >
                  {templateOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  disabled={!isDirty}
                  onClick={() => setDraft(rendered)}
                >
                  Reset template
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-50"
                  onClick={() => {
                    setRendered(draft);
                    setLastPreviewed(draft);
                  }}
                >
                  Preview
                </button>
                <button
                  type="button"
                  className={btnModalSubmit}
                  onClick={() => {
                    setRendered(draft);
                    setLastPreviewed(draft);
                    setSaved(true);
                  }}
                >
                  Save
                </button>
                {saved && (
                  <span className="self-center text-[13px] font-semibold text-green-600">
                    Template tersimpan.
                  </span>
                )}
              </div>
            </div>
            <p className="m-0 mt-3 text-[13px] text-slate-500">
              Changes will apply to every template for the selected document
              type.
            </p>
            <PdfPaper
              template={previewTemplate}
              documentType={documentType}
              header={rendered[documentType].header}
              content={rendered[documentType].content}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesTemplateMessage() {
  const [message, setMessage] = useState(
    "Halo [CustomerName], terima kasih atas kepercayaan Anda telah bertransaksi dengan perusahaan kami. Berikut adalah faktur [TransactionNo] sebesar [RemainingAmount]. Silakan lihat detail faktur di sini [InvoiceLink]"
  );
  const [showFooter, setShowFooter] = useState(true);
  const [footer, setFooter] = useState("Powered Sales Qontak [LinkJurnal]");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="Sales Template Message" />
      <div className="mt-2 pt-3">
        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="4"
            className={textareaBase}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="mt-4">
          <CheckboxRow
            label="Footer message"
            checked={showFooter}
            onChange={() => {
              setShowFooter(!showFooter);
              setSaved(false);
            }}
          />
          <textarea
            rows="2"
            className={textareaBase + " mt-2 disabled:bg-slate-100 disabled:text-slate-500"}
            value={footer}
            disabled={!showFooter}
            onChange={(event) => {
              setFooter(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mt-4 pt-5">
          <label className={formLabel}>Available variables</label>
          <p>
            [CustomerName] [CustomerCompany] [TransactionNo] [TransactionDate]
            [DueDate] [CompanyEmail] [RemainingAmount] [CompanyName]
            [InvoiceLink]
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <SavedNote saved={saved} />
          <button className={btnModalSubmit} onClick={() => setSaved(true)}>
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderTemplateMessage() {
  const [message, setMessage] = useState(
    "Halo [CustomerName], terima kasih atas kepercayaan Anda telah bertransaksi dengan perusahaan kami. Berikut adalah faktur [TransactionNo] sebesar [RemainingAmount]. Silakan lihat detail faktur di sini [OrderLink]"
  );
  const [showFooter, setShowFooter] = useState(true);
  const [footer, setFooter] = useState("Powered by Sales Qontak [LinkJurnal]");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionTitle title="Order Template Message" />
      <div className="mt-2 pt-3">
        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="4"
            className={textareaBase}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="mt-4">
          <CheckboxRow
            label="Footer message"
            checked={showFooter}
            onChange={() => {
              setShowFooter(!showFooter);
              setSaved(false);
            }}
          />
          <textarea
            rows="2"
            className={textareaBase + " mt-2 disabled:bg-slate-100 disabled:text-slate-500"}
            value={footer}
            disabled={!showFooter}
            onChange={(event) => {
              setFooter(event.target.value);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-3 mt-4 pt-5">
          <label className={formLabel}>Available variables</label>
          <p>
            [CustomerName] [CustomerCompany] [TransactionNo] [TransactionDate]
            [DueDate] [CompanyEmail] [RemainingAmount] [CompanyName]
            [OrderLink]
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <SavedNote saved={saved} />
          <button className={btnModalSubmit} onClick={() => setSaved(true)}>
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatePage() {
  const [tab, setTab] = useState("email");
  const [emailTemplate, setEmailTemplate] = useState("Sales Invoice");
  const [pdfTemplate, setPdfTemplate] = useState("General Setting");
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    "Sales Template Message"
  );

  return (
    <div className="p-5 ft-12 max-md:p-[18]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Template</h2>
      </div>
      <TabNav
        tab={tab}
        setTab={setTab}
        emailTemplate={emailTemplate}
        setEmailTemplate={setEmailTemplate}
        pdfTemplate={pdfTemplate}
        setPdfTemplate={setPdfTemplate}
        whatsappTemplate={whatsappTemplate}
        setWhatsappTemplate={setWhatsappTemplate}
      />

      <div className="mb-6 mt-4 p-6 rounded-[10px] bg-white shadow">
        {tab === "email" &&
          (emailTemplate === "Sales Invoice" ? (
            <SalesInvoice />
          ) : emailTemplate === "Sales Quote" ? (
            <SalesQuote />
          ) : emailTemplate === "Sales Order" ? (
            <SalesOrder />
          ) : (
            <PurchaseOrder />
          ))}

        {tab === "pdf" &&
          (pdfTemplate === "General Setting" ? (
            <GeneralSetting />
          ) : (
            <CustomizePdf />
          ))}

        {tab === "whatsapp" &&
          (whatsappTemplate === "Sales Template Message" ? (
            <SalesTemplateMessage />
          ) : (
            <OrderTemplateMessage />
          ))}
      </div>
    </div>
  );
}
