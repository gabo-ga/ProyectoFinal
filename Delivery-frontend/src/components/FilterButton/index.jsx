import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { Filter } from "react-bootstrap-icons";
import styles from "./button.module.css";

function FilterButton({ redirectTo }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectTo);
  };

  return (
    <Button onClick={handleClick} className={styles.buttonContainer}>
      <Filter></Filter>
    </Button>
  );
}

export default FilterButton;
