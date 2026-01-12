import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    createRegistration,
    updateRegistration,
    getRegistrationById,
    deleteRegistration,
    getAllRegistrations
} from "../../api/registrationApi";
import { uploadAttachment } from "../../api/attachmentApi";
import { getAllLocations } from "../../api/locationList";
import { getAllServices } from "../../api/serviceList";

function CreateRegistration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        id: 0,
        companyName: "",
        email: "",
        locationId: "",
        serviceId: "",
        phoneNumber: "",
        description: "",
        latitude: "",
        longitude: "",
        profileImageId: 0
    });

    const [locations, setLocations] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Load locations
    useEffect(() => {
        getAllLocations()
            .then(res => setLocations(res.data || []))
            .catch(() => setLocations([]));
    }, []);

    // Load services
    useEffect(() => {
        getAllServices()
            .then(res => setServicesList(res.data || []))
            .catch(() => setServicesList([]));
    }, []);

    // Edit mode
    useEffect(() => {
        if (!isEditMode) return;
        setPageLoading(true);
        getRegistrationById(id)
            .then(res => {
                const r = res?.data || res;
                setFormData({
                    id: r.id,
                    companyName: r.companyName || "",
                    email: r.email || "",
                    locationId: r.locationId || "",
                    serviceId: r.serviceId || "",
                    phoneNumber: r.phoneNumber || "",
                    description: r.description || "",
                    latitude: r.latitude ?? "",
                    longitude: r.longitude ?? "",
                    profileImageId: r.profileImageId || 0
                });
            })
            .catch(() => setError("Failed to load registration"))
            .finally(() => setPageLoading(false));
    }, [id, isEditMode]);



    // Geo location
    useEffect(() => {
        if (!isEditMode && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setFormData(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }));
            });
        }
    }, [isEditMode]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ["locationId", "serviceId"].includes(name) ? Number(value) : value
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Validation
    const validate = async () => {
        let temp = {};

        if (!formData.companyName) temp.companyName = "Company name is required";
        if (!formData.email) temp.email = "Email is required";
        if (!formData.locationId) temp.locationId = "Location is required";
        if (!formData.serviceId) temp.serviceId = "Service is required";

        // Normalize phone number
        const phone = formData.phoneNumber?.toString().trim() || "";
        if (!phone) temp.phoneNumber = "Phone number is required";
        else if (phone.length !== 10) temp.phoneNumber = "Phone number must be 10 digits";

        if (!formData.description) temp.description = "Description is required";

        // Duplicate checks
        try {
            const registrations = await getAllRegistrations();
            const currentId = isEditMode ? Number(id) : 0;

            // MOBILE DUPLICATE CHECK
            const phoneExists = registrations.some(
                r => r.phoneNumber?.toString().trim() === phone && r.id !== currentId
            );
            if (phoneExists) temp.phoneNumber = "Mobile number already exists";

            // EMAIL DUPLICATE CHECK
            const emailExists = registrations.some(
                r => r.email?.toLowerCase() === formData.email.toLowerCase() && r.id !== currentId
            );
            if (emailExists) temp.email = "Email already exists";
        } catch (err) {
            console.error("Duplicate check error:", err);
        }

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    //submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!(await validate())) return;

        setLoading(true);
        try {
            let profileId = formData.profileImageId || 0;
            if (selectedFile) {
                const fileData = new FormData();
                fileData.append("file", selectedFile);
                const uploadRes = await uploadAttachment(fileData);
                profileId = Number(uploadRes.data.data.id);
            }

            const payload = {
                ...formData,
                email: formData.email.toLowerCase(),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                profileImageId: Number(profileId)
            };

            isEditMode
                ? await updateRegistration(id, payload)
                : await createRegistration(payload);

            navigate("/management/registrations");
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!window.confirm("Are you sure?")) return;
        await deleteRegistration(id);
        navigate("/management/registrations");
    };

    if (pageLoading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 bg-white border rounded shadow p-4">
                <h3 className="text-center mb-4">{isEditMode ? "Update Registration" : "Create Registration"}</h3>
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label>Company Name *</label>
                    <input className={`form-control mb-1 ${errors.companyName ? "is-invalid" : ""}`}
                        name="companyName" value={formData.companyName} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.companyName}</div>

                    {/* Email */}
                    <label>Email *</label>
                    <input type="email" name="email" className={`form-control mb-1 ${errors.email ? "is-invalid" : ""}`}
                        value={formData.email} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.email}</div>

                    {/* Location */}
                    <label>Location *</label>
                    <select className={`form-control mb-1 ${errors.locationId ? "is-invalid" : ""}`}
                        name="locationId" value={formData.locationId} onChange={handleChange}>
                        <option value="">-- Select Location --</option>
                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                    <div className="invalid-feedback">{errors.locationId}</div>


                    {/* Service */}
                    <label>Service *</label>
                    <select className={`form-control mb-1 ${errors.serviceId ? "is-invalid" : ""}`}
                        name="serviceId" value={formData.serviceId} onChange={handleChange}>
                        <option value="">-- Select Service --</option>
                        {servicesList.map(srv => <option key={srv.id} value={srv.id}>{srv.name}</option>)}
                    </select>
                    <div className="invalid-feedback">{errors.serviceId}</div>


                    {/* Phone Number */}
                    <label>Phone Number *</label>
                    <input className={`form-control mb-1 ${errors.phoneNumber ? "is-invalid" : ""}`}
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, phoneNumber: val });
                            setErrors({ ...errors, phoneNumber: "" });
                        }}
                    />
                    <div className="invalid-feedback">{errors.phoneNumber}</div>

                    {/* Description */}
                    <label>Description *</label>
                    <textarea className={`form-control mb-3 ${errors.description ? "is-invalid" : ""}`}
                        name="description" value={formData.description} onChange={handleChange} />
                    <div className="invalid-feedback">{errors.description}</div>

                    {/* Latitude / Longitude */}
                    <div className="row mb-3">
                        <div className="col">
                            <input className="form-control" value={formData.latitude} readOnly />
                        </div>
                        <div className="col">
                            <input className="form-control" value={formData.longitude} readOnly />
                        </div>
                    </div>

                    {/* Profile Upload */}
                    <label>Profile Image</label>
                    <input type="file" accept="image/*" className="form-control mb-3" onChange={handleFileChange} />

                    <div className="text-end">
                        <Link to="/management/registrations" className="btn btn-secondary me-2">Cancel</Link>
                        <button className="btn btn-success" disabled={loading}>{isEditMode ? "Update" : "Save"}</button>
                        {isEditMode && <button type="button" className="btn btn-danger ms-2" onClick={handleDelete}>Delete</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRegistration;
