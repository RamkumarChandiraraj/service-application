import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnnouncementById } from "../../api/AnnouncementsApi";

const ViewAnnouncement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnnouncementById(id)
            .then((res) => setAnnouncement(res?.data || res))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (!announcement) return <p className="text-center mt-5">No announcement found</p>;

    return (
        <div className="container py-4">
            <h3>Announcement Details</h3>
            <div className="mb-2">
                <strong>ID:</strong> {announcement.id || announcement._id}
            </div>
            <div className="mb-2">
                <strong>Title:</strong> {announcement.title}
            </div>
            <div className="mb-2">
                <strong>Description:</strong> {announcement.description}
            </div>

            <div className="mt-3">
                <button
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/announcement/edit/${announcement.id || announcement._id}`)}
                >
                    Edit
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/announcement")}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default ViewAnnouncement;
