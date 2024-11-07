// src/components/MapWithMarker.jsx
import React, { useEffect, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function MapWithMarker({ center, onMarkerPositionChanged }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && window.google) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new window.google.maps.Marker({
        position: center,
        map: mapRef.current,
        draggable: true,
      });

      markerRef.current.addListener("dragend", (event) => {
        const newPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        onMarkerPositionChanged(newPosition);
      });
    }
  }, [center, onMarkerPositionChanged]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
      options={{ streetViewControl: false, mapTypeControl: false }}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    />
  );
}

export default MapWithMarker;
