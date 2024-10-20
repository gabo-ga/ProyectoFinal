import React, { useState, useRef, useCallback } from "react";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const libraries = ["places"]; // Necesitamos 'places' para usar Autocomplete

function AddressSearch({ onPlaceSelected }) {
  const [address, setAddress] = useState("");
  const searchBoxRef = useRef(null);

  // Cargar la API de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Función que maneja el cambio de lugar seleccionado
  const handlePlaceChanged = useCallback(() => {
    const place = searchBoxRef.current?.getPlaces();
    if (place && place.length > 0) {
      const selectedPlace = place[0];
      setAddress(selectedPlace.formatted_address);
      onPlaceSelected(selectedPlace); // Enviar los detalles del lugar seleccionado al componente padre
    }
  }, [onPlaceSelected]);

  // Renderizado condicional de la carga y errores
  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div>
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
        <SearchInput value={address} onChange={setAddress} />
      </StandaloneSearchBox>
    </div>
  );
}

// Componente separado para el input
const SearchInput = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Buscar dirección..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={inputStyles}
  />
);

// Estilos del input
const inputStyles = {
  boxSizing: "border-box",
  border: "1px solid transparent",
  width: "100%",
  height: "40px",
  padding: "0 12px",
  borderRadius: "3px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  fontSize: "16px",
  outline: "none",
  textOverflow: "ellipses",
};

export default AddressSearch;
