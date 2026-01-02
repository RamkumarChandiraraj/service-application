import { useParams } from "react-router-dom";
import Add from "../../components/common/Add";
import {
    createCategory,
    updateCategory,
    getCategoryById
} from "../../api/categoryApi";

function CreateCategoryManagement() {
    const { id } = useParams();

    return (
        <Add
            title={id ? "Update Category" : "Create Category"}
            isEditMode={!!id}
            cancelPath="/categorylist"
            initialData={{
                name: "",
                description: "",
                icon: "",
                link: ""
            }}
            fields={[
                { name: "name", label: "Name", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
                { name: "icon", label: "Icon", type: "text", required: true },
                { name: "link", label: "Link", type: "text", required: true }
            ]}
            onFetch={() => getCategoryById(id)}
            onSubmit={(data) =>
                id ? updateCategory(id, data) : createCategory(data)
            }
        />
    );
}

export default CreateCategoryManagement;
