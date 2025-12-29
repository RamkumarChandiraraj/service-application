import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategoryById } from "../../api/categoryApi";

function ReadCategoryManagement() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await getCategoryById(id); // now returns inner data
                setCategory(data);
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    if (loading)
        return <p className="text-center mt-5">Loading category details...</p>;

    if (!category)
        return <p className="text-center mt-5 text-danger">Category not found.</p>;

    return (
        <div className="d-flex justify-content-center align-items-start bg-light min-vh-100 pt-5 pb-5">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">Category Details</h3>

                <p><strong>ID:</strong> {category.id}</p>
                <p><strong>Name:</strong> {category.name}</p>
                <p><strong>Description:</strong> {category.description || "-"}</p>
                <p><strong>Link:</strong> {category.link || "-"}</p>
                <p><strong>Icon:</strong> {category.icon || "No Icon"}</p>

                <div className="d-flex justify-content-end mt-4">
                    <Link to={`/createcategorymanagement/${category.id}`} className="btn btn-primary me-2">Edit</Link>
                    <Link to="/categorylist" className="btn btn-secondary">Back</Link>
                </div>
            </div>
        </div>
    );
}

export default ReadCategoryManagement;
