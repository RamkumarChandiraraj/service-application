// src/components/SearchManagement/Vendors/Vendors.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ FIX: add this
import { userSearch } from "../../../api/UsersearchApi";
import LoadingPage from "../../Common/LoadingPage";

const Vendors = ({ searchPayload }) => {
  const navigate = useNavigate(); // ✅ FIX: add this

  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch vendors when searchPayload changes
  useEffect(() => {
    const fetchVendors = async () => {
      if (!searchPayload) return;

      setLoading(true);
      try {
        const vendorResponse = await userSearch(searchPayload);
        setVendors(vendorResponse?.data || []);
      } catch (err) {
        console.error("Failed to fetch vendors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [searchPayload]);

  const filteredVendors = Array.isArray(vendors)
    ? vendors.filter((vendor) =>
        vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Open OpenStreetMap directions in a new tab
  const handleDirections = (vendor) => {
    if (!vendor.latitude || !vendor.longitude) {
      alert("Vendor location not available.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const startLat = position.coords.latitude;
        const startLon = position.coords.longitude;
        const destLat = vendor.latitude;
        const destLon = vendor.longitude;

        const osmUrl = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${startLat},${startLon};${destLat},${destLon}`;
        window.open(osmUrl, "_blank");
      },
      () => {
        const osmUrl = `https://www.openstreetmap.org/?mlat=${vendor.latitude}&mlon=${vendor.longitude}#map=18/${vendor.latitude}/${vendor.longitude}`;
        window.open(osmUrl, "_blank");
      }
    );
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="vendor-wrapper">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by company name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="vendor-container">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <div className="vendor-card" key={vendor.id}>
              <h2 className="vendor-name">{vendor.companyName}</h2>

              <p className="vendor-location">
                <i className="bi bi-geo-alt location-icon"></i>
                {vendor.locationName || "Unknown"}
              </p>

              <p className="vendor-services">
                {vendor.serviceName || "Unknown Service"}
              </p>

              <p className="vendor-description">{vendor.description}</p>

              <p className="vendor-description">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    console.log("FULL VENDOR OBJECT:", vendor);
                    navigate(`/chat/${vendor.phoneNumber}`);
                  }}
                >
                  💬 Chat Now
                </button>
              </p>
              <p className="vendor-description">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleDirections(vendor)}
                >
                  Get Directions
                </button>
              </p>
            </div>
          ))
        ) : (
          <p className="no-results">No vendors found.</p>
        )}
      </div>
    </div>
  );
};

export default Vendors;
