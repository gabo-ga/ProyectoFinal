// Asegúrate de importar axiosInstance desde la ruta correcta
import axiosInstance from '../axiosInstance';


export const fetchDriversWithActiveOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/conductores/con-activos/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener conductores:", error);
    throw error;
  }
};

export const fetchActiveOrders = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/pedidos/en-curso/');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar los pedidos');
  }
};

export const fetchDrivers = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/conductores/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los conductores:', error);
    throw error;
  }
};

export const fetchActiveVehicles = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/vehiculos/vehiculos-disponibles/');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar los vehículos disponibles');
  }
};

export const deleteVehiculo = async (placa) => {
  try {
    await axiosInstance.delete(`/api/v1/vehiculos/${placa}/`);
  } catch (error) {
    console.error('Error al eliminar el vehículo:', error);
    throw error;
  }
};

export const fetchPedidos = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/pedidos/detalle-pedidos/');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los pedidos');
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/pedidos/${id}/`);
    return response.status === 204;
  } catch (error) {
    throw new Error('Error al eliminar el pedido');
  }
};

export const fetchDireccionOrigen = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/configuracion/obtener-origen/');
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar la configuración');
  }
};

export const saveDireccionOrigen = async (direccionOrigenData) => {
  try {
    const response = await axiosInstance.post('/api/v1/configuracion/guardar-origen/', direccionOrigenData);
    return response.data;
  } catch (error) {
    throw new Error('Error al guardar la configuración');
  }
};

export const fetchClientes = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/clientes/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    throw error;
  }
};

// Obtener ubicaciones de vehículos
export const fetchVehiculos = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/vehiculos/ubicaciones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    throw error;
  }
};

// Obtener coordenadas de pedidos
export const fetchPedidosCoordenadas = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/pedidos/coordenadas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    throw error;
  }
};

// Servicios del formulario de pedidos
export const fetchOrigenFijo = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/configuracion/obtener-origen/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la dirección de origen:', error);
    throw error;
  }
};

export const fetchPedidoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/pedidos/${id}/`);
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
    const response = await axiosInstance.get('/api/v1/users/1/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
};

export const fetchCompletedOrders = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/pedidos/entregados/');
    return response.data;
  } catch (error) {
    console.error('Error al cargar los pedidos completados:', error);
    throw error;
  }
};
