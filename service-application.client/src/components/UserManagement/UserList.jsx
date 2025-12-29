import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllUsers, deleteUser } from "../../api/UserApi";

function UserList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setData(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  const columns = useMemo(
    () => [
      { header: "ID", field: "id" },
      { header: "Username", field: "userName" },
      { header: "Email", field: "email" },
      { header: "Mobile", field: "mobileNumber" },
      { header: "Role", field: "role" },
      {
        header: "Actions",
        field: "actions",
        sortable: false,
        body: (row) => (
          <div className="d-flex gap-2 flex-wrap">
            <Link to={`/user/read/${row.id}`} className="btn btn-info btn-sm">
              Read
            </Link>
            <Link to={`/user/edit/${row.id}`} className="btn btn-primary btn-sm">
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

  if (loading) return <p className="text-center mt-5">Loading users...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <DataTable
        title="Users"
        data={data}
        columns={columns}
        searchFields={["userName", "email"]}
        onAdd={() => navigate("/user/create")}
      />
    </div>
  );
}

export default UserList;
