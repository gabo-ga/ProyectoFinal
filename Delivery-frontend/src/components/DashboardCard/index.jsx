import styles from "./index.module.css";
import ActiveOrders from "./activeOrders";
import ButtonsContainer from "./buttons";
import Metrics from "./metricsComponent";
import CompletedOrders from "./completedOrders";
import ActiveVehicles from "./activeVehicles";
import Header from "../Header";
import Footer from "../Footer";
import Container from "react-bootstrap/esm/Container";

function Dashboard() {
  return (
    <>
      <Header></Header>

      <Container fluid className={styles.Body}>
        <div className={styles.BodyContainer}>
          <div className={styles.MapContainer}>
            <Map></Map>
            <Metrics></Metrics>
            <ButtonsContainer></ButtonsContainer>
          </div>
          <div className={styles.OrdersContainer}>
            <ActiveOrders></ActiveOrders>
            <CompletedOrders></CompletedOrders>
            <ActiveVehicles></ActiveVehicles>
          </div>
        </div>
      </Container>

      <Footer></Footer>
    </>
  );
}

function Map() {
  return <div style={{ width: 326, height: 320, color: "white" }}></div>;
}

export default Dashboard;
