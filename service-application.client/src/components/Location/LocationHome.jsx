import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllLocations, deleteLocation } from "../../api/locationList";

function LocationHome() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await getAllLocations();
      setData(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    try {
      await deleteLocation(id);
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch {
      alert("Failed to delete location");
    }
  };

  const columns = useMemo(
    () => [
      { header: "ID", field: "id" },
      { header: "Name", field: "name" },
      { header: "Pincode", field: "pincode" },
      {
        header: "Actions",
        field: "actions",
        sortable: false,
        body: (row) => (
          <div className="d-flex gap-2 flex-wrap">
            <Link
              to={`/management/locations/read/${row.id}`}
              className="btn btn-info btn-sm"
            >
              View
            </Link>

            <Link
              to={`/management/locations/edit/${row.id}`}
              className="btn btn-primary btn-sm"
            >
              Edit
            </Link>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (loading) return <p className="text-center mt-5">Loading locations...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <DataTable
        title="Locations"
        data={data}
        columns={columns}
        searchFields={["name", "pincode"]}
        onAdd={() => navigate("/management/locations/create")}
      />
    </div>
  );
}

export default LocationHome;
