import { useEffect, useState } from "react";
import { CaretDown, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
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
  statusLabels,
  statusBadgeClass,
  typeLabels,
} from "@/data/dummy";
import {
  customRoleFeatures,
  inviteRoles,
} from "@/components/data/roleData";
import api from "../services/api";

const PAGE_SIZE = 10;

const authorityColumns = ["View", "Create/Add", "Edit", "Delete"];

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

function AddCustomRoleModal({ onClose, onSaved }) {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [expandedFeatures, setExpandedFeatures] = useState([]);
  const [authorityCells, setAuthorityCells] = useState({});
  const [saving, setSaving] = useState(false);

  const enabledColumns = (feature) =>
    feature.viewOnly ? ["View"] : authorityColumns;

  const cellKey = (featureName, subName, column) =>
    `${featureName}.${subName}.${column}`;

  const isSubChecked = (feature, sub) =>
    enabledColumns(feature).some(
      (column) => authorityCells[cellKey(feature.name, sub, column)]
    );

  const checkedSubCount = (feature) =>
    feature.subs.filter((sub) => isSubChecked(feature, sub)).length;

  const selectedFeatureCount = customRoleFeatures.filter(
    (feature) => checkedSubCount(feature) > 0
  ).length;

  const toggleFeatureExpand = (featureName) => {
    setExpandedFeatures((prev) =>
      prev.includes(featureName)
        ? prev.filter((name) => name !== featureName)
        : [...prev, featureName]
    );
  };

  const setFeatureCells = (feature, value) => {
    setAuthorityCells((prev) => {
      const next = { ...prev };
      for (const sub of feature.subs) {
        for (const column of enabledColumns(feature)) {
          next[cellKey(feature.name, sub, column)] = value;
        }
      }
      return next;
    });
  };

  const setSubCells = (feature, sub, value) => {
    setAuthorityCells((prev) => {
      const next = { ...prev };
      for (const column of enabledColumns(feature)) {
        next[cellKey(feature.name, sub, column)] = value;
      }
      return next;
    });
  };

  const toggleColumn = (column) => {
    const expandedWithColumn = customRoleFeatures.filter(
      (feature) =>
        expandedFeatures.includes(feature.name) &&
        enabledColumns(feature).includes(column)
    );
    const allChecked =
      expandedWithColumn.length > 0 &&
      expandedWithColumn.every((feature) =>
        feature.subs.every((sub) => authorityCells[cellKey(feature.name, sub, column)])
      );
    setAuthorityCells((prev) => {
      const next = { ...prev };
      for (const feature of expandedWithColumn) {
        for (const sub of feature.subs) {
          next[cellKey(feature.name, sub, column)] = !allChecked;
        }
      }
      return next;
    });
  };

  const isColumnAllChecked = (column) => {
    const expandedWithColumn = customRoleFeatures.filter(
      (feature) =>
        expandedFeatures.includes(feature.name) &&
        enabledColumns(feature).includes(column)
    );
    return (
      expandedWithColumn.length > 0 &&
      expandedWithColumn.every((feature) =>
        feature.subs.every((sub) => authorityCells[cellKey(feature.name, sub, column)])
      )
    );
  };

  const columnToApi = { View: "see", "Create/Add": "create", Edit: "edit", Delete: "can_delete" };

  const buildPayload = () => {
    const authorities = [];
    customRoleFeatures.forEach((feature) => {
      feature.subs.forEach((sub) => {
        const entry = { feature: feature.name, sub_feature: sub };
        enabledColumns(feature).forEach((column) => {
          entry[columnToApi[column]] = !!authorityCells[cellKey(feature.name, sub, column)];
        });
        authorities.push(entry);
      });
    });
    return {
      code: roleName.trim().toLowerCase().replace(/\s+/g, "_"),
      name: roleName.trim(),
      description: roleDescription,
      authorities,
    };
  };

  const handleSave = async () => {
    if (roleName.trim() === "") {
      alert("Role name wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      await api.post("/roles/", buildPayload());
      onSaved();
    } catch (error) {
      console.error(error);
      const detail = error.response?.data;
      const message =
        detail && typeof detail === "object"
          ? Object.entries(detail)
              .map(([field, errs]) => field + ": " + errs)
              .join("\n")
          : "Gagal menyimpan role.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="flex max-h-[90vh] w-full max-w-[860px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-[22px] py-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">Add custom role</h3>
          <button
            type="button"
            className="cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-[22px] py-5">
          <div className="mb-4 text-[13px] font-bold text-gray-900">Role info</div>

          <div className="mb-4">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Role name <span className="ml-[3px] text-red-600">*</span>
            </label>
            <input
              name="roleName"
              type="text"
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            />
          </div>

          <div className="mb-5">
            <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="roleDescription"
              rows={3}
              maxLength={400}
              value={roleDescription}
              onChange={(event) => setRoleDescription(event.target.value)}
              className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            />
            <p className="m-0 mt-1 text-xs text-slate-400">
              400 characters at maximum
            </p>
          </div>

          <div className="mb-2 text-[13px] font-bold text-gray-900">
            Authority <span className="ml-[3px] text-red-600">*</span>
          </div>

          <div className="mb-3 rounded-lg bg-slate-50 px-4 py-3 text-[13px] leading-relaxed text-slate-500">
            Tick the related features to view the report details.
            <br />
            Example: if a user has the sales list report access, tick the view
            sales details sub-feature as well to give a more detailed view role.
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className={`${th} w-[220px]`}>Feature ({selectedFeatureCount})</th>
                  <th className={`${th} w-[250px]`}>Subfeature/additional function</th>
                  {authorityColumns.map((column) => (
                    <th key={column} className={`${th} w-[90px]`}>
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-brand"
                          checked={isColumnAllChecked(column)}
                          onChange={() => toggleColumn(column)}
                        />
                        <span>{column}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customRoleFeatures.map((feature) => (
                  <FeatureAuthorityRows
                    key={feature.name}
                    feature={feature}
                    expanded={expandedFeatures.includes(feature.name)}
                    onToggleExpand={() => toggleFeatureExpand(feature.name)}
                    featureChecked={checkedSubCount(feature) > 0}
                    onToggleFeatureCells={() =>
                      setFeatureCells(feature, checkedSubCount(feature) === 0)
                    }
                    checkedSubCount={checkedSubCount(feature)}
                    authorityCells={authorityCells}
                    cellKey={cellKey}
                    enabledColumns={enabledColumns(feature)}
                    onToggleSub={(sub, value) => setSubCells(feature, sub, value)}
                    onToggleCell={(sub, column, value) =>
                      setAuthorityCells((prev) => ({
                        ...prev,
                        [cellKey(feature.name, sub, column)]: value,
                      }))
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
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
            disabled={saving || roleName.trim() === ""}
            onClick={handleSave}
          >
            {saving ? "Menyimpan..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureAuthorityRows({
  feature,
  expanded,
  onToggleExpand,
  featureChecked,
  onToggleFeatureCells,
  checkedSubCount,
  authorityCells,
  cellKey,
  enabledColumns,
  onToggleSub,
  onToggleCell,
}) {
  const isSubChecked = (sub) =>
    enabledColumns.some((column) => authorityCells[cellKey(feature.name, sub, column)]);

  return (
    <>
      <tr className="cursor-pointer border-b border-slate-100 bg-white transition-colors hover:bg-slate-50">
        <td className="px-[18px] py-3">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0 cursor-pointer accent-brand"
              checked={featureChecked}
              onClick={(event) => event.stopPropagation()}
              onChange={() => onToggleFeatureCells()}
            />
            <span
              className="text-sm font-semibold text-slate-900"
              onClick={onToggleExpand}
            >
              {feature.name}
            </span>
            {checkedSubCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand/10 px-1.5 text-xs font-bold text-brand">
                {checkedSubCount}
              </span>
            )}
          </div>
        </td>
        <td colSpan={5} className="px-[18px] py-3" onClick={onToggleExpand}>
          <span className="text-xs text-slate-400">
            {expanded ? "Collapse" : "Expand sub-features"}
          </span>
        </td>
      </tr>
      {expanded &&
        feature.subs.map((sub) => (
          <tr key={sub} className="border-b border-slate-100 bg-white">
            <td className="px-[18px] py-2.5" />
            <td className="px-[18px] py-2.5">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand"
                  checked={isSubChecked(sub)}
                  onChange={(event) => onToggleSub(sub, event.target.checked)}
                />
                <span className="text-[13px] text-slate-700">{sub}</span>
              </label>
            </td>
            {authorityColumns.map((column) => (
              <td key={column} className="px-[18px] py-2.5 text-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-brand disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={!enabledColumns.includes(column)}
                  checked={!!authorityCells[cellKey(feature.name, sub, column)]}
                  onChange={(event) =>
                    onToggleCell(sub, column, event.target.checked)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
    </>
  );
}

const HOUR_OPTIONS = [
  "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00",
];

const DAY_OPTIONS = [
  { key: "Monday", label: "Senin" },
  { key: "Tuesday", label: "Selasa" },
  { key: "Wednesday", label: "Rabu" },
  { key: "Thursday", label: "Kamis" },
  { key: "Friday", label: "Jumat" },
  { key: "Saturday", label: "Sabtu" },
  { key: "Sunday", label: "Minggu" },
];

function InviteUserModal({ onClose, onAddCustomRole, onInvite }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [accessTimeLimits, setAccessTimeLimits] = useState(false);
  const [accessDayType, setAccessDayType] = useState("Senin - Jumat");
  const [accessStartHour, setAccessStartHour] = useState("08:00");
  const [accessEndHour, setAccessEndHour] = useState("17:00");
  const [accessTimeError, setAccessTimeError] = useState("");
  const [customDays, setCustomDays] = useState({});
  const [customHours, setCustomHours] = useState({});
  const [roleTab, setRoleTab] = useState("existing");
  const [expandedRoles, setExpandedRoles] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState({});
  const [checkedCustomRoles, setCheckedCustomRoles] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [authorityCells, setAuthorityCells] = useState({});
  const [restrictionCells, setRestrictionCells] = useState({});
  const [listManager, setListManager] = useState(false);

  useEffect(() => {
    api
      .get("/roles/")
      .then((response) => setCustomRoles(response.data))
      .catch(() => {});
  }, []);

  const validateAccessTime = (dayType, start, end, days, hours) => {
    const ranges =
      dayType === "Custom"
        ? DAY_OPTIONS.filter((d) => days[d.key]).map(
            (d) =>
              (hours[d.key]?.start ?? "08:00") + "-" + (hours[d.key]?.end ?? "17:00")
          )
        : [start + "-" + end];
    const invalid = ranges.filter((r) => r.split("-")[0] >= r.split("-")[1]);
    return invalid.length > 0 ? "Jam selesai harus setelah jam mulai" : "";
  };

  const toggleExpand = (roleKey) => {
    setExpandedRoles((prev) =>
      prev.includes(roleKey)
        ? prev.filter((key) => key !== roleKey)
        : [...prev, roleKey]
    );
  };

  const selectedRoleNames = inviteRoles
    .filter((role) => checkedRoles[role.key])
    .map((role) => role.name);

  const selectedCustomRoleNames = customRoles
    .filter((role) => checkedCustomRoles.includes(role.id))
    .map((role) => role.name);

  const ultimateWithListManager = !!checkedRoles.ultimate && listManager;
  const ultimateSelected = !!checkedRoles.ultimate;

  useEffect(() => {
    if (ultimateWithListManager) {
      setAccessTimeLimits(false);
      setAccessTimeError("");
    }
  }, [ultimateWithListManager]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="flex max-h-[90vh] w-full max-w-[860px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-[22px] py-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">Invite user</h3>
          <button
            type="button"
            className="cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-[22px] py-5">
          <div className="mb-4 text-[13px] font-bold text-gray-900">User info</div>

          <div className="mb-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="mb-0">
              <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                User name <span className="ml-[3px] text-red-600">*</span>
              </label>
              <input
                name="inviteUserName"
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              />
            </div>
            <div className="mb-0">
              <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                Email <span className="ml-[3px] text-red-600">*</span>
              </label>
              <input
                name="inviteEmail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              />
            </div>
          </div>

          <label
            className={
              "mb-1 flex items-center gap-2.5 text-[13px] font-semibold " +
              (ultimateWithListManager
                ? "cursor-not-allowed text-slate-300"
                : "cursor-pointer text-gray-700")
            }
          >
            <input
              type="checkbox"
              name="applyAccessTimeLimits"
              className="h-4 w-4 accent-brand"
              checked={accessTimeLimits}
              disabled={ultimateWithListManager}
              onChange={(event) => setAccessTimeLimits(event.target.checked)}
            />
            Apply access time limits
          </label>
          <p className="m-0 mb-5 text-xs leading-relaxed text-slate-400">
            Can be applied to all roles except Owner and Ultimate with the
            ticked List Manager.
          </p>

          {accessTimeLimits && (
            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                <div>
                  <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                    Hari
                  </label>
                  <select
                    name="accessDayType"
                    value={accessDayType}
                    onChange={(event) => setAccessDayType(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  >
                    <option value="Senin - Jumat">Senin - Jumat</option>
                    <option value="Senin - Sabtu">Senin - Sabtu</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                {accessDayType !== "Custom" && (
                  <>
                    <div>
                      <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                        Jam mulai
                      </label>
                      <select
                        name="accessStartHour"
                        value={accessStartHour}
                        onChange={(event) =>
                          setAccessStartHour(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                      >
                        {HOUR_OPTIONS.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                        Jam selesai
                      </label>
                      <select
                        name="accessEndHour"
                        value={accessEndHour}
                        onChange={(event) => {
                          setAccessEndHour(event.target.value);
                          setAccessTimeError(
                            validateAccessTime(
                              accessDayType,
                              accessStartHour,
                              event.target.value,
                              customDays,
                              customHours
                            )
                          );
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                      >
                        {HOUR_OPTIONS.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              {accessDayType !== "Custom" && (
                <p className="m-0 mt-2 text-xs text-slate-400">
                  Waktu dalam GMT+7
                </p>
              )}
              {accessDayType === "Custom" && (
                <div className="mt-4">
                  {DAY_OPTIONS.map((day) => (
                    <div
                      key={day.key}
                      className="grid grid-cols-[140px_1fr_1fr] items-center gap-4 border-t border-slate-200 py-2.5 first:border-t-0 max-md:grid-cols-1"
                    >
                      <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          name={`custom-day-${day.key}`}
                          className="h-4 w-4 accent-brand"
                          checked={!!customDays[day.key]}
                          onChange={(event) =>
                            setCustomDays((prev) => ({
                              ...prev,
                              [day.key]: event.target.checked,
                            }))
                          }
                        />
                        {day.label}
                      </label>
                      <select
                        name={`startHour-${day.key}`}
                        value={customHours[day.key]?.start ?? "08:00"}
                        onChange={(event) =>
                          setCustomHours((prev) => ({
                            ...prev,
                            [day.key]: {
                              start: event.target.value,
                              end: prev[day.key]?.end ?? "17:00",
                            },
                          }))
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand"
                      >
                        {HOUR_OPTIONS.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <select
                        name={`endHour-${day.key}`}
                        value={customHours[day.key]?.end ?? "17:00"}
                        onChange={(event) => {
                          const value = event.target.value;
                          setCustomHours((prev) => {
                            const next = {
                              ...prev,
                              [day.key]: {
                                start: prev[day.key]?.start ?? "08:00",
                                end: value,
                              },
                            };
                            setAccessTimeError(
                              validateAccessTime(
                                accessDayType,
                                accessStartHour,
                                accessEndHour,
                                customDays,
                                next
                              )
                            );
                            return next;
                          });
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand"
                      >
                        {HOUR_OPTIONS.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              {accessTimeError && (
                <p className="m-0 mt-2 text-xs font-semibold text-red-600">
                  {accessTimeError}
                </p>
              )}
            </div>
          )}

          <div className="mb-2 text-[13px] font-bold text-gray-900">
            Role <span className="ml-[3px] text-red-600">*</span>
          </div>

          <div className="mb-1 flex border-b border-slate-200">
            <button
              type="button"
              className={
                roleTab === "existing"
                  ? "cursor-pointer border-b-2 border-brand px-4 py-2 text-[13px] font-semibold text-brand"
                  : "cursor-pointer border-b-2 border-transparent px-4 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-800"
              }
              onClick={() => setRoleTab("existing")}
            >
              Existing
            </button>
            <button
              type="button"
              className={
                roleTab === "custom"
                  ? "flex cursor-pointer items-center gap-2 border-b-2 border-brand px-4 py-2 text-[13px] font-semibold text-brand"
                  : "flex cursor-pointer items-center gap-2 border-b-2 border-transparent px-4 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-800"
              }
              onClick={() => setRoleTab("custom")}
            >
              Custom
              <span className="rounded-full bg-red-600 px-[7px] py-[1px] text-[10px] font-bold text-white">
                New
              </span>
            </button>
          </div>

          {roleTab === "custom" ? (
            <div>
              {customRoles.length > 0 ? (
                <div className="mb-5 mt-4 border-b border-slate-200">
                  {ultimateSelected && (
                    <p className="m-0 border-t border-slate-100 py-2 text-xs leading-relaxed text-slate-400 first:border-t-0">
                      Custom roles cannot be selected when the Ultimate role is
                      selected. You must choose one of these to prevent role
                      conflicts.
                    </p>
                  )}
                  {customRoles.map((role) => (
                    <label
                      key={role.id}
                      className={
                        "flex items-center gap-2.5 border-t border-slate-100 py-2.5 first:border-t-0 " +
                        (ultimateSelected
                          ? "cursor-not-allowed"
                          : "cursor-pointer")
                      }
                    >
                      <input
                        type="checkbox"
                        name={`custom-role-${role.id}`}
                        className="h-4 w-4 accent-brand"
                        checked={checkedCustomRoles.includes(role.id)}
                        disabled={ultimateSelected}
                        onChange={(event) =>
                          setCheckedCustomRoles((prev) =>
                            event.target.checked
                              ? [...prev, role.id]
                              : prev.filter((id) => id !== role.id)
                          )
                        }
                      />
                      <span
                        className={
                          "text-sm font-bold " +
                          (ultimateSelected ? "text-slate-300" : "text-slate-900")
                        }
                      >
                        {role.name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mb-5 mt-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center">
                  <div className="text-sm font-semibold text-slate-700">
                    Custom roles will appear here
                  </div>
                  <p className="m-0 text-[13px] text-slate-400">
                    Add new custom role from Add custom role button.
                  </p>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                    onClick={onAddCustomRole}
                  >
                    Add custom role
                  </button>
                </div>
              )}
              <div className="mb-2 rounded-lg bg-slate-50 px-4 py-3">
                <div className="mb-1.5 text-[13px] font-bold text-gray-900">
                  Terms for selecting roles
                </div>
                <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-500">
                  <li>
                    Custom role authority is dominant (always be the reference
                    for role management).
                  </li>
                  <li>
                    If you select more than one custom role, the authority from
                    each custom role will be merged.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_260px] gap-6 max-lg:grid-cols-1">
                <div>
                  <div className="border-b border-slate-200">
                    {inviteRoles.map((role) => (
                      <div key={role.key} className="border-t border-slate-100 py-2.5 first:border-t-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="cursor-pointer rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            onClick={() => toggleExpand(role.key)}
                          >
                            {expandedRoles.includes(role.key) ? (
                              <CaretDown size={16} />
                            ) : (
                              <CaretRight size={16} />
                            )}
                          </button>
                          <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                            <input
                              type="checkbox"
                              name={`role-${role.key}`}
                              className="h-4 w-4 accent-brand"
                              checked={!!checkedRoles[role.key]}
                              onChange={(event) =>
                                setCheckedRoles((prev) => ({
                                  ...prev,
                                  [role.key]: event.target.checked,
                                }))
                              }
                            />
                            <span className="text-sm font-bold text-slate-900">
                              {role.name}
                            </span>
                          </label>
                        </div>
                        {expandedRoles.includes(role.key) && (
                          <div className="ml-[34px] mt-2 pb-1">
                            <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-500">
                              {role.bullets.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                              ))}
                            </ul>
                            {role.authority && (
                              <div className="mt-3">
                                <div className="mb-1.5 text-[13px] font-bold text-gray-900">
                                  {role.authority}
                                </div>
                                {role.authorityOptions.map((option) => (
                                  <label
                                    key={option}
                                    className="mt-1.5 flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700"
                                  >
                                    <input
                                      type="checkbox"
                                      name={`${role.key}-authority-${option}`}
                                      className="h-4 w-4 accent-brand"
                                      checked={!!authorityCells[`${role.key}.${option}`]}
                                      onChange={(event) =>
                                        setAuthorityCells((prev) => ({
                                          ...prev,
                                          [`${role.key}.${option}`]: event.target.checked,
                                        }))
                                      }
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            )}
                            {role.restriction && (
                              <div className="mt-3">
                                <div className="mb-1.5 text-[13px] font-bold text-gray-900">
                                  Access limitation
                                </div>
                                <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-slate-700">
                                  <input
                                    type="checkbox"
                                    name={`${role.key}-restriction`}
                                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                                    checked={!!restrictionCells[role.key]}
                                    onChange={(event) =>
                                      setRestrictionCells((prev) => ({
                                        ...prev,
                                        [role.key]: event.target.checked,
                                      }))
                                    }
                                  />
                                  {role.restriction}
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mb-2 mt-5 text-[13px] font-bold text-gray-900">
                    Additional authority
                  </div>
                  <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="listManager"
                      className="h-4 w-4 accent-brand"
                      checked={listManager}
                      onChange={(event) => setListManager(event.target.checked)}
                    />
                    List Manager (can edit and delete data)
                  </label>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-3 text-[13px] font-bold text-gray-900">
                      Selected roles
                    </div>
                    <div className="mb-1.5 text-[13px] font-semibold text-slate-600">
                      Existing
                    </div>
                    {selectedRoleNames.length > 0 ? (
                      <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-slate-700">
                        {selectedRoleNames.map((roleNameItem) => (
                          <li key={roleNameItem}>{roleNameItem}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[13px] text-slate-400">-</div>
                    )}
                    <div className="mb-1.5 mt-4 text-[13px] font-semibold text-slate-600">
                      Custom
                    </div>
                    {selectedCustomRoleNames.length > 0 ? (
                      <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-slate-700">
                        {selectedCustomRoleNames.map((roleNameItem) => (
                          <li key={roleNameItem}>{roleNameItem}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[13px] text-slate-400">-</div>
                    )}
                  </div>

                  <div className="rounded-lg bg-slate-50 px-4 py-3">
                    <div className="mb-1.5 text-[13px] font-bold text-gray-900">
                      Terms for selecting roles
                    </div>
                    <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-500">
                      <li>
                        Custom role authority is dominant (always be the
                        reference for role management).
                      </li>
                      <li>
                        If you select more than one custom role, the authority
                        from each custom role will be merged.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
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
            disabled={userName.trim() === "" || email.trim() === ""}
            onClick={() => {
              if (accessTimeLimits) {
                const error = validateAccessTime(
                  accessDayType,
                  accessStartHour,
                  accessEndHour,
                  customDays,
                  customHours
                );
                if (error) {
                  setAccessTimeError(error);
                  return;
                }
              }
              onInvite({
                username: userName.trim(),
                email: email.trim(),
                type: "member",
                access_time_limit: accessTimeLimits
                  ? accessDayType === "Custom"
                    ? DAY_OPTIONS.filter(
                        (day) => customDays[day.key]
                      ).map(
                        (day) =>
                          day.key +
                          " " +
                          (customHours[day.key]?.start ?? "08:00") +
                          "-" +
                          (customHours[day.key]?.end ?? "17:00")
                      ).join(", ")
                    : accessDayType + " " + accessStartHour + "-" + accessEndHour
                  : "",
                roles: checkedCustomRoles,
              });
            }}
          >
            Invite
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
  const [customRoleModalOpen, setCustomRoleModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);

  const loadRoles = async () => {
    try {
      const response = await api.get("/roles/");
      setRoles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get("/members/");
      setUsers(
        response.data.map((user) => ({
          id: user.id,
          username: user.username,
          accessLimit: user.access_time_limit || "",
          status: user.status,
          type: user.type,
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data user.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInvite = async (payload) => {
    try {
      await api.post("/members/", payload);
      await loadUsers();
      setInviteModalOpen(false);
    } catch (error) {
      console.error(error);
      const detail = error.response?.data;
      const message =
        detail && typeof detail === "object"
          ? Object.entries(detail)
              .map(([field, errs]) => field + ": " + errs)
              .join("\n")
          : "Gagal mengundang user.";
      alert(message);
    }
  };

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
          <button className={btnSecondary} onClick={() => setCustomRoleModalOpen(true)}>Add custom role</button>
          <button className={btnPrimary} onClick={() => setInviteModalOpen(true)}>Invite user</button>
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
          <div className="mb-5 flex w-[280px] items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
            <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
            <input
              placeholder="Cari role..."
              className="w-full border-0 outline-none"
            />
          </div>
          {roles.length > 0 ? (
            <div className={`${tableCard} p-6`}>
              <div className={tableWrapper}>
                <table className={tableBase}>
                  <thead>
                    <tr>
                      <th className={`${th} w-[280px]`}>Role name</th>
                      <th className={th}>Description</th>
                      <th className={`${th} w-[140px]`}>Authority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.id} className={trHover}>
                        <td className={td}>
                          <span className="font-medium text-gray-900">
                            {role.name}
                          </span>
                        </td>
                        <td className={td}>{role.description || "-"}</td>
                        <td className={td}>
                          {role.authorities && role.authorities.length > 0
                            ? role.authorities.length + " authority"
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-10">
              <p>List role akan ditampilkan disini</p>
            </div>
          )}
        </div>
      )}

      {transferModalUser !== null && (
        <TransferOwnershipModal
          onClose={() => setTransferModalUser(null)}
        />
      )}

      {customRoleModalOpen && (
        <AddCustomRoleModal
          onClose={() => setCustomRoleModalOpen(false)}
          onSaved={() => {
            setCustomRoleModalOpen(false);
            loadRoles();
          }}
        />
      )}

      {inviteModalOpen && (
        <InviteUserModal
          onClose={() => setInviteModalOpen(false)}
          onAddCustomRole={() => {
            setInviteModalOpen(false);
            setCustomRoleModalOpen(true);
          }}
          onInvite={handleInvite}
        />
      )}
    </div>
  );
}
