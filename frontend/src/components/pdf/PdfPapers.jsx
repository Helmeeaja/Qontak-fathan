const PdfCustomFieldRows = [
  { label: "PIC SALES", value: "Bambang Suryanto" },
  { label: "CHANNEL PENJUALAN", value: "Online" },
  { label: "NO. SERTIFIKASI", value: "2236-102990-111" },
  { label: "DOKUMEN NDA", value: "Ya" },
  {
    label: "CATATAN KHUSUS",
    value:
      "Setelah dilakukan pemeriksaan fisik oleh tim gudang, seluruh barang dalam pesanan ini dalam kondisi baik, sesuai dengan jumlah dan spesifikasi yang tercantum dalam dokumen pemesanan. Tidak ditemukan kerusakan ataupun kekurangan. Barang siap untuk dikirim ke alamat tujuan sesuai jadwal pengiriman.",
  },
];

const PdfPaperData = {
  companyName: "PT Nama Perusahaan",
  companyPhone: "021-1234567",
  companyEmail: "admin@perusahaan.com",
  documentNumber: "10001",
  term: "Net 30",
  shippingDate: "21-02-2020",
  deliveryVia: "SiCepat Express",
  trackingNo: "WH-99120-3301",
  orderNo: "O-77120",
  warehouse: "Gudang Jakarta-01",
  tagsSalesInvoice: "Prioritas, Reguler",
  tagsSalesOrder: "grosir, reguler",
  customerRefSalesInvoice: "PO-90125",
  customerRefSalesOrder: "ref-4521",
  recipientName: "Vinson Masif",
  recipientCompanyName: "Test Company",
  recipientFullName: "Vinson Masif Pratama",
  recipientPhone: "0812-3456-7890",
  recipientEmail: "vinson@perusahaan-customer.com",
  recipientBillAddress: "Jl. Alamat Penagihan No. 1",
  recipientShipAddress: "Jl. Cihampelas No. 27, Bandung",
  itemOneCode: "KB-101",
  itemOneName: "Keyboard Logitech - Wireless",
  itemTwoCode: "MN-330",
  itemTwoName: "Monitor Benq - 17 inch",
  qtyText: "1 Pcs",
  itemOnePrice: "215.000,00",
  itemTwoPrice: "1.500.000,00",
  itemTwoDiscount: "10%",
  itemTwoAmount: "1.500.000,00",
  subtotal: "1.715.000,00",
  discount: "86.500,00",
  discountPerItem: "150.000,00",
  tax: "20.311,66",
  shipping: "20.000,00",
  shippingNoDecimals: "20.000",
  total: "1.518.811,66",
  witholding: "29.570,00",
  amountReceived: "500.000,00",
  balanceDue: "989.241,66",
  amountInWordsTotal:
    "SATU JUTA LIMA RATUS DELAPAN BELAS RIBU DELAPAN RATUS SEBELAS RUPIAH",
  amountInWordsBalanceDue:
    "SEMBILAN RATUS DELAPAN PULUH SEMBILAN RIBU DUA RATUS EMPAT PULUH SATU RUPIAH",
  messageText: "Barang dikirim setelah pembayaran dikonfirmasi.",
  memoText: "Terima kasih atas kerja sama Anda.",
  bankName: "Bank BCA",
  bankSwift: "CBCNIDJA",
  bankBranch: "KCU Thamrin",
  bankAccountNumber: "123-01-00078-50",
  bankAccountName: "PT Nama Perusahaan",
  signerName: "Andi Pratama",
  signerRoleOne: "Finance Manager",
  signerRoleTwo: "Kepala Operasional",
};

function paperLabel(value, fallback) {
  return value !== "" ? value : fallback;
}

function formatPdfDate(day, monthIndex, year, pattern) {
  const monthsShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthsFull = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayText = day < 10 ? `0${day}` : `${day}`;
  const monthNumber = monthIndex + 1;
  const monthText = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
  if (pattern === "28-08-2023") return `${dayText}-${monthText}-${year}`;
  if (pattern === "28 Aug 2023") return `${day} ${monthsShort[monthIndex]} ${year}`;
  if (pattern === "28 August 2023") return `${day} ${monthsFull[monthIndex]} ${year}`;
  if (pattern === "08/28/2023") return `${monthText}/${dayText}/${year}`;
  return `${monthText}-${dayText}-${year}`;
}

function paperTextClass(contentSize) {
  if (contentSize === "Medium") return "text-[12px]";
  if (contentSize === "Small") return "text-[11px]";
  return "text-[13px]";
}

