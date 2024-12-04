import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { fetchDriversWithActiveOrders } from "../../api/apiService";

const DriverField = ({ value, onChange }) => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarConductores = async () => {
      try {
        const data = await fetchDriversWithActiveOrders();
        setDrivers(data);
      } catch (error) {
        console.error("Error al obtener los conductores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarConductores();
  }, []);

  const handleChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setError("Por favor, seleccione un conductor.");
    } else {
      setError("");
    }
    onChange(e);
  };

  return (
    <Form.Group controlId="formDesignatedDriver">
      <Form.Label>CONDUCTOR DESIGNADO:</Form.Label>
      {isLoading ? (
        <Form.Text>Cargando conductores...</Form.Text>
      ) : (
        <Form.Select
          name="conductor"
          value={value}
          onChange={onChange}
          required
        >
          <option value="">Seleccione un conductor</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.nombre}
            </option>
          ))}
        </Form.Select>
      )}
    </Form.Group>
  );
};

DriverField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default DriverField;
