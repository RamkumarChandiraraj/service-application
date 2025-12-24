import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/Common/DataTable"; // adjust path
import { getAllLocations, deleteLocation } from "../../api/locationList";

function LocationHome() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getAllLocations();
        setData(res.data);
      } catch (err) {
        setError(err.message || "Failed to load locations");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;

    try {
      await deleteLocation(id);
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch {
      alert("Failed to delete location");
    }
  };

  const columns = useMemo(() => [
    { header: "ID", field: "id" },
    { header: "Name", field: "name" },
    { header: "Pincode", field: "pincode" },
    {
      header: "Actions",
      field: "actions",
      body: (row) => (
        <>
          <Link to={`/readlocation/${row.id}`} className="btn btn-info btn-sm me-2">
            Read
          </Link>
          <Link to={`/createlocation/${row.id}`} className="btn btn-primary btn-sm me-2">
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
    },
  ], []);

  if (loading) return <p className="text-center mt-5">Loading Locations...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="d-flex flex-column align-items-center bg-light min-vh-100 pb-5">
      <h1 className="mt-4">Locations List</h1>

      <div className="w-75 rounded bg-white border shadow p-4 mb-4">
        <div className="d-flex justify-content-end mb-3">
          <Link to="/createlocation" className="btn btn-success">
            Add
          </Link>
        </div>
        {/* Reusable DataTable with search, pagination, sorting */}
        <DataTable
          data={data}
          columns={columns}
          searchFields={["name", "pincode"]}
        />
      </div>
    </div>
  );
}

export default LocationHome;
