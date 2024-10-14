import Button from "react-bootstrap/esm/Button";
import { Plus } from "react-bootstrap-icons";
import styles from "./button.module.css";

function AddButton() {
  return (
    <Button variant="warning" className={styles.buttonContainer}>
      <Plus></Plus>
    </Button>
  );
}

export default AddButton;
