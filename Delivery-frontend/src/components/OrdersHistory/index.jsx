import Header from "../Header";
import Footer from "../Footer";
import styles from "./index.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/Card";

function OrdersHistory() {
  return (
    <>
      <Header></Header>
      <Container fluid className={styles.body}>
        <Row>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row></Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default OrdersHistory;
