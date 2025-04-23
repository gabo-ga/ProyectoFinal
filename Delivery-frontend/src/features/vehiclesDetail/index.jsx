import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Container, Col, Row } from "react-bootstrap";
import ActionBar from "../../components/ActionsBar/Actions";
import styles from "./index.module.css";
import AddButton from "../../components/AddButton/button";
import Vehicles from "../../components/VehicleListComponent";

function VehicleList() {
  return (
    <>
      <Header></Header>
      <Container fluid className={styles.body}>
        <Row className="w-100">
          <Col xs={10} md={11}>
            <h4>GESTIÓN DE VEHÍCULOS</h4>
          </Col>
          <Col xs={2} md={1}>
            <AddButton redirectTo="/addvehicle"></AddButton>
          </Col>
        </Row>
        <Row className={styles.row}>
          <ActionBar
            label1="ID"
            label2="MODELO"
            label3="TIPO"
            label4="PLACA"
            label5="ACCIONES"
          ></ActionBar>
          <Vehicles></Vehicles>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default VehicleList;
