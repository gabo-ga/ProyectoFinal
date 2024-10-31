import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import styles from "./index.module.css";

const libraries = ["places"]; //libreria places

function AddressSearch({ onPlaceSelected, initialAddress = "" }) {
  const [address, setAddress] = useState("");
  const searchBoxRef = useRef(null);

  useEffect(() => {
    setAddress(initialAddress);
  }, [initialAddress]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  //funcion que maneja el cambio de lugar seleccionado
  const handlePlaceChanged = useCallback(() => {
    const place = searchBoxRef.current?.getPlaces();
    if (place && place.length > 0) {
      const selectedPlace = place[0];
      const formattedAddress = selectedPlace.formatted_address;
      const lat = selectedPlace.geometry.location.lat();
      const lng = selectedPlace.geometry.location.lng();
      setAddress(formattedAddress);
      onPlaceSelected({
        address: formattedAddress,
        lat: lat,
        lng: lng,
      });
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
