import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllLocations, deleteLocation } from "../../api/locationList";

import AlertToast from "../../components/Common/AlertToast";
import LoadingPage from "../../components/Common/LoadingPage";

function LocationHome() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  // ================= FETCH =================
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await getAllLocations();
      setData(res.data || []);
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to load locations",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;

    try {
      await deleteLocation(id);
      setData((prev) => prev.filter((x) => x.id !== id));

      setToast({
        show: true,
        message: "Location deleted successfully",
        type: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "Failed to delete location",
        type: "error",
      });
    }
  };

  // ================= TABLE COLUMNS =================
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

  // ================= LOADER =================
  if (loading) return <LoadingPage />;

  return (
    <>
      {/* 🔔 TOAST */}
      <AlertToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="container py-4">
        <DataTable
          title="Locations"
          data={data}
          columns={columns}
          searchFields={["name", "pincode"]}
          onAdd={() => navigate("/management/locations/create")}
        />
      </div>
    </>
  );
}

export default LocationHome;
