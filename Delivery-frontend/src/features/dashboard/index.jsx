import styles from "./index.module.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Map from "../../components/MapComponent/map";

import ActiveOrders from "../../components/OrdersComponents/activeOrders";
import ButtonsContainer from "../../components/ButtonsComponent/buttons";
import Metrics from "../../components/MetricsComponent";
import CompletedOrders from "../../components/OrdersComponents/completedOrders";
import ActiveVehicles from "../../components/OrdersComponents/activeVehicles";

function Dashboard() {
  return (
    <>
      <Header></Header>
      <main className="bg-[#ecf0f1] p-4 gap-2 flex flex-col md:flex-row lg:flex-row lg:max-h-screen">
        <section className="w-full grid grid-rows-7 gap-2 md:w-full lg:max-w-2xl lg:grid-rows-8">
            <Map></Map>
            <Metrics></Metrics>
            <ButtonsContainer></ButtonsContainer>
            </section>
            <section className="flex flex-col md:w-full lg:w-3xl">
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
