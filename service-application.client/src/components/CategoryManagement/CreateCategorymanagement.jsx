import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createCategory, updateCategory, getCategoryById } from "../../api/categoryApi";

function CreateCategoryManagement() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({ name: "", description: "", icon: "", link: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEditMode) return;
        const fetchCategory = async () => {
            setPageLoading(true);
            try {
                const res = await getCategoryById(id);
                setFormData({
                    name: res.name || "",
                    description: res.description || "",
                    icon: res.icon || "",
                    link: res.link || ""
                });
            } catch {
                setError("Failed to load category details");
            } finally {
                setPageLoading(false);
            }
        };
        fetchCategory();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const temp = {};
        if (!formData.name.trim()) temp.name = "Category name is required";
        if (!formData.icon.trim()) temp.icon = "Icon name is required";
        if (!formData.link.trim()) temp.link = "Link is required";
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) await updateCategory(id, formData);
            else await createCategory(formData);
            navigate("/categorylist");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <p className="text-center mt-5">Loading category details...</p>;

    return (
        <div className="bg-light min-vh-100 pt-5 pb-5 d-flex justify-content-center align-items-start">
            <div className="w-50 rounded bg-white border shadow p-4">
                <h3 className="text-center mb-4">{isEditMode ? "Update Category" : "Create Category"}</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name <span className="text-danger">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`form-control ${errors.name ? "is-invalid" : ""}`} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Icon <span className="text-danger">*</span></label>
                        <input type="text" name="icon" value={formData.icon} onChange={handleChange} className={`form-control ${errors.icon ? "is-invalid" : ""}`} />
                        {errors.icon && <div className="invalid-feedback">{errors.icon}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Link <span className="text-danger">*</span></label>
                        <input type="text" name="link" value={formData.link} onChange={handleChange} className={`form-control ${errors.link ? "is-invalid" : ""}`} />
                        {errors.link && <div className="invalid-feedback">{errors.link}</div>}
                    </div>

                    <div className="d-flex justify-content-end">
                        <Link to="/categorylist" className="btn btn-secondary me-2">Cancel</Link>
                        <button type="submit" className="btn btn-success" disabled={loading}>{loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update" : "Save")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCategoryManagement;
