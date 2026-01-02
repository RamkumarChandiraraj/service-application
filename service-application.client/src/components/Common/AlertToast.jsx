import { useEffect } from "react";

function AlertToast({ show, message, type = "success", onClose }) {
    useEffect(() => {
        if (!show) return;
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [show, onClose]);

    if (!show) return null;

    const bg =
        type === "success"
            ? "bg-success"
            : type === "error"
                ? "bg-danger"
                : "bg-warning";

    return (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
            <div className={`toast show text-white ${bg}`}>
                <div className="toast-header">
                    <strong className="me-auto">
                        {type === "success" ? "Success" : "Error"}
                    </strong>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <div className="toast-body">{message}</div>
            </div>
        </div>
    );
}

export default AlertToast;
