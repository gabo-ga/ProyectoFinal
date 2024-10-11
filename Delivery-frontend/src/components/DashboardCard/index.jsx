import styles from "./index.module.css";
import ActiveOrders from "./OrderComponent/activeOrders";
import ButtonsContainer from "./ButtonsComponent/buttons";
import Metrics from "../MetricsComponent";
import CompletedOrders from "./OrderComponent/completedOrders";
import ActiveVehicles from "./OrderComponent/activeVehicles";
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
          <Col xs={12} md={6} className={styles.MapContainer}>
            <Metrics></Metrics>
            <Map></Map>
            <ButtonsContainer></ButtonsContainer>
          </Col>
          <Col xs={12} md={6} className={styles.OrdersContainer}>
            <ActiveOrders></ActiveOrders>
          </Col>
        </Row>
      </Container>

      {/*<Footer></Footer>*/}
    </>
  );
}

function Map() {
  return <div style={{ width: "100%", height: 300, color: "white" }}></div>;
}

export default Dashboard;
