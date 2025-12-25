import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createRegistration,
    updateRegistration,
    getRegistrationById
} from "../../api/registrationApi";

function CreateRegistration() {
    const { id } = useParams(); // if id exists ? EDIT MODE
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        id: 0,
        companyName: "",
        email: "",
        location: "",
        services: "",
        phoneNumber: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load registration data in EDIT mode
    useEffect(() => {
        if (!isEditMode) return;

        const fetchRegistration = async () => {
            setPageLoading(true);
            try {
                const res = await getRegistrationById(id);
                setFormData({
                    id: res.id,
                    companyName: res.companyName,
                    email: res.email,
                    location: res.location,
                    services: res.services,
                    phoneNumber: res.phoneNumber,
                    description: res.description,
                });
            } catch (err) {
                setError("Failed to load registration details");
            } finally {
                setPageLoading(false);
            }
        };

        fetchRegistration();
    }, [id, isEditMode]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // Validation
    const validate = () => {
        let temp = {};
        if (!formData.companyName.trim())
            temp.companyName = "Company Name is required";
        if (!formData.email.trim()) temp.email = "Email is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    // Submit (Create / Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await updateRegistration(formData);
                alert("Registration updated successfully");
            } else {
                await createRegistration(formData);
                alert("Registration created successfully");
            }
            navigate("/registrationlist"); // change to your list route
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
        return <p className="text-center mt-5">Loading registration data...</p>;

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">
                    {isEditMode ? "Update Registration" : "Create Registration"}
                </h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Company Name */}
                    <div className="mb-3">
                        <label className="form-label">
                            Company Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className={`form-control ${errors.companyName ? "is-invalid" : ""
                                }`}
                        />
                        {errors.companyName && (
                            <div className="invalid-feedback">{errors.companyName}</div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">
                            Email <span className="text-danger">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Services */}
                    <div className="mb-3">
                        <label className="form-label">Services</label>
                        <input
                            type="text"
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end">
                        <Link to="/registrationlist" className="btn btn-secondary me-2">
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

export default CreateRegistration;