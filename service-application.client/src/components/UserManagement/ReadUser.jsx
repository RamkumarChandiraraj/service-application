import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../api/UserApi";

function ReadUserManagement() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserById(id).then(res => {
            const data = res.data?.data || res.data;
            setUser(data);
        });
    }, [id]); 

    if (!user) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-4">
            <h3>User Details</h3>

            <table className="table table-bordered w-50">
                <tbody>
                    <tr><th>ID</th><td>{user.id}</td></tr>
                    <tr><th>User Name</th><td>{user.userName}</td></tr>
                    <tr><th>Email</th><td>{user.email}</td></tr>
                    <tr><th>MobileNumber</th><td>{user.mobileNumber}</td></tr>
                    <tr><th>Role</th><td>{user.role}</td></tr>
                    <tr><th>ProfileId</th><td>{user.profileId}</td></tr>
                </tbody>
            </table>

            <Link to="/userlist" className="btn btn-secondary">Back</Link>
        </div>
    );
}

export default ReadUserManagement;
