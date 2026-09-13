import { useEffect, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import Pagination from "@/components/ui/Pagination";
import {
  tableWrapper,
  tableBase,
  tableCard,
  th,
  td,
  trHover,
  selectBase,
  formLabel,
  btnPrimary,
  btnSecondary
} from "@/components/ui/styles";
import {
  dummyUsers,
  statusLabels,
  statusBadgeClass,
  typeLabels,
} from "@/components/data/dummy";

const PAGE_SIZE = 10;

function TransferOwnershipModal({ onClose }) {
  const [newOwner, setNewOwner] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const isTransferEnabled = newOwner !== "" && confirmText === "TRANSFER";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="max-h-[90vh] w-full max-w-[480px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-[22px] py-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">Transfer Kepemilikan Akun Perusahaan</h3>
          <button
            type="button"
            className="cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <p className="m-0 mb-5 text-sm leading-relaxed text-slate-500">
            Setelah kepemilikan dialihkan, peran Anda di akun perusahaan ini
            akan berubah menjadi Ultimate. Silakan pilih pemilik baru
          </p>

          <div className="mb-4">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Pemilik baru
            </label>
            <select
              name="newOwner"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              value={newOwner}
              onChange={(event) => setNewOwner(event.target.value)}
            >
              <option value="">Tidak ada yang ditemukan</option>
            </select>
          </div>

          <div className="mb-0">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Ketik TRANSFER sebagai konfirmasi untuk menyetujui pengalihan
              kepemilikan
            </label>
            <input
              name="confirmTransfer"
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border border-gray-300 bg-white px-[15px] py-[9px] text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-brand px-[15px] py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!isTransferEnabled}
            onClick={onClose}
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

function TableUser({ users, onTransferClick }) {
  return (
    <div className={tableWrapper}>
      <table className={`${tableBase} min-w-[800px]`}>
        <thead>
          <tr>
            <th className={th}>User name</th>
            <th className={th}>Acces time limits</th>
            <th className={th}>Status</th>
            <th className={th}>Type</th>
            <th className={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={trHover}>
              <td className={`${td} font-bold text-slate-900`}>
                {user.username}
              </td>
              <td className={td}>{user.accessLimit || "-"}</td>
              <td className={td}>
                <span
                  className={`inline-flex rounded-full px-[9px] py-[5px] text-xs font-bold ${statusBadgeClass[user.status]}`}
                >
                  {statusLabels[user.status]}
                </span>
              </td>
              <td className={td}>{typeLabels[user.type]}</td>
              <td className={td}>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={() => onTransferClick(user)}
                >
                  Transfer ownership
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserFilter({
  typeFilter,
  statusFilter,
  search,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}) {
  return (
    <div className="flex flex-wrap items-end gap-5 max-md:flex-col max-md:items-stretch">
      <div className="flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Tipe</label>
        <select
          name="type"
          className={selectBase}
          value={typeFilter}
          onChange={onTypeChange}
        >
          <option value="all">All types</option>
          <option value="member">Member</option>
          <option value="partner">Partner</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Status</label>
        <select
          name="status"
          className={selectBase}
          value={statusFilter}
          onChange={onStatusChange}
        >
          <option value="all">All status</option>
          <option value="invited">Invited</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex w-[280px] items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
        <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
        <input
          value={search}
          onChange={onSearchChange}
          placeholder="Cari user..."
          className="w-full border-0 outline-none"
        />
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [userListPage, setUserListPage] = useState(true);
  const [transferModalUser, setTransferModalUser] = useState(null);

  useEffect(() => {
    setUsers(dummyUsers);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesType =
      typeFilter === "all" || user.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    const keyword = search.toLowerCase();

    const matchesSearch =
      !keyword ||
      user.username.toLowerCase().includes(keyword) ||
      (user.accessLimit || "").toLowerCase().includes(keyword);

    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const pagedUsers = filteredUsers.slice(
    (safePage - 1) * pageSize,
    (safePage - 1) * pageSize + pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter]);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="m-0 text-[28px] font-bold text-gray-900">
            User Management
          </h2>

          <p className="m-0 mt-1.5 text-slate-500">
            Kelola informasi pengguna
          </p>
        </div>

        <div className="flex gap-3 ">
          <button className={btnSecondary}>Add custom role</button>
          <button className={btnPrimary}>Invite user</button>
        </div>
      </div>

      {userListPage ? (
        <div className="flex gap-3">
          <button
            className="border-b border-brand bg-white p-2 text-brand hover:bg-gray-50"
            onClick={() => setUserListPage(true)}
          >
            User list
          </button>

          <button
            className="p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
            onClick={() => setUserListPage(false)}
          >
            Custom role
          </button>
        </div>
      ) : (
        <div className="mb-6 flex gap-3">
          <button
            className="p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
            onClick={() => setUserListPage(true)}
          >
            User list
          </button>

          <button
            className="border-b border-brand p-2 text-brand hover:bg-gray-50"
            onClick={() => setUserListPage(false)}
          >
            Custom role
          </button>
        </div>
      )}

      {userListPage ? (
        <div className={`${tableCard} p-6`}>
          <div className="mb-8">
            <UserFilter
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              search={search}
              onTypeChange={(event) =>
                setTypeFilter(event.target.value)
              }
              onStatusChange={(event) =>
                setStatusFilter(event.target.value)
              }
              onSearchChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <TableUser
            users={pagedUsers}
            onTransferClick={(user) => setTransferModalUser(user)}
          />

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex w-[280px] items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto ">
        <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
        <input
          placeholder="Cari role..."
          className="w-full border-0 outline-none"
        />
      </div>
      <div className="p-10">
          <p>List role akan ditampilkan disini</p>
      </div>
        </div>
      )}

      {transferModalUser !== null && (
        <TransferOwnershipModal
          onClose={() => setTransferModalUser(null)}
        />
      )}
    </div>
  );
}