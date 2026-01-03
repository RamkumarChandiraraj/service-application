import React, { useEffect, useState } from "react";

const CurrentLocation = ({ onLocationSelect }) => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        setLocation(coords);
        setError(null);
        setLoading(false);

        // send location back to parent as object
        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permission denied. Please allow location access.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred.");
        }
      }
    );
  }, [onLocationSelect]);

  return null; // hidden component, no visible UI needed
};

export default CurrentLocation;
