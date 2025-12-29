import React, { useState, useMemo } from "react";
import "./DataTable.css";

const DataTable = ({
  data = [],
  columns = [],
  title,
  searchFields = [],
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  onAdd, // optional Add button handler
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      searchFields.some((field) =>
        row[field]?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data, searchFields]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="datatable-card">
      {/* HEADER */}
      <div className="datatable-header">
        <h3 className="datatable-title">{title}</h3>

        {onAdd && (
          <button className="datatable-add-btn" onClick={onAdd}>
            Add
          </button>
        )}
      </div>

      {/* CONTROLS */}
      <div className="datatable-controls">
        <div className="datatable-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>

        {searchFields.length > 0 && (
          <input
            type="text"
            className="datatable-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* TABLE */}
      <div className="datatable-table-wrapper">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  onClick={() =>
                    col.sortable !== false && handleSort(col.field)
                  }
                >
                  {col.header}{" "}
                  {sortField === col.field
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.field}>
                      {col.body ? col.body(row) : row[col.field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="datatable-footer">
        <label>Rows per page:</label>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {rowsPerPageOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataTable;