function paperLogoBox(logoPosition) {
  return (
    <span
      className={
        logoPosition === "Center"
          ? "mx-auto mb-2 block h-8 w-24 rounded border border-slate-200 bg-slate-100 text-center text-[10px] font-semibold leading-8 text-slate-400"
          : logoPosition === "Right"
            ? "ml-auto mb-2 block h-8 w-24 rounded border border-slate-200 bg-slate-100 text-center text-[10px] font-semibold leading-8 text-slate-400"
            : "mb-2 block h-8 w-24 rounded border border-slate-200 bg-slate-100 text-center text-[10px] font-semibold leading-8 text-slate-400"
      }
    >
      LOGO
    </span>
  );
}

function PdfLineRow({ label, value }) {
  return (
    <div className="flex">
      <span className="w-[46%] shrink-0 pr-1">{label}</span>
      <span className="w-3 shrink-0">:</span>
      <span>{value}</span>
    </div>
  );
}

function PdfTotalLine({ label, value, bold }) {
  return (
    <div className={bold ? "flex justify-between font-bold" : "flex justify-between"}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PdfSignatureBlock({ documentType, data, bestRegards }) {
  if (documentType === "Purchase Invoice") return null;
  return (
    <div className="mt-8 ml-auto w-[45%]">
      {bestRegards && <p className="m-0">Best Regards,</p>}
      <p className="m-0">______________________________________</p>
      <p className="m-0">{data.signerName}</p>
      <p className="m-0">{data.signerRoleOne}</p>
      <p className="m-0">{data.signerRoleTwo}</p>
    </div>
  );
}

function PdfDocumentFooter({ documentType, numberLabel, content }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-2 text-[11px] text-slate-500">
      <span>
        {documentType} {numberLabel}
        {PdfPaperData.documentNumber}
      </span>
      <span className="flex-1 text-center">
        {content.showFootnote ? content.footnoteText : ""}
      </span>
      <span>Page 1 of 1</span>
    </div>
  );
}

function PdfCustomFieldsBlock({ header }) {
  if (!header.showCustomFields) return null;
  return (
    <div>
      {PdfCustomFieldRows.map((row) => (
        <PdfLineRow key={row.label} label={row.label} value={row.value} />
      ))}
    </div>
  );
}

function PdfAmountTotals({ documentType, content, uppercase }) {
  const shippingValue =
    documentType === "Sales Order"
      ? PdfPaperData.shippingNoDecimals
      : PdfPaperData.shipping;
  return (
    <div className="ml-auto w-[55%]">
      <PdfTotalLine
        label={uppercase ? "SUBTOTAL" : "Subtotal"}
        value={PdfPaperData.subtotal}
      />
      <PdfTotalLine
        label={uppercase ? "DISCOUNT" : "Discount"}
        value={PdfPaperData.discount}
      />
      <PdfTotalLine
        label={uppercase ? "DISCOUNT PER ITEM" : "Discount per Item"}
        value={PdfPaperData.discountPerItem}
      />
      <PdfTotalLine label="PPN 10%" value={PdfPaperData.tax} />
      <PdfTotalLine label={uppercase ? "SHIPPING" : "Shipping"} value={shippingValue} />
      <PdfTotalLine label="TOTAL" value={PdfPaperData.total} bold />
      {documentType !== "Sales Order" && (
        <PdfTotalLine
          label={uppercase ? "WITHOLDING AMOUNT" : "Witholding Amount"}
          value={PdfPaperData.witholding}
        />
      )}
      <PdfTotalLine
        label={uppercase ? "AMOUNT RECEIVED" : "Amount Received"}
        value={PdfPaperData.amountReceived}
      />
      <PdfTotalLine
        label={uppercase ? "BALANCE DUE" : "Balance Due"}
        value={PdfPaperData.balanceDue}
      />
    </div>
  );
}

export function PdfPaperTemplate1({ documentType, header, content }) {
  const numberLabel = documentType === "Sales Order" ? "ORDER #" : "INVOICE #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const customerRefLabel =
    content.labelCustomerRef !== ""
      ? content.labelCustomerRef.toUpperCase()
      : "CUSTOMER'S REFERENCE";
  const quantityLabel =
    content.labelTableQty !== ""
      ? content.labelTableQty.toUpperCase()
      : "QUANTITY";
  const priceLabel =
    content.labelTablePrice !== ""
      ? content.labelTablePrice.toUpperCase()
      : "UNIT PRICE (RP.)";
  const discountLabel =
    content.labelTableDiscount !== ""
      ? content.labelTableDiscount.toUpperCase()
      : "DISCOUNT";
  const taxLabel =
    content.labelTableTax !== ""
      ? content.labelTableTax.toUpperCase()
      : "TAXED";
  const phoneLabel = paperLabel(header.labelCompanyPhone, "Phone");
  const emailLabel = paperLabel(header.labelCompanyEmail, "Email");
  const recipientNameLabel = paperLabel(header.labelRecipientName, "NAME");
  const recipientCompanyLabel = paperLabel(
    header.labelRecipientCompany,
    "COMPANY NAME"
  );
  const recipientFullNameLabel = paperLabel(
    header.labelRecipientFullName,
    "FULL NAME"
  );
  const recipientAddressLabel = paperLabel(
    header.labelRecipientAddress,
    "ADDRESS"
  );
  const recipientTelephoneLabel = paperLabel(
    header.labelRecipientTelephone,
    "PHONE"
  );
  const recipientEmailLabel = paperLabel(
    header.labelRecipientEmail,
    "EMAIL"
  );
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;

  return (
    <div className={paperTextClass(header.contentSize)}>
      <div className="flex gap-6">
        <div className="w-[45%]">
          {header.showLogo && paperLogoBox(header.logoPosition)}
          {header.showCompanyName && (
            <p className="m-0 text-[17px] font-bold">
              {PdfPaperData.companyName}
            </p>
          )}
          {header.showCompanyPhone && (
            <p className="m-0">
              {phoneLabel}: {PdfPaperData.companyPhone}
            </p>
          )}
          {header.showCompanyEmail && (
            <p className="m-0">
              {emailLabel}: {PdfPaperData.companyEmail}
            </p>
          )}
        </div>
        <div className="w-[55%]">
          <PdfLineRow label={numberLabel} value={PdfPaperData.documentNumber} />
          <PdfLineRow label="DATE" value={dateText} />
        </div>
      </div>
      <hr className="my-3 border-slate-200" />
      <div className="flex gap-6">
        <div className="w-[45%]">
          <p className="m-0 font-semibold">
            {documentType === "Purchase Invoice" ? "VENDOR" : "CUSTOMER"}
          </p>
          {header.showRecipientName && (
            <PdfLineRow label={recipientNameLabel} value={PdfPaperData.recipientName} />
          )}
          {header.showRecipientCompany && (
            <PdfLineRow
              label={recipientCompanyLabel}
              value={PdfPaperData.recipientCompanyName}
            />
          )}
          {header.showRecipientFullName && (
            <PdfLineRow
              label={recipientFullNameLabel}
              value={PdfPaperData.recipientFullName}
            />
          )}
          {header.showRecipientAddress && (
            <PdfLineRow
              label={recipientAddressLabel}
              value={PdfPaperData.recipientBillAddress}
            />
          )}
          {header.showRecipientTelephone && (
            <PdfLineRow
              label={recipientTelephoneLabel}
              value={PdfPaperData.recipientPhone}
            />
          )}
          {header.showRecipientEmail && (
            <PdfLineRow
              label={recipientEmailLabel}
              value={PdfPaperData.recipientEmail}
            />
          )}
        </div>
        <div className="w-[55%]">
          {documentType !== "Sales Order" && (
            <PdfLineRow label="ORDER NO" value={PdfPaperData.orderNo} />
          )}
          <PdfLineRow label="DUE DATE" value={dueDateText} />
          {content.showWarehouse && (
            <PdfLineRow label="WAREHOUSE" value={PdfPaperData.warehouse} />
          )}
          {content.showCustomerRef && (
            <PdfLineRow
              label={customerRefLabel}
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.customerRefSalesOrder
                  : PdfPaperData.customerRefSalesInvoice
              }
            />
          )}
          {content.showTags && (
            <PdfLineRow
              label="TAGS"
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.tagsSalesOrder
                  : PdfPaperData.tagsSalesInvoice
              }
            />
          )}
          <PdfCustomFieldsBlock header={header} />
        </div>
      </div>
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-300 text-left">
            <th className="py-1 pr-2 font-semibold">NO.</th>
            {content.showTableDescription && (
              <th className="py-1 pr-2 font-semibold">DESCRIPTION</th>
            )}
            {content.showTableQty && (
              <th className="py-1 pr-2 font-semibold">{quantityLabel}</th>
            )}
            {content.showTablePrice && (
              <th className="py-1 pr-2 font-semibold">{priceLabel}</th>
            )}
            {content.showTableDiscount && (
              <th className="py-1 pr-2 font-semibold">{discountLabel}</th>
            )}
            {content.showTableTax && (
              <th className="py-1 pr-2 font-semibold">{taxLabel}</th>
            )}
            <th className="py-1 font-semibold">AMOUNT (RP.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100 align-top">
            <td className="py-1.5 pr-2">1</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">
                {content.showTableProduct &&
                  `${PdfPaperData.itemOneCode} `}
                {PdfPaperData.itemOneName}
              </td>
            )}
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="py-1.5 pr-2"></td>}
            {content.showTableTax && <td className="py-1.5 pr-2">X</td>}
            <td className="py-1.5"></td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            <td className="py-1.5 pr-2">2</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">
                {content.showTableProduct &&
                  `${PdfPaperData.itemTwoCode} `}
                {PdfPaperData.itemTwoName}
              </td>
            )}
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="py-1.5 pr-2"></td>}
            <td className="py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-3">
        <PdfAmountTotals
          documentType={documentType}
          content={content}
          uppercase={false}
        />
      </div>
      {content.showMemo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">MEMO</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">MESSAGE</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">PAYMENT DETAIL</p>
          <PdfLineRow label="BANK NAME :" value={PdfPaperData.bankName} />
          <PdfLineRow label="BANK BRANCH :" value={PdfPaperData.bankBranch} />
          <PdfLineRow
            label="BANK ACCOUNT NUMBER :"
            value={PdfPaperData.bankAccountNumber}
          />
          <PdfLineRow
            label="BANK ACCOUNT NAME :"
            value={PdfPaperData.bankAccountName}
          />
        </div>
      )}
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock
          documentType={documentType}
          data={PdfPaperData}
        />
      )}
      {content.showFooter && (
        <PdfDocumentFooter
          documentType={documentType}
          numberLabel="#"
          content={content}
        />
      )}
    </div>
  );
}

