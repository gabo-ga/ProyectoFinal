// src/components/Order.js
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { fetchPedidos, deletePedido } from "../../api/apiService.js";

function Vehicles() {
  return (
    <Container fluid className={styles.container}>
      <Row className="w-100">
        <Col md={2} className={styles.hideOnXS}>
          ID
        </Col>
        <Col xs={4} md={3}>
          CLIENTE
        </Col>
        <Col xs={3} md={2}>
          ESTADO
        </Col>
        <Col md={2} className={styles.hideOnXS}>
          DIRECCION
        </Col>
        <Col xs={3} md={2}>
          <PencilSquare className={styles.icons} />
          <Trash className={styles.icons} />
        </Col>
      </Row>
    </Container>
  );
}

export default Vehicles;
