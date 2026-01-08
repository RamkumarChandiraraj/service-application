import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../api/UserApi";
import { downloadAttachmentById } from "../../api/attachmentApi";

function ReadUserManagement() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    // Function to generate avatar with initials
    const generateInitialsAvatar = (name, size = 140) => {
        const initials = name
            ? name
                .split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase()
            : "U"; // fallback if no name

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Background color
        ctx.fillStyle = "#E8D6FF"; // Bootstrap primary
        ctx.fillRect(0, 0, size, size);

        // Text style
        ctx.font = `${size / 2}px Arial`;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initials, size / 2, size / 2);

        return canvas.toDataURL();
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await getUserById(id);
            const data = res.data?.data || res.data;
            setUser(data);

            if (data.profileId) {
                try {
                    const imgRes = await downloadAttachmentById(data.profileId);
                    const blob = new Blob([imgRes.data]);
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error fetching image:", error);
                    setImageUrl(generateInitialsAvatar(data.userName));
                }
            } else {
                setImageUrl(generateInitialsAvatar(data.userName));
            }
        };

        fetchData();
    }, [id]);

    if (!user) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-4 text-center">
            <h3 className="mb-4">User Details</h3>

            {/* Profile Image on Top */}
            <div className="d-flex justify-content-center mb-3">
                <img
                    src={imageUrl}
                    alt="Profile"
                    style={{
                        width: "140px",
                        height: "140px",
                        borderRadius: "50%",
                        border: "4px solid #000000",
                        objectFit: "cover",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}
                />
            </div>

            <table className="table table-bordered w-50 mx-auto text-start">
                <tbody>
                    <tr><th>ID</th><td>{user.id}</td></tr>
                    <tr><th>User Name</th><td>{user.userName}</td></tr>
                    <tr><th>Email</th><td>{user.email}</td></tr>
                    <tr><th>Mobile</th><td>{user.mobileNumber}</td></tr>
                    <tr><th>Role</th><td>{user.role}</td></tr>
                </tbody>
            </table>

            <Link to="/management/users" className="btn btn-secondary">Back</Link>
        </div>
    );
}

export default ReadUserManagement;
