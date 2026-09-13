import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash,
  ArrowClockwise,
  X,
} from "@phosphor-icons/react";
import api from "@/services/api";
import {
  btnModalCancel,
  statCard,
  statLabel,
  tableCard,
  tableWrapper,
  tableBase,
  th,
  td,
  trHover,
  modalOverlay,
  modalPanel,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalFooter,
  formGroup,
  formLabel,
  formRequiredMark,
  inputBase,
  selectBase,
  pageSpinner,
  buttonSpinner,
} from "@/components/ui/styles";

const kategoriOptions = [
  "Aset",
  "Liabilitas",
  "Ekuitas",
  "Pendapatan",
  "Beban",
];

const emptyForm = {
  kode: "",
  nama: "",
  kategori: "Aset",
  saldo: "",
};

export default function COAPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCOA = async () => {
    try {
      setLoading(true);

      const response = await api.get("/coa/");

      setItems(response.data.results || response.data);
    } catch (error) {
      console.error("Fetch COA error:", error);
      alert(
        error.response?.data?.detail ||
          "Gagal mengambil data COA"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCOA();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);

    setForm({
      kode: item.kode || "",
      nama: item.nama || "",
      kategori: item.kategori || "Aset",
      saldo: item.saldo || "",
    });

    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kode.trim() || !form.nama.trim()) {
      alert("Kode dan nama akun wajib diisi");
      return;
    }

    try {
      setSaving(true);

      const data = {
        kode: form.kode.trim(),
        nama: form.nama.trim(),
        kategori: form.kategori,
        saldo: form.saldo || 0,
      };

      if (editing) {
        await api.put(`/coa/${editing.id}/`, data);
        alert("COA berhasil diperbarui");
      } else {
        await api.post("/coa/", data);
        alert("COA berhasil ditambahkan");
      }

      setDialogOpen(false);
      setForm(emptyForm);
      setEditing(null);

      await fetchCOA();
    } catch (error) {
      console.error("Save COA error:", error);

      const message =
        error.response?.data?.kode?.[0] ||
        error.response?.data?.detail ||
        "Data COA gagal disimpan";

      alert(
        typeof message === "string"
          ? message
          : "Data COA gagal disimpan"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const yakin = window.confirm(
      "Yakin ingin menghapus akun COA ini?"
    );

    if (!yakin) return;

    try {
      await api.delete(`/coa/${id}/`);

      alert("COA berhasil dihapus");

      await fetchCOA();
    } catch (error) {
      console.error("Delete COA error:", error);

      alert(
        error.response?.data?.detail ||
          "Gagal menghapus COA"
      );
    }
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const totalSaldo = items.reduce(
    (total, item) =>
      total + Number(item.saldo || 0),
    0
  );

  const totalKategori = new Set(
    items.map((item) => item.kategori)
  ).size;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-3 text-slate-500">
        <div className={`${pageSpinner} h-6 w-6`} />
        <span>Loading COA...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] p-6 max-md:p-4">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-5 max-md:items-stretch">
        <div>
          <h1 className="m-0 text-[28px] font-bold text-gray-900">
            Chart of Accounts
          </h1>
          <p className="m-0 mt-1.5 text-sm text-slate-500">
            Kelola daftar akun dan saldo perusahaan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 max-md:w-full">
          <button
            type="button"
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-lg border border-gray-300 bg-white px-[15px] py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
            onClick={fetchCOA}
          >
            <ArrowClockwise size={17} />
            Refresh
          </button>

          <button
            type="button"
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-brand px-[15px] py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
            onClick={openCreate}
          >
            <Plus size={17} />
            Tambah COA
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4 max-md:grid-cols-1">
        <div className={statCard}>
          <span className={statLabel}>Total Akun</span>
          <strong className="block text-[25px] text-gray-900">{items.length}</strong>
        </div>

        <div className={statCard}>
          <span className={statLabel}>Total Saldo</span>
          <strong className="block text-[25px] text-gray-900">{formatRupiah(totalSaldo)}</strong>
        </div>

        <div className={statCard}>
          <span className={statLabel}>Kategori</span>
          <strong className="block text-[25px] text-gray-900">{totalKategori}</strong>
        </div>
      </div>

      <div className={tableCard}>
        <div className="border-b border-gray-200 p-5">
          <h2 className="m-0 text-lg text-gray-900">Daftar COA</h2>
          <p className="m-0 mt-[5px] text-[13px] text-slate-500">
            {items.length} akun terdaftar
          </p>
        </div>

        <div className={tableWrapper}>
          <table className={`${tableBase} min-w-[700px]`}>
            <thead>
              <tr>
                <th className={th}>Kode</th>
                <th className={th}>Nama Akun</th>
                <th className={th}>Kategori</th>
                <th className={th}>Saldo</th>
                <th className={th}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="!p-5 py-[50px] text-center !text-slate-500"
                  >
                    Belum ada data COA.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className={trHover}>
                    <td className={`${td} font-bold text-gray-900`}>
                      {item.kode}
                    </td>

                    <td className={td}>{item.nama}</td>

                    <td className={td}>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-[5px] text-xs font-semibold text-blue-700">
                        {item.kategori}
                      </span>
                    </td>

                    <td className={td}>
                      {formatRupiah(item.saldo)}
                    </td>

                    <td className={td}>
                      <div className="flex items-center gap-[7px] max-md:flex-col max-md:items-stretch">
                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-[5px] rounded-md border border-gray-300 bg-white px-2.5 py-[7px] text-xs font-semibold text-gray-700 transition-colors hover:bg-slate-50 max-md:justify-center"
                          onClick={() =>
                            openEdit(item)
                          }
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-[5px] rounded-md border border-red-200 bg-white px-2.5 py-[7px] text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 max-md:justify-center"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                        >
                          <Trash size={13} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {dialogOpen && (
        <div
          className={modalOverlay}
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving
            ) {
              setDialogOpen(false);
            }
          }}
        >
          <div className={`${modalPanel} max-w-[500px]`}>
            <div className={modalHeader}>
              <h2 className={modalTitle}>
                {editing
                  ? "Edit COA"
                  : "Tambah COA"}
              </h2>

              <button
                type="button"
                className={modalCloseButton}
                onClick={() => {
                  if (!saving) {
                    setDialogOpen(false);
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-[22px]">
                <div className={formGroup}>
                  <label className={formLabel}>
                    Kode Akun <span className={formRequiredMark}>*</span>
                  </label>

                  <input
                    value={form.kode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        kode: e.target.value,
                      })
                    }
                    placeholder="Contoh: 1001"
                    className={inputBase}
                  />
                </div>

                <div className={formGroup}>
                  <label className={formLabel}>
                    Nama Akun <span className={formRequiredMark}>*</span>
                  </label>

                  <input
                    value={form.nama}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nama: e.target.value,
                      })
                    }
                    placeholder="Contoh: Kas"
                    className={inputBase}
                  />
                </div>

                <div className={formGroup}>
                  <label className={formLabel}>
                    Kategori <span className={formRequiredMark}>*</span>
                  </label>

                  <select
                    value={form.kategori}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        kategori: e.target.value,
                      })
                    }
                    className={selectBase}
                  >
                    {kategoriOptions.map(
                      (kategori) => (
                        <option
                          key={kategori}
                          value={kategori}
                        >
                          {kategori}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className={formGroup}>
                  <label className={formLabel}>Saldo Awal</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.saldo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        saldo: e.target.value,
                      })
                    }
                    placeholder="0"
                    className={inputBase}
                  />
                </div>
              </div>

              <div className={modalFooter}>
                <button
                  type="button"
                  className={btnModalCancel}
                  onClick={() => {
                    if (!saving) {
                      setDialogOpen(false);
                    }
                  }}
                  disabled={saving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-brand px-4 py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className={buttonSpinner} />
                      Menyimpan...
                    </>
                  ) : editing ? (
                    "Update"
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
