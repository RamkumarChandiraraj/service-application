import { useState, useMemo } from "react";

const DataTable = ({
  title,
  data = [],
  columns = [],
  searchFields = [],
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  onAdd,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // FILTER
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      searchFields.some((field) =>
        row[field]?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data, searchFields]);

  // SORT
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

  // PAGINATION
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

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
        <h3>{title}</h3>
        {onAdd && (
          <button className="datatable-add-btn" onClick={onAdd}>
            Add
          </button>
        )}
      </div>

      {/* CONTROLS */}
      <div className="datatable-controls">
        {/* PAGINATION */}
        <div className="datatable-pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} / {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

        {/* SEARCH */}
        {searchFields.length > 0 && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* TABLE */}
      <div className="datatable-table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  onClick={() =>
                    col.sortable !== false && handleSort(col.field)
                  }
                  className={col.sortable !== false ? "sortable" : ""}
                >
                  {col.header}
                  {sortField === col.field && (
                    <span className="sort">
                      {sortOrder === "asc" ? " ▲" : " ▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length ? (
              paginatedData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td
                      key={col.field}
                      className={col.field === "actions" ? "actions-cell" : ""}
                    >
                      {col.body ? col.body(row) : row[col.field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="datatable-footer">
        <label>
          Rows:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default DataTable;
