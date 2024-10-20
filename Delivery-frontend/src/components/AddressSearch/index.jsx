import React, { useState, useRef } from "react";
import {
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const libraries = ["places"]; // Necesitamos 'places' para usar Autocomplete

function AddressSearch({ onPlaceSelected }) {
  const [address, setAddress] = useState("");
  const searchBoxRef = useRef(null);

  // Obtener la clave API de la variable de entorno
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Cargar el script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  if (loadError) {
    return <div>Error al cargar Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Cargando...</div>;
  }

  const handlePlaceChanged = () => {
    const place = searchBoxRef.current.getPlaces();
    if (place && place.length > 0) {
      const selectedPlace = place[0];
      setAddress(selectedPlace.formatted_address);
      onPlaceSelected(selectedPlace); // Enviar los detalles del lugar seleccionado al componente padre
    }
  };

  return (
    <div>
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Buscar dirección..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `100%`,
            height: `40px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `16px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </StandaloneSearchBox>
    </div>
  );
}

export default AddressSearch;
