import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "../../api/serviceList";

function ReadServiceManagement() {
    const { id } = useParams();
    const [service, setService] = useState(null);

    useEffect(() => {
        getServiceById(id).then((res) => setService(res.data));
    }, [id]);

    if (!service) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">Service Details</h3>

                <p>
                    <strong>Name:</strong> {service.name}
                </p>
                <p>
                    <strong>Description:</strong> {service.description}
                </p>
                <p>
                    <strong>Icon:</strong> {service.icon}
                </p>
                <p>
                    <strong>CategoryId:</strong> {service.categoryId}
                </p>

                <div className="text-end">
                    <Link to="/management/services/" className="btn btn-secondary">
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReadServiceManagement;
