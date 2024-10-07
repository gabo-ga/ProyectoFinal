import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/DashboardCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"></Navigate>}></Route>
        <Route path="/login" element={<LoginCard></LoginCard>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
