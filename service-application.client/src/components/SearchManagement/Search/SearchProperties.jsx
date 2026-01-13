import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAllCategories } from "../../../api/categoryApi";
import { getAllServices } from "../../../api/serviceList";
import { getAllLocations } from "../../../api/locationList";

import "./SearchProperties.css";
import LoadingPage from "../../Common/LoadingPage";
import MultiSelect from "../../Common/MultiSelect";

/* ---------- HELPERS ---------- */
const ALL_OPTION = { id: "__ALL__", label: "All" };
const slugify = (text = "") => text.toLowerCase().replace(/\s+/g, "-");

const SearchProperties = ({ onSearch, onValidationError }) => {
  const [searchParams] = useSearchParams();

  /* ---------- URL PARAMS ---------- */
  const categorySlugs =
    searchParams.get("category")?.split(",").map(s => s.toLowerCase()) || [];
  const serviceSlugs =
    searchParams.get("service")?.split(",").map(s => s.toLowerCase()) || [];
  const locationSlugs =
    searchParams.get("location")?.split(",").map(s => s.toLowerCase()) || [];

  /* ---------- DATA ---------- */
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);

  /* ---------- SELECTIONS ---------- */
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);

  const [locationMode, setLocationMode] = useState("current");
  const [currentCoords, setCurrentCoords] = useState({ lat: null, lon: null });

  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- ERRORS ---------- */
  const [categoryError, setCategoryError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [locationError, setLocationError] = useState("");

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [catRes, servRes, locRes] = await Promise.all([
          getAllCategories(),
          getAllServices(),
          getAllLocations(),
        ]);

        const catData = catRes?.data || [];
        const servData = servRes?.data || [];
        const locData = locRes?.data || [];

        setCategories(catData);
        setServices(servData);
        setLocations(locData);

        /* DEFAULT CATEGORY FROM URL */
        setSelectedCategoryIds(
          catData
            .filter(c => categorySlugs.includes(c.link?.toLowerCase()))
            .map(c => Number(c.id))
        );

        /* DEFAULT SERVICE FROM URL */
        setSelectedServiceIds(
          servData
            .filter(s => serviceSlugs.includes(slugify(s.name)))
            .map(s => Number(s.id))
        );

        /* DEFAULT LOCATION FROM URL */
        if (locationSlugs.length) {
          setLocationMode("choose");
          setSelectedLocationIds(
            locData
              .filter(l => locationSlugs.includes(slugify(l.name)))
              .map(l => Number(l.id))
          );
        }
      } catch (err) {
        console.error("Failed to load search filters", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- CURRENT LOCATION ---------- */
  useEffect(() => {
    if (locationMode !== "current") return;

    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setCurrentCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setLocationError("Unable to fetch current location");
      },
      { enableHighAccuracy: true }
    );
  }, [locationMode]);

  /* ---------- FILTER SERVICES ---------- */
  useEffect(() => {
    if (!selectedCategoryIds.length) {
      setFilteredServices([]);
      setSelectedServiceIds([]);
      return;
    }

    const categoryNames = categories
      .filter(c => selectedCategoryIds.includes(Number(c.id)))
      .map(c => (c.title || c.name).toLowerCase());

    const filtered = services.filter(s =>
      categoryNames.includes(s.categoryName?.toLowerCase())
    );

    setFilteredServices(filtered);

    setSelectedServiceIds(prev =>
      prev.filter(id => filtered.some(s => Number(s.id) === id))
    );
  }, [selectedCategoryIds, categories, services]);

  /* ---------- VALIDATION ---------- */
  const isSearchDisabled =
    loading ||
    !selectedCategoryIds.length ||
    !selectedServiceIds.length ||
    (locationMode === "choose" && !selectedLocationIds.length) ||
    (locationMode === "current" &&
      (currentCoords.lat === null || currentCoords.lon === null));

  /* ---------- SEARCH ---------- */
  const handleSearch = () => {
    setCategoryError("");
    setServiceError("");
    setLocationError("");

    if (isSearchDisabled) {
      onValidationError?.("Please fill all required fields");
      return;
    }

    let latitude = 0;
    let longitude = 0;

    if (locationMode === "current") {
      latitude = currentCoords.lat;
      longitude = currentCoords.lon;
    } else {
      const loc = locations.find(l => l.id === selectedLocationIds[0]);
      latitude = loc?.latitude || 0;
      longitude = loc?.longitude || 0;
    }

    onSearch?.({
      CategoryIds: selectedCategoryIds,
      ServiceIds: selectedServiceIds,
      LocationIds: locationMode === "choose" ? selectedLocationIds : [],
      Latitude: latitude,
      Longitude: longitude,
    });
  };

  if (loading) return <LoadingPage />;

  return (
    <section className="sp-page">
      <div className="sp-container">
        <div className="sp-header-center">
          <h2>Search Vendors</h2>
          <div className="sp-divider"><span /></div>
        </div>

        <div className="sp-bar">

          {/* CATEGORY */}
          <div className="sp-col">
            <label>Category</label>
            <MultiSelect
              options={categories.map(c => ({
                id: c.id,
                label: c.title || c.name,
              }))}
              value={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
              placeholder="Select categories"
            />
          </div>

          {/* SERVICE */}
          <div className="sp-col">
            <label>Service</label>
            <MultiSelect
              options={filteredServices.map(s => ({
                id: s.id,
                label: s.name,
              }))}
              value={selectedServiceIds}
              onChange={setSelectedServiceIds}
              placeholder="Select services"
              disabled={!filteredServices.length}
            />
          </div>

          {/* LOCATION */}
          <div className="sp-col">
            <label>Location</label>

            <div className="sp-location-inline">
              <button
                title="Use current location"
                className={`sp-loc-btn ${locationMode === "current" ? "active" : ""}`}
                onClick={() => {
                  setLocationMode("current");
                  setSelectedLocationIds([]);
                }}
              >
                <i className="bi bi-geo-alt-fill" />
              </button>

              <button
                title="Choose location"
                className={`sp-loc-btn ${locationMode === "choose" ? "active" : ""}`}
                onClick={() => setLocationMode("choose")}
              >
                <i className="bi bi-list-check" />
              </button>

              {locationMode === "choose" && (
                <MultiSelect
                  options={[ ...locations.map(l => ({
                    id: l.id,
                    label: l.name,
                  }))]}
                  value={selectedLocationIds}
                  onChange={setSelectedLocationIds}
                  placeholder="Select location"
                />
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="sp-col sp-search-col">
            <button
              className="sp-search-btn"
              disabled={isSearchDisabled}
              onClick={handleSearch}
            >
              <i className="bi bi-search" /> Search
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SearchProperties;
