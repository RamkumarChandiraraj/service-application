import { useState, useMemo } from "react";
import "./MultiSelect.css";

const MultiSelect = ({
    label,
    options = [],          // [{ id: 1, label: "Chennai" }]
    value = [],             // selected ids [1,2]
    onChange,
    placeholder = "Select options",
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter(o =>
            o.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options]);

    const toggleOption = (id) => {
        if (value.includes(id)) {
            onChange(value.filter(v => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    const removeTag = (id) => {
        onChange(value.filter(v => v !== id));
    };

    const selectAll = () => {
        onChange(options.map(o => o.id));
    };

    const clearAll = () => {
        onChange([]);
    };

    return (
        <div className="multiselect">
            {label && <label className="multiselect-label">{label}</label>}

            <div
                className={`multiselect-control ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
            >
                {value.length === 0 ? (
                    <span className="placeholder">{placeholder}</span>
                ) : (
                    <div className="tags">
                        {options
                            .filter(o => value.includes(o.id))
                            .map(o => (
                                <span key={o.id} className="tag">
                                    {o.label}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTag(o.id);
                                        }}
                                    >
                                        
                                    </button>
                                </span>
                            ))}
                    </div>
                )}
                <span className="arrow">{open ? "?" : "?"}</span>
            </div>

            {open && (
                <div className="multiselect-dropdown">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="multiselect-actions">
                        <button onClick={selectAll}>Select All</button>
                        <button onClick={clearAll}>Clear</button>
                    </div>

                    <ul>
                        {filteredOptions.length ? (
                            filteredOptions.map(o => (
                                <li key={o.id} onClick={() => toggleOption(o.id)}>
                                    <input
                                        type="checkbox"
                                        checked={value.includes(o.id)}
                                        readOnly
                                    />
                                    <span>{o.label}</span>
                                </li>
                            ))
                        ) : (
                            <li className="empty">No options</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
