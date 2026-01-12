import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ================= FIX LEAFLET DEFAULT MARKER ICON =================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ================= LOCATION MARKER COMPONENT =================
function LocationMarker({ position, setPosition, onSelect }) {
    // Handle map click safely
    useMapEvents({
        click(e) {
            const coords = { lat: e.latlng.lat, lon: e.latlng.lng };
            setPosition([coords.lat, coords.lon]);
            onSelect(coords);
        },
    });

    return position ? <Marker position={position} /> : null;
}

// ================= MAIN MAP PICKER COMPONENT =================
export default function OpenStreetMapPicker({
    latitude,
    longitude,
    onSelect,
    height = "350px",
    width = "100%",
}) {
    const [position, setPosition] = useState(
        latitude && longitude ? [latitude, longitude] : null
    );

    // Update marker if parent coordinates change
    useEffect(() => {
        if (latitude && longitude) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const initialCenter = position || [13.0827, 80.2707]; // default Chennai

    return (
        <MapContainer
            center={initialCenter}
            zoom={13}
            style={{ height, width }}
            scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />

            <LocationMarker
                position={position}
                setPosition={setPosition}
                onSelect={onSelect}
            />
        </MapContainer>
    );
}
