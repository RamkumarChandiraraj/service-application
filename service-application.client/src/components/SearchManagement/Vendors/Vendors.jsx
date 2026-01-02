import React, { useEffect, useState } from "react";
import { vendorSampleData } from "./vendor"; 
import { getAllLocations } from "../../../api/locationList";
import { getAllServices } from "../../../api/serviceList";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState({});
  const [services, setServices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setVendors(vendorSampleData);

        // Fetch locations and services
        const locationData = (await getAllLocations()).data; 
        const serviceData = (await getAllServices()).data;

        console.log("Locations:", locationData);
        console.log("Services:", serviceData);

        const locationMap = {};
        locationData.forEach(loc => (locationMap[loc.id] = loc.name));

        const serviceMap = {};
        serviceData.forEach(ser => (serviceMap[ser.id] = ser.name));

        setLocations(locationMap);
        setServices(serviceMap);
      } catch (error) {
        console.error("Failed to fetch locations or services", error);
      }
    };

    fetchData();
  }, []);

  const filteredVendors = vendors.filter(vendor =>
    vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
