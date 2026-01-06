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
                setRegistration(res);
            } catch (err) {
                console.error(err);
                setError("Failed to load registration");
            } finally {
                setLoading(false);
            }
        };

        fetchRegistration();
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading registration...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
    if (!registration) return <p className="text-center mt-5">Registration not found</p>;

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 bg-white border rounded shadow p-4">
                <h3 className="text-center mb-4">Registration Details</h3>

                <p><strong>ID:</strong> {registration.id}</p>
                <p><strong>Company Name:</strong> {registration.companyName}</p>
                <p><strong>Email:</strong> {registration.email}</p>

                {/* ✅ SHOW IDS */}
                <p><strong>Location ID:</strong> {registration.locationId}</p>
                <p><strong>Service ID:</strong> {registration.serviceId}</p>

                <p><strong>Phone Number:</strong> {registration.phoneNumber}</p>
                <p><strong>Description:</strong> {registration.description}</p>
                <p><strong>Latitude:</strong> {registration.latitude}</p>
                <p><strong>Longitude:</strong> {registration.longitude}</p>

                <div className="text-end mt-3">
                    <Link to="/management/registrations" className="btn btn-secondary">
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ReadRegistration;
