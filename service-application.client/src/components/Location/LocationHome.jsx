import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { getAllLocations, deleteLocation } from "../../api/locationList";

function LocationHome() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getAllLocations();
        setData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        setError(err.message || "Failed to load locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const result = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.pincode.toString().includes(search)
    );
    setFilteredData(result);
  }, [search, data]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;

    try {
      await deleteLocation(id);
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch {
      alert("Failed to delete location");
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "ID",
        selector: (row) => row.id,
        sortable: true,
        width: "80px",
      },
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Pincode",
        selector: (row) => row.pincode,
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <>
            <Link
              to={`/readlocation/${row.id}`}
              className="btn btn-info btn-sm me-2"
            >
              Read
            </Link>

            <Link
              to={`/createlocation/${row.id}`}
              className="btn btn-primary btn-sm me-2"
            >
              Edit
            </Link>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </button>
          </>
        ),
        right: true,
      },
    ],
    []
  );

  if (loading) return <p className="text-center mt-5">Loading Locations...</p>;
  if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;

  return (
    <div
      className="d-flex flex-column align-items-center bg-light min-vh-100"
      style={{ paddingBottom: "80px" }}
    >
      <h1 className="mt-4">Locations List</h1>

      <div className="w-75 rounded bg-white border shadow p-4 mb-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/createlocation" className="btn btn-success">
            Add +
          </Link>

          {/* 🔍 Search Box */}
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by name or pincode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          persistTableHead
          noDataComponent="No Locations Found"
        />
      </div>
    </div>
  );
}

export default LocationHome;
