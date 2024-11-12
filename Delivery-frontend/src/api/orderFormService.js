
import { fetchOrigenFijo, fetchPedidoById } from "../api/apiService";

// Obtener origen fijo
export const obtenerOrigenFijo = async (setFormData) => {
  try {
    const data = await fetchOrigenFijo();
    if (data.direccion_origen && data.punto_origen) {
      const [lng, lat] = data.punto_origen
        .replace("SRID=4326;POINT (", "")
        .replace(")", "")
        .split(" ")
        .map(parseFloat);
      setFormData((prevData) => ({
        ...prevData,
        direccion_origen: data.direccion_origen,
        coordenadas_origen_lat: lat,
        coordenadas_origen_lng: lng,
      }));
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Cargar pedido
export const cargarPedido = async (id, setFormData) => {
  try {
    const data = await fetchPedidoById(id);
    setFormData({
      direccion_origen: data.direccion_origen || "",
      coordenadas_origen_lat: data.coordenadas_origen?.lat || "",
      coordenadas_origen_lng: data.coordenadas_origen?.lng || "",
      direccion_destino: data.direccion_destino || "",
      coordenadas_destino_lat: data.coordenadas_destino?.lat || "",
      coordenadas_destino_lng: data.coordenadas_destino?.lng || "",
      cliente: data.cliente || "",
      estado: data.estado || "",
      precio: data.precio || "",
      date: data.fecha_entrega ? data.fecha_entrega.split("T")[0] : "",
      time: data.fecha_entrega ? data.fecha_entrega.split("T")[1].substring(0, 5) : "",
      detalle: data.detalle || "",
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Manejar el envío de datos
export const handleOrderSubmit = async (formData) => {
  const dataToSend = {
    ...formData,
    coordenadas_origen: {
      lat: formData.coordenadas_origen_lat,
      lng: formData.coordenadas_origen_lng,
    },
    coordenadas_destino: {
      lat: formData.coordenadas_destino_lat,
      lng: formData.coordenadas_destino_lng,
    },
  };

  try {
    const response = await fetch("http://localhost:8000/api/v1/pedidos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      alert("Pedido añadido con éxito");
      return true;
    } else {
      console.error("Error al enviar el formulario:", response.statusText);
      alert("Error al enviar el formulario");
      return false;
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Error de red");
    return false;
  }
};
