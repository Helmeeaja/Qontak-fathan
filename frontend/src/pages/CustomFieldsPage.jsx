import { useState } from "react";
import {
  Users,
  UserPlus,
  UsersFour,
  MagnifyingGlass,
  X,
  Table,
  Minus,
  CaretDown,
  Image as ImageIcon,
} from "@phosphor-icons/react";
import {
  selectBase,
  inputBase,
  formLabel,
  textareaBase,
  btnModalCancel,
  btnModalSubmit,
} from "@/components/ui/styles";

const pageOptions = ["Sales", "Purchases", "Products", "Expenses"];

const typeOptions = [
  {
    label: "Text",
    desc: "Can enter information in letters, numbers, and symbols",
  },
  {
    label: "Number",
    desc: "Can enter integers or fractions (decimals)",
  },
  {
    label: "Date",
    desc: "Can select a date from the provided calendar",
  },
  {
    label: "Dropdown",
    desc: "Can show several options to select one of them",
  },
];

const salesSubPages = [
  "Sales Order",
  "Sales Invoice",
  "Sales Quotation",
  "Sales Delivery",
  "Sales Return",
  "Down payment receipt",
  "Proforma invoice",
  "Proforma order",
];

const purchaseSubPages = [
  "Purchase Order",
  "Purchase Invoice",
  "Purchase Quotation",
  "Purchase Request",
  "Purchase Return",
  "Purchase Quote",
  "Purchase Delivery",
];

const expenseSubPages = ["Expense"];

const subPagesByPage = {
  Sales: salesSubPages,
  Purchases: purchaseSubPages,
  Expenses: expenseSubPages,
};

const salesPreviewRows = [
  ["Pelanggan", "Email"],
  ["Alamat Penagihan", "Tgl transaksi", "No transaksi", "Tag"],
  ["Tgl jatuh tempo", "No referensi pelanggan"],
  ["Syarat pembayaran", "Gudang"],
];

const salesBottomRows = [
  "Pesan",
  "Memo",
  "Lampiran",
  "Subtotal",
  "Total",
  "Sisa tagihan",
];

const purchasePreviewRows = [
  ["Supplier", "Email"],
  ["Alamat Penagihan", "Tgl transaksi", "No transaksi", "Tag"],
  ["Tgl jatuh tempo", "No referensi supplier"],
  ["Syarat pembayaran", "Gudang"],
];

const purchaseBottomRows = [
  "Pesan",
  "Memo",
  "Lampiran",
  "Subtotal",
  "Total",
  "Sisa tagihan",
];

const previewRowsByPage = {
  Sales: salesPreviewRows,
  Purchases: purchasePreviewRows,
  Expenses: purchasePreviewRows,
};

const bottomRowsByPage = {
  Sales: salesBottomRows,
  Purchases: purchaseBottomRows,
  Products: [],
  Expenses: purchaseBottomRows,
};

function PreviewField({ label }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[13px] font-medium text-slate-500">{label}</p>

      <div className="h-[10px] w-full rounded-sm bg-slate-200" />
    </div>
  );
}

function PreviewCustomField({ name, type, mustFilled, mainOptionLabel }) {
  if (name === "") {
    return null;
  }

  return (
    <div className="rounded-md border border-dashed border-blue-400 bg-white p-4">
      <p className="text-[13px] font-medium text-slate-600">
        {name}
        {mustFilled && <span className="ml-1 text-red-600">*</span>}
      </p>

      {type === "" ? (
        <div className="mt-1.5 h-[10px] w-full rounded-sm bg-slate-200" />
      ) : type === "Dropdown" ? (
        <div className="mt-1.5 flex w-full max-w-[240px] items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2">
          <span className="truncate text-xs text-slate-500">
            {mainOptionLabel}
          </span>

          <CaretDown size={14} className="shrink-0 text-slate-400" />
        </div>
      ) : (
        <div className="mt-1.5 h-9 w-full max-w-[240px] rounded-md border border-slate-300 bg-white" />
      )}
    </div>
  );
}

