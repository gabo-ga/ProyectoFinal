import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import Dashboard from "./components/DashboardCard";
import OrdersHistory from "./features/ordersList";
import PrivateRoute from "./PrivateRoute";
import AddOrder from "./features/addOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"></Navigate>}></Route>
        <Route path="/login" element={<LoginCard></LoginCard>}></Route>
        <Route path="/addorder" element={<AddOrder></AddOrder>}></Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard></Dashboard>
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/ordershistory"
          element={<OrdersHistory></OrdersHistory>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
