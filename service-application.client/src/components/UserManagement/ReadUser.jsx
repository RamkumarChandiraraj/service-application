import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../api/UserApi";
import { downloadAttachmentById } from "../../api/attachmentApi";

function ReadUserManagement() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getUserById(id);
            const data = res.data?.data || res.data;
            setUser(data);

            if (data.profileId) {
                const imgRes = await downloadAttachmentById(data.profileId);
                const blob = new Blob([imgRes.data]);
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            }
        };

        fetchData();
    }, [id]);

    if (!user) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-4 text-center">
            <h3 className="mb-4">User Details</h3>

            {/* Profile Image on Top */}
            {imageUrl && (
                <div className="d-flex justify-content-center mb-3">
                    <img
                        src={imageUrl}
                        alt="Profile"
                        style={{
                            width: "140px",
                            height: "140px",
                            borderRadius: "50%",
                            border: "4px solid #0d6efd",   
                            objectFit: "cover",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                        }}
                    />
                </div>
            )}

            <table className="table table-bordered w-50 mx-auto text-start">
                <tbody>
                    <tr><th>ID</th><td>{user.id}</td></tr>
                    <tr><th>User Name</th><td>{user.userName}</td></tr>
                    <tr><th>Email</th><td>{user.email}</td></tr>
                    <tr><th>Mobile</th><td>{user.mobileNumber}</td></tr>
                    <tr><th>Role</th><td>{user.role}</td></tr>
                    
                </tbody>
            </table>

            <Link to="/userlist" className="btn btn-secondary mt-3">Back</Link>
        </div>
    );
}

export default ReadUserManagement;
