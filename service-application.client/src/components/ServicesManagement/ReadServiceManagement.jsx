import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "../../api/serviceList";

function ReadServiceManagement() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await getServiceById(id);
                setService(res.data); // make sure your API returns { data: { ... } }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading service...</p>;
    if (error) return <p className="text-center mt-5">Error: {error}</p>;
    if (!service) return <p className="text-center mt-5">Service not found</p>;

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">Service Details</h3>

                <div className="mb-3">
                    <strong>ID:</strong> {service.id}
                </div>
                <div className="mb-3">
                    <strong>Name:</strong> {service.name}
                </div>
                <div className="mb-3">
                    <strong>Description:</strong> {service.description}
                </div>

                <div className="d-flex justify-content-end">
                    <Link to="/servicelist" className="btn btn-secondary">
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReadServiceManagement;
