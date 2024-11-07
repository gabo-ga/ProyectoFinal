// src/components/AddressSearch.js
import React, { useState, useRef, useCallback, useEffect } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import SearchInput from "../../components/AddressInput/index"; // Importa el componente de entrada
import { useGoogleMapsScript } from "../../api/mapService"; // Importa el hook de carga de Google Maps

function AddressSearch({ onPlaceSelected, initialAddress = "" }) {
  const [address, setAddress] = useState("");
  const searchBoxRef = useRef(null);

  useEffect(() => {
    setAddress(initialAddress);
  }, [initialAddress]);

  const { isLoaded, loadError } = useGoogleMapsScript();

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

export default AddressSearch;
