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
      mobilenumber: 0,
      role:0

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

          console.log(user);

          setFormData({
              id: user.id || 0,
              username: user.userName || "",
              email: user.email || "",
              password: "",
              mobilenumber: user.mobileNumber || 0,
              role: user.role || 0
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


      let newValue = value;

      if (name === "role") {
          newValue = Number(value);
      }

      if (name === "mobilenumber") {
          newValue = Number(value);
      }

    setFormData({ ...formData, [name]: newValue });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let temp = {};
      if (!formData.username.trim()) temp.userName = "Username required";
      if (!formData.password.trim() && !isEditMode) temp.password = "Password required";
      if (!formData.email.trim()) temp.email = "Email required";
      if (!formData.mobilenumber) temp.mobileNumber = "Mobilenumber required";
      if (!formData.role) temp.role = "Role required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditMode) {
          await updateUser(formData.id, formData);
        alert("User updated succesfully!");
      } else {
        await createUser(formData);
          alert("User created succesfully!");
      }
      navigate("/user");
    } catch (err) {
      console.error(err);
            const apiMessage = err.response?.data?.message || "";

            if (apiMessage.toLowerCase().includes("email")) {
                setError("Your email already exists");
            } else if (apiMessage.toLowerCase().includes("mobile")) {
                setError("Your mobile number already exists");
            } else if (apiMessage.toLowerCase().includes("password")) {
                setError("Your password already exists");
            } else {
                setError(apiMessage || "Save failed");
            }
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
                  <label>Password</label>
                  <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                  />
              </div>
              {errors.password && <small className="text-danger">{errors.password}</small>}

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

              <div className="mb-3">
                  <label>MobileNumber</label>
                  <input
                      name="mobilenumber"
                      value={formData.mobilenumber}
                      onChange={handleChange}
                      className="form-control"
                  />
              </div>
              {errors.mobilenumber && <small className="text-danger">{errors.mobilenumber}</small>}

              <div className="mb-3">
                  <label>Role</label>
                  <select
                      name="role"
                      value={formData.role}
                     onChange={handleChange}
                      className="form-control">
                      <option value="">--Select Role--</option>
                      <option value={1}>Admin</option>
                      <option value={2}>Manager</option>
                      <option value={3}>User</option>
                      <option value={4}>Painting</option>
                      <option value={5}>Cooking</option>
                      <option value={6}>Plumbing</option>
                  </select>
                  
                  {errors.role && <small className="text-danger">{errors.role}</small>}
              </div>
        <div>
                  <Link to="/userlist" className="btn btn-secondary me-2">Cancel</Link>
                  
                  <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserManagement;
