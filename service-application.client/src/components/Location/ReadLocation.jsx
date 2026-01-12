import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLocationById } from "../../api/locationList";

import AlertToast from "../../components/Common/AlertToast";
import LoadingPage from "../../components/Common/LoadingPage";

function ReadLocationManagement() {
  const { id } = useParams();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const res = await getLocationById(id);
        setLocation(res.data);
      } catch (error) {
        setToast({
          show: true,
          message: "Failed to load location details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  // 🔄 PAGE LOADER
  if (loading) return <LoadingPage />;

  if (!location) return null;

  return (
    <>
      {/* 🔔 TOAST */}
      <AlertToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="d-flex justify-content-center align-items-center bg-light min-vh-100 py-4">
        <div className="w-100 rounded bg-white border shadow p-4" style={{ maxWidth: "700px" }}>
          <h3 className="text-center mb-4">Location Details</h3>

          <div className="row g-3">
            <div className="col-12">
              <strong>Name:</strong>
              <div>{location.name || "-"}</div>
            </div>

            <div className="col-12">
              <strong>Description:</strong>
              <div>{location.description || "-"}</div>
            </div>

            <div className="col-12 col-md-6">
              <strong>Code:</strong>
              <div>{location.locationCode || "-"}</div>
            </div>

            <div className="col-12 col-md-6">
              <strong>Pincode:</strong>
              <div>{location.pincode || "-"}</div>
            </div>

            <div className="col-12 col-md-6">
              <strong>Latitude:</strong>
              <div>{location.latitude}</div>
            </div>

            <div className="col-12 col-md-6">
              <strong>Longitude:</strong>
              <div>{location.longitude}</div>
            </div>
          </div>

          <div className="text-end mt-4">
            <Link to="/management/locations" className="btn btn-secondary">
              Back
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReadLocationManagement;
