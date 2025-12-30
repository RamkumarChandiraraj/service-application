import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import { getAllServices, deleteService } from "../../api/serviceList";

function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await getAllServices();
                setData(res.data);
            } catch (err) {
                setError(err.message || "Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            await deleteService(id);
            setData((prev) => prev.filter((x) => x.id !== id));
        } catch {
            alert("Failed to delete service");
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
            { header: "Description", field: "description" },
            { header: "CategoryId", field: "categoryId" },
            {
                header: "Actions",
                field: "actions",
                body: (row) => (
                    <>
                        <div className="d-flex flex-nowrap gap-2">
                        <Link
                            to={`/readservice/${row.id}`}
                            className="btn btn-info btn-sm me-2"
                        >
                            Read
                        </Link>
                        <Link
                            to={`/createservicemanagement/${row.id}`}
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
                        </div>
                    </>
                ),
            },
        ],
        []
    );

    if (loading) return <p className="text-center mt-5">Loading Services...</p>;
    if (error)
        return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="d-flex flex-column align-items-center bg-light min-vh-100 pb-5">
            <h1 className="mt-4">Services List</h1>

            <div className="w-75 rounded bg-white border shadow p-4 mb-4">
                <div className="d-flex justify-content-end mb-3">
                    <Link
                        to="/createservicemanagement"
                        className="btn btn-success"
                    >
                        Add
                    </Link>
                </div>

                {/* Reusable DataTable */}
                <DataTable
                    data={data}
                    columns={columns}
                    searchFields={["name", "description"]}
                />
            </div>
        </div>
    );
}

export default Home;
