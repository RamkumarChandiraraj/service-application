import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllRegistrations } from "../../api/registrationApi";

function RegistrationList() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fetch all registrations
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await getAllRegistrations();
                setRegistrations(res);
                setLoading(false);
            } catch (err) {
                setError("Failed to load registrations");
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    if (loading) return <p className="text-center mt-5">Loading registrations...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Registration List</h2>
                <Link to="/createregistration" className="btn btn-success">
                    + Create Registration
                </Link>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Services</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {registrations.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No registrations found
                            </td>
                        </tr>
                    ) : (
                        registrations.map((reg) => (
                            <tr key={reg.id}>
                                <td>{reg.id}</td>
                                <td>{reg.companyName}</td>
                                <td>{reg.email}</td>
                                <td>{reg.location}</td>
                                <td>{reg.services}</td>
                                <td>{reg.phoneNumber}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => navigate(`/readregistration/${reg.id}`)}
                                    >
                                        View
                                    </button>

                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/createregistration/${reg.id}`)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RegistrationList;
