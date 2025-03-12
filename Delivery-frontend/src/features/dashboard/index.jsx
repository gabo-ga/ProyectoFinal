import styles from "./index.module.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Map from "../../components/MapComponent/map";

import ActiveOrders from "../../components/OrdersComponents/activeOrders";
import ButtonsContainer from "../../components/ButtonsComponent/buttons";
import Metrics from "../../components/MetricsComponent";
import CompletedOrders from "../../components/OrdersComponents/completedOrders";
import ActiveVehicles from "../../components/OrdersComponents/activeVehicles";

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function Dashboard() {
  return (
    <>
      <Header></Header>
      <Container fluid className={styles.Body}>
        <Row className={styles.BodyContainer}>
          <Col xs={12} sm={6} className={styles.MapContainer}>
            <Map></Map>
            <Metrics></Metrics>
            <ButtonsContainer></ButtonsContainer>
          </Col>
          <Col xs={12} sm={6} className={styles.OrdersContainer}>
            <ActiveOrders title={"PEDIDOS EN CURSO"}></ActiveOrders>
            <CompletedOrders title={"PEDIDOS COMPLETADOS"}></CompletedOrders>
            <ActiveVehicles title={"VEHICULOS ACTIVOS"}></ActiveVehicles>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default Dashboard;
