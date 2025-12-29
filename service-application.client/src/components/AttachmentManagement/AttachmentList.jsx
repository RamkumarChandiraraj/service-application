import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/Common/DataTable";
import {
    uploadAttachment,
    getAllAttachments,
    downloadAttachmentById,
    deleteAttachment,
    updateAttachment,
} from "../../api/attachmentApi";

function AttachmentList() {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");

    // ================= FETCH ATTACHMENTS =================
    const fetchAttachments = async () => {
        setLoading(true);
        try {
            const res = await getAllAttachments();
            const attachments = res?.data?.data || res?.data || [];
            setData(
                attachments.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
            );
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttachments();
    }, []);

    // ================= UPLOAD / UPDATE =================
    const handleUploadOrUpdate = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            if (updatingId) {
                await updateAttachment(updatingId, formData);
                setUpdatingId(null);
                setModalOpen(false);
                alert("Attachment updated successfully");
            } else {
                await uploadAttachment(formData);
                alert("Attachment uploaded successfully");
            }
            setFile(null);
            fetchAttachments();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setUploading(false);
        }
    };

    // ================= DOWNLOAD =================
    const handleDownload = async (id, fileName) => {
        try {
            const res = await downloadAttachmentById(id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || "attachment";
            link.click();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this attachment?")) return;
        try {
            await deleteAttachment(id);
            setData((prev) => prev.filter((a) => a.id !== id));
            alert("Attachment deleted successfully");
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // ================= OPEN UPDATE MODAL =================
    const handleEdit = (row) => {
        setUpdatingId(row.id);
        setSelectedFileName(row.fileName);
        setModalOpen(true);
    };

    // ================= TABLE COLUMNS =================
    const columns = useMemo(() => [
        { header: "S.No", field: "serial" },
        { header: "File Name", field: "fileName" },
        { header: "Content Type", field: "contentType" },
        {
            header: "Actions",
            field: "actions",
            body: (row) => (
                <>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleDownload(row.id, row.fileName)}>Download</button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(row)}>Update</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>Delete</button>
                </>
            ),
        },
    ], []);

    if (loading) return <p className="text-center mt-5">Loading Attachments...</p>;

    const tableData = data.map((item, idx) => ({ ...item, serial: idx + 1 }));

    return (
        <div className="d-flex flex-column align-items-center bg-light min-vh-100 pb-5">
            <h1 className="mt-4">Attachment Management</h1>

            <div className="w-75 rounded bg-white border shadow p-4">
                {/* ================= UPLOAD SECTION ================= */}
                <form onSubmit={handleUploadOrUpdate} className="mb-4">
                    <div className="d-flex gap-2">
                        <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                        <button className="btn btn-success" disabled={uploading}>
                            {uploading ? updatingId ? "Updating..." : "Uploading..." : updatingId ? "Update" : "Upload"}
                        </button>
                    </div>
                </form>

                {/* ================= LIST SECTION ================= */}
                <DataTable data={tableData} columns={columns} searchFields={["fileName"]} />
            </div>

            {/* ================= UPDATE MODAL ================= */}
            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Attachment</h5>
                                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Current File: <strong>{selectedFileName}</strong></p>
                                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleUploadOrUpdate} disabled={uploading}>
                                    {uploading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttachmentList;
