function AnnouncementsManagementList() {
    const { id, viewId } = useParams(); // id for edit, viewId for read
    const navigate = useNavigate();

    // ================= STATE =================
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // ================= FETCH ANNOUNCEMENTS =================
    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await getAllAnnouncements();
            const data = res?.data?.data || res?.data || [];
            setAnnouncements(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this announcement?")) return;

        try {
            await deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            setToast({ show: true, message: "Announcement deleted successfully!", type: "success" });
        } catch {
            setToast({ show: true, message: "Failed to delete announcement", type: "error" });
        }
    };

    // ================= TABLE COLUMNS =================
    const columns = useMemo(() => [
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
                        to={`/announcements/view/${row.id}`}
                        className="btn btn-info btn-sm"
                    >
                        View
                    </Link>
                    <Link
                        to={`/announcements/edit/${row.id}`}
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
    ], []);

    // ================= RENDER =================
    if (loading) return <p className="text-center mt-5">Loading announcements...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    // Main list page only
    return (
        <>
            <div className="container py-4">
                <DataTable
                    title="Announcements"
                    data={announcements}
                    columns={columns}
                    searchFields={["title", "description"]}
                    onAdd={() => navigate("/announcements/edit")}
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

export default AnnouncementsManagementList;
