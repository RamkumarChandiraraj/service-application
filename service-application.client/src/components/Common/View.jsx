import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertToast from "../Common/AlertToast";

function View({ title, data, fields, editPath, backPath }) {
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    useEffect(() => {
        if (data) {
            setToast({ show: true, message: "Data loaded successfully", type: "success" });
        }
    }, [data]);

    if (!data) {
        return <p className="text-center mt-5 text-danger">Data not found</p>;
    }

    return (
        <>
            <div className="add-page">
                <div className="add-card">
                    <h3 className="add-title">{title}</h3>

                    {fields.map((field) => (
                        <div className="mb-3" key={field.name}>
                            <strong>{field.label}:</strong>
                            <div>{data[field.name] || "-"}</div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-end mt-4">
                        {editPath && (
                            <Link to={editPath} className="btn btn-primary me-2">
                                Edit
                            </Link>
                        )}
                        <Link to={backPath} className="btn btn-outline-secondary">
                            Back
                        </Link>
                    </div>
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

export default View;
