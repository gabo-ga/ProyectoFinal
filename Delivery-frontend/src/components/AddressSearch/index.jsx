import React, { useState, useRef, useCallback } from "react";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import styles from "./index.module.css";

const libraries = ["places"]; // Necesitamos 'places' para usar Autocomplete

function AddressSearch({ onPlaceSelected }) {
  const [address, setAddress] = useState("");
  const searchBoxRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Función que maneja el cambio de lugar seleccionado
  const handlePlaceChanged = useCallback(() => {
    const place = searchBoxRef.current?.getPlaces();
    if (place && place.length > 0) {
      const selectedPlace = place[0];
      const formattedAddress = selectedPlace.formatted_address;
      setAddress(formattedAddress);
      onPlaceSelected(formattedAddress); // Enviar solo la dirección al componente padre
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
    className={styles.inputStyles}
  />
);

export default AddressSearch;
