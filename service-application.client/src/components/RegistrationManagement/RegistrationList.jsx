import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllRegistrations, deleteRegistration } from "../../api/registrationApi";

function RegistrationList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await getAllRegistrations();
                setData(res.data ?? res); // supports both API shapes
            } catch (err) {
                setError(err.message || "Failed to load registrations");
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this registration?")) return;

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
            { header: "Phone Number", field: "phoneNumber" },
            {
                header: "Actions",
                field: "actions",
                body: (row) => (
                    <>
                        <Link
                            to={`/readregistration/${row.id}`}
                            className="btn btn-info btn-sm me-2"
                        >
                            View
                        </Link>

                        <Link
                            to={`/createregistration/${row.id}`}
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
            },
        ],
        []
    );

    if (loading) return <p className="text-center mt-5">Loading Registrations...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="d-flex flex-column align-items-center bg-light min-vh-100 pb-5">
            <h1 className="mt-4">Registration List</h1>

            <div className="w-75 rounded bg-white border shadow p-4 mb-4">
                <div className="d-flex justify-content-end mb-3">
                    <Link to="/createregistration" className="btn btn-success">
                        Add
                    </Link>
                </div>

                {/* ? Reusable DataTable */}
                <DataTable
                    data={data}
                    columns={columns}
                    searchFields={["companyName", "email", "phoneNumber"]}
                />
            </div>
        </div>
    );
}

export default RegistrationList;