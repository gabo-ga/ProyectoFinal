import styles from "./index.module.css";
import ActiveOrders from "./OrderComponent/activeOrders";
import ButtonsContainer from "./ButtonsComponent/buttons";
import Metrics from "./MetricsComponent/";
import CompletedOrders from "./OrderComponent/completedOrders";
import ActiveVehicles from "./OrderComponent/activeVehicles";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Map from "../MapComponent/map";

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
            <ActiveOrders title={"PEDIDOS COMPLETADOS"}></ActiveOrders>
            <ActiveOrders title={"VEHICULOS ACTIVOS"}></ActiveOrders>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default Dashboard;