export function PdfPaperTemplate6({ documentType, header, content }) {
  const numberTitle = documentType === "Sales Order" ? "Order #" : "Invoice #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;
  const bigNominal =
    content.amountNominal === "Balance due"
      ? PdfPaperData.balanceDue
      : PdfPaperData.total;

  return (
    <div className={paperTextClass(header.contentSize)}>
      <div className="flex gap-6">
        <div className="w-1/2">
          {header.showLogo && paperLogoBox("Left")}
          {header.showCompanyName && (
            <p className="m-0 text-[17px] font-bold">{PdfPaperData.companyName}</p>
          )}
          {header.showCompanyPhone && (
            <p className="m-0">{PdfPaperData.companyPhone}</p>
          )}
          {header.showCompanyEmail && <p className="m-0">{PdfPaperData.companyEmail}</p>}
        </div>
        <div className="w-1/2">
          <div className="flex gap-4">
            <div className="w-1/2">
              {header.showRecipientName && (
                <p className="m-0 font-semibold">{PdfPaperData.recipientName}</p>
              )}
              {header.showRecipientFullName && (
                <p className="m-0">{PdfPaperData.recipientFullName}</p>
              )}
              {header.showRecipientCompany && (
                <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
              )}
              {header.showRecipientTelephone && (
                <p className="m-0">{PdfPaperData.recipientPhone}</p>
              )}
              {header.showRecipientEmail && (
                <p className="m-0">{PdfPaperData.recipientEmail}</p>
              )}
              {header.showRecipientAddress && (
                <>
                  <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
                  <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
                </>
              )}
            </div>
            <div className="w-1/2">
              <p className="m-0 font-semibold">
                {numberTitle} {PdfPaperData.documentNumber}
              </p>
              <p className="m-0">{dateText}</p>
              <p className="m-0">Term: {PdfPaperData.term}</p>
              <p className="m-0">Due Date: {dueDateText}</p>
              <p className="m-0">Shipping Date: {shippingDateText}</p>
              <p className="m-0">Delivery Via: {PdfPaperData.deliveryVia}</p>
              <p className="m-0">Tracking No.: {PdfPaperData.trackingNo}</p>
              <p className="mt-2 text-[16px] font-bold">Rp. {bigNominal}</p>
            </div>
          </div>
        </div>
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="py-1 pr-2 font-semibold">NO.</th>
            {content.showTableQty && (
              <th className="py-1 pr-2 font-semibold">Quantity</th>
            )}
            {content.showTableDescription && (
              <th className="py-1 pr-2 font-semibold">Description</th>
            )}
            {content.showTablePrice && (
              <th className="py-1 pr-2 font-semibold">Unit Price (Rp.)</th>
            )}
            {content.showTableDiscount && (
              <th className="py-1 pr-2 font-semibold">Discount</th>
            )}
            {content.showTableTax && (
              <th className="py-1 pr-2 font-semibold">Taxed</th>
            )}
            <th className="py-1 font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="py-1.5 pr-2">1</td>
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">
                {content.showTableProduct && (
                  <span className="block">{PdfPaperData.itemOneCode}</span>
                )}
                {PdfPaperData.itemOneName}
              </td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="py-1.5 pr-2"></td>}
            {content.showTableTax && <td className="py-1.5 pr-2">PPN</td>}
            <td className="py-1.5"></td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            <td className="py-1.5 pr-2">2</td>
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">
                {content.showTableProduct && (
                  <span className="block">{PdfPaperData.itemTwoCode}</span>
                )}
                {PdfPaperData.itemTwoName}
              </td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="py-1.5 pr-2"></td>}
            <td className="py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      <PdfAmountTotals
        documentType={documentType}
        content={content}
        uppercase={false}
      />
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Payment Detail</p>
          <PdfLineRow label="Bank Name" value={PdfPaperData.bankName} />
          <PdfLineRow label="Bank/Swift Code" value={PdfPaperData.bankSwift} />
          <PdfLineRow label="Bank Branch" value={PdfPaperData.bankBranch} />
          <PdfLineRow
            label="Bank Account Number"
            value={PdfPaperData.bankAccountNumber}
          />
          <PdfLineRow
            label="Bank Account Name"
            value={PdfPaperData.bankAccountName}
          />
        </div>
      )}
      <div className="mt-4">
        <p className="m-0 font-semibold">Other Information</p>
        {documentType !== "Sales Order" && (
          <p className="m-0">Order No : {PdfPaperData.orderNo}</p>
        )}
        {content.showCustomerRef && (
          <p className="m-0">
            Customer's Reference :{" "}
            {documentType === "Sales Order"
              ? PdfPaperData.customerRefSalesOrder
              : PdfPaperData.customerRefSalesInvoice}
          </p>
        )}
        {content.showWarehouse && (
          <p className="m-0">Warehouse : {PdfPaperData.warehouse}</p>
        )}
        {content.showTags && (
          <p className="m-0">
            Tags :{" "}
            {documentType === "Sales Order"
              ? PdfPaperData.tagsSalesOrder
              : PdfPaperData.tagsSalesInvoice}
          </p>
        )}
      </div>
      {content.showMemo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Memo</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Message</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock documentType={documentType} data={PdfPaperData} />
      )}
      {content.showFooter && (
        <PdfDocumentFooter
          documentType={documentType}
          numberLabel="#"
          content={content}
        />
      )}
    </div>
  );
}

