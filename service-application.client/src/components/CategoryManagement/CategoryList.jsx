/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories, deleteCategory } from "../../api/categoryApi";

function CategoryList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();

                // keep existing response handling
                const categories = res?.data?.data || res?.data || [];

                const ordered = [...categories].sort((a, b) => a.id - b.id);
                setData(ordered);

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchCategories();

        return () => {
            abortController.abort();
        };
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;

        try {
            await deleteCategory(id);
            setData(prev => prev.filter(category => category.id !== id));
            alert("Category deleted successfully");
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <p>Loading Categories...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
            <h1>Category List</h1>

            <div className="w-75 rounded bg-white border shadow p-4">
                <div className="d-flex justify-content-end">
                    <Link to="/createcategorymanagement" className="btn btn-success">
                        Add +
                    </Link>
                </div>

                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((d, i) => (
                            <tr key={i}>
                                <td>{d.id}</td>
                                <td>{d.name}</td>
                                <td>{d.description}</td>
                                <td className="text-end">
                                    <Link
                                        to={`/ReadCategory/${d.id}`}
                                        className="btn btn-sm btn-info me-2"
                                    >
                                        Read
                                    </Link>
                                    <Link
                                        to={`/createcategorymanagement/${d.id}`}
                                        className="btn btn-sm btn-primary me-2"
                                    >
                                        Edit
                                    </Link>
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
                                    No Categories Found
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
