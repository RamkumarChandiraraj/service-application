import React, { useState } from "react";

const CurrentLocation = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
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
  };

  return (
    <div>
      <h3>Current Location</h3>
      <button onClick={getLocation}>Get Location</button>

      {location.lat && location.lon && (
        <p>
          Latitude: {location.lat} <br />
          Longitude: {location.lon}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CurrentLocation;
