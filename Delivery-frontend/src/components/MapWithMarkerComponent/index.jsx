// src/components/MapWithMarker.jsx
import React, { useEffect, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["places"];

function MapWithMarker({ center, onMarkerPositionChanged }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Usa el hook useLoadScript para cargar el script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && mapRef.current && window.google) {
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
  }, [isLoaded, center, onMarkerPositionChanged]);

  if (loadError) return <p>Error al cargar Google Maps</p>;
  if (!isLoaded) return <p>Cargando mapa...</p>;

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
