import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import styles from "./Actions.module.css";

function ActionBar({ label1, label2, label3, label4, label5 }) {
  return (
    <div className="bg-white rounded-lg w-full grid grid-cols-3 p-2 md:grid-cols-5 lg:grid-cols-5"> 
        <div className="hidden md:block lg:block">
          {label1}
        </div>
        <div className="">
          {label2}
        </div>
        <div className="">
          {label3}
        </div>
        <div className="hidden md:block lg:block">
          {label4}
        </div>
        <div className="">
          {label5}
        </div>
    </div>
  );
}

export default ActionBar;
