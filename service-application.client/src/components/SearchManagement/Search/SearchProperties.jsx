import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../api/categoryApi";
import { getAllServices } from "../../../api/serviceList";
import { getAllLocations } from "../../../api/locationList";

const SearchBar = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoryRes, serviceRes, locationRes] = await Promise.all([
          getAllCategories(),
          getAllServices(),
          getAllLocations(),
        ]);

        // 🔑 Extract correct array from API response
        setCategories(categoryRes?.Objectdata || []);
        setServices(serviceRes?.Objectdata || []);
        setLocations(locationRes?.Objectdata || []);
      } catch (error) {
        console.error("Failed to load search filters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleSearch = () => {
    const payload = {
      categoryId: selectedCategory,
      serviceId: selectedService,
      locationId: selectedLocation,
    };

    console.log("Search payload:", payload);
    // 👉 integrate search API or navigate with params
  };

  return (
    <section className="sp-search-wrapper">
      <div className="sp-search-title">
        <h2>Search Properties</h2>
        <span className="sp-search-dot"></span>
      </div>

      <div className="sp-search-box">
        <div className="sp-search-row">
          {/* Category Dropdown */}
          <select
            className="sp-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option
                key={cat.categoryId}
                value={cat.categoryId}
              >
                {cat.categoryName}
              </option>
            ))}
          </select>

          {/* Service Dropdown */}
          <select
            className="sp-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            disabled={loading}
          >
            <option value="">All Services</option>
            {services.map((service) => (
              <option
                key={service.serviceId}
                value={service.serviceId}
              >
                {service.serviceName}
              </option>
            ))}
          </select>

          {/* Location Dropdown */}
          <select
            className="sp-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={loading}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option
                key={loc.locationId}
                value={loc.locationId}
              >
                {loc.locationName}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button
            className="sp-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "LOADING..." : "🔍 SEARCH"}
          </button>
        </div>

        {/* More Options */}
        <div className="sp-more-options">+ MORE OPTIONS</div>
      </div>
    </section>
  );
};

export default SearchBar;
