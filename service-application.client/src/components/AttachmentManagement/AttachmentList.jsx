import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/Common/DataTable";
import {
  uploadAttachment,
  getAllAttachments,
  downloadAttachmentById,
  deleteAttachment,
  updateAttachment,
} from "../../api/attachmentApi";

const AttachmentList = () => {
  const [attachments, setAttachments] = useState([]);
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
      const data = res?.data?.data || res?.data || [];
      setAttachments(
        data.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
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
        alert("Attachment updated successfully");
      } else {
        await uploadAttachment(formData);
        alert("Attachment added successfully");
      }
      // Close modal after success
      setModalOpen(false);
      setUpdatingId(null);
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
      setAttachments((prev) => prev.filter((a) => a.id !== id));
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
  const columns = useMemo(
    () => [
      { header: "S.No", field: "serial" },
      { header: "File Name", field: "fileName" },
      {
        header: "Actions",
        field: "actions",
        sortable: false,
        body: (row) => (
          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn btn-info btn-sm"
              onClick={() => handleDownload(row.id, row.fileName)}
            >
              Download
            </button>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => handleEdit(row)}
            >
              Update
            </button>
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

  const tableData = attachments.map((item, idx) => ({ ...item, serial: idx + 1 }));

  if (loading) return <p className="text-center mt-5">Loading attachments...</p>;

  return (
    <div className="container py-4">
      <DataTable
        title="Attachments"
        data={tableData}
        columns={columns}
        searchFields={["fileName"]}
        onAdd={() => setModalOpen(true)}
      />

      {/* ================= MODAL FOR ADD / UPDATE ================= */}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{updatingId ? "Update Attachment" : "Add Attachment"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setModalOpen(false);
                    setUpdatingId(null);
                    setFile(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {updatingId && <p>Current File: <strong>{selectedFileName}</strong></p>}
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setModalOpen(false);
                    setUpdatingId(null);
                    setFile(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUploadOrUpdate}
                  disabled={uploading}
                >
                  {uploading ? (updatingId ? "Updating..." : "Adding...") : updatingId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentList;
