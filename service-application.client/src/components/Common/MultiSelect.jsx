import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import "./MultiSelect.css";

const MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select",
  disabled = false,
}) => {
  const controlRef = useRef(null);
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [style, setStyle] = useState({});
  const [highlight, setHighlight] = useState(0);

  /* ---------- FILTER ---------- */
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(o =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  /* ---------- POSITION ---------- */
  useLayoutEffect(() => {
    if (!open || !controlRef.current) return;

    const rect = controlRef.current.getBoundingClientRect();
    const dropdownHeight = Math.min(260, filteredOptions.length * 38);
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight + 10;

    setStyle({
      left: rect.left,
      width: rect.width,
      top: openUp ? undefined : rect.bottom + 6,
      bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
      position: "fixed",
      zIndex: 10000,
    });
  }, [open, filteredOptions.length]);

  /* ---------- OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (
        !controlRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- TOGGLE ---------- */
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeTag = (id, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== id));
  };

  const selected = options.filter(o => value.includes(o.id));

  return (
    <div className="multiselect">
      {label && <label className="multiselect-label">{label}</label>}

      <div
        ref={controlRef}
        className={`multiselect-control ${open ? "open" : ""} ${disabled ? "disabled" : ""}`}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        {!selected.length ? (
          <span className="placeholder">{placeholder}</span>
        ) : (
          <div className="tags">
            {selected.map(o => (
              <span key={o.id} className="tag">
                {o.label}
                <button onClick={(e) => removeTag(o.id, e)}>×</button>
              </span>
            ))}
          </div>
        )}
        <span className="arrow">▾</span>
      </div>

      {/* ---------- DROPDOWN ---------- */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="multiselect-dropdown"
            style={style}
          >
            <input
              className="multiselect-search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />

            <ul>
              {filteredOptions.length ? (
                filteredOptions.map((o, i) => (
                  <li
                    key={o.id}
                    className={`${value.includes(o.id) ? "selected" : ""} ${
                      i === highlight ? "highlight" : ""
                    }`}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => toggle(o.id)}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(o.id)}
                      readOnly
                    />
                    {o.label}
                  </li>
                ))
              ) : (
                <li className="empty">No options</li>
              )}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MultiSelect;
