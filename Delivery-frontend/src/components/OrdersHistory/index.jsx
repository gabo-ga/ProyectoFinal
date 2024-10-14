import Header from "../Header";
import Footer from "../Footer";
import styles from "./index.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import AddButton from "./AddButton/button";

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
          <Col xs={12}>
            <h3>PEDIDOS</h3>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default OrdersHistory;
