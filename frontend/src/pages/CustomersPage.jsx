import { useEffect, useState } from "react";
import { Plus, Pencil, Trash, MagnifyingGlass, X } from "@phosphor-icons/react";
import api from "../services/api";
import RegionSelects from "@/components/ui/RegionSelects";
import Pagination from "@/components/ui/Pagination";
import {
  btnPrimary,
  btnModalCancel,
  btnModalSubmit,
  tableCard,
  tableWrapper,
  tableBase,
  th,
  td,
  trHover,
  formLabel,
  selectBase,
  textareaBase,
  pageSpinner,
} from "@/components/ui/styles";

const emptyForm = {
  name: "",
  company_name: "",
  email: "",
  phone: "",
  address: "",
  agent: "",
  notes: "",
  adress:"",
  province:"",
  village:"",
  postal_code:"",
  status:"PROSPECT",
};

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const fetchCustomers = async () => {
    const response = await api.get("/customers/");
    const data = response.data;
    setCustomers(Array.isArray(data) ? data : data.results || []);
  };

  const fetchAgents = async () => {
    const response = await api.get("/agents/");
    const data = response.data;
    setAgents(Array.isArray(data) ? data : data.results || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCustomers(), fetchAgents()]);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Nama customer wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        company_name: form.company_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        province: form.province,
        city: form.city,
        district: form.district,
        village: form.village,
        postal_code: form.postal_code,
        status: form.status,
        notes: form.notes,
      };

      if (form.agent) {
        payload.agent = Number(form.agent);
      }

      if (editingId) {
        await api.put(`/customers/${editingId}/`, payload);
      } else {
        await api.post("/customers/", payload);
      }

      await fetchCustomers();
      closeForm();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);

    setForm({
      name: customer.name || "",
      company_name: customer.company_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      province: customer.province || "",
      city: customer.city || "",
      district: customer.district || "",
      village: customer.village || "",
      postal_code: customer.postal_code || "",
      status: customer.status || "PROSPECT",
      agent: customer.agent ? String(customer.agent) : "",
      notes: customer.notes || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus customer ini?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/customers/${id}/`);
      await fetchCustomers();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus customer.");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(keyword) ||
      customer.company_name?.toLowerCase().includes(keyword) ||
      customer.email?.toLowerCase().includes(keyword) ||
      customer.phone?.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const pageStart = (safePage - 1) * pageSize;
  const pagedCustomers = filteredCustomers.slice(
    pageStart,
    pageStart + pageSize
  );

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-center justify-between gap-5 max-md:flex-col max-md:items-stretch">
        <div>
          <h1 className="m-0 text-[28px] font-bold text-gray-900">
            Customers
          </h1>
          <p className="m-0 mt-1.5 text-slate-500">
            Kelola data customer QontakSales.
          </p>
        </div>

        <button
          type="button"
          className={`${btnPrimary} max-md:justify-center`}
          onClick={openAddForm}
        >
          <Plus size={20} />
          <span>Tambah Customer</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-[22px] flex items-start justify-between">
            <div>
              <h2 className="m-0 text-[19px]">
                {editingId ? "Edit Customer" : "Tambah Customer"}
              </h2>
              <p className="m-0 mt-[5px] text-sm text-slate-500">
                Isi informasi customer di bawah ini.
              </p>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-slate-100"
              onClick={closeForm}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
              <div className="flex flex-col gap-[7px]">
                <label className={formLabel}>Nama Customer</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama customer"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label className={formLabel}>Nama Perusahaan</label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="Masukkan nama perusahaan"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label className={formLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="customer@email.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label className={formLabel}>No. Telepon</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Masukkan nomor telepon"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label className={formLabel}>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={selectBase}
                >
                  <option value="PROSPECT">Prospect</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col gap-[7px]">
                <label className={formLabel}>Agent</label>
                <select
                  name="agent"
                  value={form.agent}
                  onChange={handleChange}
                  className={selectBase}
                >
                  <option value="">Pilih Agent</option>

                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name ||
                        `${agent.first_name || ""} ${agent.last_name || ""}`.trim() ||
                        agent.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-[7px] col-span-full max-md:col-auto">
                <label className={formLabel}>Alamat jalan</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="jalan, nomor rumah, Rt/Rw"
                  rows="3"
                  className={textareaBase}
                />
              </div>

              <RegionSelects
                value={{
                  province: form.province,
                  city: form.city,
                  district: form.district,
                  village: form.village,
                }}
                onChange={(region) =>
                  setForm((current) => ({ ...current, ...region }))
                }
              />

              <div className="flex flex-col gap-[7px]">
                <label className={formLabel}>Kode Pos</label>
                <input
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="Contoh: 40135"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand"
                />
              </div>


              <div className="flex flex-col gap-[7px] col-span-full max-md:col-auto">
                <label className={formLabel}>Catatan</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Catatan tambahan"
                  rows="3"
                  className={textareaBase}
                />
              </div>
            </div>

            <div className="mt-[22px] flex justify-end gap-2.5">
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700"
                onClick={closeForm}
              >
                Batal
              </button>

              <button
                type="submit"
                className={`${btnPrimary} py-[11px]`}
                disabled={saving}
              >
                {saving
                  ? "Menyimpan..."
                  : editingId
                    ? "Update Customer"
                    : "Simpan Customer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={tableCard}>
        <div className="flex items-center justify-between gap-5 border-b border-slate-200 px-[22px] py-5 max-md:flex-col max-md:items-stretch">
          <div>
            <h2 className="m-0 text-[19px]">Daftar Customer</h2>
            <p className="m-0 mt-[5px] text-sm text-slate-500">
              {filteredCustomers.length} customer ditemukan
            </p>
          </div>

          <div className="flex w-[280px] items-center gap-2 rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
            <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari customer..."
              className="w-full border-0 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-slate-500">
            <div className="h-[30px] w-[30px] animate-spin rounded-full border-[3px] border-slate-200 border-t-brand" />
            <span>Loading customers...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-5 py-[70px] text-center">
            <h3 className="m-0 text-slate-900">Belum ada customer</h3>
            <p className="m-0 mt-2 text-slate-500">
              Tambahkan customer untuk mulai mengelola data.
            </p>
          </div>
        ) : (
          <>
            <div className={tableWrapper}>
            <table className={`${tableBase} min-w-[900px]`}>
              <thead>
                <tr>
                  <th>No</th>
                  <th className={th}>Nama</th>
                  <th className={th}>Perusahaan</th>
                  <th className={th}>Email</th>
                  <th className={th}>Telepon</th>
                  <th className={th}>Status</th>
                  <th className={th}>Alamat Jalan</th>
                  <th className={th}>Provinsi</th>
                  <th className={th}>Kota/Kabupaten</th>
                  <th className={th}>Kecamatan</th>
                  <th className={th}>Kelurahan/Desa</th>
                  <th className={th}>Kode Pos</th>
                  <th className={th}>Agent</th>
                  <th className={th}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {pagedCustomers.map((customer,index) => (
                  <tr key={customer.id} className={trHover}>
                    <td className={td}>{index+1}</td>
                    <td className={`${td} font-bold text-slate-900`}>
                      {customer.name || "-"}
                    </td>

                    <td className={td}>{customer.company_name || "-"}</td>

                    <td className={td}>{customer.email || "-"}</td>

                    <td className={td}>{customer.phone || "-"}</td>

                    <td className={td}>
                      <span
                        className={`inline-flex rounded-full px-[9px] py-[5px] text-xs font-bold ${
                          customer.status === "CUSTOMER"
                            ? "bg-green-100 text-green-700"
                            : customer.status === "INACTIVE"
                              ? "bg-slate-200 text-slate-600"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {customer.status || "-"}
                      </span>
                    </td>

                    <td className={td}>{customer.address || "-"}</td>

                    <td className={td}>{customer.province || "-"}</td>

                    <td className={td}>{customer.city || "-"}</td>

                    <td className={td}>{customer.district || "-"}</td>

                    <td className={td}>{customer.village || "-"}</td>

                    <td className={td}>{customer.postal_code || "-"}</td>

                    <td className={td}>{customer.agent_name || "-"}</td>

                    <td className={td}>
                      <div className="flex gap-[7px]">
                        <button
                          type="button"
                          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[7px] bg-blue-100 text-brand"
                          onClick={() => handleEdit(customer)}
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[7px] bg-red-100 text-red-600"
                          onClick={() => handleDelete(customer.id)}
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filteredCustomers.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
