import { useEffect, useRef, useState } from "react";
import {
  Bank,
  BookOpen,
  CaretDown,
  Columns,
  Funnel,
  GlobeSimple,
  Info,
  MagnifyingGlass,
  MinusCircle,
  PlusCircle,
  PushPin,
  Receipt,
  Trash,
  User,
  UserCircle,
  Users,
  Warning,
  X,
} from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";
import processingImg from "@/assets/contact-Processing.svg";
import { useOutsideClose } from "@/components/ui/PopoverSelect";
import {
  btnPrimary,
  modalOverlay,
  tableCard,
  tableWrapper,
  tableBase,
  th,
  td,
  trHover,
} from "@/components/ui/styles";

const TONES = {
  yellow: {
    border: "border-amber-400",
    header: "bg-amber-200",
    badge: "bg-amber-600",
  },
  red: {
    border: "border-red-400",
    header: "bg-red-200",
    badge: "bg-red-800",
  },
  blue: {
    border: "border-blue-700",
    header: "bg-blue-200",
    badge: "bg-blue-800",
  },
};

const CARD = {
  openRec: { title: "Open receivables", tone: "yellow" },
  overdueRec: { title: "Overdue receivables", tone: "red" },
  creditMemo: { title: "Credit memo", tone: "blue" },
  openPay: { title: "Open payables", tone: "yellow" },
  overduePay: { title: "Overdue payables", tone: "red" },
  debitMemo: { title: "Debit memo", tone: "blue" },
};

const IMPORT_OPTIONS = {
  customer: ["Customer data", "Memo credit"],
  vendor: ["Vendor data", "Memo debit"],
  employee: ["Employee data", "Memo credit", "Memo debit"],
  others: ["Others data", "Memo credit", "Memo debit"],
};

IMPORT_OPTIONS.all = [...new Set(Object.values(IMPORT_OPTIONS).flat())];

const FILLING_CONDITIONS = [
  "Date format is dd/mm/yyyy (day/month/year)",
  "Maximum rows of transactions are 1.000 rows",
  "For thousands nominal, no need for comma or period",
  "To separate decimals, use period",
  "No need to put currency symbols (Rp, $, etc.)",
];

const TABS = [
  {
    key: "customer",
    label: "Customer",
    icon: User,
    iconColor: "text-orange-500",
    showGroup: true,
    toggle: false,
    cards: [CARD.openRec, CARD.overdueRec, CARD.creditMemo],
  },
  {
    key: "vendor",
    label: "Vendor",
    icon: User,
    iconColor: "text-violet-400",
    showGroup: true,
    toggle: false,
    cards: [CARD.openPay, CARD.overduePay, CARD.debitMemo],
  },
  {
    key: "employee",
    label: "Employee",
    icon: User,
    iconColor: "text-teal-500",
    showGroup: true,
    toggle: true,
    cards: {
      they: [CARD.openRec],
      we: [CARD.openPay, CARD.overduePay],
    },
  },
  {
    key: "others",
    label: "Others",
    icon: User,
    iconColor: "text-lime-500",
    showGroup: true,
    toggle: true,
    cards: {
      they: [CARD.openRec],
      we: [CARD.openPay, CARD.overduePay],
    },
  },
  {
    key: "all",
    label: "All",
    icon: Users,
    iconColor: "text-gray-400",
    showGroup: false,
    toggle: true,
    cards: {
      they: [CARD.openRec, CARD.overdueRec],
      we: [CARD.openPay, CARD.overduePay],
    },
  },
];

