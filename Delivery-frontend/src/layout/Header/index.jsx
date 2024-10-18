import Row from "react-bootstrap/esm/Row";
import styles from "./header.module.css";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import { PersonCircle } from "react-bootstrap-icons";
import React, { useState } from "react";
import Logout from "../../components/LogoutComponent";

function Header() {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <>
      <Container fluid className={styles.HeaderStyles}>
        <Row className={styles.row}>
          <Col xs={12} md={6}></Col>
          <Col
            xs={12}
            md={6}
            className={`${styles.ProfileContainer} d-flex justify-content-end`}
          >
            <PersonCircle
              className={styles.profile}
              onClick={() => setShowProfile(true)}
            ></PersonCircle>
          </Col>
        </Row>
      </Container>
      {showProfile && <Logout onClose={() => setShowProfile(false)} />}
    </>
  );
}

export default Header;
