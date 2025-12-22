import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    createCategory,
    updateCategory,
    getCategoryById
} from "../../api/categoryApi";

function CreateCategorymanagement() {
    const navigate = useNavigate();
    const { id } = useParams(); // 👈 id exists only for EDIT

    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // LOAD DATA FOR EDIT
    useEffect(() => {
        if (isEdit) {
            getCategoryById(id)
                .then((res) => {
                    setFormData({
                        name: res.data.name,
                        description: res.data.description
                    });
                })
                .catch(() => alert("Failed to load category"));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        let temp = {};

        if (!formData.name.trim())
            temp.name = "Category name is required";

        if (!formData.description.trim())
            temp.description = "Description is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            if (isEdit) {
                await updateCategory(id, formData);
                alert("Category updated successfully");
            } else {
                await createCategory(formData);
                alert("Category created successfully");
            }

            navigate("/categorylist");
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 bg-white p-4 rounded shadow">
                <h3 className="text-center mb-4">
                    {isEdit ? "Edit Category" : "Create Category"}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Category Name *</label>
                        <input
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback">{errors.name}</div>
                    </div>

                    <div className="mb-3">
                        <label>Description *</label>
                        <textarea
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <div className="invalid-feedback">{errors.description}</div>
                    </div>

                    <div className="text-end">
                        <Link to="/categorylist" className="btn btn-secondary me-2">
                            Cancel
                        </Link>
                        <button className="btn btn-success" disabled={loading}>
                            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCategorymanagement;
