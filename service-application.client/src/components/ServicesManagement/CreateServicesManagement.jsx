import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createService,
    updateService,
    getServiceById,
} from "../../api/serviceList";

function CreateServiceManagement() {
    const { id } = useParams(); // if id exists ? EDIT MODE
    const navigate = useNavigate();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load service data in EDIT mode
    useEffect(() => {
        if (!isEditMode) return;

        const fetchService = async () => {
            setPageLoading(true);
            try {
                const res = await getServiceById(id);
                setFormData({
                    id: Number(res.data.id),
                    name: res.data.name,
                    description: res.data.description,
                });
            } catch (err) {
                setError("Failed to load service details");
            } finally {
                setPageLoading(false);
            }
        };

        fetchService();
    }, [id, isEditMode]);

    // Input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // Validation
    const validate = () => {
        let temp = {};
        if (!formData.name.trim()) temp.name = "Service name is required";
        if (!formData.description.trim())
            temp.description = "Description is required";

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
                await updateService(formData);
                alert("Service updated successfully");
            } else {
                await createService(formData);
                alert("Service created successfully");
            }
            navigate("/servicelist");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">
                    {isEditMode ? "Update Service" : "Create Service"}
                </h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Service Name */}
                    <div className="mb-3">
                        <label className="form-label">
                            Service Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? "is-invalid" : ""
                                }`}
                        />
                        {errors.name && (
                            <div className="invalid-feedback">{errors.name}</div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">
                            Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`form-control ${errors.description ? "is-invalid" : ""
                                }`}
                            rows="3"
                        />
                        {errors.description && (
                            <div className="invalid-feedback">
                                {errors.description}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end">
                        <Link to="/servicelist" className="btn btn-secondary me-2">
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

export default CreateServiceManagement;