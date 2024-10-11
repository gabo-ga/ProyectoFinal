import styles from "./index.module.css";
import ActiveOrders from "./activeOrders";
import ButtonsContainer from "./buttons";
import Metrics from "./metricsComponent";
import CompletedOrders from "./completedOrders";
import ActiveVehicles from "./activeVehicles";
import Header from "../Header";
import Footer from "../Footer";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function Dashboard() {
  return (
    <>
      <Header></Header>

      <Container fluid className={styles.Body}>
        <Row className={styles.BodyContainer}>
          <Col className={styles.MapContainer}>
            <Map></Map>
            <Metrics></Metrics>
            <ButtonsContainer></ButtonsContainer>
          </Col>
          <Col className={styles.OrdersContainer}>
            <ActiveOrders></ActiveOrders>
            <CompletedOrders></CompletedOrders>
            <ActiveVehicles></ActiveVehicles>
          </Col>
        </Row>
      </Container>

      <Footer></Footer>
    </>
  );
}

function Map() {
  return <div style={{ width: "100%", height: 300, color: "white" }}></div>;
}

export default Dashboard;
