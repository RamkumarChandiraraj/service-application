import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/Common/DataTable";
import AlertToast from "../../components/Common/AlertToast";
import {
    getAllAnnouncements,
    deleteAnnouncement
} from "../../api/announcementApi";

function AnnouncementList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await getAllAnnouncements();
            setData(res.data || res || []);
        } catch (err) {
            setError(err.message || "Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this announcement?")) return;

        try {
            await deleteAnnouncement(id);
            setData((prev) => prev.filter((x) => x.id !== id));

            setToast({
                show: true,
                message: "Announcement deleted successfully!",
                type: "success",
            });
        } catch {
            setToast({
                show: true,
                message: "Failed to delete announcement",
                type: "error",
            });
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", field: "id" },
            { header: "Title", field: "title" },
            { header: "Description", field: "description" },
            {
                header: "Actions",
                field: "actions",
                sortable: false,
                body: (row) => (
                    <div className="d-flex gap-2 flex-wrap">
                        <Link
                            to={`/readannouncement/${row.id}`}
                            className="btn btn-info btn-sm"
                        >
                            View
                        </Link>

                        <Link
                            to={`/createannouncement/${row.id}`}
                            className="btn btn-primary btn-sm"
                        >
                            Edit
                        </Link>

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(row.id)}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    if (loading) return <p className="text-center mt-5">Loading announcements...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <>
            <div className="container py-4">
                <DataTable
                    title="Announcements"
                    data={data}
                    columns={columns}
                    searchFields={["title", "description"]}
                    onAdd={() => navigate("/createannouncement")}
                />
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

export default AnnouncementList;
