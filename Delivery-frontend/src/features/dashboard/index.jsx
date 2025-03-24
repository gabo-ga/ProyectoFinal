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
      <main className="bg-[#ecf0f1] h-auto p-4 gap-2 flex flex-col">
        <section className="grid grid-rows-7 gap-2 h-auto">
            <Map></Map>
            <Metrics></Metrics>
            <ButtonsContainer></ButtonsContainer>
            </section>
            <section>
          
            <ActiveOrders title={"PEDIDOS EN CURSO"}></ActiveOrders>
            <CompletedOrders title={"PEDIDOS COMPLETADOS"}></CompletedOrders>
            <ActiveVehicles title={"VEHICULOS ACTIVOS"}></ActiveVehicles>
            </section>
        
      
      </main>
      <Footer></Footer>
    </>
  );
}

export default Dashboard;
