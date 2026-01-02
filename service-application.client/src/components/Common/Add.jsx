import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertToast from "./AlertToast";
import "./Add.css";

function Add({
    title,
    fields,
    initialData,
    onSubmit,
    onFetch,
    onDelete,      // ✅ NEW
    cancelPath,
    isEditMode
}) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!isEditMode || !onFetch || fetchedRef.current) return;
        fetchedRef.current = true;

        (async () => {
            setPageLoading(true);
            try {
                const data = await onFetch();
                setFormData({ ...initialData, ...data });
            } catch {
                setToast({ show: true, message: "Failed to load data", type: "error" });
            } finally {
                setPageLoading(false);
            }
        })();
    }, [isEditMode, onFetch, initialData]);

    const validate = () => {
        const temp = {};
        fields.forEach(f => {
            if (f.required && !formData[f.name]?.trim()) {
                temp[f.name] = `${f.label} is required`;
            }
        });
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit(formData);

            setToast({
                show: true,
                message: isEditMode
                    ? "Category updated successfully!"
                    : "Category created successfully!",
                type: "success"
            });

            setTimeout(() => navigate("/categorylist"), 1800);
        } catch {
            setToast({ show: true, message: "Save failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    /* 🔴 DELETE HANDLER */
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await onDelete();

            setToast({
                show: true,
                message: "Category deleted successfully!",
                type: "error"   // 🔴 RED TOAST
            });

            setTimeout(() => navigate("/categorylist"), 1800);
        } catch {
            setToast({
                show: true,
                message: "Delete failed. Please try again.",
                type: "error"
            });
        }
    };

    if (pageLoading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <>
            <div className="add-page">
                <div className="add-card">
                    <h3 className="add-title">{title}</h3>

                    <form onSubmit={handleSubmit}>
                        {fields.map(f => (
                            <div className="mb-3" key={f.name}>
                                <label className="form-label">
                                    {f.label} {f.required && <span className="text-danger">*</span>}
                                </label>

                                {f.type === "textarea" ? (
                                    <textarea
                                        name={f.name}
                                        className={`form-control ${errors[f.name] ? "is-invalid" : ""}`}
                                        value={formData[f.name]}
                                        onChange={e =>
                                            setFormData({ ...formData, [f.name]: e.target.value })
                                        }
                                    />
                                ) : (
                                    <input
                                        type={f.type}
                                        name={f.name}
                                        className={`form-control ${errors[f.name] ? "is-invalid" : ""}`}
                                        value={formData[f.name]}
                                        onChange={e =>
                                            setFormData({ ...formData, [f.name]: e.target.value })
                                        }
                                    />
                                )}

                                {errors[f.name] && (
                                    <div className="invalid-feedback">{errors[f.name]}</div>
                                )}
                            </div>
                        ))}

                        <div className="d-flex justify-content-end mt-4">
                            {isEditMode && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="btn btn-danger me-auto"
                                >
                                    Delete
                                </button>
                            )}

                            <Link to={cancelPath} className="btn btn-outline-secondary me-2">
                                Cancel
                            </Link>
                            <button className="btn btn-primary" disabled={loading}>
                                {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <AlertToast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </>
    );
}

export default Add;
