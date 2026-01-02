import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllRegistrations, deleteRegistration } from "../../api/registrationApi";

function RegistrationList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await getAllRegistrations();
      setData(res.data ?? res ?? []);
    } catch (err) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    try {
      await deleteRegistration(id);
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch {
      alert("Failed to delete registration");
    }
  };

  const columns = useMemo(
    () => [
      { header: "ID", field: "id" },
      { header: "Company Name", field: "companyName" },
      { header: "Email", field: "email" },
      { header: "PhoneNumber", field: "phoneNumber" },
      {
        header: "Actions",
        field: "actions",
        sortable: false,
        body: (row) => (
          <div className="d-flex gap-2 flex-wrap">
            <Link to={`/readregistration/${row.id}`} className="btn btn-info btn-sm">
              View
            </Link>
            <Link to={`/createregistration/${row.id}`} className="btn btn-primary btn-sm">
              Edit
            </Link>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (loading) return <p className="text-center mt-5">Loading registrations...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <DataTable
        title="Registrations"
        data={data}
        columns={columns}
        searchFields={["companyName", "email", "phoneNumber"]}
        onAdd={() => navigate("/createregistration")}
      />
    </div>
  );
}

export default RegistrationList;
