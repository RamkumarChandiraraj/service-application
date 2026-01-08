import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createService,
    updateService,
    getServiceById,
} from "../../api/serviceList";

function CreateServiceManagement() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        ID: 0, // must match backend
        Name: "",
        Description: "",
        Icon: "",
        CategoryId:0,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load service data for edit mode
    useEffect(() => {
        if (!isEditMode) return;

        const fetchService = async () => {
            setPageLoading(true);
            try {
                const res = await getServiceById(id);
                setFormData({
                    ID: res.data.id,
                    Name: res.data.name || "",
                    Description: res.data.description || "",
                    Icon: res.data.icon || "",
                    CategoryId: res.data.categoryId || "",
                });
            } catch (err) {
                setError("Failed to load service details");
            } finally {
                setPageLoading(false);
            }
        };

        fetchService();
    }, [id, isEditMode]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // Validate form
    const validate = () => {
        let temp = {};
        if (!formData.Name.trim())
            temp.Name = "Service name is required";
        if (!formData.Description.trim())
            temp.Description = "Description is required";
        if (!formData.Icon.trim())
            temp.Icon = "Icon is required";
        if (!formData.CategoryId || Number(formData.CategoryId) <= 0)
            temp.CategoryId = "CategoryId is required";

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
                await updateService(payload); // includes ID
                alert("Service updated successfully");
            } else {
                const { ID, ...createPayload } = payload; // remove ID for create
                await createService(createPayload);
                alert("Service created successfully");
            }

            navigate("/management/services");
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
        return <p className="text-center mt-5">Loading service details...</p>;

    return (
        <div className="bg-light min-vh-100 pt-5 pb-5 d-flex justify-content-center align-items-start">
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
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            className={`form-control ${errors.Name ? "is-invalid" : ""
                                }`}
                        />
                        {errors.Name && (
                            <div className="invalid-feedback">
                                {errors.Name}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">
                            Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            className={`form-control ${errors.Description ? "is-invalid" : ""
                                }`}
                            rows="3"
                        />
                        {errors.Description && (
                            <div className="invalid-feedback">
                                {errors.Description}
                            </div>
                        )}
                    </div>

                    {/* Icon */}
                    <div className="mb-3">
                        <label className="form-label">
                            Icon <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="Icon"
                            value={formData.Icon}
                            onChange={handleChange}
                            className={`form-control ${errors.Icon ? "is-invalid" : ""
                                }`}
                        />
                        {errors.Icon && (
                            <div className="invalid-feedback">
                                {errors.Icon}
                            </div>
                        )}
                    </div>

                    {/* Category Id */}
                    <div className="mb-3">
                        <label className="form-label">
                            Category Id <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            name="CategoryId"
                            value={formData.CategoryId}
                            onChange={handleChange}
                            className={`form-control ${errors.CategoryId ? "is-invalid" : ""
                                }`}
                        />
                        {errors.CategoryId && (
                            <div className="invalid-feedback">
                                {errors.CategoryId}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end">
                        <Link to="/management/services/" className="btn btn-secondary me-2">
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
