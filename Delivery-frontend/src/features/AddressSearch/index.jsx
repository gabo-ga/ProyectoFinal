import React, { useState, useRef, useCallback, useEffect } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import SearchInput from "../../components/AddressInput/index";
import { useGoogleMapsScript } from "../../api/mapService";

function AddressSearch({ onPlaceSelected, initialAddress = "" }) {
  const [address, setAddress] = useState(initialAddress || "");
  const searchBoxRef = useRef(null);

  useEffect(() => {
    setAddress(initialAddress || "");
  }, [initialAddress]);

  const { isLoaded, loadError } = useGoogleMapsScript();

  const handlePlaceChanged = useCallback(() => {
    const place = searchBoxRef.current?.getPlaces();
    console.log("Lugares obtenidos:", place);

    if (place && place.length > 0) {
      const selectedPlace = place[0];
      console.log("Lugar seleccionado:", selectedPlace);

      const formattedAddress = selectedPlace.formatted_address;
      const lat = selectedPlace.geometry?.location?.lat();
      const lng = selectedPlace.geometry?.location?.lng();

      if (lat && lng) {
        setAddress(formattedAddress);
        onPlaceSelected({
          address: formattedAddress,
          lat: lat,
          lng: lng,
        });
      } else {
        console.error("Coordenadas no encontradas en el lugar seleccionado.");
      }
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
