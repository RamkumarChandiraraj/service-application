import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createUser, updateUser, getUserById } from "../../api/UserApi";

const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateMobile = (mobile) =>
    /^[6-9]\d{9}$/.test(mobile);

const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(password);

function CreateUserManagement() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        id: 0,
        username: "",
        password: "",
        email: "",
        mobilenumber: "",
        role: "",
        profileId: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEditMode) return;

        const fetchUser = async () => {
            setPageLoading(true);
            try {
                const res = await getUserById(id);
                const user = res.data?.data || res.data;

                setFormData({
                    id: user.id,
                    username: user.userName || "",
                    email: user.email || "",
                    password: "",
                    mobilenumber: user.mobileNumber || "",
                    role: user.role || "",
                    profileId: user.profileId ? String(user.profileId) : ""
                });
            } catch {
                setError("Failed to load user");
            } finally {
                setPageLoading(false);
            }
        };

        fetchUser();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        let temp = {};

        if (!formData.username.trim())
            temp.username = "Username is required";

        if (!isEditMode) {
            if (!formData.password.trim())
                temp.password = "Password is required";
            else if (!validatePassword(formData.password))
                temp.password = "Password must be 6+ chars and include a number";
        }

        if (!formData.email.trim())
            temp.email = "Email is required";
        else if (!validateEmail(formData.email))
            temp.email = "Invalid email format";

        if (!formData.mobilenumber)
            temp.mobilenumber = "Mobile number is required";
        else if (!validateMobile(formData.mobilenumber))
            temp.mobilenumber = "Enter valid 10-digit mobile number";

        if (!formData.role)
            temp.role = "Role is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                role: Number(formData.role),
                profileId: formData.profileId ? Number(formData.profileId) : null
            };

            if (isEditMode) delete payload.password;

            console.log("Payload:", payload);

            isEditMode
                ? await updateUser(formData.id, payload)
                : await createUser(payload);

            alert(isEditMode ? "User updated successfully!" : "User created successfully!");
            navigate("/userlist");
        } catch (err) {
            setError(err.response?.data?.message || "Save failed");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-4">
            <h3>{isEditMode ? "Edit User" : "Create User"}</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="w-50">

                <div className="mb-3">
                    <label>User Name</label>
                    <input name="username" value={formData.username} onChange={handleChange} className="form-control" readOnly={isEditMode} />
                    {errors.username && <small className="text-danger">{errors.username}</small>}
                </div>

                {!isEditMode && (
                    <div className="mb-3">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" />
                        {errors.password && <small className="text-danger">{errors.password}</small>}
                    </div>
                )}

                <div className="mb-3">
                    <label>Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>Mobile</label>
                    <input name="mobilenumber" value={formData.mobilenumber} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="form-control">
                        <option value="">--Select Role--</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Manager</option>
                        <option value={3}>User</option>
                        <option value={4}>Painting</option>
                        <option value={5}>Cooking</option>
                        <option value={6}>Plumbing</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label> Profile ID</label>
                    <input
                        name="profileId"
                        value={formData.profileId}
                        onChange={handleChange}
                        className="form-control"
                        
                    />
                </div>

                <div>
                    <Link to="/userlist" className="btn btn-secondary me-2">Cancel</Link>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default CreateUserManagement;
