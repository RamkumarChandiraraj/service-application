import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategoryById } from "../../api/categoryApi";

function ReadCategoryManagement() {
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await getCategoryById(id);

                // ✅ res IS already data
                const data = res?.data || res;

                if (!data) {
                    throw new Error("Category not found");
                }

                setCategory({
                    id: data.id ?? data.ID,
                    name: data.name,
                    description: data.description
                });
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading category...</p>;
    if (error) return <p className="text-center text-danger mt-5">{error}</p>;

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="w-50 bg-white shadow rounded p-4">
                <h3 className="text-center mb-4">Category Details</h3>

                <p><strong>ID:</strong> {category.id}</p>
                <p><strong>Name:</strong> {category.name}</p>
                <p><strong>Description:</strong> {category.description}</p>

                <div className="text-end">
                    <Link to="/categorylist" className="btn btn-secondary">
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReadCategoryManagement;
