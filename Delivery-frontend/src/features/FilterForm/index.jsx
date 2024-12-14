import React, { useState, useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { fetchClientes } from "../../api/apiService";

function FilterForm({ show, onHide, onFiltrar }) {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [clientes, setClientes] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    onFiltrar({ cliente: filtroCliente, estado: filtroEstado });
    onHide();
  }

  function handleReset() {
    setFiltroCliente("");
    setFiltroEstado("");
    onFiltrar({ cliente: "", estado: "" });
  }

  function handleFiltroClienteChange(e) {
    setFiltroCliente(e.target.value);
  }

  function handleFiltroEstadoChange(e) {
    setFiltroEstado(e.target.value);
  }

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
                  value={filtroCliente}
                  onChange={handleFiltroClienteChange}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
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
                  value={filtroEstado}
                  onChange={handleFiltroEstadoChange}
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
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
