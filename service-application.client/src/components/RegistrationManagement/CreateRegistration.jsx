import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createRegistration,
    updateRegistration,
    getRegistrationById,
    deleteRegistration,
    getAllRegistrations
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
                console.error("API fetch error:", err);
                setError("Failed to load registration. Check backend URL and CORS.");
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

    // Validation with duplicate check
    const validate = async () => {
        let temp = {};
        if (!formData.companyName.trim())
            temp.companyName = "Company Name is required";
        if (!formData.email.trim())
            temp.email = "Email is required";
        if (!formData.phoneNumber.trim())
            temp.phoneNumber = "Phone Number is required";
        if (!formData.location.trim())
            temp.location = "Location is required";

        try {
            const registrations = await getAllRegistrations();

            // 🔁 Email duplicate check
            const emailExists = registrations.find(
                (r) =>
                    r.email?.toLowerCase() === formData.email.toLowerCase() &&
                    r.id !== formData.id
            );
            if (emailExists) {
                temp.email = "Email already exists";
            }

            // 🔁 Mobile duplicate check
            const phoneExists = registrations.find(
                (r) =>
                    r.phoneNumber?.toString().trim() ===
                    formData.phoneNumber.toString().trim() &&
                    r.id !== formData.id
            );

            if (phoneExists) {
                temp.phoneNumber = "Mobile number already exists";
            }
        } catch (err) {
            console.error("Duplicate check failed:", err);
        }

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    // Submit (Create / Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const isValid = await validate();
        if (!isValid) return;

        setLoading(true);
        try {
            if (isEditMode) {
                await updateRegistration(formData);
                alert("Registration updated successfully");
            } else {
                await createRegistration(formData);
                alert("Registration created successfully");
            }
            navigate("/registrationlist");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this registration?")) {
            try {
                await deleteRegistration(id);
                alert("Registration deleted successfully!");
                navigate("/registrationlist");
            } catch (err) {
                console.error("Error deleting registration:", err);
                alert("Failed to delete registration. Check console for details.");
            }
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
                            className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
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
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">-- Select Location --</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                        </select>
                    </div>

                    {/* Services */}
                    <div className="mb-3">
                        <label className="form-label">Services</label>
                        <select
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">-- Select Service --</option>
                            <option value="Home Services">Home Services</option>
                            <option value="Mechanical Services">Mechanical Services</option>
                            <option value="Agriculture Solutions">Agriculture Solutions</option>
                            <option value="Food Services">Food Services</option>
                            <option value="Other Services">Other Services</option>
                        </select>
                    </div>

                    {/* Phone Number */}
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                        />
                        {errors.phoneNumber && (
                            <div className="invalid-feedback">{errors.phoneNumber}</div>
                        )}
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

                        {/* Delete button only in edit mode */}
                        {isEditMode && (
                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRegistration;