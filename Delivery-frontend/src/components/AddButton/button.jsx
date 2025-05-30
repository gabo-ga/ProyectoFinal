import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { Plus } from "react-bootstrap-icons";
import styles from "./button.module.css";

function AddButton({ redirectTo }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectTo);
  };

  return (
    <Button
      onClick={handleClick}
      variant="warning"
      className={styles.buttonContainer}
    >
      <Plus></Plus>
    </Button>
  );
}

export default AddButton;
