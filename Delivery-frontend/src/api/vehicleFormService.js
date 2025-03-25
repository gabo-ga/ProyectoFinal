import axios from "axios";

const API_URL = "http://localhost:8000/api/vehiculos/";

//funcion para añadir un vehiculo
export const addVehicle = async (vehicleData) => {
    try {
      const response = await axios.post(API_URL, vehicleData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

//funcion para editar
export const updateVehicle = async(vehicleId, vehicleData) => {
    try{
        const response = await axios.patch(`${API_URL}${vehicleId}/`, vehicleData);
        return response.data;
    }catch (error){
        throw error.response ? error.response.data : error;
    }
};

//funcion para eliminar
export const deleteVehicle = async (vehicleId) => {
    try {
      const response = await axios.delete(`${API_URL}${vehicleId}/`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
};

