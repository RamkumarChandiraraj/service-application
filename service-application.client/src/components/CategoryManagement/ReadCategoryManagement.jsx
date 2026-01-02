import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import View from "../../components/common/View";
import { getCategoryById } from "../../api/categoryApi";

function ReadCategoryManagement() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategoryById(id)
            .then(setCategory)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <View
            title="Category Details"
            data={category}
            fields={[
                { name: "id", label: "ID" },
                { name: "name", label: "Name" },
                { name: "description", label: "Description" },
                { name: "icon", label: "Icon" },
                { name: "link", label: "Link" }
            ]}
            editPath={`/createcategorymanagement/${category.id}`}
            backPath="/categorylist"
        />
    );
}

export default ReadCategoryManagement;
