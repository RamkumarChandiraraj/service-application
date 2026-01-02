import React, { useState } from "react";
import SearchProperties from "../SearchManagement/Search/SearchProperties";
import Vendors from "../SearchManagement/Vendors/Vendors";
import LoadingPage from "../Common/LoadingPage"; // Loading component

const SearchVendors = () => {
  const [showVendors, setShowVendors] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchPayload, setSearchPayload] = useState(null);
  const [loadingVendors, setLoadingVendors] = useState(false);

  const handleSearch = async (payload) => {
    setSearchError("");
    setLoadingVendors(true);
    setShowVendors(false);

    try {
      // Simulate API call delay
      await new Promise((res) => setTimeout(res, 1000)); // Replace with your API call
      setSearchPayload(payload);
      setShowVendors(true);
    } catch (error) {
      setSearchError("Failed to load vendors. Please try again.");
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleValidationError = (message) => {
    setShowVendors(false);
    setSearchError(message);
  };

  return (
    <div>
      <SearchProperties
        onSearch={handleSearch}
        onValidationError={handleValidationError}
      />

      {searchError && (
        <p style={{ color: "red", marginTop: "10px" }}>{searchError}</p>
      )}

      {loadingVendors && <LoadingPage />}

      {showVendors && !loadingVendors && <Vendors searchPayload={searchPayload} />}
    </div>
  );
};

export default SearchVendors;
