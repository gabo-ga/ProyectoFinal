import Container from "react-bootstrap/esm/Container";
import styles from "./footer.module.css";

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
