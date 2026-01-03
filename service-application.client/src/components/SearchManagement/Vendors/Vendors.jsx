import React, { useEffect, useState } from "react";
import { getAllLocations } from "../../../api/locationList";
import { getAllServices } from "../../../api/serviceList";
import { userSearch } from "../../../api/UsersearchApi"; // POST API
import LoadingPage from "../../Common/LoadingPage"; // ✅ import loading

const Vendors = ({ searchPayload }) => {
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState({});
  const [services, setServices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchVendors = async () => {
      if (!searchPayload) return;

      setLoading(true); // start loading
      try {
        // Fetch vendors
        const vendorResponse = await userSearch(searchPayload);
        setVendors(vendorResponse?.data || []);

        // Fetch locations & services
        const [locationRes, serviceRes] = await Promise.all([
          getAllLocations(),
          getAllServices()
        ]);

        const locationMap = {};
        (locationRes?.data || []).forEach(loc => {
          locationMap[loc.id] = loc.name;
        });

        const serviceMap = {};
        (serviceRes?.data || []).forEach(ser => {
          serviceMap[ser.id] = ser.name;
        });

        setLocations(locationMap);
        setServices(serviceMap);

      } catch (err) {
        console.error("Failed to fetch vendors, locations, or services", err);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchVendors();
  }, [searchPayload]);

  const filteredVendors = Array.isArray(vendors)
    ? vendors.filter(vendor =>
        vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // ✅ Show loading until all data is fetched
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
          filteredVendors.map(vendor => (
            <div className="vendor-card" key={vendor.id}>
              <h2 className="vendor-name">{vendor.companyName}</h2>
              <p className="vendor-location">
                <i className="bi bi-geo-alt location-icon"></i>
                {locations[vendor.locationId] || "Unknown"}
              </p>
              <p className="vendor-services">
                {services[vendor.serviceId] || "Unknown Service"}
              </p>
              <p className="vendor-description">{vendor.description}</p>
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
