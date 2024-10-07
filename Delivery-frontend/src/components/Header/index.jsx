import Row from "react-bootstrap/esm/Row";
import UserProfile from "../../assets/user.png";
import styles from "./header.module.css";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";

function Header() {
  return (
    <>
      <Container fluid className={styles.HeaderStyles}>
        <Row className="w-100">
          <Col>
            <img
              src={UserProfile}
              alt="user-picture"
              className={`${styles.Profile} img-fluid`}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Header;
