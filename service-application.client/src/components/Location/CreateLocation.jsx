import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createLocation,
    updateLocation,
    getLocationById,
} from "../../api/locationList";

function CreateLocation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        ID: 0, // Must match backend
        Name: "",
        Description: "",
        LocationCode: "",
        Latitude: "",
        Longitude: "",
        Pincode: "",
        ReferenceId: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load location data for edit mode
    useEffect(() => {
        if (!isEditMode) return;

        const fetchLocation = async () => {
            setPageLoading(true);
            try {
                const res = await getLocationById(id);
                setFormData({
                    ID: res.data.id,
                    Name: res.data.name || "",
                    Description: res.data.description || "",
                    LocationCode: res.data.locationCode || "",
                    Latitude: res.data.latitude ?? 0,
                    Longitude: res.data.longitude ?? 0,
                    Pincode: res.data.pincode ?? 0,
                    ReferenceId: res.data.referenceId ?? null,
                });
            } catch (err) {
                setError("Failed to load location details");
            } finally {
                setPageLoading(false);
            }
        };

        fetchLocation();
    }, [id, isEditMode]);

    // Handle form input changes
    const handleChange = (e) => {
        let { name, value } = e.target;

        // Convert numbers properly
        if (["Latitude", "Longitude"].includes(name)) value = parseFloat(value) || 0;
        if (["Pincode", "ReferenceId"].includes(name))
            value = value === "" ? null : parseInt(value);

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // Validate form
    const validate = () => {
        let temp = {};
        if (!formData.Name.trim()) temp.Name = "Location name is required";
        if (!formData.Latitude) temp.Latitude = "Latitude is required";
        if (!formData.Longitude) temp.Longitude = "Longitude is required";
        if (!formData.Pincode || formData.Pincode.toString().length !== 6)
            temp.Pincode = "Pincode must be 6 digits";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError(null);

        try {
            const payload = { ...formData };

            if (isEditMode) {
                await updateLocation(payload); // backend expects ID
                alert("Location updated successfully");
            } else {
                const { ID, ...createPayload } = payload; // remove ID for create
                await createLocation(createPayload);
                alert("Location created successfully");
            }

            navigate("/locationlist");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading)
        return <p className="text-center mt-5">Loading location details...</p>;

    return (
        <div className="bg-light min-vh-100 pt-5 pb-5 d-flex justify-content-center align-items-start">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">
                    {isEditMode ? "Update Location" : "Create Location"}
                </h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-3">
                        <label className="form-label">
                            Location Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            className={`form-control ${errors.Name ? "is-invalid" : ""}`}
                        />
                        {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                        />
                    </div>

                    {/* Location Code */}
                    <div className="mb-3">
                        <label className="form-label">Location Code</label>
                        <input
                            type="text"
                            name="LocationCode"
                            value={formData.LocationCode}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Latitude */}
                    <div className="mb-3">
                        <label className="form-label">
                            Latitude <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            name="Latitude"
                            value={formData.Latitude}
                            onChange={handleChange}
                            className={`form-control ${errors.Latitude ? "is-invalid" : ""}`}
                        />
                        {errors.Latitude && (
                            <div className="invalid-feedback">{errors.Latitude}</div>
                        )}
                    </div>

                    {/* Longitude */}
                    <div className="mb-3">
                        <label className="form-label">
                            Longitude <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            name="Longitude"
                            value={formData.Longitude}
                            onChange={handleChange}
                            className={`form-control ${errors.Longitude ? "is-invalid" : ""}`}
                        />
                        {errors.Longitude && (
                            <div className="invalid-feedback">{errors.Longitude}</div>
                        )}
                    </div>

                    {/* Pincode */}
                    <div className="mb-3">
                        <label className="form-label">
                            Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            name="Pincode"
                            value={formData.Pincode}
                            onChange={handleChange}
                            className={`form-control ${errors.Pincode ? "is-invalid" : ""}`}
                        />
                        {errors.Pincode && (
                            <div className="invalid-feedback">{errors.Pincode}</div>
                        )}
                    </div>

                    {/* ReferenceId */}
                    <div className="mb-3">
                        <label className="form-label">Reference ID</label>
                        <input
                            type="number"
                            name="ReferenceId"
                            value={formData.ReferenceId ?? ""}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end">
                        <Link to="/locationlist" className="btn btn-secondary me-2">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Saving..."
                                : isEditMode
                                    ? "Update"
                                    : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateLocation;
