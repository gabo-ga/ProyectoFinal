import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { fetchClientes } from "../../api/apiService";
import { useFilter } from "../../contexts/FilterContext";

function FilterForm({ show, onHide }) {
  const { filters, updateFilters } = useFilter();
  const [clientes, setClientes] = useState([]);

  const [localCliente, setLocalCliente] = useState("");
  const [localEstado, setLocalEstado] = useState("");

  const handleFiltroClienteChange = (e) => {
    const value = e.target.value;
    setLocalCliente(value);
  };

  const handleFiltroEstadoChange = (e) => {
    const value = e.target.value;
    setLocalEstado(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFilters({ cliente: localCliente, estado: localEstado });
    console.log("Filtros aplicados:", filters);
    onHide();
  };

  const handleReset = () => {
    updateFilters({ cliente: "", estado: "" });
    console.log("Filtros restablecidos");
  };

  useEffect(() => {
    const getClientes = async () => {
      try {
        const data = await fetchClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    getClientes();
  }, []);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filtrar Pedidos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="filtroCliente">
                <Form.Label>Filtro por Cliente</Form.Label>
                <Form.Select
                  value={localCliente}
                  onChange={handleFiltroClienteChange}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.nombre}>
                      {cliente.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="filtroEstado">
                <Form.Label>Filtro por Estado</Form.Label>
                <Form.Select
                  value={localEstado}
                  onChange={handleFiltroEstadoChange}
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Filtrar
              </Button>{" "}
              <Button variant="secondary" onClick={handleReset}>
                Restablecer
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default FilterForm;
