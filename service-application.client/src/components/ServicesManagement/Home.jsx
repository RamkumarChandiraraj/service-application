
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllServices, deleteService } from "../../api/serviceList";

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {
        console.log("ChatPage - Vendor Mobile :");
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getAllServices();
      setData(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmed) return;

    try {
      await deleteService(id);
      setData((prev) => prev.filter((service) => service.id !== id));
      alert("Service deleted successfully");
    } catch (err) {
      alert(
        "Failed to delete service: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const columns = useMemo(
    () => [
      { header: "ID", field: "id", sortable: true },
      { header: "Name", field: "name", sortable: true },
      { header: "Description", field: "description" },
      {
        header: "Actions",
        field: "actions",
        sortable: false,
        body: (row) => (
          <div className="d-flex gap-2 flex-wrap">
            <Link
              to={`/readservice/${row.id}`}
              className="btn btn-info btn-sm"
            >
              Read
            </Link>

            <Link
              to={`/createservicemanagement/${row.id}`}
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

  if (loading)
    return <p className="text-center mt-5">Loading services...</p>;

  if (error)
    return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <DataTable
        title="Services List"
        data={data}
        columns={columns}
        searchFields={["name", "description"]}
        onAdd={() => navigate("/createservicemanagement")}
      />
    </div>
  );
}

export default Home;
