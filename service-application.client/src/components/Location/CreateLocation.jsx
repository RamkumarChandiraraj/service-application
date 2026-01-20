import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AlertToast from "../Common/AlertToast";
import LoadingPage from "../Common/LoadingPage";

import {
    createLocation,
    updateLocation,
    getLocationById,
} from "../../api/locationList";

function CreateLocation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        ID: 0,
        Name: "",
        Description: "",
        LocationCode: "",
        Latitude: "",
        Longitude: "",
        Pincode: "",
        ReferenceId: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // ================= LOAD DATA (EDIT MODE) =================
    useEffect(() => {
        if (!isEditMode) return;

        const fetchLocation = async () => {
            setPageLoading(true);
            try {
                const res = await getLocationById(id);
                setFormData({
                    ID: res.data.id,
                    Name: res.data.name || "",
                    Description: res.data.description || "",
                    LocationCode: res.data.locationCode || "",
                    Latitude: res.data.latitude ?? "",
                    Longitude: res.data.longitude ?? "",
                    Pincode: res.data.pincode ?? "",
                    ReferenceId: res.data.referenceId ?? "",
                });
            } catch {
                setToast({
                    show: true,
                    message: "Failed to load location details",
                    type: "error",
                });
            } finally {
                setPageLoading(false);
            }
        };

        fetchLocation();
    }, [id, isEditMode]);

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // ================= VALIDATION =================
    const validate = () => {
        let temp = {};
        if (!formData.Name.trim()) temp.Name = "Location name is required";
        if (!formData.Latitude) temp.Latitude = "Latitude is required";
        if (!formData.Longitude) temp.Longitude = "Longitude is required";
        if (!formData.Pincode || formData.Pincode.toString().length !== 6)
            temp.Pincode = "Pincode must be 6 digits";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const payload = {
                ...formData,
                Latitude: Number(formData.Latitude),
                Longitude: Number(formData.Longitude),
                Pincode: Number(formData.Pincode),
                ReferenceId: formData.ReferenceId
                    ? Number(formData.ReferenceId)
                    : null,
            };

            if (isEditMode) {
                await updateLocation(payload);
                setToast({
                    show: true,
                    message: "Location updated successfully",
                    type: "success",
                });
            } else {
                const { ID, ...createPayload } = payload;
                await createLocation(createPayload);
                setToast({
                    show: true,
                    message: "Location created successfully",
                    type: "success",
                });
            }

            setTimeout(() => navigate("/management/locations"), 1500);
        } catch (err) {
            setToast({
                show: true,
                message: err.response?.data?.message || "Something went wrong",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <LoadingPage />;

    return (
        <>
            <AlertToast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <div className="bg-light min-vh-100 d-flex justify-content-center py-5">
                <div className="container px-3">
                    <div
                        className="card shadow-sm mx-auto p-4 p-md-5"
                        style={{ maxWidth: "900px" }}
                    >
                        <h3 className="text-center mb-4">
                            {isEditMode ? "Update Location" : "Create Location"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                {/* Name */}
                                <div className="col-12">
                                    <label className="form-label">
                                        Location Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={handleChange}
                                        className={`form-control ${errors.Name ? "is-invalid" : ""
                                            }`}
                                    />
                                    {errors.Name && (
                                        <div className="invalid-feedback">{errors.Name}</div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="col-12">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="Description"
                                        value={formData.Description}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="3"
                                    />
                                </div>

                                {/* Location Code */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Location Code</label>
                                    <input
                                        type="text"
                                        name="LocationCode"
                                        value={formData.LocationCode}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                {/* Pincode */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label">
                                        Pincode <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="Pincode"
                                        value={formData.Pincode}
                                        onChange={handleChange}
                                        className={`form-control ${errors.Pincode ? "is-invalid" : ""
                                            }`}
                                    />
                                    {errors.Pincode && (
                                        <div className="invalid-feedback">
                                            {errors.Pincode}
                                        </div>
                                    )}
                                </div>

                                {/* Latitude */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label">
                                        Latitude <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="Latitude"
                                        value={formData.Latitude}
                                        onChange={handleChange}
                                        className={`form-control ${errors.Latitude ? "is-invalid" : ""
                                            }`}
                                    />
                                    {errors.Latitude && (
                                        <div className="invalid-feedback">
                                            {errors.Latitude}
                                        </div>
                                    )}
                                </div>

                                {/* Longitude */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label">
                                        Longitude <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="Longitude"
                                        value={formData.Longitude}
                                        onChange={handleChange}
                                        className={`form-control ${errors.Longitude ? "is-invalid" : ""
                                            }`}
                                    />
                                    {errors.Longitude && (
                                        <div className="invalid-feedback">
                                            {errors.Longitude}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-3 mt-5">
                                <Link
                                    to="/management/locations"
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={loading}
                                >
                                    {loading
                                        ? isEditMode
                                            ? "Updating..."
                                            : "Saving..."
                                        : isEditMode
                                            ? "Update"
                                            : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateLocation;