export function PdfPaperTemplate7({ documentType, header, content }) {
  const numberTitle = documentType === "Sales Order" ? "Order #" : "Invoice #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;

  return (
    <div className={paperTextClass(header.contentSize)}>
      <div className="flex gap-6">
        <div className="w-1/2">
          {header.showLogo && paperLogoBox("Left")}
          {header.showCompanyName && (
            <p className="m-0 text-[17px] font-bold">{PdfPaperData.companyName}</p>
          )}
          {header.showCompanyPhone && (
            <p className="m-0">{PdfPaperData.companyPhone}</p>
          )}
          {header.showCompanyEmail && <p className="m-0">{PdfPaperData.companyEmail}</p>}
        </div>
        <div className="w-1/2">
          <PdfLineRow label="Date :" value={dateText} />
          <PdfLineRow label={`${numberTitle} :`} value={PdfPaperData.documentNumber} />
          {content.showCustomerRef && (
            <PdfLineRow
              label="Customer's Reference :"
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.customerRefSalesOrder
                  : PdfPaperData.customerRefSalesInvoice
              }
            />
          )}
        </div>
      </div>
      <div className="mt-3 border-t border-slate-200 pt-3">
        <p className="m-0 font-semibold uppercase">
          {documentType === "Purchase Invoice" ? "Vendor" : "Customer"}
        </p>
        {header.showRecipientName && (
          <p className="m-0">{PdfPaperData.recipientName}</p>
        )}
        {header.showRecipientFullName && (
          <p className="m-0">{PdfPaperData.recipientFullName}</p>
        )}
        {header.showRecipientCompany && (
          <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
        )}
        {header.showRecipientTelephone && (
          <p className="m-0">{PdfPaperData.recipientPhone}</p>
        )}
        {header.showRecipientEmail && (
          <p className="m-0">{PdfPaperData.recipientEmail}</p>
        )}
        {header.showRecipientAddress && (
          <>
            <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
            <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
          </>
        )}
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="mt-4 w-full border-collapse text-center">
        <thead>
          <tr className="border-y border-slate-300 bg-slate-50">
            {content.showTags && <th className="py-1 px-2 font-semibold">Tags</th>}
            <th className="py-1 px-2 font-semibold">
              Delivery Via ( Tracking No. )
            </th>
            <th className="py-1 px-2 font-semibold">Term</th>
            <th className="py-1 px-2 font-semibold">Due Date</th>
            <th className="py-1 px-2 font-semibold">Shipping Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {content.showTags && (
              <td className="py-1 px-2">
                {documentType === "Sales Order"
                  ? PdfPaperData.tagsSalesOrder
                  : PdfPaperData.tagsSalesInvoice}
              </td>
            )}
            <td className="py-1 px-2">
              {PdfPaperData.deliveryVia} ( {PdfPaperData.trackingNo} )
            </td>
            <td className="py-1 px-2">{PdfPaperData.term}</td>
            <td className="py-1 px-2">{dueDateText}</td>
            <td className="py-1 px-2">{shippingDateText}</td>
          </tr>
        </tbody>
      </table>
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-300 bg-slate-50 text-left">
            <th className="py-1 pr-2 font-semibold">NO.</th>
            {content.showTableQty && (
              <th className="py-1 pr-2 font-semibold">Quantity</th>
            )}
            <th className="py-1 pr-2 font-semibold">Product</th>
            {content.showTableDescription && (
              <th className="py-1 pr-2 font-semibold">Description</th>
            )}
            {content.showTablePrice && (
              <th className="py-1 pr-2 font-semibold">Unit Price (Rp.)</th>
            )}
            {content.showTableDiscount && (
              <th className="py-1 pr-2 font-semibold">Discount</th>
            )}
            {content.showTableTax && (
              <th className="py-1 pr-2 font-semibold">Taxed</th>
            )}
            <th className="py-1 font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="py-1.5 pr-2">1</td>
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            <td className="py-1.5 pr-2">{PdfPaperData.itemOneCode}</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemOneName}</td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="py-1.5 pr-2"></td>}
            {content.showTableTax && <td className="py-1.5 pr-2">PPN</td>}
            <td className="py-1.5"></td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            <td className="py-1.5 pr-2">2</td>
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            <td className="py-1.5 pr-2">{PdfPaperData.itemTwoCode}</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoName}</td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="py-1.5 pr-2"></td>}
            <td className="py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex gap-6">
        <div className="w-[50%]">
          {content.showAmountInWords && (
            <div>
              <p className="m-0 font-semibold">AMOUNT IN WORD</p>
              <p className="m-0">{amountInWordsText}</p>
            </div>
          )}
          {content.showPaymentInfo && (
            <div className="mt-4">
              <p className="m-0 font-semibold">Payment Detail</p>
              <PdfLineRow label="Bank Name :" value={PdfPaperData.bankName} />
              <PdfLineRow label="Bank Branch :" value={PdfPaperData.bankBranch} />
              <PdfLineRow
                label="Bank Account Number :"
                value={PdfPaperData.bankAccountNumber}
              />
              <PdfLineRow
                label="Bank Account Name :"
                value={PdfPaperData.bankAccountName}
              />
            </div>
          )}
        </div>
        <div className="w-[50%]">
          <PdfAmountTotals
            documentType={documentType}
            content={content}
            uppercase={false}
          />
        </div>
      </div>
      <div className="mt-4 rounded border border-slate-200 p-3">
        <p className="m-0 font-semibold">Special Notes and Instructions</p>
        {content.showMemo && (
          <div className="mt-2">
            <p className="m-0">Memo: {PdfPaperData.memoText}</p>
          </div>
        )}
        {content.showMessage && (
          <div className="mt-2">
            <p className="m-0">Message: {PdfPaperData.messageText}</p>
          </div>
        )}
      </div>
      {content.showSignature && (
        <PdfSignatureBlock documentType={documentType} data={PdfPaperData} />
      )}
      {content.showFooter && (
        <PdfDocumentFooter documentType={documentType} numberLabel="#" content={content} />
      )}
    </div>
  );
}

