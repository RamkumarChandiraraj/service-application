import React, { useEffect, useState } from "react";
import { userSearch } from "../../../api/UsersearchApi"; // POST API
import LoadingPage from "../../Common/LoadingPage";

const Vendors = ({ searchPayload }) => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

              <p className="vendor-description"> Call Now{vendor.mobile}</p>
              
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
