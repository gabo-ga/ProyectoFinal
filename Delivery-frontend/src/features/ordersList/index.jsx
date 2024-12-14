import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import styles from "./index.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import AddButton from "../../components/AddButton/button";
import ActionBar from "../../components/ActionsBar/Actions";
import Order from "../../components/OrderListComponent";
import FilterButton from "../../components/FilterButton";
import { useState } from "react";

function OrdersHistory() {
  return (
    <>
      <Header></Header>
      <Container fluid className={styles.body}>
        <Row className="w-100">
          <Col xs={8} md={10}>
            <h4>GESTION DE PEDIDOS</h4>
          </Col>
          <Col xs={2} md={1}>
            <FilterButton></FilterButton>
          </Col>
          <Col xs={2} md={1}>
            <AddButton redirectTo="/addorder"></AddButton>
          </Col>
        </Row>
        <Row className={styles.row}>
          <ActionBar
            label1="ID"
            label2="CLIENTE"
            label3="ESTADO"
            label4="DESTINO"
            label5="ACCIONES"
          ></ActionBar>
          <Order></Order>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default OrdersHistory;
