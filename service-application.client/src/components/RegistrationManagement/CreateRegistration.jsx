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
        location: "",
        services: "",
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
        const fetchLocations = async () => {
            try {
                const res = await getAllLocations();
                setLocations(res.data || []);   // ✅ FIX
            } catch (err) {
                console.error("Failed to load locations", err);
                setLocations([]);
            }
        };
        fetchLocations();
    }, []);

    /* ================= LOAD SERVICES ================= */
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await getAllServices();
                setServicesList(res.data || []); // ✅ FIX
            } catch (err) {
                console.error("Failed to load services", err);
                setServicesList([]);
            }
        };
        fetchServices();
    }, []);

    /* ================= EDIT MODE ================= */
    useEffect(() => {
        if (!isEditMode) return;

        const fetchRegistration = async () => {
            setPageLoading(true);
            try {
                const res = await getRegistrationById(id);
                setFormData({
                    id: res.id,
                    companyName: res.companyName || "",
                    email: res.email || "",
                    location: res.location || "",
                    services: res.services || "",
                    phoneNumber: res.phoneNumber || "",
                    description: res.description || "",
                    latitude: res.latitude ?? "",
                    longitude: res.longitude ?? ""
                });
            } catch {
                setError("Failed to load registration");
            } finally {
                setPageLoading(false);
            }
        };

        fetchRegistration();
    }, [id, isEditMode]);

    /* ================= GEO LOCATION ================= */
    useEffect(() => {
        if (!isEditMode && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }));
                },
                (err) => console.warn("Geolocation error:", err)
            );
        }
    }, [isEditMode]);

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    /* ================= VALIDATION ================= */
    const validate = async () => {
        let temp = {};

        if (!formData.companyName) temp.companyName = "Company name is required";
        if (!formData.email) temp.email = "Email is required";
        if (!formData.location) temp.location = "Location is required";
        if (!formData.services) temp.services = "Service is required";
        if (!formData.phoneNumber) temp.phoneNumber = "Phone number is required";
        if (formData.phoneNumber.length !== 10)
            temp.phoneNumber = "Phone number must be 10 digits";
        if (!formData.description) temp.description = "Description is required";

        try {
            const registrations = await getAllRegistrations();

            const emailExists = registrations.find(
                (r) =>
                    r.email?.toLowerCase() === formData.email.toLowerCase() &&
                    r.id !== formData.id
            );
            if (emailExists) temp.email = "Email already exists";

            const phoneExists = registrations.find(
                (r) =>
                    r.phoneNumber === formData.phoneNumber &&
                    r.id !== formData.id
            );
            if (phoneExists) temp.phoneNumber = "Phone number already exists";
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

            if (isEditMode) {
                await updateRegistration(id, payload);
                alert("Registration updated successfully");
            } else {
                await createRegistration(payload);
                alert("Registration created successfully");
            }

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
                    <input
                        className="form-control mb-3"
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-3"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {/* LOCATION DROPDOWN */}
                    <select
                        className="form-control mb-3"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    >
                        <option value="">-- Select Location --</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.name}>
                                {loc.name}
                            </option>
                        ))}
                    </select>

                    {/* SERVICES DROPDOWN */}
                    <select
                        className="form-control mb-3"
                        name="services"
                        value={formData.services}
                        onChange={handleChange}
                    >
                        <option value="">-- Select Service --</option>
                        {servicesList.map((srv) => (
                            <option key={srv.id} value={srv.name}>
                                {srv.name}
                            </option>
                        ))}
                    </select>

                    <input
                        className="form-control mb-3"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 10) {
                                setFormData({ ...formData, phoneNumber: val });
                            }
                        }}
                    />

                    <textarea
                        className="form-control mb-3"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <div className="row mb-3">
                        <div className="col">
                            <input className="form-control" value={formData.latitude} readOnly />
                        </div>
                        <div className="col">
                            <input className="form-control" value={formData.longitude} readOnly />
                        </div>
                    </div>

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