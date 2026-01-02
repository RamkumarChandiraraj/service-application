import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllCategories } from "../../../api/categoryApi";
import { getAllServices } from "../../../api/serviceList";
import { getAllLocations } from "../../../api/locationList";
import CurrentLocation from "../../Location/CurrentLocation";
import LoadingPage from "../../Common/LoadingPage";

const SearchProperties = ({ onSearch, onValidationError }) => {
  const [searchParams] = useSearchParams();

  const initialCategorySlug = searchParams.get("category") || "";
  const initialServiceSlug = searchParams.get("service") || "";
  const initialLocation = searchParams.get("location") || "";

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(initialServiceSlug);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const [locationMode, setLocationMode] = useState("current");
  const [currentCoords, setCurrentCoords] = useState({ lat: null, lon: null });

  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryError, setCategoryError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [locationError, setLocationError] = useState("");

  // Fetch filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const [catRes, serviceRes, locRes] = await Promise.all([
          getAllCategories(),
          getAllServices(),
          getAllLocations(),
        ]);

        setCategories(catRes?.data || []);
        setServices(serviceRes?.data || []);
        setLocations(locRes?.data || []);

        // ✅ Return the fetched data
        return {
          categories: catRes?.data || [],
          services: serviceRes?.data || [],
          locations: locRes?.data || [],
        };
      } catch (err) {
        console.error(err);
        return {
          categories: [],
          services: [],
          locations: [],
        };
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Filter services by category
  useEffect(() => {
    if (!selectedCategorySlug) {
      setFilteredServices([]);
      setSelectedServiceSlug("");
      return;
    }

    const categoryObj = categories.find(
      (c) => c.link?.toLowerCase() === selectedCategorySlug.toLowerCase()
    );

    if (!categoryObj) return;

    const filtered = services.filter(
      (s) =>
        s.categoryName?.toLowerCase() ===
        (categoryObj.title || categoryObj.name)?.toLowerCase()
    );

    setFilteredServices(filtered);

    if (
      selectedServiceSlug &&
      !filtered.some(
        (s) => s.name.toLowerCase().replace(/\s+/g, "-") === selectedServiceSlug
      )
    ) {
      setSelectedServiceSlug("");
    }
  }, [selectedCategorySlug, categories, services, selectedServiceSlug]);

  const isSearchDisabled =
    loading ||
    !selectedCategorySlug ||
    !selectedServiceSlug ||
    (locationMode === "choose" && !selectedLocation) ||
    (locationMode === "current" &&
      (currentCoords.lat === null || currentCoords.lon === null));

  const handleSearch = () => {
    setCategoryError("");
    setServiceError("");
    setLocationError("");

    let hasError = false;

    const categoryObj = categories.find(
      (c) => c.link?.toLowerCase() === selectedCategorySlug.toLowerCase()
    );

    if (!categoryObj) {
      setCategoryError("Category is required");
      hasError = true;
    }

    const serviceObj = services.find(
      (s) => s.name.toLowerCase().replace(/\s+/g, "-") === selectedServiceSlug
    );

    if (!serviceObj) {
      setServiceError("Service is required");
      hasError = true;
    }

    if (locationMode === "choose" && !selectedLocation) {
      setLocationError("Location is required");
      hasError = true;
    }

    if (
      locationMode === "current" &&
      (currentCoords.lat === null || currentCoords.lon === null)
    ) {
      setLocationError("Current location not available");
      hasError = true;
    }

    if (hasError) {
      onValidationError?.("Please fix the errors above");
      return;
    }

    const selectedLoc = locations.find((l) => l.name === selectedLocation);

    const latitude =
      locationMode === "current"
        ? Number(currentCoords.lat)
        : Number(selectedLoc?.latitude ?? 0);

    const longitude =
      locationMode === "current"
        ? Number(currentCoords.lon)
        : Number(selectedLoc?.longitude ?? 0);

    // ✅ FINAL PAYLOAD MATCHING C# DTO
    onSearch?.({
      CategoryIds: [Number(categoryObj.id)],
      ServiceIds: [Number(serviceObj.id)],
      Latitude: latitude,
      Longitude: longitude,
    });
  };

  return (
    <section className="sp-search-wrapper" style={{ position: "relative" }}>
      {loading && <LoadingPage />}

      <div className="sp-search-title">
        <h2>Search Vendors</h2>
        <span className="sp-search-dot"></span>
      </div>

      <div className="sp-search-box">
        <div className="sp-search-row">
          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              className="sp-select"
              value={selectedCategorySlug}
              onChange={(e) => setSelectedCategorySlug(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.link}>
                  {cat.title || cat.name}
                </option>
              ))}
            </select>
            {categoryError && <span className="error">{categoryError}</span>}
          </div>

          {/* Service */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select
              className="sp-select"
              value={selectedServiceSlug}
              onChange={(e) => setSelectedServiceSlug(e.target.value)}
              disabled={loading || filteredServices.length === 0}
            >
              <option value="">Select Service</option>
              {filteredServices.map((s) => (
                <option
                  key={s.id}
                  value={s.name.toLowerCase().replace(/\s+/g, "-")}
                >
                  {s.name}
                </option>
              ))}
            </select>
            {serviceError && <span className="error">{serviceError}</span>}
          </div>

          {/* Location */}
          <div
            className="sp-location-box"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              <label>
                <input
                  type="radio"
                  checked={locationMode === "current"}
                  onChange={() => {
                    setLocationMode("current");
                    setSelectedLocation("");
                  }}
                />
                Current Location
              </label>

              <label>
                <input
                  type="radio"
                  checked={locationMode === "choose"}
                  onChange={() => setLocationMode("choose")}
                />
                Choose Location
              </label>
            </div>

            {locationMode === "current" && (
              <CurrentLocation onLocationSelect={setCurrentCoords} />
            )}

            {locationMode === "choose" && (
              <select
                className="sp-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            )}

            {locationError && <span className="error">{locationError}</span>}
          </div>

          <button
            className={`sp-search-btn ${isSearchDisabled ? "disabled" : ""}`}
            onClick={handleSearch}
            disabled={isSearchDisabled}
          >
            🔍 SEARCH
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchProperties;
