import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    createRegistration,
    updateRegistration,
    getRegistrationById,
    deleteRegistration,
    getAllRegistrations
} from "../../api/registrationApi";

import { getAllLocations } from "../../api/locationList";
import { getAllServices } from "../../api/serviceList";

function CreateRegistration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    /* ================= STATE ================= */
    const [formData, setFormData] = useState({
        id: 0,
        companyName: "",
        email: "",
        locationId: "",
        serviceId: "",
        phoneNumber: "",
        description: "",
        latitude: "",
        longitude: ""
    });

    const [locations, setLocations] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ================= LOAD LOCATIONS ================= */
    useEffect(() => {
        getAllLocations()
            .then(res => setLocations(res.data || []))
            .catch(() => setLocations([]));
    }, []);

    /* ================= LOAD SERVICES ================= */
    useEffect(() => {
        getAllServices()
            .then(res => setServicesList(res.data || []))
            .catch(() => setServicesList([]));
    }, []);

    /* ================= EDIT MODE ================= */
    useEffect(() => {
        if (!isEditMode) return;

        setPageLoading(true);
        getRegistrationById(id)
            .then(res => {
                setFormData({
                    id: res.id,
                    companyName: res.companyName || "",
                    email: res.email || "",
                    locationId: res.locationId || "",
                    serviceId: res.serviceId || "",
                    phoneNumber: res.phoneNumber || "",
                    description: res.description || "",
                    latitude: res.latitude ?? "",
                    longitude: res.longitude ?? ""
                });
            })
            .catch(() => setError("Failed to load registration"))
            .finally(() => setPageLoading(false));
    }, [id, isEditMode]);

    /* ================= GEO LOCATION ================= */
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

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === "locationId" || name === "serviceId"
                ? Number(value)
                : value
        }));

        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    /* ================= VALIDATION ================= */
    const validate = async () => {
        let temp = {};

        // Required fields
        if (!formData.companyName)
            temp.companyName = "Company name is required";

        if (!formData.email)
            temp.email = "Email is required";

        if (!formData.locationId)
            temp.locationId = "Location is required";

        if (!formData.serviceId)
            temp.serviceId = "Service is required";

        if (!formData.phoneNumber)
            temp.phoneNumber = "Phone number is required";
        else if (formData.phoneNumber.length !== 10)
            temp.phoneNumber = "Phone number must be 10 digits";

        if (!formData.description)
            temp.description = "Description is required";

        // DUPLICATE CHECKS
        try {
            const registrations = await getAllRegistrations();

            //  MOBILE DUPLICATE CHECK
            const phoneExists = registrations.find(
                r =>
                    r.phoneNumber === formData.phoneNumber &&
                    r.id !== formData.id // allow same record in edit
            );

            if (phoneExists) {
                temp.phoneNumber = "Mobile number already exists";
            }

            //  EMAIL DUPLICATE CHECK
            const emailExists = registrations.find(
                r =>
                    r.email?.toLowerCase() === formData.email.toLowerCase() &&
                    r.id !== formData.id
            );

            if (emailExists) {
                temp.email = "Email already exists";
            }

        } catch (err) {
            console.error("Duplicate check error:", err);
        }

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!(await validate())) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                email: formData.email.toLowerCase(),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude)
            };

            isEditMode
                ? await updateRegistration(id, payload)
                : await createRegistration(payload);

            navigate("/registrationlist");
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async () => {
        if (!window.confirm("Are you sure?")) return;
        await deleteRegistration(id);
        navigate("/registrationlist");
    };

    if (pageLoading) return <p className="text-center mt-5">Loading...</p>;

    /* ================= UI ================= */
    return (
        <div className="d-flex justify-content-center align-items-center bg-light vh-100">
            <div className="w-50 bg-white border rounded shadow p-4">
                <h3 className="text-center mb-4">
                    {isEditMode ? "Update Registration" : "Create Registration"}
                </h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>

                    {/* COMPANY */}
                    <label>Company Name *</label>
                    <input
                        className={`form-control mb-1 ${errors.companyName ? "is-invalid" : ""}`}
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.companyName}</div>

                    {/* EMAIL */}
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        className={`form-control mb-1 ${errors.email ? "is-invalid" : ""}`}
                        value={formData.email}
                        onChange={(e) => {
                            const lowerEmail = e.target.value.toLowerCase();
                            setFormData({ ...formData, email: lowerEmail });
                            setErrors({ ...errors, email: "" });
                        }}
                    />
                    <div className="invalid-feedback">{errors.email}</div>

                    {/* LOCATION */}
                    <label>Location *</label>
                    <select
                        className={`form-control mb-1 ${errors.locationId ? "is-invalid" : ""}`}
                        name="locationId"
                        value={formData.locationId}
                        onChange={handleChange}
                    >
                        <option value="">-- Select Location --</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                    <div className="invalid-feedback">{errors.locationId}</div>

                    {/* SERVICE */}
                    <label>Service *</label>
                    <select
                        className={`form-control mb-1 ${errors.serviceId ? "is-invalid" : ""}`}
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleChange}
                    >
                        <option value="">-- Select Service --</option>
                        {servicesList.map(srv => (
                            <option key={srv.id} value={srv.id}>{srv.name}</option>
                        ))}
                    </select>
                    <div className="invalid-feedback">{errors.serviceId}</div>

                    {/* PHONE */}
                    <label>Phone Number *</label>
                    <input
                        className={`form-control mb-1 ${errors.phoneNumber ? "is-invalid" : ""}`}
                        value={formData.phoneNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 10) {
                                setFormData({ ...formData, phoneNumber: val });
                                setErrors({ ...errors, phoneNumber: "" });
                            }
                        }}
                    />
                    {errors.phoneNumber && (
                        <div className="invalid-feedback">{errors.phoneNumber}</div>
                    )}

                    {/* DESCRIPTION */}
                    <label>Description *</label>
                    <textarea
                        className={`form-control mb-3 ${errors.description ? "is-invalid" : ""}`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.description}</div>

                    {/* LAT / LNG */}
                    <label>Company Current Location</label>
                    <div className="row mb-3">
                        <div className="col">
                            <input className="form-control" value={formData.latitude} readOnly />
                        </div>
                        <div className="col">
                            <input className="form-control" value={formData.longitude} readOnly />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="text-end">
                        <Link to="/registrationlist" className="btn btn-secondary me-2">
                            Cancel
                        </Link>
                        <button className="btn btn-success" disabled={loading}>
                            {isEditMode ? "Update" : "Save"}
                        </button>

                        {isEditMode && (
                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CreateRegistration;
