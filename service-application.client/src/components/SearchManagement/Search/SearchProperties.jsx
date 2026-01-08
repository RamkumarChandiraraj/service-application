import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAllCategories } from "../../../api/categoryApi";
import { getAllServices } from "../../../api/serviceList";
import { getAllLocations } from "../../../api/locationList";

import CurrentLocation from "../../Location/CurrentLocation";
import LoadingPage from "../../Common/LoadingPage";
import MultiSelect from "../../Common/MultiSelect";
import "./SearchProperties.css";

/* ---------- HELPERS ---------- */
const slugify = (text = "") =>
  text.toLowerCase().replace(/\s+/g, "-");

const ALL_OPTION = { id: "__ALL__", label: "All" };

const SearchProperties = ({ onSearch, onValidationError }) => {
  const [searchParams] = useSearchParams();

  const categorySlugs = searchParams.get("category")?.split(",") || [];
  const serviceSlugs = searchParams.get("service")?.split(",") || [];

  /* ---------------- DATA ---------------- */
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);

  /* ---------------- SELECTIONS ---------------- */
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);

  const [locationMode, setLocationMode] = useState("current");
  const [currentCoords, setCurrentCoords] = useState({ lat: null, lon: null });

  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- ERRORS ---------------- */
  const [categoryError, setCategoryError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [locationError, setLocationError] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [catRes, servRes, locRes] = await Promise.all([
          getAllCategories(),
          getAllServices(),
          getAllLocations(),
        ]);

        setCategories(catRes?.data || []);
        setServices(servRes?.data || []);
        setLocations(locRes?.data || []);
      } catch (err) {
        console.error("Failed to load search filters", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* -------- FILTER SERVICES BY CATEGORY -------- */
  useEffect(() => {
    if (!selectedCategoryIds.length) {
      setFilteredServices([]);
      setSelectedServiceIds([]);
      return;
    }

    const selectedCategoryNames = categories
      .filter(c => selectedCategoryIds.includes(Number(c.id)))
      .map(c => (c.title || c.name)?.toLowerCase());

    const filtered = services.filter(s =>
      selectedCategoryNames.includes(s.categoryName?.toLowerCase())
    );

    setFilteredServices(filtered);

    setSelectedServiceIds(prev =>
      prev.filter(id => filtered.some(s => Number(s.id) === id))
    );
  }, [selectedCategoryIds, categories, services]);

  /* ---------------- VALIDATION ---------------- */
  const isSearchDisabled =
    loading ||
    !selectedCategoryIds.length ||
    !selectedServiceIds.length ||
    (locationMode === "choose" && !selectedLocationIds.length) ||
    (locationMode === "current" &&
      (currentCoords.lat === null || currentCoords.lon === null));

  /* ---------------- SEARCH ---------------- */
  const handleSearch = () => {
    setCategoryError("");
    setServiceError("");
    setLocationError("");

    let hasError = false;

    if (!selectedCategoryIds.length) {
      setCategoryError("Select at least one category");
      hasError = true;
    }
    if (!selectedServiceIds.length) {
      setServiceError("Select at least one service");
      hasError = true;
    }
    if (locationMode === "choose" && !selectedLocationIds.length) {
      setLocationError("Select at least one location");
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

    onSearch?.({
      CategoryIds: selectedCategoryIds.map(Number),
      ServiceIds: selectedServiceIds.map(Number),
      LocationIds:
        locationMode === "choose"
          ? selectedLocationIds.map(Number)
          : [],
      Latitude:
        locationMode === "current" ? Number(currentCoords.lat) : 0,
      Longitude:
        locationMode === "current" ? Number(currentCoords.lon) : 0,
    });
  };

  if (loading) return <LoadingPage />;

  /* ---------------- UI ---------------- */
  return (
    <section className="sp-search-wrapper">
      <div className="sp-search-title">
        <h2>Search Vendors</h2>
        <span className="sp-search-dot" />
      </div>

      <div className="sp-search-box">
        <div className="sp-search-row">

          {/* CATEGORY */}
          <MultiSelect
            label="Category"
            options={[
              ALL_OPTION,
              ...categories.map(c => ({
                id: c.id,
                label: c.title || c.name,
              })),
            ]}
            value={selectedCategoryIds}
            onChange={(ids) =>
              ids.includes("__ALL__")
                ? setSelectedCategoryIds(categories.map(c => Number(c.id)))
                : setSelectedCategoryIds(ids)
            }
            placeholder="Select Categories"
          />
          {categoryError && <span className="error">{categoryError}</span>}

          {/* SERVICE */}
          <MultiSelect
            label="Service"
            options={[
              ALL_OPTION,
              ...filteredServices.map(s => ({
                id: s.id,
                label: s.name,
              })),
            ]}
            value={selectedServiceIds}
            onChange={(ids) =>
              ids.includes("__ALL__")
                ? setSelectedServiceIds(filteredServices.map(s => Number(s.id)))
                : setSelectedServiceIds(ids)
            }
            placeholder="Select Services"
          />
          {serviceError && <span className="error">{serviceError}</span>}

          {/* LOCATION MODE */}
          <div className="sp-location-box">
            <label>
              <input
                type="radio"
                checked={locationMode === "current"}
                onChange={() => setLocationMode("current")}
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

            {locationMode === "choose" && (
              <MultiSelect
                label="Location"
                options={[
                  ALL_OPTION,
                  ...locations.map(l => ({
                    id: l.id,
                    label: l.name,
                  })),
                ]}
                value={selectedLocationIds}
                onChange={(ids) =>
                  ids.includes("__ALL__")
                    ? setSelectedLocationIds(locations.map(l => Number(l.id)))
                    : setSelectedLocationIds(ids)
                }
                placeholder="Select Locations"
              />
            )}

            {locationError && <span className="error">{locationError}</span>}
          </div>

          {/* SEARCH */}
          <button
            className="sp-search-btn"
            disabled={isSearchDisabled}
            onClick={handleSearch}
          >
            🔍 SEARCH
          </button>

        </div>
      </div>
    </section>
  );
};

export default SearchProperties;
