import React, { useState } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";

function FilterForm({ show, onHide, onFiltrar }) {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

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
                <Form.Control
                  type="text"
                  placeholder="Escribe el nombre del cliente"
                  value={filtroCliente}
                  onChange={handleFiltroClienteChange}
                />
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
