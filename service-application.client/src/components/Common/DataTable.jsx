import React, { useState, useMemo } from "react";
import "./DataTable.css"; // Make sure this file is included

const DataTable = ({
  data = [],
  columns = [],
  title,
  searchFields = [],
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      searchFields.some((field) =>
        row[field]?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data, searchFields]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      } else {
        return sortOrder === "asc"
          ? aVal.toString().localeCompare(bVal.toString())
          : bVal.toString().localeCompare(aVal.toString());
      }
    });
  }, [filteredData, sortField, sortOrder]);

  // Pagination logic
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
    <div className="datatable-container">
      {/* Top controls: Title, Pagination (Prev/Page/Next) left, Search right */}
      <div className="datatable-top">
        {title && <h4>{title}</h4>}

        <div className="datatable-top-left">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>

        {searchFields.length > 0 && (
          <input
            type="text"
            className="form-control datatable-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  onClick={() =>
                    col.sortable !== false && handleSort(col.field)
                  }
                  style={{
                    cursor: col.sortable !== false ? "pointer" : "default",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.header}{" "}
                  {sortField === col.field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
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

      {/* Bottom controls: Rows per page selector */}
      <div className="d-flex justify-content-end mt-3">
        <label className="me-2">Rows per page:</label>
        <select
          className="form-select form-select-sm w-auto"
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
