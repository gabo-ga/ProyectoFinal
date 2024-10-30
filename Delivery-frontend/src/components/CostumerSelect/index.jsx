import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const CustomerSelect = ({ value, onChange, name }) => {
  const [clientes, setClientes] = useState([]);

  // Función para obtener los clientes desde el backend
  const fetchClientes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/clientes/");
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  // Ejecuta la función fetchClientes cuando el componente se monta
  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <Form.Group>
      <Form.Label>CLIENTE:</Form.Label>
      <Form.Select value={value} onChange={onChange} name={name} required>
        <option value="">Seleccione un cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

CustomerSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default CustomerSelect;
