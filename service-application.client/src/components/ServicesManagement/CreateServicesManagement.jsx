import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function CreateServiceManagement() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error while typing
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    // Validation logic (matches backend)
    const validate = () => {
        let tempErrors = {};

        if (!formData.name || formData.name.trim() === "") {
            tempErrors.name = "Service name is required";
        }

        if (!formData.description || formData.description.trim() === "") {
            tempErrors.description = "Description is required";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            await axios.post(
                "https://localhost:44351/api/Service",
                {
                    name: formData.name,
                    description: formData.description
                }
            );

            alert("Service created successfully");
            navigate("/servicelist"); // back to service list
        } catch (error) {
            if (error.response && error.response.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">Create Service</h3>

                <form onSubmit={handleSubmit}>
                    {/* Service Name */}
                    <div className="mb-3">
                        <label className="form-label">
                            Service Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter service name"
                        />
                        {errors.name && (
                            <div className="invalid-feedback">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">
                            Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            rows="3"
                        ></textarea>
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
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateServiceManagement;
