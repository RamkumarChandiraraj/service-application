import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import AlertToast from "../../components/Common/AlertToast";
import { getAllCategories, deleteCategory } from "../../api/categoryApi";

function CategoryList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ TOAST STATE
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories();
            setData(res.data || res || []);
        } catch (err) {
            setError(err.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    /* 🔴 DELETE HANDLER WITH RED SUCCESS TOAST */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            await deleteCategory(id);

            setData((prev) => prev.filter((x) => x.id !== id));

            setToast({
                show: true,
                message: "Category deleted successfully!",
                type: "success", // ✅ GREEN
            });
        } catch {
            setToast({
                show: true,
                message: "Failed to delete category",
                type: "error", // ✅ RED
            });
        }
    };


    const columns = useMemo(
        () => [
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
            { header: "Description", field: "description" },
            {
                header: "Actions",
                field: "actions",
                sortable: false,
                body: (row) => (
                    <div className="d-flex gap-2 flex-wrap">
                        <Link
                            to={`/readcategory/${row.id}`}
                            className="btn btn-info btn-sm"
                        >
                            View
                        </Link>

                        <Link
                            to={`/createcategorymanagement/${row.id}`}
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

    if (loading) return <p className="text-center mt-5">Loading categories...</p>;
    if (error)
        return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <>
            <div className="container py-4">
                <DataTable
                    title="Categories"
                    data={data}
                    columns={columns}
                    searchFields={["name", "description"]}
                    onAdd={() => navigate("/createcategorymanagement")}
                />
            </div>

            {/* ✅ TOAST */}
            <AlertToast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </>
    );
}

export default CategoryList;
