import { useEffect, useMemo, useRef, useState } from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { DropdownPanel, MK, MK_FONT, MenuItem, useDropdown } from "./MekariUI";


export function useOutsideClose() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return { ref, open, setOpen };
}

const ALL_LABEL = "All transaction types";

/**
 * PopoverSelect — dropdown pilihan tunggal.
 * Panel-nya pakai portal + position:fixed dari MekariUI, jadi tidak
 * kepotong card induk yang overflow-hidden dan isinya bisa discroll.
 */
export default function PopoverSelect({
  value,
  placeholder,
  groups = [],
  onSelect,
  includeAll = false,
  closeAfterSelect = true,
  searchable = false,
  searchPlaceholder = "Cari...",
  maxHeight = 288,
}) {
  const { triggerRef, rect, isOpen, toggle, close } = useDropdown();
  const [keyword, setKeyword] = useState("");

  const flat = useMemo(
    () =>
      includeAll ? [{ label: "", options: [ALL_LABEL] }, ...groups] : groups,
    [includeAll, groups],
  );

  const term = keyword.trim().toLowerCase();
  const visibleGroups = term
    ? flat
        .map((group) => ({
          ...group,
          options: group.options.filter((option) =>
            option.toLowerCase().includes(term),
          ),
        }))
        .filter((group) => group.options.length > 0)
    : flat;

  const handleToggle = () => {
    setKeyword("");
    toggle();
  };

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        data-dropdown-trigger
        type="button"
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-brand focus:outline-none"
      >
        <span
          className={`truncate ${value ? "text-gray-900" : "text-gray-400"}`}
        >
          {value || placeholder}
        </span>
        <CaretDown
          size={14}
          className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <DropdownPanel rect={rect} onClose={close} maxHeight={maxHeight}>
        {searchable && (
          <div
            style={{
              position: "sticky",
              top: -4,
              zIndex: 2,
              margin: "-4px -4px 4px",
              padding: "4px 4px 6px",
              background: "#fff",
              borderBottom: `1px solid ${MK.border}`,
            }}
          >
            <div className="relative">
              <MagnifyingGlass
                size={13}
                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                style={{ color: MK.muted }}
              />
              <input
                type="text"
                autoFocus
                value={keyword}
                placeholder={searchPlaceholder}
                onChange={(event) => setKeyword(event.target.value)}
                style={{
                  fontFamily: MK_FONT,
                  fontSize: 13,
                  color: MK.text,
                  border: `1px solid ${MK.border}`,
                  borderRadius: 4,
                  width: "100%",
                  padding: "5px 8px 5px 26px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}

        {visibleGroups.length === 0 && (
          <p
            className="m-0 px-[15px] py-2 text-[13px]"
            style={{ color: MK.muted, fontFamily: MK_FONT }}
          >
            Opsi tidak ditemukan
          </p>
        )}

        {visibleGroups.map((group, groupIndex) => (
          <div key={`${group.label || "grup"}-${groupIndex}`}>
            {group.label && (
              <p
                className="m-0 px-[15px] pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide"
                style={{ color: MK.muted, fontFamily: MK_FONT }}
              >
                {group.label}
              </p>
            )}
            {group.options.map((option) => (
              <MenuItem
                key={option}
                selected={option === value}
                onClick={() => {
                  onSelect?.(option);
                  if (closeAfterSelect) close();
                }}
              >
                {option}
              </MenuItem>
            ))}
          </div>
        ))}
      </DropdownPanel>
    </div>
  );
}
