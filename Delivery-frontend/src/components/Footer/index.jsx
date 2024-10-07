import styled from "styled-components";
import Container from "react-bootstrap/esm/Container";
import styles from "./footer.module.css";

const FooterContainer = styled.footer`
  display: flex;
  width: 100vp;
  height: 112px;
  justify-content: center;
  align-items: center;
  background-color: #1abc9c;
`;

function Footer() {
  return (
    <>
      <Container fluid className={styles.FooterStyle}>
        <h2>Proyecto de Grado 2/24</h2>
      </Container>
    </>
  );
}

export default Footer;
