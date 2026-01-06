import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAllCategories } from "../../../api/categoryApi";
import { getAllServices } from "../../../api/serviceList";
import { getAllLocations } from "../../../api/locationList";

import CurrentLocation from "../../Location/CurrentLocation";
import LoadingPage from "../../Common/LoadingPage";
import MultiSelect from "../../Common/MultiSelect";

/* ---------- HELPERS ---------- */
const slugify = (text = "") =>
    text.toLowerCase().replace(/\s+/g, "-");

const SearchProperties = ({ onSearch, onValidationError }) => {
    const [searchParams] = useSearchParams();

    /* ---------- URL PARAMS ---------- */
    const categoryParam = searchParams.get("category"); // mechanic,plumber
    const serviceParam = searchParams.get("service");   // two-wheeler-service
    const initialLocation = searchParams.get("location") || "";

    const categorySlugs = categoryParam
        ? categoryParam.split(",").map(s => s.toLowerCase())
        : [];

    const serviceSlugs = serviceParam
        ? serviceParam.split(",").map(s => s.toLowerCase())
        : [];

    /* ---------------- DATA ---------------- */
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [locations, setLocations] = useState([]);

    /* ---------------- SELECTIONS ---------------- */
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);

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

                const catData = catRes?.data || [];
                const servData = servRes?.data || [];

                setCategories(catData);
                setServices(servData);
                setLocations(locRes?.data || []);

                /* ✅ DEFAULT CATEGORY FROM URL */
                const defaultCategoryIds = catData
                    .filter(c => categorySlugs.includes(c.link?.toLowerCase()))
                    .map(c => Number(c.id));

                setSelectedCategoryIds(defaultCategoryIds);

                /* ✅ DEFAULT SERVICE FROM URL */
                const defaultServiceIds = servData
                    .filter(s => serviceSlugs.includes(slugify(s.name)))
                    .map(s => Number(s.id));

                setSelectedServiceIds(defaultServiceIds);

            } catch (err) {
                console.error("Failed to load search filters", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* -------- FILTER SERVICES BASED ON CATEGORY -------- */
    useEffect(() => {
        if (selectedCategoryIds.length === 0) {
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

        /* remove invalid services */
        setSelectedServiceIds(prev =>
            prev.filter(id => filtered.some(s => Number(s.id) === id))
        );
    }, [selectedCategoryIds, categories, services]);

    /* ---------------- VALIDATION ---------------- */
    const isSearchDisabled =
        loading ||
        selectedCategoryIds.length === 0 ||
        selectedServiceIds.length === 0 ||
        (locationMode === "choose" && !selectedLocation) ||
        (locationMode === "current" &&
            (currentCoords.lat === null || currentCoords.lon === null));

    /* ---------------- SEARCH ---------------- */
    const handleSearch = () => {
        setCategoryError("");
        setServiceError("");
        setLocationError("");

        let hasError = false;

        if (selectedCategoryIds.length === 0) {
            setCategoryError("Select at least one category");
            hasError = true;
        }

        if (selectedServiceIds.length === 0) {
            setServiceError("Select at least one service");
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

        const selectedLoc = locations.find(l => l.name === selectedLocation);

        const latitude =
            locationMode === "current"
                ? Number(currentCoords.lat)
                : Number(selectedLoc?.latitude ?? 0);

        const longitude =
            locationMode === "current"
                ? Number(currentCoords.lon)
                : Number(selectedLoc?.longitude ?? 0);

        onSearch?.({
            CategoryIds: selectedCategoryIds.map(Number),
            ServiceIds: selectedServiceIds.map(Number),
            Latitude: latitude,
            Longitude: longitude,
        });
    };

    /* ---------------- UI ---------------- */
    return (
        <section className="sp-search-wrapper" style={{ position: "relative" }}>
            {loading && <LoadingPage />}

            <div className="sp-search-title">
                <h2>Search Vendors</h2>
                <span className="sp-search-dot"></span>
            </div>

            <div className="sp-search-box">
                <div className="sp-search-row">

                    {/* CATEGORY */}
                    <div>
                        <MultiSelect
                            label="Category"
                            options={categories.map(c => ({
                                id: c.id,
                                label: c.title || c.name,
                            }))}
                            value={selectedCategoryIds}
                            onChange={setSelectedCategoryIds}
                            placeholder="Select Categories"
                        />
                        {categoryError && (
                            <span className="error">{categoryError}</span>
                        )}
                    </div>

                    {/* SERVICE */}
                    <div>
                        <MultiSelect
                            label="Service"
                            options={filteredServices.map(s => ({
                                id: s.id,
                                label: s.name,
                            }))}
                            value={selectedServiceIds}
                            onChange={setSelectedServiceIds}
                            placeholder="Select Services"
                            disabled={filteredServices.length === 0}
                        />
                        {serviceError && (
                            <span className="error">{serviceError}</span>
                        )}
                    </div>

                    {/* LOCATION */}
                    <div className="sp-location-box">
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

                        {locationMode === "current" && (
                            <CurrentLocation onLocationSelect={setCurrentCoords} />
                        )}

                        {locationMode === "choose" && (
                            <select
                                className="sp-select"
                                value={selectedLocation}
                                onChange={(e) =>
                                    setSelectedLocation(e.target.value)
                                }
                            >
                                <option value="">Select Location</option>
                                {locations.map(l => (
                                    <option key={l.id} value={l.name}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {locationError && (
                            <span className="error">{locationError}</span>
                        )}
                    </div>

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
