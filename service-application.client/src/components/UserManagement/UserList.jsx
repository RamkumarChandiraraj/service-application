import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllUsers, deleteUser } from "../../api/UserApi";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getAllUsers();
                setUsers(res.data);
            } catch (err) {
                setError(err.message || "Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((x) => x.id !== id));
        } catch {
            alert("Failed to delete user");
        }
    };

    const columns = useMemo(() => [
        { header: "ID", field: "id" },
        { header: "UserName", field: "username" },
        { header: "Password", field: "password" },
        { header: "Email", field: "email" },
        { header: "MobileNumber", field: "mobilenumber" },
        { header: "Role", field: "role" },
        {
            header: "Actions",
            field: "actions",
            body: (row) => (
                <>
                    <Link to={`/user/read/:id/${row.id}`} className="btn btn-info btn-sm me-2">
                        Read
                    </Link>
                    <Link to={`/user/edit/:id"/${row.id}`} className="btn btn-primary btn-sm me-2">
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

    if (loading) return <p className="text-center mt-5">Loading Users...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="d-flex flex-column align-items-center bg-light min-vh-100 pb-5">
            <h1 className="mt-4">Users List</h1>

            <div className="w-75 rounded bg-white border shadow p-4 mb-4">
                <div className="d-flex justify-content-end mb-3">
                    <Link to="/user/create" className="btn btn-success">
                        Add
                    </Link>
                </div>

                <DataTable
                    data={users}
                    columns={columns}
                    searchFields={["username", "email"]}
                />
            </div>
        </div>
    );
};

export default UserList;
