import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRegistrationById } from "../../api/registrationApi";

function ReadRegistration() {
    const { id } = useParams();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistration = async () => {
            try {
                const res = await getRegistrationById(id);
                setRegistration(res); // API should return the registration object
                setLoading(false);
            } catch (err) {
                setError(err.message || "Failed to load registration");
                setLoading(false);
            }
        };

        fetchRegistration();
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading registration...</p>;
    if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;
    if (!registration) return <p className="text-center mt-5">Registration not found</p>;

    return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">Registration Details</h3>

                <div className="mb-3"><strong>ID:</strong> {registration.id}</div>
                <div className="mb-3"><strong>Company Name:</strong> {registration.companyName}</div>
                <div className="mb-3"><strong>Email:</strong> {registration.email}</div>
                <div className="mb-3"><strong>Location:</strong> {registration.location}</div>
                <div className="mb-3"><strong>Services:</strong> {registration.services}</div>
                <div className="mb-3"><strong>Phone:</strong> {registration.phoneNumber}</div>
                <div className="mb-3"><strong>Description:</strong> {registration.description}</div>

                <div className="d-flex justify-content-end">
                    <Link to="/registrationlist" className="btn btn-secondary">
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReadRegistration;