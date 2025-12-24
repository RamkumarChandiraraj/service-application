/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createCategory,
    updateCategory,
    getCategoryById
} from "../../api/categoryApi";

function CreateCategoryManagement() {
    const { id } = useParams(); // EDIT MODE if id exists
    const navigate = useNavigate();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        description: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    // 🔹 LOAD CATEGORY IN EDIT MODE
    useEffect(() => {
        if (!isEditMode) return;

        const fetchCategory = async () => {
            setPageLoading(true);
            try {
                const res = await getCategoryById(id);
                const data = res?.data?.data || res?.data;

                setFormData({
                    id: data.id ?? data.ID,
                    name: data.name,
                    description: data.description
                });
            } catch (err) {
                setError("Failed to load category details");
            } finally {
                setPageLoading(false);
            }
        };

        fetchCategory();
    }, [id, isEditMode]);

    // 🔹 INPUT CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // 🔹 VALIDATION
    const validate = () => {
        let temp = {};
        if (!formData.name.trim()) temp.name = "Category name is required";
        if (!formData.description.trim())
            temp.description = "Description is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    // 🔹 SUBMIT (CREATE / UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await updateCategory(formData.id, {
                    name: formData.name,
                    description: formData.description
                });
                alert("Category updated successfully");
            } else {
                await createCategory({
                    name: formData.name,
                    description: formData.description
                });
                alert("Category created successfully");
            }

            navigate("/categorylist");
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
                    {isEditMode ? "Update Category" : "Create Category"}
                </h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <div className="mb-3">
                        <label className="form-label">
                            Category Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
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
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
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
                        <Link to="/categorylist" className="btn btn-secondary me-2">
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

export default CreateCategoryManagement;
