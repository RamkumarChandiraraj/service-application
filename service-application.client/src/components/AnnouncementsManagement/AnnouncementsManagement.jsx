import { useEffect, useMemo, useState } from "react";
import DataTable from "../Common/DataTable";
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from "../../api/AnnouncementsApi";

const AnnouncementsManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewData, setViewData] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    // ================= FETCH ANNOUNCEMENTS =================
    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await getAllAnnouncements();
            const data = res?.data?.data || res?.data || [];
            setAnnouncements(data);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // ================= FORM HANDLING =================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!formData.title || !formData.description)
            return alert("Title and Description are required");

        try {
            setSaving(true);
            if (editingId) {
                await updateAnnouncement(editingId, formData);
                alert("Announcement updated successfully");
            } else {
                await createAnnouncement(formData);
                alert("Announcement added successfully");
            }

            closeModal();
            fetchAnnouncements();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    // ================= EDIT =================
    const handleEdit = (row) => {
        setEditingId(row.id || row._id);
        setFormData({
            title: row.title,
            description: row.description,
        });
        setModalOpen(true);
    };

    // ================= VIEW =================
    const handleView = (row) => {
        setViewData(row);
        setViewModalOpen(true);
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this announcement?"))
            return;

        try {
            await deleteAnnouncement(id);
            setAnnouncements((prev) => prev.filter((a) => a.id !== id));
            alert("Announcement deleted successfully");
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setFormData({ title: "", description: "" });
    };

    const closeViewModal = () => {
        setViewModalOpen(false);
        setViewData(null);
    };

    // ================= TABLE COLUMNS =================
    const columns = useMemo(
        () => [
            { header: "S.No", field: "serial" },
            { header: "Title", field: "title" },
            { header: "Description", field: "description" },
            {
                header: "Actions",
                field: "actions",
                sortable: false,
                body: (row) => (
                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleView(row)}
                        >
                            View
                        </button>
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(row)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(row.id || row._id)}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const tableData = announcements.map((item, idx) => ({
        ...item,
        serial: idx + 1,
    }));

    if (loading) return <p className="text-center mt-5">Loading announcements...</p>;

    return (
        <div className="container py-4">
            <DataTable
                title="Announcements"
                data={tableData}
                columns={columns}
                searchFields={["title", "description"]}
                onAdd={() => setModalOpen(true)}
            />

            {/* ================= ADD / EDIT MODAL ================= */}
            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingId ? "Update Announcement" : "Add Announcement"}
                                </h5>
                                <button className="btn-close" onClick={closeModal}></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? editingId
                                            ? "Updating..."
                                            : "Adding..."
                                        : editingId
                                            ? "Update"
                                            : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= VIEW MODAL ================= */}
            {viewModalOpen && viewData && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">View Announcement</h5>
                                <button className="btn-close" onClick={closeViewModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <strong>ID:</strong> {viewData.id || viewData._id}
                                </p>
                                <p>
                                    <strong>Title:</strong> {viewData.title}
                                </p>
                                <p>
                                    <strong>Description:</strong> {viewData.description}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeViewModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsManagement;