const COLUMN_OPTIONS = [
  { key: "name", label: "Display name", locked: true },
  { key: "company_name", label: "Company name" },
  { key: "address", label: "Address" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Handphone no." },
  { key: "telephone", label: "Telephone no." },
  { key: "npwp", label: "NPWP" },
  { key: "other_info", label: "Other info" },
  { key: "balance", label: "Balance" },
];

const DEFAULT_COLUMNS = ["name", "company_name", "address", "email", "phone"];

const EXPORT_CONTACT_INFO = [
  { key: "display_name", label: "Display name", locked: true },
  { key: "type", label: "Type", locked: true },
  { key: "group", label: "Group" },
  { key: "full_name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Handphone no." },
  { key: "telephone", label: "Telephone no." },
  { key: "fax", label: "Fax" },
];

const EXPORT_ADDITIONAL_INFO = [
  { key: "company_name", label: "Company name" },
  { key: "npwp", label: "NPWP" },
  { key: "id_number", label: "ID number" },
  { key: "billing_address", label: "Billing address" },
  { key: "shipping_address", label: "Shipping address" },
  { key: "other_info", label: "Other info" },
  { key: "bank_info", label: "Bank information" },
];

const EXPORT_FORMATS = [
  { key: "excel", label: "Excel format" },
  { key: "csv", label: "CSV format" },
];

const ALL_EXPORT_KEYS = [...EXPORT_CONTACT_INFO, ...EXPORT_ADDITIONAL_INFO].map(
  (item) => item.key
);

const EMPTY_FILTERS = {
  keyword: "",
  group: "",
  phone: "",
  email: "",
  archived: false,
};

const fieldClass =
  "h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand";

const outlineBtn =
  "h-9 cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 text-xs font-semibold text-brand transition-colors hover:bg-slate-50";

const MAX_GROUPS = 3;
const MAX_BANKS = 3;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_TYPES = [
  { key: "customer", label: "Customer" },
  { key: "vendor", label: "Vendor" },
  { key: "employee", label: "Employee" },
  { key: "others", label: "Others" },
];

const TITLE_OPTIONS = [
  { value: "", label: "(Empty)" },
  { value: "Mr.", label: "Mr." },
  { value: "Ms.", label: "Ms." },
  { value: "Mrs.", label: "Mrs." },
];

const IDENTITY_OPTIONS = [
  { value: "KTP", label: "KTP" },
  { value: "Passport", label: "Passport" },
  { value: "SIM", label: "SIM" },
];

const ACCOUNTS = [
  { value: "1-10100", label: "(1-10100) Piutang Usaha" },
  { value: "1-10102", label: "(1-10102) Cadangan Kerugian Piutang" },
  { value: "1-10101", label: "(1-10101) Piutang Belum Ditagih" },
  { value: "2-20100", label: "(2-20100) Hutang Usaha" },
  { value: "2-20101", label: "(2-20101) Hutang Belum Ditagih" },
];

const PAYABLE_ACCOUNTS = [...ACCOUNTS].reverse();

const PAYMENT_TERMS = [
  { value: "net30", label: "Net 30 (30)" },
  { value: "cod", label: "Cash on Delivery (0)" },
  { value: "net15", label: "Net 15 (15)" },
  { value: "net60", label: "Net 60 (60)" },
  { value: "custom", label: "Custom (0)" },
];

const BANK_NAMES = [
  "PT. BANK CENTRAL ASIA TBK.",
  "BCA Personal",
  "PT. BANK MANDIRI (PERSERO) TBK.",
  "PT. BANK MANDIRI TASPEN POS",
  "PT. BANK CIMB NIAGA TBK.",
  "PT. BANK RAKYAT INDONESIA (PERSERO)",
  "PT. BANK SYARIAH MANDIRI TBK.",
  "PT. BANK NEGARA INDONESIA (PERSERO)",
  "PT. BANK BTPN",
  "PT. BANK PERMATA TBK.",
  "PT. BANK DANAMON INDONESIA TBK.",
  "PT. BANK SINARMAS",
  "PT. PANIN BANK TBK.",
  "PT. BANK BISNIS INTERNASIONAL",
  "BNI Syariah",
  "PT. BANK BCA SYARIAH",
  "Bank Seabank Indonesia",
  "PT. BANK NUSANTARA PARAHYANGAN",
  "PT. BANK SYARIAH BRI",
  "PT. BANK VICTORIA INTERNATIONAL",
  "PT.BANK PEMBANGUNAN DAERAH KALBAR UUS",
  "PT. ANGLOMAS INTERNATIONAL BANK",
  "PT. BANK MAYBANK INDONESIA TBK.",
  "BANGKOK BANK PUBLIC CO.LTD",
  "PT. BANK RAKYAT INDONESIA AGRONIAGA TBK.",
  "PT. BANK BNP PARIBAS INDONESIA",
  "PT. BANK JABAR BANTEN SYARIAH",
  "PT. BANK BUKOPIN TBK.",
  "CHINA CONSTRUCTION",
  "PT BANK CAPITAL INDONESIA",
  "PT. BANK COMMONWEALTH",
  "PT. BANK DKI",
  "PT. BANK EKONOMI RAHARJA",
  "PT. BANK GANESHA",
  "PT. BANK HARDA INTERNATIONAL",
  "BANK INDEX SELINDO",
  "PT. BANK JASA JAKARTA",
  "PT. BANK MAYAPADA TBK.",
  "PT. BANK MASPION",
  "PT. BANK MESTIKA DHARMA",
  "PT. BANK METRO EXPRESS",
  "PT. BANK MNC INTERNASIONAL TBK.",
  "PT. BANK MUAMALAT INDONESIA",
  "PT. BANK MULTI ARTA SENTOSA",
  "PT. BANK NATIONALNOBU",
  "PT. BANK OCBC NISP TBK.",
  "PT. BANK RABOBANK INTERNATIONAL INDONESIA",
  "PT. BANK SAHABAT SAMPOERNA",
  "PT. BANK SINARMAS UNIT USAHA SYARIAH",
  "PT. BANK SYARIAH BUKOPIN",
  "PT. BANK MEGA SYARIAH",
  "PT. BANK TABUNGAN NEGARA (PERSERO)",
  "PT. BANK TABUNGAN NEGARA (PERSERO) UNIT USAHA SYARIAH",
  "PT. BANK TABUNGAN PENSIUNAN NASIONAL SYARIAH",
  "PT. BANK VICTORIA SYARIAH",
  "PT. BANK YUDHA BHAKTI",
  "PT. BPD BENGKULU",
  "PT. BANK PEMBANGUNAN DAERAH DIY",
  "PT. BANK PEMBANGUNAN DAERAH JAWA TENGAH",
  "PT.BANK PEMBANGUNAN DAERAH KALBAR",
  "PT. BPD KALIMANTAN TENGAH",
  "PT. BANK PEMBANGUNAN DAERAH KALSEL",
  "PT.BANK PEMBANGUNAN DAERAH KALTIM",
  "PT.BANK PEMBANGUNAN DAERAH LAMPUNG",
  "PT. BANK PEMBANGUNAN DAERAH NTB",
  "PT.BANK PEMBANGUNAN DAERAH NTT",
  "PT. BANK PEMBANGUNAN DAERAH RIAU KEPRI",
  "PT. BPD SULAWESI TENGAH",
  "PT. BPD SULAWESI TENGGARA",
  "PT. BANK SULSELBAR",
  "BPD SUMATERA BARAT",
  "PT. BPD SUMSEL DAN BABEL",
  "PT. CENTRATAMA NASIONAL BANK",
  "DEUTSCHE BANK AG.",
  "CITIBANK, NA",
  "JP MORGAN CHASE BANK, N.A",
  "PRIMA_MASTER",
  "STANDARD CHARTERED BANK",
  "PT. BANK ANTAR DAERAH",
  "PT. BANK ARTHA GRAHA INTERNASIONAL TBK.",
  "PT. BANK ARTOS INDONESIA",
  "PT. BANK ANZ INDONESIA",
  "PT. BANK PEMBANGUNAN DAERAH JABAR DAN BANTEN",
  "PT. BANK BUMI ARTA",
  "PT. BANK DBS INDONESIA",
  "PT. BANK DINAR INDONESIA",
  "PT. BANK FAMA INTERNATIONAL",
  "PT. BANK MAYBANK SYARIAH INDONESIA",
  "PT. BANK MAYORA",
  "PT. BANK MEGA TBK.",
  "PT. BANK MIZUHO INDONESIA",
  "BANK OF AMERICA MERILL-LYNCH",
  "BANK OF CHINA",
  "THE BANK OF TOKYO MITSUBISHI UFJ LTD.",
  "PT. BANK PUNDI INDONESIA",
  "PT. BANK QNB INDONESIA TBK.",
  "PT. BANK RESONA PERDANIA",
  "PT. BANK ROYAL INDONESIA",
  "PT. BANK SBI INDONESIA",
  "PT. BANK SUMITOMO MITSUI INDONESIA",
  "PT. BANK UOB INDONESIA",
  "Bank Windu Kentjana Int",
  "PT. BANK WOORI SAUDARA INDONESIA 1906 TBK.",
  "PT. BANK PEMBANGUNAN DAERAH BALI",
  "PT.BANK PEMBANGUNAN DAERAH DIY UNIT USAHA SYARIAH",
  "PT.BANK PEMBANGUNAN DAERAH JAMBI",
  "BPD Jawa Tengah UUS",
  "PT.BANK PEMBANGUNAN DAERAH JATIM - UNIT USAHA SYARIAH",
  "PT. BANK PEMBANGUNAN DAERAH KALSEL - UNIT USAHA SYARIAH",
  "PT.BANK PEMBANGUNAN DAERAH KALTIM - UNIT USAHA SYARIAH",
  "PT.BANK PEMBANGUNAN DAERAH MALUKU",
  "PT.BANK PEMBANGUNAN DAERAH PAPUA",
  "PT. BANK SULSELBAR UNIT USAHA SYARIAH",
  "PT. BANK PEMBANGUNAN DAERAH SULUT",
  "PT. BPD SUMSEL DAN BABEL UNIT USAHA SYARIAH",
  "PT. BANK PEMBANGUNAN DAERAH SUMUT",
  "PT. BANK HSBC INDONESIA",
  "PT. BANK DANAMON INDONESIA UNIT USAHA SYARIAH",
  "PT. BANK ANDARA",
  "PT. BANK MUTIARA TBK.",
  "PT. BANK PERMATA TBK. UNIT USAHA SYARIAH",
  "PT. BANK PEMBANGUNAN DAERAH JATIM",
  "PT. BANK CIMB NIAGA TBK. - UNIT USAHA SYARIAH",
  "PT. BANK DKI UNIT USAHA SYARIAH",
  "PT. BANK AGRIS",
  "PT. BANK KEB HANA INDONESIA",
  "Bank Himpunan Saudara 1906",
  "PT. BANK ICBC INDONESIA",
  "PT. BANK INA PERDANA",
  "PT. BANK OCBC NISP TBK. - UNIT USAHA SYARIAH",
  "PT. BANK OF INDIA INDONESIA TBK.",
  "PT. BANK PANIN SYARIAH",
  "PT. BANK PURBA DANARTA",
  "PT. BANK ACEH",
  "PT. BPD ISTIMEWA ACEH SYARIAH",
  "PT.BANK PEMBANGUNAN DAERAH JAMBI UNIT USAHA SYARIAH",
  "PT. BANK PEMBANGUNAN DAERAH NTB UNIT USAHA SYARIAH",
  "PT. BANK PEMBANGUNAN DAERAH RIAU KEPRI UNIT USAHA SYARIAH",
  "BPD SUMATERA BARAT UNIT USAHA SYARIAH",
  "PT. BANK PEMBANGUNAN DAERAH SUMUT UUS",
  "Hongkong and Shanghai Bank Corporation (HSBC) UUS",
  "THE ROYAL BANK OF SCOTLAND N.V.",
  "INDONESIA EXIMBANK",
  "PT. BANK MITRANIAGA",
  "Bank Arta Niaga Kencana",
  "Bank Syariah Indonesia (BSI)",
  "PT. BANK DIGITAL BCA",
  "Bank Jago",
  "Bank Oke Indonesia",
  "Shopeepay",
  "LinkAja",
  "DANA",
  "OVO",
  "PT. BANK SHINHAN INDONESIA",
  "PT. BANK NAGARI",
  "PT. BANK NIAGA TBK. SYARIAH",
  "PT. BANK MAYBANK INDONESIA TBK. UNIT USAHA SYARIAH",
  "PT. BANK JTRUST INDONESIA TBK.",
  "PT. BANK HS 1906",
  "GO-PAY",
  "PT. BANK DIPO INTERNATIONAL",
  "PT. BANK CIMB NIAGA TBK. - REKENING PONSEL",
  "PT. BANK CTBC INDONESIA",
  "PT. BANK BUMIPUTERA",
  "BANK OF AMERICA NA",
  "PT BANK BARCLAYS INDONESIA",
  "PT. BANK BANTEN",
  "PT. ARTAJASA",
  "PT. BANK AMAR INDONESIA",
];

const BANK_OPTIONS = [...new Set(BANK_NAMES)].map((name) => ({
  value: name,
  label: name,
}));

const DETAIL_TOP = [
  ["number", "Number"],
  ["neighbourhood", "Neighbourhood"],
  ["hamlet", "Hamlet"],
  ["postal", "Postal code"],
];

const DETAIL_BOTTOM = [
  ["village", "Urban village"],
  ["subDistrict", "Sub district"],
  ["district", "District"],
  ["province", "Province"],
];

const textareaClass =
  "w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand";

const tagBoxClass =
  "flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border bg-white px-2 py-1";

const onlyDigits = (value) => value.replace(/\D/g, "");

let bankSeq = 0;

const createBank = () => {
  bankSeq += 1;

  return { id: bankSeq, name: "", branch: "", holder: "", number: "" };
};

const createInitialForm = () => ({
  displayName: "",
  types: [],
  groups: [],
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  identityType: "",
  identityNumber: "",
  emails: [],
  company: "",
  phone: "",
  telephone: "",
  fax: "",
  billing: "",
  addDetail: false,
  detail: {
    number: "",
    neighbourhood: "",
    hamlet: "",
    postal: "",
    village: "",
    subDistrict: "",
    district: "",
    province: "",
  },
  sameAddress: true,
  delivery: "",
  otherInfo: "",
  citizen: "indonesian",
  npwp: "",
  nitku: "",
  tin: "",
  banks: [createBank()],
  receivable: "1-10100",
  payable: "2-20100",
  maxReceivable: false,
  maxReceivableAmount: "",
  paymentTerm: "",
});

const buildContact = (form) => ({
  id: Date.now(),
  name: form.displayName.trim(),
  types: form.types,
  groups: form.groups,
  full_name: [form.title, form.firstName, form.middleName, form.lastName]
    .filter(Boolean)
    .join(" "),
  company_name: form.company.trim(),
  address: form.billing.trim(),
  email: form.emails.join(", "),
  phone: form.phone.trim(),
  telephone: form.telephone.trim(),
  npwp: form.citizen === "indonesian" ? form.npwp.trim() : form.tin.trim(),
  other_info: form.otherInfo.trim(),
  banks: form.banks.filter((bank) => bank.name),
});

function Checkbox({ checked, indeterminate = false, disabled = false, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-brand disabled:cursor-not-allowed"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  );
}

function Modal({ title, onClose, width = "w-[335px]", children }) {
  return (
    <div className={modalOverlay}>
      <div
        className={`flex max-h-[90vh] max-w-full flex-col rounded-md bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] ${width}`}
      >
        <div className="flex shrink-0 items-center justify-between rounded-t-md border-b border-gray-200 bg-slate-50 px-3 py-3">
          <h2 className="m-0 text-xs font-bold text-gray-900">{title}</h2>

          <button
            type="button"
            aria-label="Close"
            className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 text-gray-600 transition-colors hover:bg-slate-200"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function ExportGroup({ title, items, selected, onToggleItem, onToggleGroup }) {
  const selectedCount = items.filter((item) =>
    selected.includes(item.key)
  ).length;
  const allSelected = selectedCount === items.length;

  return (
    <div className="min-w-0">
      <label className="flex cursor-pointer items-center gap-2 border-b border-gray-200 pb-2.5 text-xs font-bold text-gray-900">
        <Checkbox
          checked={allSelected}
          indeterminate={selectedCount > 0 && !allSelected}
          onChange={() => onToggleGroup(items, allSelected)}
        />
        {title}
      </label>

      <div className="flex flex-col">
        {items.map((item) => (
          <label
            key={item.key}
            className={`flex items-center gap-2 py-2.5 text-xs ${
              item.locked
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer text-gray-800"
            }`}
          >
            <Checkbox
              checked={selected.includes(item.key)}
              disabled={item.locked}
              onChange={() => onToggleItem(item.key)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function ExportModal({ onClose, onExport }) {
  const [selected, setSelected] = useState(ALL_EXPORT_KEYS);
  const { ref, open, setOpen } = useOutsideClose();

  const handleToggleItem = (key) => {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const handleToggleGroup = (items, allSelected) => {
    const keys = items.map((item) => item.key);
    const removable = items
      .filter((item) => !item.locked)
      .map((item) => item.key);

    setSelected((current) =>
      allSelected
        ? current.filter((key) => !removable.includes(key))
        : [...new Set([...current, ...keys])]
    );
  };

  return (
    <Modal title="Contact export" onClose={onClose}>
      <div className="px-3 pb-4 pt-3">
        <p className="m-0 mb-3 text-xs text-gray-800">
          Select and export contact information you need.
        </p>

        <div className="grid grid-cols-2 gap-x-5 rounded-md bg-slate-100 px-3 pb-2 pt-3">
          <ExportGroup
            title="Contact info"
            items={EXPORT_CONTACT_INFO}
            selected={selected}
            onToggleItem={handleToggleItem}
            onToggleGroup={handleToggleGroup}
          />

          <ExportGroup
            title="Additional info"
            items={EXPORT_ADDITIONAL_INFO}
            selected={selected}
            onToggleItem={handleToggleItem}
            onToggleGroup={handleToggleGroup}
          />
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            Cancel
          </button>

          <div className="relative" ref={ref}>
            <button
              type="button"
              className="flex h-9 cursor-pointer items-center gap-2.5 rounded-md border-0 bg-brand px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
              onClick={() => setOpen((current) => !current)}
            >
              Export
              <CaretDown size={12} weight="fill" />
            </button>

            {open && (
              <div className="absolute bottom-full right-0 z-30 mb-1 w-[150px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                {EXPORT_FORMATS.map((format) => (
                  <button
                    key={format.key}
                    type="button"
                    className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                    onClick={() => {
                      setOpen(false);
                      onExport(format.key, selected);
                    }}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ExportProgressModal({ onClose }) {
  return (
    <Modal title="Export contact in progress" onClose={onClose}>
      <div className="px-3 pb-4 pt-5">
        <img
          src={processingImg}
          alt="Export in progress"
          className="mx-auto mb-5 h-[110px] w-auto object-contain"
        />

        <p className="m-0 text-center text-xs text-gray-800">
          We will send notification to your email once the export is done.
        </p>

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            className="h-9 cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 text-xs font-semibold text-brand transition-colors hover:bg-slate-50"
            onClick={onClose}
          >
            See export list
          </button>

          <button
            type="button"
            className="h-9 cursor-pointer rounded-md border-0 bg-brand px-3.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
            onClick={onClose}
          >
            OK, got it
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ImportStep({ number, title, last = false, children }) {
  return (
    <div
      className={`flex gap-3 ${
        last ? "" : "mb-4 border-b border-gray-200 pb-4"
      }`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
        {number}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="m-0 mb-1 text-[15px] font-semibold text-gray-900">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

function ImportNotice({ tone, title, children }) {
  const isWarning = tone === "warning";
  const Icon = isWarning ? Warning : Info;

  return (
    <div
      className={`mt-3 flex gap-3 rounded-md px-3 py-3 ${
        isWarning ? "bg-amber-50" : "bg-indigo-50"
      }`}
    >
      <Icon
        size={18}
        weight="fill"
        className={`mt-0.5 shrink-0 ${
          isWarning ? "text-amber-500" : "text-brand"
        }`}
      />

      <div className="min-w-0">
        <p className="m-0 text-xs font-semibold text-gray-900">{title}</p>
        <p className="m-0 mt-1 text-xs text-gray-700">{children}</p>
      </div>
    </div>
  );
}

function ImportModal({ option, onClose }) {
  const [showConditions, setShowConditions] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const isMemo = option.startsWith("Memo");

  return (
    <Modal
      title={`Import ${option.toLowerCase()}`}
      onClose={onClose}
      width="w-[512px]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <p className="m-0 mb-4 text-xs text-gray-800">
          You can follow these steps to import data to Jurnal.
        </p>

        <ImportStep number={1} title="Download template file">
          <p className="m-0 text-xs text-gray-700">
            To import the data correctly, avoid using a template other than
            provided. This template file has been aligned with Jurnal's system
            requirement.
          </p>

          {!isMemo && (
            <ImportNotice
              tone="info"
              title="There is an update to the file template"
            >
              Now, it includes columns for accounts payable and receivable.
              Make sure to download the latest version before importing.
            </ImportNotice>
          )}

          <button type="button" className={`mt-3 ${outlineBtn} h-8 text-[11px]`}>
            Download template
          </button>
        </ImportStep>

        <ImportStep number={2} title="Fill the data in template file">
          <p className="m-0 text-xs text-gray-700">
            Make sure the data you have filled in are aligned with filling
            conditions. Please do not edit or change the columns to avoid data
            import issues.
          </p>
          <p className="m-0 text-xs text-gray-700">
            Need an example or filling tutorials?{" "}
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
            >
              See example
            </button>{" "}
            or{" "}
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
            >
              learn tutorial
            </button>
          </p>

          {showConditions && (
            <div className="mt-3">
              <p className="m-0 mb-1.5 text-xs font-bold text-gray-900">
                Filling conditions
              </p>

              <ul className="m-0 list-disc pl-5 text-xs text-gray-700">
                {FILLING_CONDITIONS.map((condition) => (
                  <li key={condition} className="py-0.5">
                    {condition}
                  </li>
                ))}
              </ul>

              <p className="m-0 mb-1 mt-3 text-xs font-bold text-gray-900">
                Filling tip
              </p>
              <p className="m-0 text-xs text-gray-700">
                If you fill in numbers data with Microsoft Excel, add (`) symbol
                before the numbers.
              </p>
              <p className="m-0 text-xs text-gray-700">
                For example: `6-6003 or `11-02-2016.
              </p>
            </div>
          )}

          <button
            type="button"
            className={`mt-3 ${outlineBtn} h-8 text-[11px]`}
            onClick={() => setShowConditions((current) => !current)}
          >
            {showConditions ? "Hide" : "Show filling conditions"}
          </button>
        </ImportStep>

        <ImportStep number={3} title="Upload template file" last>
          <p className="m-0 text-xs text-gray-700">
            You can upload the previously filled template file without changing
            its format (.csv). If it needs to be changed, please use .xls or
            .xlsx file format.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />

          <div className="mt-3 flex h-9 w-[288px] max-w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-1">
            <button
              type="button"
              className="h-7 shrink-0 cursor-pointer rounded border border-gray-300 bg-white px-2.5 text-[11px] font-semibold text-brand hover:bg-slate-50"
              onClick={() => inputRef.current?.click()}
            >
              Choose file
            </button>

            <span
              className={`truncate text-xs ${
                file ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {file ? file.name : "No file chosen"}
            </span>
          </div>

          {isMemo && (
            <ImportNotice tone="warning" title="Transaction import term">
              Before importing, ensure your contact is already listed in Jurnal.
            </ImportNotice>
          )}
        </ImportStep>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 rounded-b-md border-t border-gray-100 px-3 py-3">
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!file}
          className="h-9 cursor-pointer rounded-md border-0 bg-brand px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200"
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
}

function GroupModal({ groups, contacts, setGroups, onClose }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const editing = editingId !== null;
  const draftName = draft.trim();
  const duplicate = groups.some(
    (group) =>
      group.id !== editingId &&
      group.name.toLowerCase() === draftName.toLowerCase()
  );
  const invalid = !draftName || duplicate;

  const visibleGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(query.toLowerCase())
  );
  const showTable = visibleGroups.length > 0 || editingId === "new";

  const startCreate = () => {
    setDraft("");
    setEditingId("new");
  };

  const startEdit = (group) => {
    setDraft(group.name);
    setEditingId(group.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const saveEdit = () => {
    if (invalid) return;

    if (editingId === "new") {
      setGroups((current) => [...current, { id: Date.now(), name: draftName }]);
    } else {
      setGroups((current) =>
        current.map((group) =>
          group.id === editingId ? { ...group, name: draftName } : group
        )
      );
    }

    cancelEdit();
  };

  const handleDelete = (id) => {
    setGroups((current) => current.filter((group) => group.id !== id));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") saveEdit();
    if (event.key === "Escape") cancelEdit();
  };

  const editRow = (
    <div className="flex items-center gap-3 border-b border-gray-200 px-2 py-2">
      <input
        autoFocus
        value={draft}
        placeholder="Enter group name"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        className="h-8 min-w-0 flex-1 rounded-md border border-brand bg-white px-2.5 text-xs text-gray-900 outline-none placeholder:text-gray-400"
      />

      <button
        type="button"
        className="cursor-pointer border-0 bg-transparent px-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
        onClick={cancelEdit}
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={invalid}
        className="h-8 cursor-pointer rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-brand transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={saveEdit}
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal title="Contact group setup" onClose={onClose} width="w-[512px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-[210px]">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              disabled={editing}
              placeholder="Search contact group"
              onChange={(event) => setQuery(event.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand disabled:bg-slate-100"
            />
          </div>

          <button
            type="button"
            disabled={editing}
            className={`${outlineBtn} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
            onClick={startCreate}
          >
            Create group
          </button>
        </div>

        {showTable ? (
          <div>
            <div className="grid grid-cols-[1fr_150px_32px] items-center bg-slate-100 px-2 py-2.5 text-xs font-bold text-gray-900">
              <span>Group name</span>
              <span>Number of contacts</span>
              <span />
            </div>

            {editingId === "new" && editRow}

            {visibleGroups.map((group) =>
              editingId === group.id ? (
                <div key={group.id}>{editRow}</div>
              ) : (
                <div
                  key={group.id}
                  className="grid grid-cols-[1fr_150px_32px] items-center border-b border-gray-200 px-2 py-2.5 text-xs text-gray-800"
                >
                  <button
                    type="button"
                    disabled={editing}
                    className="cursor-pointer truncate border-0 bg-transparent p-0 text-left text-xs text-gray-800 hover:text-brand disabled:cursor-default disabled:hover:text-gray-800"
                    onClick={() => startEdit(group)}
                  >
                    {group.name}
                  </button>

                  <span>
                    {
                      contacts.filter((contact) =>
                        contact.groups?.includes(group.name)
                      ).length
                    }
                  </span>

                  <button
                    type="button"
                    aria-label={`Delete ${group.name}`}
                    disabled={editing}
                    className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 text-gray-500 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gray-500"
                    onClick={() => handleDelete(group.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <img
              src={emptyFolderImg}
              alt="No contact group yet"
              className="mb-4 h-[130px] w-auto object-contain"
            />
            <p className="m-0 text-[13px] font-bold text-gray-900">
              No contact group yet
            </p>
            <p className="m-0 mt-1 text-xs text-slate-500">
              Your group list will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 justify-end rounded-b-md px-3 pb-4 pt-1">
        <button
          type="button"
          className="h-9 cursor-pointer rounded-md border-0 bg-brand px-5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </Modal>
  );
}

function GroupSelect({ value, groups, onChange }) {
  const { ref, open, setOpen } = useOutsideClose();

  const options = groups.filter((group) =>
    group.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <input
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        className={fieldClass}
      />

      {open && options.length > 0 && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`block w-full cursor-pointer border-0 px-3 py-2 text-left text-xs text-gray-800 hover:bg-slate-100 ${
                group.name === value ? "bg-slate-100" : "bg-transparent"
              }`}
              onClick={() => {
                onChange(group.name);
                setOpen(false);
              }}
            >
              {group.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterField({ label, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-bold text-gray-900">
        {label}
      </label>
      {children}
    </div>
  );
}

function FilterDrawer({ groups, filters, onClose, onApply }) {
  const [draft, setDraft] = useState(filters);

  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <aside className="flex h-full w-[260px] max-w-full flex-col bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.2)]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-slate-50 px-3 py-3">
          <h2 className="m-0 text-xs font-bold text-gray-900">
            Filter contact list
          </h2>

          <button
            type="button"
            aria-label="Close"
            className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 text-gray-600 transition-colors hover:bg-slate-200"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-4">
          <FilterField label="Keyword">
            <input
              value={draft.keyword}
              placeholder="Search contact"
              onChange={(event) => update("keyword", event.target.value)}
              className={fieldClass}
            />
          </FilterField>

          <FilterField label="Group">
            <GroupSelect
              value={draft.group}
              groups={groups}
              onChange={(value) => update("group", value)}
            />
          </FilterField>

          <FilterField label="Telephone number">
            <input
              value={draft.phone}
              placeholder="Example: 012 3456789"
              onChange={(event) => update("phone", event.target.value)}
              className={fieldClass}
            />
          </FilterField>

          <FilterField label="Email">
            <input
              value={draft.email}
              onChange={(event) => update("email", event.target.value)}
              className={fieldClass}
            />
          </FilterField>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800">
            <Checkbox
              checked={draft.archived}
              onChange={() => update("archived", !draft.archived)}
            />
            Show archived contacts
          </label>
        </div>

        <div className="flex shrink-0 items-center justify-between px-3 py-3">
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
            onClick={() => setDraft(EMPTY_FILTERS)}
          >
            Reset
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="h-9 cursor-pointer rounded-md border-0 bg-brand px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
              onClick={() => onApply(draft)}
            >
              Apply
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SummaryCard({ title, tone, count = 0, total = 0 }) {
  const t = TONES[tone];

  return (
    <div className={`overflow-hidden rounded-md border bg-white ${t.border}`}>
      <div
        className={`flex items-center justify-between px-2.5 py-2 ${t.header}`}
      >
        <span className="text-xs font-bold text-gray-900">{title}</span>

        <span
          className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${t.badge}`}
        >
          {count}
        </span>
      </div>

      <div className="relative px-2.5 pb-2.5 pt-2">
        <p className="m-0 text-[11px] text-slate-500">Total</p>
        <p className="m-0 text-lg font-semibold text-gray-900">{total}</p>

        <button
          type="button"
          aria-label={`Filter ${title}`}
          className="absolute bottom-2 right-2.5 flex cursor-pointer items-center justify-center rounded p-1 text-brand transition-colors hover:bg-blue-50"
        >
          <Funnel size={18} />
        </button>
      </div>
    </div>
  );
}

function SideToggle({ value, onChange }) {
  const base =
    "cursor-pointer rounded px-2.5 py-1 text-xs font-semibold transition-colors";
  const on = "bg-indigo-100 text-brand";
  const off = "text-gray-600 hover:bg-slate-50";

  return (
    <div className="inline-flex gap-0.5 rounded-md border border-gray-300 bg-white p-0.5">
      <button
        type="button"
        className={`${base} ${value === "we" ? on : off}`}
        onClick={() => onChange("we")}
      >
        We owe
      </button>
      <button
        type="button"
        className={`${base} ${value === "they" ? on : off}`}
        onClick={() => onChange("they")}
      >
        They owe
      </button>
    </div>
  );
}

function ColumnPicker({ selected, onToggle }) {
  const { ref, open, setOpen } = useOutsideClose();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Pilih kolom"
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 text-gray-600 transition-colors hover:bg-slate-50"
        onClick={() => setOpen((current) => !current)}
      >
        <Columns size={20} />
        <CaretDown size={12} weight="fill" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[190px] rounded-md border border-gray-200 bg-white py-2 shadow-lg">
          {COLUMN_OPTIONS.map((option) => (
            <label
              key={option.key}
              className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] ${
                option.locked
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer text-gray-700 hover:bg-slate-50"
              }`}
            >
              <Checkbox
                checked={selected.includes(option.key)}
                disabled={option.locked}
                onChange={() => onToggle(option.key)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportMenu({ options, onSelect }) {
  const { ref, open, setOpen } = useOutsideClose();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-xs font-semibold text-brand transition-colors hover:bg-slate-50"
        onClick={() => setOpen((current) => !current)}
      >
        Import
        <CaretDown size={12} weight="fill" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[170px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
              onClick={() => {
                setOpen(false);
                onSelect(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  required = false,
  info = false,
  hint,
  counter,
  error,
  children,
}) {
  return (
    <div className="min-w-0">
      {(label || counter) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-gray-900">
            {label}
            {required && <span className="text-red-500">*</span>}
            {info && <Info size={14} className="text-gray-500" />}
          </span>

          {counter && (
            <span className="text-[11px] text-slate-500">{counter}</span>
          )}
        </div>
      )}

      {children}

      {hint && <p className="m-0 mt-1 text-[10px] text-slate-500">{hint}</p>}
      {error && <p className="m-0 mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

function FormSection({ icon: Icon, title, collapsible = true, children }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Icon size={20} className="text-brand" />
          {title}
        </h2>

        {collapsible && (
          <button
            type="button"
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 text-gray-600 transition-colors hover:bg-slate-100"
            onClick={() => setOpen((current) => !current)}
          >
            <CaretDown
              size={12}
              weight="fill"
              className={`transition-transform ${open ? "" : "-rotate-90"}`}
            />
          </button>
        )}
      </div>

      <div className={open ? "" : "hidden"}>{children}</div>
    </section>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex max-w-full items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-xs text-brand">
      <span className="truncate">{label}</span>

      <button
        type="button"
        aria-label={`Remove ${label}`}
        className="flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-brand"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      >
        <X size={10} weight="bold" />
      </button>
    </span>
  );
}

function ComboSelect({
  value,
  options,
  placeholder = "",
  searchable = true,
  onChange,
}) {
  const { ref, open, setOpen } = useOutsideClose();
  const [query, setQuery] = useState("");

  const selected = options.find((option) => option.value === value);
  const keyword = query.trim().toLowerCase();
  const visible =
    searchable && keyword
      ? options.filter((option) => option.label.toLowerCase().includes(keyword))
      : options;
  const text = open && searchable ? query : selected ? selected.label : "";

  const pick = (option) => {
    onChange(option.value);
    setQuery("");
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") setOpen(false);

    if (event.key === "Enter") {
      event.preventDefault();

      if (searchable && keyword && visible[0]) pick(visible[0]);
      else setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <input
        value={text}
        readOnly={!searchable}
        placeholder={open && selected ? selected.label : placeholder}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className={`${fieldClass} cursor-pointer pr-8`}
      />

      <CaretDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
      />

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {visible.length === 0 ? (
            <p className="m-0 px-3 py-2 text-xs text-slate-500">No results</p>
          ) : (
            visible.map((option) => (
              <button
                key={option.value || "empty"}
                type="button"
                className={`block w-full cursor-pointer border-0 px-3 py-2 text-left text-xs text-gray-800 hover:bg-slate-100 ${
                  option.value === value ? "bg-indigo-50" : "bg-transparent"
                }`}
                onClick={() => pick(option)}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function GroupMultiSelect({ groups, value, onChange }) {
  const { ref, open, setOpen } = useOutsideClose();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const full = value.length >= MAX_GROUPS;
  const keyword = query.trim().toLowerCase();
  const options = groups.filter(
    (group) =>
      !value.includes(group.name) && group.name.toLowerCase().includes(keyword)
  );

  const add = (name) => {
    onChange([...value, name]);
    setQuery("");
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace" && !query && value.length > 0) {
      onChange(value.slice(0, -1));
    }

    if (event.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <div
        className={`${tagBoxClass} border-gray-300 focus-within:border-brand`}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((name) => (
          <Chip
            key={name}
            label={name}
            onRemove={() => onChange(value.filter((item) => item !== name))}
          />
        ))}

        {!full && (
          <input
            ref={inputRef}
            value={query}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="h-7 min-w-[80px] flex-1 border-0 bg-transparent p-0 text-xs text-gray-900 outline-none"
          />
        )}
      </div>

      {open && !full && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.length === 0 ? (
            <p className="m-0 px-3 py-2 text-xs text-slate-500">
              {groups.length === 0 ? "No contact group yet" : "No results"}
            </p>
          ) : (
            options.map((group) => (
              <button
                key={group.id}
                type="button"
                className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-xs text-gray-800 hover:bg-slate-100"
                onClick={() => add(group.name)}
              >
                {group.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EmailInput({ value, onChange }) {
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef(null);

  const commit = () => {
    const email = draft.trim();

    if (!email) {
      setInvalid(false);
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setInvalid(true);
      return;
    }

    if (!value.includes(email)) onChange([...value, email]);
    setDraft("");
    setInvalid(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    }

    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className={`${tagBoxClass} ${
        invalid
          ? "border-red-500"
          : "border-gray-300 focus-within:border-brand"
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((email) => (
        <Chip
          key={email}
          label={email}
          onRemove={() => onChange(value.filter((item) => item !== email))}
        />
      ))}

      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setInvalid(false);
        }}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        className="h-7 min-w-[120px] flex-1 border-0 bg-transparent p-0 text-xs text-gray-900 outline-none"
      />
    </div>
  );
}

function BankAccount({ bank, index, onChange, onRemove }) {
  return (
    <div className={index > 0 ? "mt-6 border-t border-gray-200 pt-6" : ""}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 text-sm font-semibold text-gray-900">
          Bank account
        </h3>

        {index > 0 && (
          <button
            type="button"
            aria-label="Remove bank account"
            className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0.5 text-gray-500 transition-colors hover:text-red-600"
            onClick={onRemove}
          >
            <MinusCircle size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-md:grid-cols-1">
        <FormField label="Bank name">
          <ComboSelect
            value={bank.name}
            options={BANK_OPTIONS}
            placeholder="Select bank"
            onChange={(value) => onChange("name", value)}
          />
        </FormField>

        <FormField label="Bank branch">
          <input
            value={bank.branch}
            onChange={(event) => onChange("branch", event.target.value)}
            className={fieldClass}
          />
        </FormField>

        <FormField label="Bank holder name">
          <input
            value={bank.holder}
            onChange={(event) => onChange("holder", event.target.value)}
            className={fieldClass}
          />
        </FormField>

        <FormField label="Account number">
          <input
            value={bank.number}
            inputMode="numeric"
            onChange={(event) =>
              onChange("number", onlyDigits(event.target.value))
            }
            className={fieldClass}
          />
        </FormField>
      </div>
    </div>
  );
}

function CreateContactForm({ groups, onClose, onSave }) {
  const [form, setForm] = useState(createInitialForm);
  const [submitted, setSubmitted] = useState(false);
  const [typeTouched, setTypeTouched] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const saveMenu = useOutsideClose();

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setDetail = (key, value) => {
    setForm((current) => ({
      ...current,
      detail: { ...current.detail, [key]: value },
    }));
  };

  const setBank = (id, key, value) => {
    setForm((current) => ({
      ...current,
      banks: current.banks.map((bank) =>
        bank.id === id ? { ...bank, [key]: value } : bank
      ),
    }));
  };

  const addBank = () => {
    setForm((current) =>
      current.banks.length >= MAX_BANKS
        ? current
        : { ...current, banks: [...current.banks, createBank()] }
    );
  };

  const removeBank = (id) => {
    setForm((current) => ({
      ...current,
      banks: current.banks.filter((bank) => bank.id !== id),
    }));
  };

  const toggleType = (key) => {
    setTypeTouched(true);
    setForm((current) => ({
      ...current,
      types: current.types.includes(key)
        ? current.types.filter((item) => item !== key)
        : [...current.types, key],
    }));
  };

  const nameError = submitted && !form.displayName.trim();
  const typeError = (submitted || typeTouched) && form.types.length === 0;

  const handleSave = (createAnother) => {
    saveMenu.setOpen(false);
    setSubmitted(true);

    if (!form.displayName.trim() || form.types.length === 0) {
      const top = document.getElementById("create-contact-top");
      if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    onSave(buildContact(form), createAnother);

    if (createAnother) {
      setForm(createInitialForm());
      setSubmitted(false);
      setTypeTouched(false);
    }
  };

  return (
    <div className="min-h-full bg-white">
      <div
        id="create-contact-top"
        className="border-b border-gray-200 bg-slate-100 px-7 py-4 max-md:px-[18px]"
      >
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
          onClick={() => setLeaveOpen(true)}
        >
          Contact
        </button>

        <h1 className="m-0 text-2xl font-bold text-gray-900">Create contact</h1>
      </div>

      <div className="flex items-start gap-5 p-7 max-lg:flex-col max-md:p-[18px]">
        <div className="min-w-0 flex-1">
          <FormSection icon={UserCircle} title="Contact info" collapsible={false}>
            <div className="flex flex-col gap-4">
              <FormField
                label="Display name"
                required
                error={nameError ? "Display name is required" : ""}
              >
                <input
                  value={form.displayName}
                  onChange={(event) => set("displayName", event.target.value)}
                  className={`${fieldClass} ${
                    nameError ? "border-red-500" : ""
                  }`}
                />
              </FormField>

              <FormField
                label="Contact type"
                required
                info
                error={typeError ? "You must select contact type" : ""}
              >
                <div className="flex flex-wrap items-center gap-5">
                  {CONTACT_TYPES.map((type) => (
                    <label
                      key={type.key}
                      className="flex cursor-pointer items-center gap-2 text-xs text-gray-800"
                    >
                      <Checkbox
                        checked={form.types.includes(type.key)}
                        onChange={() => toggleType(type.key)}
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField
                label="Contact group"
                hint={`You can select maximum ${MAX_GROUPS} groups`}
              >
                <GroupMultiSelect
                  groups={groups}
                  value={form.groups}
                  onChange={(value) => set("groups", value)}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection icon={BookOpen} title="General info">
            <div className="flex flex-col gap-4">
              <FormField label="Full name">
                <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-4 max-md:grid-cols-2">
                  <ComboSelect
                    value={form.title}
                    options={TITLE_OPTIONS}
                    searchable={false}
                    onChange={(value) => set("title", value)}
                  />

                  <input
                    value={form.firstName}
                    placeholder="First name"
                    onChange={(event) => set("firstName", event.target.value)}
                    className={fieldClass}
                  />

                  <input
                    value={form.middleName}
                    placeholder="Middle name"
                    onChange={(event) => set("middleName", event.target.value)}
                    className={fieldClass}
                  />

                  <input
                    value={form.lastName}
                    placeholder="Last name"
                    onChange={(event) => set("lastName", event.target.value)}
                    className={fieldClass}
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-[90px_1fr] gap-4">
                <FormField label="Identity">
                  <ComboSelect
                    value={form.identityType}
                    options={IDENTITY_OPTIONS}
                    placeholder="Select"
                    searchable={false}
                    onChange={(value) => set("identityType", value)}
                  />
                </FormField>

                <FormField label="Identity number">
                  <input
                    value={form.identityNumber}
                    placeholder="Enter identity number"
                    onChange={(event) =>
                      set("identityNumber", event.target.value)
                    }
                    className={fieldClass}
                  />
                </FormField>
              </div>

              <FormField label="Email" hint="You can select more than 1 email">
                <EmailInput
                  value={form.emails}
                  onChange={(value) => set("emails", value)}
                />
              </FormField>

              <FormField label="Company name">
                <input
                  value={form.company}
                  onChange={(event) => set("company", event.target.value)}
                  className={fieldClass}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <FormField label="Handphone number">
                  <input
                    value={form.phone}
                    placeholder="Example: 0812 9374 546"
                    onChange={(event) => set("phone", event.target.value)}
                    className={fieldClass}
                  />
                </FormField>

                <FormField label="Telephone number">
                  <input
                    value={form.telephone}
                    placeholder="Example: 012 83746579"
                    onChange={(event) => set("telephone", event.target.value)}
                    className={fieldClass}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <FormField label="Fax">
                  <input
                    value={form.fax}
                    placeholder="Example: 012 9374867"
                    onChange={(event) => set("fax", event.target.value)}
                    className={fieldClass}
                  />
                </FormField>
              </div>

              <FormField label="Billing address">
                <textarea
                  rows={3}
                  value={form.billing}
                  placeholder="Example: Jalan Indonesia Block C No. 22"
                  onChange={(event) => set("billing", event.target.value)}
                  className={textareaClass}
                />

                {form.addDetail && (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
                      {DETAIL_TOP.map(([key, placeholder]) => (
                        <input
                          key={key}
                          value={form.detail[key]}
                          placeholder={placeholder}
                          onChange={(event) =>
                            setDetail(key, event.target.value)
                          }
                          className={fieldClass}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                      {DETAIL_BOTTOM.map(([key, placeholder]) => (
                        <input
                          key={key}
                          value={form.detail[key]}
                          placeholder={placeholder}
                          onChange={(event) =>
                            setDetail(key, event.target.value)
                          }
                          className={fieldClass}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-gray-800">
                  <Checkbox
                    checked={form.addDetail}
                    onChange={() => set("addDetail", !form.addDetail)}
                  />
                  Add detail
                </label>
              </FormField>

              <FormField label="Delivery address">
                {!form.sameAddress && (
                  <textarea
                    rows={3}
                    value={form.delivery}
                    placeholder="Example: Jalan Indonesia Block C No. 22"
                    onChange={(event) => set("delivery", event.target.value)}
                    className={textareaClass}
                  />
                )}

                <label
                  className={`flex cursor-pointer items-center gap-2 text-xs text-gray-800 ${
                    form.sameAddress ? "" : "mt-2"
                  }`}
                >
                  <Checkbox
                    checked={form.sameAddress}
                    onChange={() => set("sameAddress", !form.sameAddress)}
                  />
                  Same with billing address
                </label>
              </FormField>

              <FormField label="Other info">
                <input
                  value={form.otherInfo}
                  onChange={(event) => set("otherInfo", event.target.value)}
                  className={fieldClass}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection icon={Receipt} title="Tax info">
            <div className="mb-4 flex items-center gap-3 rounded-md bg-indigo-50 px-3 py-3">
              <Info size={18} weight="fill" className="shrink-0 text-brand" />

              <p className="m-0 text-xs text-gray-800">
                Integrate with Klikpajak to validate NPWP and NITKU.{" "}
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent p-0 text-xs text-brand hover:underline"
                >
                  Learn more
                </button>
              </p>
            </div>

            <div className="mb-4 flex items-center gap-5">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800">
                <input
                  type="radio"
                  name="citizen"
                  checked={form.citizen === "indonesian"}
                  onChange={() => set("citizen", "indonesian")}
                  className="m-0 h-3.5 w-3.5 cursor-pointer accent-brand"
                />
                Indonesian Citizen
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800">
                <input
                  type="radio"
                  name="citizen"
                  checked={form.citizen === "foreign"}
                  onChange={() => set("citizen", "foreign")}
                  className="m-0 h-3.5 w-3.5 cursor-pointer accent-brand"
                />
                Foreign Citizen
              </label>
            </div>

            {form.citizen === "indonesian" ? (
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <FormField
                  label="NPWP/NIK"
                  counter={`${16 - form.npwp.length}/16`}
                >
                  <input
                    value={form.npwp}
                    maxLength={16}
                    inputMode="numeric"
                    placeholder="Example: 1237657480132546"
                    onChange={(event) =>
                      set("npwp", onlyDigits(event.target.value))
                    }
                    className={fieldClass}
                  />
                </FormField>

                <FormField
                  label="NITKU"
                  info
                  counter={`${6 - form.nitku.length}/6`}
                >
                  <div className="flex h-9 items-center overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-brand">
                    <span className="mx-1 flex h-7 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-xs text-gray-600">
                      -
                    </span>

                    <input
                      value={form.nitku}
                      maxLength={6}
                      inputMode="numeric"
                      placeholder="Example: 00000"
                      onChange={(event) =>
                        set("nitku", onlyDigits(event.target.value))
                      }
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-xs text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </FormField>
              </div>
            ) : (
              <FormField label="Tax Identification Number" info>
                <input
                  value={form.tin}
                  placeholder="Example: 1100229933884477"
                  onChange={(event) => set("tin", event.target.value)}
                  className={fieldClass}
                />
              </FormField>
            )}
          </FormSection>

          <FormSection icon={Bank} title="Bank info">
            {form.banks.map((bank, index) => (
              <BankAccount
                key={bank.id}
                bank={bank}
                index={index}
                onChange={(key, value) => setBank(bank.id, key, value)}
                onRemove={() => removeBank(bank.id)}
              />
            ))}

            {form.banks.length < MAX_BANKS && (
              <button
                type="button"
                className="mt-4 flex h-9 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-brand transition-colors hover:bg-slate-50"
                onClick={addBank}
              >
                <PlusCircle size={16} />
                Add another bank
              </button>
            )}
          </FormSection>

          <FormSection icon={GlobeSimple} title="Account mapping">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <FormField label="Account receivable">
                  <ComboSelect
                    value={form.receivable}
                    options={ACCOUNTS}
                    onChange={(value) => set("receivable", value)}
                  />
                </FormField>

                <FormField label="Account payable">
                  <ComboSelect
                    value={form.payable}
                    options={PAYABLE_ACCOUNTS}
                    onChange={(value) => set("payable", value)}
                  />
                </FormField>
              </div>

              {form.types.includes("customer") && (
                <div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800">
                    <Checkbox
                      checked={form.maxReceivable}
                      onChange={() => set("maxReceivable", !form.maxReceivable)}
                    />
                    Enable maximum receivable
                  </label>

                  {form.maxReceivable && (
                    <div className="mt-2 w-1/2 max-md:w-full">
                      <input
                        value={form.maxReceivableAmount}
                        inputMode="numeric"
                        placeholder="Maximum receivable"
                        onChange={(event) =>
                          set(
                            "maxReceivableAmount",
                            onlyDigits(event.target.value)
                          )
                        }
                        className={fieldClass}
                      />
                    </div>
                  )}
                </div>
              )}

              <FormField label="Default payment term">
                <ComboSelect
                  value={form.paymentTerm}
                  options={PAYMENT_TERMS}
                  placeholder="Select payment"
                  onChange={(value) => set("paymentTerm", value)}
                />
              </FormField>
            </div>
          </FormSection>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              onClick={() => setLeaveOpen(true)}
            >
              Cancel
            </button>

            <div className="relative flex" ref={saveMenu.ref}>
              <button
                type="button"
                className="h-9 cursor-pointer rounded-l-md border-0 bg-brand px-5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
                onClick={() => handleSave(false)}
              >
                Save
              </button>

              <button
                type="button"
                aria-label="More save options"
                className="flex h-9 cursor-pointer items-center rounded-r-md border-0 border-l border-white/30 bg-brand px-2.5 text-white transition-colors hover:bg-brand-dark"
                onClick={() => saveMenu.setOpen((current) => !current)}
              >
                <CaretDown size={12} weight="fill" />
              </button>

              {saveMenu.open && (
                <div className="absolute bottom-full right-0 z-30 mb-1 w-[170px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                    onClick={() => handleSave(true)}
                  >
                    Save & create new
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="w-[340px] shrink-0 rounded-md border border-gray-200 bg-slate-50 p-4 max-lg:w-full lg:sticky lg:top-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="m-0 text-sm font-bold text-gray-900">
              Account mapping term
            </h2>

            <PushPin size={16} weight="fill" className="text-brand" />
          </div>

          <p className="m-0 text-xs text-gray-700">
            The account mapping details cannot be edited if the contact already
            has transactions. Make sure all data is correct before creating the
            contact.
          </p>
        </aside>
      </div>

      {leaveOpen && (
        <Modal title="Leave this page?" onClose={() => setLeaveOpen(false)}>
          <div className="px-3 pb-4 pt-3">
            <p className="m-0 text-xs text-gray-800">
              This contact will be unable to be saved. You can't undo this
              action.
            </p>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                onClick={() => setLeaveOpen(false)}
              >
                Keep creating
              </button>

              <button
                type="button"
                className="h-9 cursor-pointer rounded-md border-0 bg-red-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                onClick={onClose}
              >
                Leave
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function ContactsPage() {
  const initialTab = () => {
    const hash = window.location.hash.replace("#", "");
    return TABS.some((tab) => tab.key === hash) ? hash : "customer";
  };

  const [activeKey, setActiveKey] = useState(initialTab);
  const [side, setSide] = useState("they");
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [creating, setCreating] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [importOption, setImportOption] = useState(null);

  const activeTab = TABS.find((tab) => tab.key === activeKey);
  const cards = activeTab.toggle ? activeTab.cards[side] : activeTab.cards;

  const handleTabChange = (key) => {
    setActiveKey(key);
    setSide("they");
    window.history.replaceState(null, "", `#${key}`);
  };

  const handleToggleColumn = (key) => {
    setColumns((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const handleExport = () => {
    setExportOpen(false);
    setProgressOpen(true);
  };

  const handleApplyFilters = (next) => {
    setFilters(next);
    setFilterOpen(false);
  };

  const handleSaveContact = (contact, createAnother) => {
    setContacts((current) => [...current, contact]);
    if (!createAnother) setCreating(false);
  };

  const keyword = filters.keyword.toLowerCase();
  const groupFilter = filters.group.toLowerCase();
  const emailFilter = filters.email.toLowerCase();

  const visibleContacts = contacts.filter((contact) => {
    const matchTab = activeKey === "all" || contact.types?.includes(activeKey);
    const matchSearch =
      !keyword ||
      contact.name?.toLowerCase().includes(keyword) ||
      contact.company_name?.toLowerCase().includes(keyword) ||
      contact.email?.toLowerCase().includes(keyword);
    const matchGroup =
      !groupFilter ||
      contact.groups?.some((name) => name.toLowerCase().includes(groupFilter));
    const matchPhone =
      !filters.phone ||
      [contact.phone, contact.telephone].some((value) =>
        value?.includes(filters.phone)
      );
    const matchEmail =
      !emailFilter || contact.email?.toLowerCase().includes(emailFilter);
    const matchArchived = filters.archived || !contact.archived;

    return (
      matchTab &&
      matchSearch &&
      matchGroup &&
      matchPhone &&
      matchEmail &&
      matchArchived
    );
  });

  const visibleColumns = COLUMN_OPTIONS.filter((option) =>
    columns.includes(option.key)
  );

  if (creating) {
    return (
      <CreateContactForm
        groups={groups}
        onClose={() => setCreating(false)}
        onSave={handleSaveContact}
      />
    );
  }

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-5 flex items-center justify-between gap-5">
        <h1 className="m-0 text-[28px] font-bold text-gray-900">Contact</h1>

        <button
          type="button"
          className={btnPrimary}
          onClick={() => setCreating(true)}
        >
          Create contact
        </button>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.key === activeKey;

          return (
            <button
              key={tab.key}
              type="button"
              className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 bg-transparent px-3.5 py-3 text-sm transition-colors ${
                active
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              <Icon
                size={20}
                weight={tab.key === "all" ? "regular" : "fill"}
                className={
                  tab.key === "all" && active ? "text-brand" : tab.iconColor
                }
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab.toggle && (
        <div className="mb-4">
          <SideToggle value={side} onChange={setSide} />
        </div>
      )}

      <div
        className={`mb-5 grid gap-4 max-md:grid-cols-1 ${
          cards.length === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {cards.map((card) => (
          <SummaryCard key={card.title} title={card.title} tone={card.tone} />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ColumnPicker selected={columns} onToggle={handleToggleColumn} />

          {activeTab.showGroup && (
            <button
              type="button"
              className={outlineBtn}
              onClick={() => setGroupOpen(true)}
            >
              Set contact group
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 max-md:flex-wrap">
          <ImportMenu
            options={IMPORT_OPTIONS[activeKey]}
            onSelect={setImportOption}
          />

          <button
            type="button"
            className={outlineBtn}
            onClick={() => setExportOpen(true)}
          >
            Export
          </button>

          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={filters.keyword}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  keyword: event.target.value,
                }))
              }
              placeholder="Search contact"
              className="h-9 w-[200px] rounded-md border border-gray-300 bg-white pl-9 pr-3 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand"
            />
          </div>

          <button
            type="button"
            className={`flex items-center gap-2 ${outlineBtn}`}
            onClick={() => setFilterOpen(true)}
          >
            <Funnel size={16} />
            Filter
          </button>
        </div>
      </div>

      {visibleContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <img
            src={emptyFolderImg}
            alt="No contact yet"
            className="mb-4 h-[130px] w-auto object-contain"
          />
          <p className="m-0 text-[13px] font-bold text-gray-900">
            No contact yet
          </p>
          <p className="m-0 mt-1 text-xs text-slate-500">
            Your contact list will appear here.
          </p>
        </div>
      ) : (
        <div className={tableCard}>
          <div className={tableWrapper}>
            <table className={tableBase}>
              <thead>
                <tr>
                  {visibleColumns.map((column) => (
                    <th key={column.key} className={th}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleContacts.map((contact) => (
                  <tr key={contact.id} className={trHover}>
                    {visibleColumns.map((column) => (
                      <td key={column.key} className={td}>
                        {contact[column.key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {exportOpen && (
        <ExportModal
          onClose={() => setExportOpen(false)}
          onExport={handleExport}
        />
      )}

      {progressOpen && (
        <ExportProgressModal onClose={() => setProgressOpen(false)} />
      )}

      {groupOpen && (
        <GroupModal
          groups={groups}
          contacts={contacts}
          setGroups={setGroups}
          onClose={() => setGroupOpen(false)}
        />
      )}

      {importOption && (
        <ImportModal
          key={importOption}
          option={importOption}
          onClose={() => setImportOption(null)}
        />
      )}

      {filterOpen && (
        <FilterDrawer
          groups={groups}
          filters={filters}
          onClose={() => setFilterOpen(false)}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
}