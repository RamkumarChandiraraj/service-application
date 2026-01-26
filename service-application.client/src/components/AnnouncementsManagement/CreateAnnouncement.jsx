import { useParams } from "react-router-dom";
import Add from "../../components/common/Add";
import {
    createAnnouncement,
    updateAnnouncement,
    getAnnouncementById
}from "../../api/AnnouncementsApi";


function CreateAnnouncement() {
    const { id } = useParams();

    return (
        <Add
            title={id ? "Update Announcement" : "Create Announcement"}
            isEditMode={!!id}
            cancelPath="/announcementlist"
            initialData={{
                title: "",
                description: "",
            }}
            fields={[
                { name: "title", label: "Title", type: "text", required: true },
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                },
            ]}
            onFetch={() => getAnnouncementById(id)}
            onSubmit={(data) =>
                id ? updateAnnouncement(id, data) : createAnnouncement(data)
            }
        />
    );
}

export default CreateAnnouncement;