function AddPopUp({ showQuotaPopup, setShowQuotaPopup }) {
  return (
    <>
      {showQuotaPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[500px] rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                Add custom field quota
              </h2>

              <hr className="border-slate-300"></hr>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-bold text-gray-800">
                199.000 per custom field per year
              </p>

              <p className="text-sm leading-6 text-slate-500">
                Please contact Jurnal team through the button or send an email
                to haloqontak@qontak.com to add your quota.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowQuotaPopup(false)}
                className={btnModalCancel}
              >
                OK, Got It
              </button>

              <button className={btnModalSubmit}>
                Contact Qontak Team
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReorderPopUp({ showReorderPopup, setShowReorderPopup }) {
  const [page, setPage] = useState("");
  const [subPage, setSubPage] = useState("");

  const salesSubPage = [
    "Sales Order",
    "Sales Invoice",
    "Sales Quotation",
    "Sales Delivery",
    "Sales Return",
    "Down payment receipt",
    "Proforma invoice",
    "Proforma order",
  ];

  const purchaseSubPage = [
    "Purchase Order",
    "Purchase Invoice",
    "Purchase Quotation",
    "Purchase Request",
    "Purchase Return",
    "Purchase Quote",
    "Purchase Delivery",
  ];

  function handlePageChange(event) {
    setPage(event.target.value);
    setSubPage("");
  }

  return (
    <>
      {showReorderPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[550px] rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                Reorder custom fields
              </h2>

              <hr className="border-slate-300"></hr>
            </div>

            <div className="flex flex-col gap-4">
              <select
                className={selectBase}
                value={page}
                onChange={handlePageChange}
              >
                <option value="" disabled>
                  Select Page
                </option>
                <option value="Sales">Sales</option>
                <option value="Purchases">Purchases</option>
                <option value="Products">Products</option>
                <option value="Expenses">Expenses</option>
              </select>

              {page === "Sales" && (
                <select
                  className={selectBase}
                  value={subPage}
                  onChange={(event) => setSubPage(event.target.value)}
                >
                  <option value="" disabled>
                    Select subpage
                  </option>

                  {salesSubPage.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}

              {page === "Purchases" && (
                <select
                  className={selectBase}
                  value={subPage}
                  onChange={(event) => setSubPage(event.target.value)}
                >
                  <option value="" disabled>
                    Select subpage
                  </option>

                  {purchaseSubPage.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}

              {(page === "Products" || page === "Expenses") && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="font-bold text-gray-800">
                    The has no custom field yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Please add custom field.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowReorderPopup(false)}
                className={btnModalCancel}
              >
                Cancel
              </button>

              <button
                onClick={() => setShowReorderPopup(false)}
                className={btnModalSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AddCustomFieldPopUp({ showAddPopUp, setShowAddPopUp }) {
  const [fieldName, setFieldName] = useState("");
  const [page, setPage] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [checkedSubPages, setCheckedSubPages] = useState({});
  const [useMaxChar, setUseMaxChar] = useState(false);
  const [maxChar, setMaxChar] = useState(0);
  const [useDecimal, setUseDecimal] = useState(false);
  const [additionalText, setAdditionalText] = useState("none");
  const [prefixText, setPrefixText] = useState("");
  const [suffixText, setSuffixText] = useState("");
  const [dateSelection, setDateSelection] = useState("none");
  const [multiSelect, setMultiSelect] = useState(false);
  const [options, setOptions] = useState([""]);
  const [mainOption, setMainOption] = useState(-1);
  const [mustFilled, setMustFilled] = useState(false);
  const [showInPrint, setShowInPrint] = useState(false);
  const [showSubPageList, setShowSubPageList] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const subPages = subPagesByPage[page] || [];
  const previewRows = previewRowsByPage[page] || [];
  const bottomRows = bottomRowsByPage[page] || [];
  const selectedSubPageCount = Object.values(checkedSubPages).filter(Boolean).length;
  const subPagePlaceholder =
    page === "Sales"
      ? "Select sales page"
      : page === "Purchases"
        ? "Select purchase page"
        : "Select page";
  const tableHeaders = [
    "Produk",
    "Deskripsi",
    "Kuantitas",
    "Unit",
    "Harga satuan",
    "Jumlah",
  ];
  const allChecked = subPages.length > 0 && subPages.every((item) => checkedSubPages[item]);

  const hasContent =
    fieldName !== "" ||
    page !== "" ||
    fieldType !== "" ||
    useMaxChar ||
    useDecimal ||
    additionalText !== "none" ||
    dateSelection !== "none" ||
    multiSelect ||
    options.some((item) => item !== "") ||
    mustFilled ||
    showInPrint;

  function handlePageChange(event) {
    setPage(event.target.value);
    setCheckedSubPages({});
  }

  function handleTypeChange(event) {
    setFieldType(event.target.value);
    setUseMaxChar(false);
    setMaxChar(0);
    setUseDecimal(false);
    setAdditionalText("none");
    setPrefixText("");
    setSuffixText("");
    setDateSelection("none");
    setMultiSelect(false);
    setOptions([""]);
    setMainOption(-1);
  }

  function toggleSubPage(item) {
    setCheckedSubPages((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  function toggleSelectAll() {
    if (allChecked) {
      setCheckedSubPages({});
    } else {
      const next = {};
      subPages.forEach((item) => { next[item] = true; });
      setCheckedSubPages(next);
    }
  }

  function handleAddOption() {
    setOptions((prev) => [...prev, ""]);
  }

  function handleDeleteOption(index) {
    if (options.length <= 1) {
      return;
    }
    setOptions((prev) => prev.filter((item, i) => i !== index));
    setMainOption((prev) => {
      if (prev === index) return -1;
      if (prev > index) return prev - 1;
      return prev;
    });
  }

  function handleOptionChange(index, value) {
    setOptions((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function resetForm() {
    setFieldName("");
    setPage("");
    setFieldType("");
    setCheckedSubPages({});
    setUseMaxChar(false);
    setMaxChar(0);
    setUseDecimal(false);
    setAdditionalText("none");
    setPrefixText("");
    setSuffixText("");
    setDateSelection("none");
    setMultiSelect(false);
    setOptions([""]);
    setMainOption(-1);
    setMustFilled(false);
    setShowInPrint(false);
    setShowConfirmLeave(false);
  }

  function handleClose() {
    if (hasContent) {
      setShowConfirmLeave(true);
    } else {
      resetForm();
      setShowAddPopUp(false);
    }
  }

  function handleLeave() {
    resetForm();
    setShowAddPopUp(false);
  }

  const mainOptionLabel = mainOption >= 0 ? options[mainOption] : "";

  return (
    <>
      {showAddPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Add custom field</h2>

              <button
                onClick={handleClose}
                className="cursor-pointer rounded-md border-0 bg-transparent p-1 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5 md:flex-row">
              <div className="flex w-full flex-col gap-5 md:w-[340px] md:shrink-0">
                <div>
                  <label className={formLabel}>
                    Custom field name <span className="text-red-600">*</span>
                  </label>

                  <input
                    type="text"
                    maxLength={25}
                    value={fieldName}
                    onChange={(event) => setFieldName(event.target.value)}
                    className={inputBase}
                  />

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {fieldName.length} / 25
                  </p>
                </div>

                <div>
                  <label className={formLabel}>
                    Page <span className="text-red-600">*</span>
                  </label>

                  <select
                    value={page}
                    onChange={handlePageChange}
                    className={`${selectBase} cursor-pointer appearance-none`}
                  >
                    <option value="" disabled>
                      Select page
                    </option>

                    {pageOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  {subPages.length > 0 && (
                    <div className="relative mt-3">
                      <button
                        type="button"
                        onClick={() => setShowSubPageList((prev) => !prev)}
                        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-[9px] text-left"
                      >
                        <span className="text-sm text-slate-500">
                          {selectedSubPageCount === 0
                            ? subPagePlaceholder
                            : `${selectedSubPageCount} page selected`}
                        </span>

                        <CaretDown
                          size={16}
                          className={`shrink-0 text-slate-400 transition-transform ${showSubPageList ? "rotate-180" : ""}`}
                        />
                      </button>

                      {showSubPageList && (
                        <div className="absolute left-0 right-0 top-full z-20 mt-1 flex max-h-[200px] flex-col gap-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              onChange={toggleSelectAll}
                              className="h-4 w-4 accent-brand"
                            />

                            Select all
                          </label>

                          {subPages.map((item) => (
                            <label
                              key={item}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <input
                                type="checkbox"
                                checked={!!checkedSubPages[item]}
                                onChange={() => toggleSubPage(item)}
                                className="h-4 w-4 accent-brand"
                              />

                              {item}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className={formLabel}>
                    Custom field type <span className="text-red-600">*</span>
                  </label>

                  <select
                    value={fieldType}
                    onChange={handleTypeChange}
                    className={`${selectBase} cursor-pointer appearance-none`}
                  >
                    <option value="" disabled>
                      Select custom field type
                    </option>

                    {typeOptions.map((item) => (
                      <option key={item.label} value={item.label}>
                        {item.label} — {item.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {fieldType === "Text" && (
                  <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={useMaxChar}
                        onChange={(event) => setUseMaxChar(event.target.checked)}
                        className="h-4 w-4 accent-brand"
                      />

                      Has a maximum character of
                    </label>

                    {useMaxChar && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={maxChar}
                          onChange={(event) => setMaxChar(Number(event.target.value))}
                          className={`${inputBase} w-28`}
                        />

                        <span className="text-sm text-slate-500">Characters</span>
                      </div>
                    )}
                  </div>
                )}

                {fieldType === "Number" && (
                  <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={useDecimal}
                        onChange={(event) => setUseDecimal(event.target.checked)}
                        className="h-4 w-4 accent-brand"
                      />

                      Use fractions (decimals)
                    </label>

                    <p className="text-sm font-semibold text-gray-800">
                      Additional text
                    </p>

                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="additionalText"
                        checked={additionalText === "none"}
                        onChange={() => setAdditionalText("none")}
                        className="mt-0.5 h-4 w-4 accent-brand"
                      />

                      <span>
                        Without addition
                      </span>
                    </label>

                    <div className="flex flex-col gap-1">
                      <label className="flex items-start gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name="additionalText"
                          checked={additionalText === "prefix"}
                          onChange={() => setAdditionalText("prefix")}
                          className="mt-0.5 h-4 w-4 accent-brand"
                        />

                        <span>
                          Prefix
                          <span className="block text-xs text-slate-500">
                            Text is added before number.
                          </span>
                          <span className="block text-xs text-slate-500">
                            Example: Currency symbol (Rp50.000)
                          </span>
                        </span>
                      </label>

                      {additionalText === "prefix" && (
                        <input
                          type="text"
                          value={prefixText}
                          onChange={(event) => setPrefixText(event.target.value)}
                          className={inputBase}
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="flex items-start gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name="additionalText"
                          checked={additionalText === "suffix"}
                          onChange={() => setAdditionalText("suffix")}
                          className="mt-0.5 h-4 w-4 accent-brand"
                        />

                        <span>
                          Suffix
                          <span className="block text-xs text-slate-500">
                            Text is added after number.
                          </span>
                          <span className="block text-xs text-slate-500">
                            Example: Product length (5 cm)
                          </span>
                        </span>
                      </label>

                      {additionalText === "suffix" && (
                        <input
                          type="text"
                          value={suffixText}
                          onChange={(event) => setSuffixText(event.target.value)}
                          className={inputBase}
                        />
                      )}
                    </div>
                  </div>
                )}

                {fieldType === "Date" && (
                  <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                    <p className="text-sm font-semibold text-gray-800">
                      Date selection in custom field
                    </p>

                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="dateSelection"
                        checked={dateSelection === "none"}
                        onChange={() => setDateSelection("none")}
                        className="mt-0.5 h-4 w-4 accent-brand"
                      />

                      <span>
                        Empty
                        <span className="block text-xs text-slate-500">
                          Date must be selected manually
                        </span>
                      </span>
                    </label>

                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="dateSelection"
                        checked={dateSelection === "today"}
                        onChange={() => setDateSelection("today")}
                        className="mt-0.5 h-4 w-4 accent-brand"
                      />

                      <span>
                        Today's date
                        <span className="block text-xs text-slate-500">
                          Auto-selected when you're creating/adding transactions, products, &amp; contacts
                        </span>
                      </span>
                    </label>
                  </div>
                )}

                {fieldType === "Dropdown" && (
                  <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={multiSelect}
                        onChange={(event) => setMultiSelect(event.target.checked)}
                        className="h-4 w-4 accent-brand"
                      />

                      Can select more than one option
                    </label>

                    <p className="text-sm font-semibold text-gray-800">
                      Option ({options.length})
                    </p>

                    {options.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(event) =>
                            handleOptionChange(index, event.target.value)
                          }
                          className={inputBase}
                        />

                        <label className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={mainOption === index}
                            onChange={() =>
                              setMainOption((prev) => (prev === index ? -1 : index))
                            }
                            className="h-4 w-4 accent-brand"
                          />

                          Set as main option
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteOption(index)}
                          disabled={options.length <= 1}
                          className="shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleAddOption}
                      className="text-left text-sm font-semibold text-brand"
                    >
                      Add option
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-800">
                    Additional settings
                  </p>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={mustFilled}
                      onChange={(event) => setMustFilled(event.target.checked)}
                      className="h-4 w-4 accent-brand"
                    />

                    Custom field must be filled in
                  </label>

                  {page !== "" && (
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={showInPrint}
                        onChange={(event) => setShowInPrint(event.target.checked)}
                        className="h-4 w-4 accent-brand"
                      />

                      Show custom field when being printed
                    </label>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-full">
                <p className="text-sm font-semibold text-gray-800">Preview</p>

                {page === "" ? (
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 p-4 text-center">
                    <Table size={28} className="text-brand" />

                    <p className="text-sm font-medium text-gray-800">
                      Custom field preview will appear here
                    </p>

                    <p className="text-xs text-slate-500">
                      Please select page first.
                    </p>
                  </div>
                ) : page === "Products" ? (
                  <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
                    <div className="flex gap-6">
                      <div className="flex flex-1 flex-col gap-2.5">
                        <PreviewField label="Nama Produk" />

                        <div className="grid grid-cols-2 gap-x-6">
                          <PreviewField label="Kode Produk/SKU" />
                          <PreviewField label="Barcode" />
                        </div>

                        <div className="grid grid-cols-2 gap-x-6">
                          <PreviewField label="Unit" />
                        </div>

                        <div className="grid grid-cols-2 gap-x-6">
                          <PreviewField label="Kategori Produk" />
                        </div>

                        <PreviewField label="Deskripsi" />

                        <div className="grid grid-cols-2 gap-x-6">
                          <PreviewField label="Tipe Produk" />
                        </div>
                      </div>

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-slate-200">
                        <ImageIcon size={26} className="text-slate-400" />
                      </div>
                    </div>

                    <PreviewCustomField
                      name={fieldName}
                      type={fieldType}
                      mustFilled={mustFilled}
                      mainOptionLabel={mainOptionLabel}
                    />

                    <div className="flex gap-6 border-b border-slate-200">
                      <p className="-mb-px border-b-2 border-blue-500 pb-2 text-[13px] font-medium text-blue-500">
                        Harga &amp; persediaan
                      </p>

                      <p className="pb-2 text-[13px] font-medium text-slate-500">
                        Pengaturan bundle
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="grid grid-cols-2 gap-x-6">
                        <PreviewField label="Saya beli produk ini" />
                      </div>

                      <div className="grid grid-cols-2 gap-x-6">
                        <PreviewField label="Saya jual produk ini" />
                      </div>

                      <div className="grid grid-cols-2 gap-x-6">
                        <PreviewField label="Monitor persediaan barang" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
                    {previewRows.map((row, rowIdx) => (
                      <div
                        key={rowIdx}
                        className="grid grid-cols-2 gap-x-6 gap-y-2.5"
                      >
                        {row.map((label) => (
                          <PreviewField key={label} label={label} />
                        ))}
                      </div>
                    ))}

                    <PreviewCustomField
                      name={fieldName}
                      type={fieldType}
                      mustFilled={mustFilled}
                      mainOptionLabel={mainOptionLabel}
                    />

                    <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
                      <div className="grid grid-cols-6 gap-x-4">
                        {tableHeaders.map((header) => (
                          <p
                            key={header}
                            className="text-[11px] font-semibold text-slate-600"
                          >
                            {header}
                          </p>
                        ))}
                      </div>

                      <div className="h-[10px] w-full rounded-sm bg-slate-200" />
                    </div>

                    {bottomRows.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-slate-200 pt-3">
                        {bottomRows.map((label) => (
                          <PreviewField key={label} label={label} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex shrink-0 justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button onClick={handleClose} className={btnModalCancel}>
                Cancel
              </button>

              <button className={btnModalSubmit}>Save</button>

              {showConfirmLeave && (
                <div className="absolute bottom-[70px] right-6 z-10 w-[270px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                  <p className="text-sm font-bold text-gray-800">
                    Leave this process?
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Data you have filled will not be saved.
                  </p>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => setShowConfirmLeave(false)}
                      className={btnModalCancel}
                    >
                      Continue addition
                    </button>

                    <button
                      onClick={handleLeave}
                      className={btnModalSubmit}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CustomFieldsPage() {
  const [showQuotaPopup, setShowQuotaPopup] = useState(false);
  const [showReorderPopup, setShowReorderPopup] = useState(false);
  const [showAddPopUp, setShowAddPopUp] = useState(false);

  function Main() {
    return (
      <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-md font-bold text-gray-800">
            Custom Field Quota : 3
          </p>

          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">
              Start setting custom fields as needed for your business. Need more custom fields?
            </p>

            <button
              onClick={() => setShowQuotaPopup(true)}
              className="text-sm text-blue-500 hover:cursor-pointer"
            >
              Add Custom Field Quota
            </button>
          </div>

          <hr className="mt-6 border-gray-300" />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-[200px]">
              <select
                className={`${selectBase} w-[150px]`}
                value="All Status"
                onChange={() => {}}
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>

            <div className="flex w-[280px] items-center gap-2 rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
              <MagnifyingGlass
                size={19}
                className="shrink-0 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search Custom Fields"
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-40">
          <h2>
            Custom fields list will appear here
          </h2>

          <h3 className="text-slate-500">
            Add custom field through button Add custom field
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between">
        <h1 className="m-0 text-[28px] font-bold text-gray-700 max-md:text-2xl">
          Custom Fields
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowReorderPopup(true)}
            className={btnModalCancel}
          >
            Reorder custom fields
          </button>

          <button
            onClick={() => setShowAddPopUp(true)}
            className={btnModalSubmit}
          >
            Add custom fields
          </button>
        </div>
      </div>

      <Main />

      <AddPopUp
        showQuotaPopup={showQuotaPopup}
        setShowQuotaPopup={setShowQuotaPopup}
      />

      <AddCustomFieldPopUp
        showAddPopUp={showAddPopUp}
        setShowAddPopUp={setShowAddPopUp}
      />

      <ReorderPopUp
        showReorderPopup={showReorderPopup}
        setShowReorderPopup={setShowReorderPopup}
      />
    </div>
  );
}