export function PdfPaperTemplate10({ documentType, header, content }) {
  const numberTitle = documentType === "Sales Order" ? "Order No :" : "Invoice No :";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;

  return (
    <div className={paperTextClass(header.contentSize)}>
      <div className="flex items-start justify-between gap-6">
        <div>
          {header.showLogo && paperLogoBox("Left")}
          {header.showCompanyName && (
            <p className="m-0 text-[17px] font-bold">{PdfPaperData.companyName}</p>
          )}
          {header.showCompanyPhone && (
            <p className="m-0">{PdfPaperData.companyPhone}</p>
          )}
          {header.showCompanyEmail && <p className="m-0">{PdfPaperData.companyEmail}</p>}
        </div>
        <div className="rounded bg-slate-100 px-4 py-2 text-right">
          <p className="m-0 text-[11px] uppercase text-slate-500">Total</p>
          <p className="m-0 text-[16px] font-bold">{PdfPaperData.total}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-6">
        <div className="w-[55%]">
          <p className="m-0 font-semibold">
            {documentType === "Purchase Invoice" ? "Billed To" : "Sale To"} :
          </p>
          {header.showRecipientName && (
            <p className="m-0">{PdfPaperData.recipientName}</p>
          )}
          {header.showRecipientFullName && (
            <p className="m-0">{PdfPaperData.recipientFullName}</p>
          )}
          {header.showRecipientEmail && (
            <p className="m-0">{PdfPaperData.recipientEmail}</p>
          )}
          {header.showRecipientCompany && (
            <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
          )}
          {header.showRecipientTelephone && (
            <p className="m-0">{PdfPaperData.recipientPhone}</p>
          )}
          {header.showRecipientAddress && (
            <>
              <p className="m-0">Address</p>
              <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
              <p className="mt-2 m-0">Shipping Address</p>
              <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
            </>
          )}
        </div>
        <div className="w-[45%]">
          <PdfLineRow label={`${numberTitle}`} value={PdfPaperData.documentNumber} />
          <PdfLineRow label="Date :" value={dateText} />
          <PdfLineRow label="Due Date :" value={dueDateText} />
          <PdfLineRow label="Term :" value={PdfPaperData.term} />
          <PdfLineRow label="Shipping Date :" value={shippingDateText} />
          <PdfLineRow label="Delivery Via :" value={PdfPaperData.deliveryVia} />
          <PdfLineRow label="Tracking No. :" value={PdfPaperData.trackingNo} />
          {documentType !== "Sales Order" && (
            <PdfLineRow label="Order No :" value={PdfPaperData.orderNo} />
          )}
          {content.showCustomerRef && (
            <PdfLineRow
              label="Customer's Reference :"
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.customerRefSalesOrder
                  : PdfPaperData.customerRefSalesInvoice
              }
            />
          )}
          {content.showWarehouse && (
            <PdfLineRow label="Warehouse :" value={PdfPaperData.warehouse} />
          )}
          {content.showTags && (
            <PdfLineRow
              label="Tags :"
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.tagsSalesOrder
                  : PdfPaperData.tagsSalesInvoice
              }
            />
          )}
        </div>
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-300 bg-slate-50 text-left">
            <th className="py-1 pr-2 font-semibold">Product</th>
            {content.showTableDescription && (
              <th className="py-1 pr-2 font-semibold">Description</th>
            )}
            {content.showTableQty && (
              <th className="py-1 pr-2 font-semibold">Quantity</th>
            )}
            {content.showTableDiscount && (
              <th className="py-1 pr-2 font-semibold">Discount</th>
            )}
            {content.showTableTax && (
              <th className="py-1 pr-2 font-semibold">Taxed</th>
            )}
            {content.showTablePrice && (
              <th className="py-1 pr-2 font-semibold">Unit Price (Rp.)</th>
            )}
            <th className="py-1 font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="py-1.5 pr-2">{PdfPaperData.itemOneCode}</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemOneName}</td>
            )}
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDiscount && <td className="py-1.5 pr-2"></td>}
            {content.showTableTax && <td className="py-1.5 pr-2">PPN</td>}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemOnePrice}</td>
            )}
            <td className="py-1.5"></td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            <td className="py-1.5 pr-2">{PdfPaperData.itemTwoCode}</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoName}</td>
            )}
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDiscount && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="py-1.5 pr-2"></td>}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoPrice}</td>
            )}
            <td className="py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Message</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showMemo && (
        <div className="mt-2">
          <p className="m-0 font-semibold">Memo</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      <PdfAmountTotals documentType={documentType} content={content} uppercase={false} />
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Payment Detail</p>
          <p className="m-0">Bank Name : {PdfPaperData.bankName}</p>
          <p className="m-0">Bank Branch : {PdfPaperData.bankBranch}</p>
          <p className="m-0">
            Bank Account Number : {PdfPaperData.bankAccountNumber}
          </p>
          <p className="m-0">Bank Account Name : {PdfPaperData.bankAccountName}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock
          documentType={documentType}
          data={PdfPaperData}
          bestRegards
        />
      )}
      {content.showFooter && (
        <PdfDocumentFooter documentType={documentType} numberLabel="#" content={content} />
      )}
    </div>
  );
}

