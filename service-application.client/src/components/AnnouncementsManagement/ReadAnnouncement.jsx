import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import View from "../../components/common/View";
import { getAnnouncementById } from "../../api/announcementApi";

function ReadAnnouncement() {
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnnouncementById(id)
            .then(setAnnouncement)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <View
            title="Announcement Details"
            data={announcement}
            fields={[
                { name: "id", label: "ID" },
                { name: "title", label: "Title" },
                { name: "description", label: "Description" },
            ]}
            editPath={`/createannouncement/${announcement.id}`}
            backPath="/announcementlist"
        />
    );
}

export default ReadAnnouncement;
