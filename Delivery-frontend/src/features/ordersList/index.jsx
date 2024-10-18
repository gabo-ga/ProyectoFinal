import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import styles from "./index.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import AddButton from "../../components/AddButton/button";
import ActionBar from "../../components/ActionsBar/Actions";

function OrdersHistory() {
  return (
    <>
      <Header></Header>
      <Container fluid className={styles.body}>
        <Row>
          <Col xs={10}>
            <h4>GESTION DE PEDIDOS</h4>
          </Col>
          <Col xs={2}>
            <AddButton></AddButton>
          </Col>
        </Row>
        <Row>
          <ActionBar></ActionBar>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default OrdersHistory;
