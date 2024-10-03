import styled from "styled-components";
import ActiveOrders from "./activeOrders";
import ButtonsContainer from "./buttons";
import Metrics from "./metricsComponent";
import CompletedOrders from "./completedOrders";
import ActiveVehicles from "./activeVehicles";

const Hero = styled.body`
  background-color: #ecf0f1;
  width: 100vp;
  height: 100vh;
  padding: 32px 119px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
`;
const Main = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 20px;
  align-self: stretch;
`;
const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  flex: 1 0 0;
  align-self: stretch;
`;
const OrdersContainer = styled.div`
  display: flex;
  width: 711px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

function Dashboard() {
  return (
    <>
      <Hero>
        <Main>
          <MapContainer>
            <Map></Map>
            <Metrics></Metrics>
            <ButtonsContainer></ButtonsContainer>
          </MapContainer>
          <OrdersContainer>
            <ActiveOrders></ActiveOrders>
            <CompletedOrders></CompletedOrders>
            <ActiveVehicles></ActiveVehicles>
          </OrdersContainer>
        </Main>
      </Hero>
    </>
  );
}

function Map() {
  return <div style={{ width: 326, height: 320, color: "white" }}></div>;
}

export default Dashboard;
