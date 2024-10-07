import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import Dashboard from "./components/DashboardCard";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"></Navigate>}></Route>
        <Route path="/login" element={<LoginCard></LoginCard>}></Route>
        <Route path="/dashboard" element={<Header></Header>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
