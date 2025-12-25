import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createUser, updateUser, getUserById } from "../../api/UserApi";

function CreateUserManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    id: 0,
      username: "",
    password:"",
      email: "",
      mobilenumber: "",
      role:""

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
          id: Number(user.id),
          username: user.username,
          email: user.email,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load user");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUser();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let temp = {};
    if (!formData.username.trim()) temp.username = "User name required";
    if (!formData.email.trim()) temp.email = "Email required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditMode) {
        await updateUser(id, formData);
        alert("User updated");
      } else {
        await createUser(formData);
        alert("User created");
      }
      navigate("/user");
    } catch (err) {
      console.error(err);
      setError("Save failed");
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
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
          />
          {errors.username && <small className="text-danger">{errors.username}</small>}
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        <div>
          <Link to="/user" className="btn btn-secondary me-2">Cancel</Link>
          <button className="btn btn-success" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserManagement;
