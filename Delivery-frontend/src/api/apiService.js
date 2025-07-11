// Asegúrate de importar axiosInstance desde la ruta correcta
import axiosInstance from '../axiosInstance';


// Función para contar los pedidos
export const fetchPedidosEnCurso = async (estado = 1) => {
  try {
    const response = await axiosInstance.get(`/api/pedidos/count/?estado=${estado}`);
    return response.data.count;
  } catch (error) {
    console.error("Error al obtener los pedidos en curso:", error);
    throw error;
  }
};


// Función para contar los vehículos
export const fetchVehiculosDisponibles = async () => {
  try {
    const response = await axiosInstance.get("/api/vehiculos/count/");
    return response.data.count;
  } catch (error) {
    console.error("Error al obtener los vehículos disponibles:", error);
    throw error;
  }
};

export const fetchPedidosCancelados = async () => {
  try {
    const response = await axiosInstance.get("/api/pedidos/count/", {
      params: { estado: "cancelado" },
    });
    return response.data.count; // Devuelve el conteo
  } catch (error) {
    console.error("Error al obtener los pedidos cancelados:", error);
    throw error;
  }
};

// Función para obtener pedidos entregados
export const fetchPedidosEntregados = async () => {
  try {
    const response = await axiosInstance.get("/api/pedidos/count-entregados/");
    return response.data.count; // Devuelve el conteo
  } catch (error) {
    console.error("Error al obtener los pedidos entregados:", error);
    throw error;
  }
};
//funcion para llamar conductores con ordenes
export const fetchDriversWithActiveOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/usuarios/conductores/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener conductores:", error);
    throw error;
  }
};

export const fetchActiveOrders = async (conductorId) => {
  try {
    let url = "/api/pedidos/en-curso/?estado=pendiente";

    if(conductorId && conductorId !== 6){
      url += `&conductor_id=${conductorId}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar los pedidos');
  }
};

export const fetchDrivers = async () => {
  try {
    const response = await axiosInstance.get('/api/usuarios/conductores/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los conductores:', error);
    throw error;
  }
};


export const fetchPedidos = async () => {
  try {
    const response = await axiosInstance.get('/api/pedidos/detalle-pedidos/');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los pedidos');
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/pedidos/${id}/`);
    return response.status === 204;
  } catch (error) {
    throw new Error('Error al eliminar el pedido');
  }
};

export const fetchDireccionOrigen = async () => {
  try {
    const response = await axiosInstance.get('/api/configuracion/');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar la configuración');
  }
};

export const saveDireccionOrigen = async (direccionOrigenData) => {
  try {
    const response = await axiosInstance.patch('/api/configuracion/guardar-origen/', direccionOrigenData);
    return response.data;
  } catch (error) {
    throw new Error('Error al guardar la configuración');
  }
};

export const fetchClientes = async () => {
  try {
    const response = await axiosInstance.get('/api/clientes/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    throw error;
  }
};

// Obtener coordenadas de pedidos
export const fetchPedidosCoordenadas = async (conductorId) => {
  try {
    let url = "api/pedidos/coordenadas";

    if(conductorId){
      url += `?conductor_id=${conductorId}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    throw error;
  }
};

// Servicios del formulario de pedidos
export const fetchOrigenFijo = async () => {
  try {
    const response = await axiosInstance.get('/api/configuracion/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la dirección de origen:', error);
    throw error;
  }
};

export const fetchPedidoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/pedidos/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    throw error;
  }
};

export const saveOrUpdatePedido = async (data, id = null) => {
  const url = id ? `/pedidos/${id}/` : '/pedidos/';
  const method = id ? 'PUT' : 'POST';
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
    });
    return response;
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    throw error;
  }
};

export const fetchUserById = async () => {
  try {
    const response = await axiosInstance.get('/api/usuarios/6/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
};

export const fetchCompletedOrders = async () => {
  try {
    const response = await axiosInstance.get('/api/pedidos/en-curso/?estado=entregado');
    return response.data;
  } catch (error) {
    console.error('Error al cargar los pedidos completados:', error);
    throw error;
  }
};

export const fetchOrderDetailsById = async (id) => {
  try {
    const response = await axiosInstance.get("/api/pedidos/en-curso/");
    const orders = response.data;
    const selectedOrder = orders.find((order) => order.pedido_id === parseInt(id));
    if (!selectedOrder) {
      throw new Error("Pedido no encontrado");
    }
    return selectedOrder;
  } catch (error) {
    console.error("Error al obtener los detalles del pedido:", error);
    throw error;
  }
};

export const updateOrderStatusById = async (id, nuevoEstado) => {
  try {
    const response = await axiosInstance.patch(`/api/pedidos/${id}/actualizar-estado/`, {
      estado_id: nuevoEstado,
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    throw error;
  }
};

export const crearUbicacion = async (direccion, lat, lng) => {
  try {
    const response = await axiosInstance.post('api/ubicaciones/', {
      direccion,
      coordenadas_input: {
        lat: lat,
        lng: lng,
      },
    });
    return response.data.id;
  } catch (error) {
    console.error("Error al crear ubicación:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchAnalisisPedidosPorFecha = async ({ fechaInicio, fechaFin } = {}) => {
  try {
    let url = '/api/analisis-pedido/rango_fechas/';
    const params = new URLSearchParams();

    if (fechaInicio) {
      params.append('fecha_inicio', fechaInicio);
    }
    if (fechaFin) {
      params.append('fecha_fin', fechaFin);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('No se encontraron registros:', error);
  }
};

