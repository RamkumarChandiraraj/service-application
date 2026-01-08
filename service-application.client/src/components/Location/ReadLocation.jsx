import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLocationById } from "../../api/locationList";

function ReadLocationManagement() {
    const { id } = useParams();
    const [location, setLocation] = useState(null);

    useEffect(() => {
        getLocationById(id).then(res => setLocation(res.data));
    }, [id]);

    if (!location) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">Location Details</h3>

                <p><strong>Name:</strong> {location.name}</p>
                <p><strong>Description:</strong> {location.description}</p>
                <p><strong>Code:</strong> {location.locationCode}</p>
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
                <p><strong>Pincode:</strong> {location.pincode}</p>

                <div className="text-end">
                    <Link to="/management/locations" className="btn btn-secondary">Back</Link>
                </div>
            </div>
        </div>
    );
}

export default ReadLocationManagement;
