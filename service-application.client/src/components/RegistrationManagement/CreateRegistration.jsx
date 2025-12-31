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
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        id: 0,
        companyName: "",
        email: "",
        location: "",
        services: "",
        phoneNumber: "",
        description: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load data in edit mode
    useEffect(() => {
        if (!isEditMode) return;

        const fetchRegistration = async () => {
            setPageLoading(true);
            try {
                const res = await getRegistrationById(id);
                setFormData({
                    id: res.id,
                    companyName: res.companyName || "",
                    email: res.email || "",
                    location: res.location || "",
                    services: res.services || "",
                    phoneNumber: res.phoneNumber || "",
                    description: res.description || ""
                });
            } catch (err) {
                setError("Failed to load registration");
            } finally {
                setPageLoading(false);
            }
        };

        fetchRegistration();
    }, [id, isEditMode]);

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // ✅ Validation + Duplicate check
    const validate = async () => {
        let temp = {};

        if (!formData.companyName) temp.companyName = "Company name is required";
        if (!formData.email) temp.email = "Email is required";
        if (!formData.location) temp.location = "Location is required";
        if (!formData.services) temp.services = "Services is required";
        if (!formData.phoneNumber) temp.phoneNumber = "Phone number is required";
        if (!formData.description) temp.description = "Description is required";

        if (Object.keys(temp).length > 0) {
            setErrors(temp);
            return false;
        }

        try {
            const registrations = await getAllRegistrations();
            //Email Duplicate checks
            const emailExists = registrations.find(
                (r) =>
                    r.email?.toLowerCase() === formData.email.toLowerCase() &&
                    r.id !== formData.id
            );

            if (emailExists) {
                temp.email = "Email already exists";
            }
            //Mobile

            const phoneExists = registrations.find(
                (r) =>
                    r.phoneNumber?.toString().trim() ===
                    formData.phoneNumber.toString().trim() &&
                    r.id !== formData.id
            );

            if (phoneExists) {
                temp.phoneNumber = "Phone number already exists";
            }
        } catch (err) {
            console.error("Duplicate check error:", err);
        }

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const isValid = await validate();
        if (!isValid) return;

        setLoading(true);
        try {
            if (isEditMode) {
                await updateRegistration(id, formData);
                alert("Registration updated successfully");
            } else {
                await createRegistration(formData);
                alert("Registration created successfully");
            }
            navigate("/registrationlist");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete?")) return;
        try {
            await deleteRegistration(id);
            alert("Registration deleted successfully");
            navigate("/registrationlist");
        } catch {
            alert("Delete failed");
        }
    };

    if (pageLoading) {
        return <p className="text-center mt-5">Loading...</p>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 bg-white border rounded shadow p-4">
                <h3 className="text-center mb-4">
                    {isEditMode ? "Update Registration" : "Create Registration"}
                </h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Company Name */}
                    <div className="mb-3">
                        <label className="form-label">Company Name</label>
                        <input
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">{errors.companyName}</div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">{errors.email}</div>
                    </div>

                    {/* Location */}
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`form-control ${errors.location ? "is-invalid" : ""}`}
                        >
                            <option value="">-- Select Location --</option>
                            <option>Chennai</option>
                            <option>Bangalore</option>
                            <option>Mumbai</option>
                            <option>Delhi</option>
                        </select>
                        <div className="invalid-feedback">{errors.location}</div>
                    </div>

                    {/* Services */}
                    <div className="mb-3">
                        <label className="form-label">Services</label>
                        <select
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            className={`form-control ${errors.services ? "is-invalid" : ""}`}
                        >
                            <option value="">-- Select Service --</option>
                            <option>Home Services</option>
                            <option>Mechanical Services</option>
                            <option>Agriculture Solutions</option>
                            <option>Food Services</option>
                            <option>Other Services</option>
                        </select>
                        <div className="invalid-feedback">{errors.services}</div>
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // numbers only
                                if (value.length <= 10) {
                                    setFormData({ ...formData, phoneNumber: value });
                                    setErrors({ ...errors, phoneNumber: "" });
                                }
                            }}
                            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">{errors.phoneNumber}</div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        />
                        <div className="invalid-feedback">{errors.description}</div>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end">
                        <Link to="/registrationlist" className="btn btn-secondary me-2">
                            Cancel
                        </Link>
                        <button className="btn btn-success" disabled={loading}>
                            {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
                        </button>

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