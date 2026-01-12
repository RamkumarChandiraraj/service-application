import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRegistrationById } from "../../api/registrationApi";
import { downloadAttachmentById } from "../../api/attachmentApi";

function ReadRegistration() {
    const { id } = useParams();
    const [registration, setRegistration] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRegistrationById(id);
                const reg = res?.data || res;
                setRegistration(reg);

                if (reg.profileImageId) {
                    try {
                        const attachmentRes = await downloadAttachmentById(reg.profileImageId);
                        const blob = attachmentRes.data instanceof Blob ? attachmentRes.data : new Blob([attachmentRes.data]);
                        const url = URL.createObjectURL(blob);
                        setProfileImageUrl(url);
                    } catch (err) {
                        console.warn("Profile image not found", err);
                        setProfileImageUrl(null);
                    }
                }
            } catch {
                setError("Failed to load registration");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading registration...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
    if (!registration) return <p className="text-center mt-5">Registration not found</p>;

    return (
        <div className="d-flex justify-content-center bg-light vh-100 pt-5">
            <div className="w-75 bg-white border rounded shadow p-4">
                <div className="d-flex flex-column flex-md-row align-items-start">
                    <div className="flex-grow-1 pe-md-4">
                        <h3 className="text-center mb-4">Registration Details</h3>
                        <p><strong>ID:</strong> {registration.id}</p>
                        <p><strong>Company Name:</strong> {registration.companyName}</p>
                        <p><strong>Email:</strong> {registration.email}</p>
                        <p><strong>Location ID:</strong> {registration.locationId}</p>
                        <p><strong>Service ID:</strong> {registration.serviceId}</p>
                        <p><strong>Phone Number:</strong> {registration.phoneNumber}</p>
                        <p><strong>Description:</strong> {registration.description}</p>
                        <p><strong>Latitude:</strong> {registration.latitude}</p>
                        <p><strong>Longitude:</strong> {registration.longitude}</p>
                        <p><strong>Profile Image ID:</strong> {registration.profileImageId || ""}</p>
                    </div>
                    <div className="mt-4 mt-md-0 text-center">
                        {profileImageUrl && (
                            <img src={profileImageUrl} alt="Profile"
                                className="rounded-circle"
                                style={{ width: "150px", height: "150px", objectFit: "cover", border: "2px solid #ccc" }} />
                        )}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <Link to="/management/registrations" className="btn btn-secondary">Back</Link>
                </div>
            </div>
        </div>
    );
}

export default ReadRegistration;
