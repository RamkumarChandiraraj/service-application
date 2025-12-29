import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/Common/DataTable"; // adjust path
import { getAllCategories, deleteCategory } from "../../api/categoryApi";

function CategoryHome() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                const categories = Array.isArray(res) ? res : res.data;
                setData(categories || []);
            } catch (err) {
                setError(err.message || "Failed to load categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(id);
            setData((prev) => prev.filter((x) => x.id !== id));
        } catch {
            alert("Failed to delete category");
        }
    };

    const columns = useMemo(() => [
        { header: "ID", field: "id" },
        { header: "Name", field: "name" },
        { header: "Description", field: "description" },
        
        {
            header: "Actions",
            field: "actions",
            body: (row) => (
                <>
                    <Link to={`/readcategory/${row.id}`} className="btn btn-info btn-sm me-2">
                        View
                    </Link>
                    <Link to={`/createcategorymanagement/${row.id}`} className="btn btn-primary btn-sm me-2">
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

    if (loading) return <p className="text-center mt-5">Loading Categories...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="d-flex flex-column align-items-center bg-light min-vh-100 pb-5">
            <h1 className="mt-4">Category List</h1>

            <div className="w-75 rounded bg-white border shadow p-4 mb-4">
                <div className="d-flex justify-content-end mb-3">
                    <Link to="/createcategorymanagement" className="btn btn-success">
                        Add
                    </Link>
                </div>

                <DataTable
                    data={data}
                    columns={columns}
                    searchFields={["name", "description"]}
                />
            </div>
        </div>
    );
}

export default CategoryHome;