export function PdfPaperTemplate12({ documentType, header, content }) {
  const numberTitle = documentType === "Sales Order" ? "Order #" : "Invoice #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;
  const bigNominal =
    content.amountNominal === "Balance due"
      ? PdfPaperData.balanceDue
      : PdfPaperData.total;

  return (
    <div className={paperTextClass(header.contentSize)}>
      <div className="flex items-start justify-between gap-6">
        <div>
          {header.showLogo && paperLogoBox("Left")}
          {header.showCompanyName && (
            <p className="m-0 text-[17px] font-bold">{PdfPaperData.companyName}</p>
          )}
          {header.showCompanyPhone && (
            <p className="m-0">{PdfPaperData.companyPhone}</p>
          )}
          {header.showCompanyEmail && <p className="m-0">{PdfPaperData.companyEmail}</p>}
        </div>
        <div className="rounded-md bg-brand px-4 py-2 text-right text-white">
          <p className="m-0 text-[10px] uppercase">Balance Due</p>
          <p className="m-0 text-[16px] font-bold">Rp. {bigNominal}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="col-span-1 rounded-lg border border-slate-200 p-3">
          <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
            {documentType === "Purchase Invoice" ? "Vendor" : "Customer"}
          </p>
          {header.showRecipientName && (
            <p className="m-0 font-semibold">{PdfPaperData.recipientName}</p>
          )}
          {header.showRecipientFullName && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                Full Name
              </p>
              <p className="m-0">{PdfPaperData.recipientFullName}</p>
            </>
          )}
          {header.showRecipientCompany && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                Company Name
              </p>
              <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
            </>
          )}
          {header.showRecipientTelephone && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                Phone
              </p>
              <p className="m-0">{PdfPaperData.recipientPhone}</p>
            </>
          )}
          {header.showRecipientEmail && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                Email
              </p>
              <p className="m-0">{PdfPaperData.recipientEmail}</p>
            </>
          )}
          {header.showRecipientAddress && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                Address
              </p>
              <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                Shipping Address
              </p>
              <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
            </>
          )}
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
              {numberTitle}
            </p>
            <p className="m-0 font-semibold">{PdfPaperData.documentNumber}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Date
            </p>
            <p className="m-0">{dateText}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Due Date
            </p>
            <p className="m-0">{dueDateText}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Term
            </p>
            <p className="m-0">{PdfPaperData.term}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
              Shipping Date
            </p>
            <p className="m-0">{shippingDateText}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Delivery Via
            </p>
            <p className="m-0">{PdfPaperData.deliveryVia}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Tracking No.
            </p>
            <p className="m-0">{PdfPaperData.trackingNo}</p>
            {documentType !== "Sales Order" && (
              <>
                <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                  Order No
                </p>
                <p className="m-0">{PdfPaperData.orderNo}</p>
              </>
            )}
          </div>
          <div className="col-span-2 rounded-lg border border-slate-200 p-3">
            <div className="flex gap-6">
              {content.showCustomerRef && (
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
                    Customer's Reference
                  </p>
                  <p className="m-0">
                    {documentType === "Sales Order"
                      ? PdfPaperData.customerRefSalesOrder
                      : PdfPaperData.customerRefSalesInvoice}
                  </p>
                </div>
              )}
              {content.showWarehouse && (
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
                    Warehouse
                  </p>
                  <p className="m-0">{PdfPaperData.warehouse}</p>
                </div>
              )}
              {content.showTags && (
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
                    Tags
                  </p>
                  <p className="m-0">
                    {documentType === "Sales Order"
                      ? PdfPaperData.tagsSalesOrder
                      : PdfPaperData.tagsSalesInvoice}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-300 text-left">
            <th className="py-1 pr-2 font-semibold">NO.</th>
            {content.showTableDescription && (
              <th className="py-1 pr-2 font-semibold">Description</th>
            )}
            {content.showTableQty && (
              <th className="py-1 pr-2 font-semibold">Quantity</th>
            )}
            {content.showTablePrice && (
              <th className="py-1 pr-2 font-semibold">Unit Price (Rp.)</th>
            )}
            {content.showTableDiscount && (
              <th className="py-1 pr-2 font-semibold">Discount</th>
            )}
            {content.showTableTax && (
              <th className="py-1 pr-2 font-semibold">Taxed</th>
            )}
            <th className="py-1 font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100 align-top">
            <td className="py-1.5 pr-2">1</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">
                {content.showTableProduct &&
                  `${PdfPaperData.itemOneCode} - `}
                {PdfPaperData.itemOneName}
              </td>
            )}
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="py-1.5 pr-2"></td>}
            {content.showTableTax && <td className="py-1.5 pr-2">PPN</td>}
            <td className="py-1.5"></td>
          </tr>
          <tr className="align-top">
            <td className="py-1.5 pr-2">2</td>
            {content.showTableDescription && (
              <td className="py-1.5 pr-2">
                {content.showTableProduct &&
                  `${PdfPaperData.itemTwoCode} - `}
                {PdfPaperData.itemTwoName}
              </td>
            )}
            {content.showTableQty && (
              <td className="py-1.5 pr-2">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="py-1.5 pr-2">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="py-1.5 pr-2"></td>}
            <td className="py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Message</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showMemo && (
        <div className="mt-2">
          <p className="m-0 font-semibold">Memo</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      <PdfAmountTotals documentType={documentType} content={content} uppercase={false} />
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Payment Detail</p>
          <p className="m-0">Bank Name : {PdfPaperData.bankName}</p>
          <p className="m-0">Bank Branch : {PdfPaperData.bankBranch}</p>
          <p className="m-0">
            Bank Account Number : {PdfPaperData.bankAccountNumber}
          </p>
          <p className="m-0">Bank Account Name : {PdfPaperData.bankAccountName}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock documentType={documentType} data={PdfPaperData} />
      )}
      {content.showFooter && (
        <PdfDocumentFooter documentType={documentType} numberLabel="#" content={content} />
      )}
    </div>
  );
}

export function PdfPaper({ template, documentType, header, content }) {
  if (template === "Template 6") {
    return (
      <PdfPaperTemplate6
        documentType={documentType}
        header={header}
        content={content}
      />
    );
  }
  if (template === "Template 7") {
    return (
      <PdfPaperTemplate7
        documentType={documentType}
        header={header}
        content={content}
      />
    );
  }
  if (template === "Template 10") {
    return (
      <PdfPaperTemplate10
        documentType={documentType}
        header={header}
        content={content}
      />
    );
  }
  if (template === "Template 12") {
    return (
      <PdfPaperTemplate12
        documentType={documentType}
        header={header}
        content={content}
      />
    );
  }
  return (
    <PdfPaperTemplate1
      documentType={documentType}
      header={header}
      content={content}
    />
  );
}
