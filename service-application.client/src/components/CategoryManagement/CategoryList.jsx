import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategories, deleteCategory } from "../../api/categoryApi";

function CategoryList() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                console.log(res);
                setData(res.data); // 🔑 same pattern as Home
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleEdit = (id) => {
        navigate(`/category/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(id);
            setData(data.filter((c) => c.id !== id));
        } catch {
            alert("Delete failed");
        }
    };

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
            <h1>Category List</h1>

            <div className="w-75 rounded bg-white border shadow p-4">
                <div className="d-flex justify-content-end">
                    <Link to="/CreateCategorymanagement" className="btn btn-success">
                        Add +
                    </Link>
                </div>

                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((d, i) => (
                            <tr key={i}>
                                <td>{d.id}</td>
                                <td>{d.name}</td>
                                <td>{d.description}</td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEdit(d.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(d.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No categories found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryList;
