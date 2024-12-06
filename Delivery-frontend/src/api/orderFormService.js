
import { fetchOrigenFijo, fetchPedidoById } from "../api/apiService";
import axiosInstance from "../axiosInstance";

// Obtener origen fijo
export const obtenerOrigenFijo = async (setFormData) => {
  try {
    const data = await fetchOrigenFijo();
    if (data.direccion_origen && data.punto_origen) {
      const [lng, lat] = data.punto_origen
        .replace("POINT (", "")
        .replace(")", "")
        .split(" ")
        .map(parseFloat);
      setFormData((prevData) => ({
        ...prevData,
        origen_id: data.id,
        direccion_origen: data.direccion_origen,
        coordenadas_origen_lat: lat,
        coordenadas_origen_lng: lng,
      }));
    }
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * Obtener la dirección de un destino por ID.
 * @param {number|string} destinoId - ID del destino.
 * @returns {Promise<string>} - Dirección del destino.
 */
export const fetchDireccionByDestinoId = async (destinoId) => {
  try {
    const response = await axiosInstance.get(`/api/ubicaciones/${destinoId}/destino/`);
    const direccion = response.data.direccion; 
    return direccion;
  } catch (error) {
    console.error("Error al obtener la dirección del destino:", error);
    throw error;
  }
};

// Cargar pedido
export const cargarPedido = async (id, setFormData) => {
  try {
    const data = await fetchPedidoById(id);
    setFormData({
      cliente_id: data.cliente || "",
      conductor: data.conductor || null,
      origen: data.origen || "",
      destino_direccion: data.destino_data?.direccion || "",
      estado: data.estado || "",
      precio: data.precio || "",
      fecha_entrega: data.fecha_entrega || "",
      detalle: data.detalle || "",
    });
  } catch (error) {
    console.error(error.message);
  }
};


// Manejar el envío de datos
export const handleOrderSubmit = async (formData, pedidoId = null) => {
  const dataToSend = {
    cliente: formData.cliente_id, 
    conductor: formData.conductor,
    origen: formData.origen_id,
    destino: formData.destino_id,
    estado: formData.estado_id, 
    precio: parseFloat(formData.precio),
    detalle: formData.detalle, 
  };
  

  // Eliminar campos redundantes
  delete dataToSend.coordenadas_origen_lat;
  delete dataToSend.coordenadas_origen_lng;
  delete dataToSend.coordenadas_destino_lat;
  delete dataToSend.coordenadas_destino_lng;

  console.log("Datos enviados al backend:", dataToSend);

  try {
    let response;
    if (pedidoId) {
      // Actualizar pedido existente
      response = await axiosInstance.put(`api/pedidos/${pedidoId}/editar`, dataToSend);
    } else {
      // Crear nuevo pedido
      response = await axiosInstance.post("api/pedidos/", dataToSend);
    }

    if (response.status === 201 || response.status === 200) {
      alert(`Pedido ${pedidoId ? "actualizado" : "añadido"} con éxito`);
      return true;
    } else {
      console.error("Error al enviar el formulario:", response.statusText);
      alert("Error al enviar el formulario");
      return false;
    }
  } catch (error) {
    console.error("Error de red:", error.response?.data || error.message);
    alert("Error al enviar el formulario: " + (error.response?.data?.detail || error.message));
    return false;
  }
};

