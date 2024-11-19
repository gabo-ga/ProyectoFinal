import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/login";
import Dashboard from "./features/dashboard";
import OrdersHistory from "./features/ordersList";
import PrivateRoute from "./PrivateRoute";
import OrderForm from "./features/OrderForm";
import UserPage from "./features/UserConfiguration";
import OrderDetails from "./features/orderDetails";
import VehicleList from "./features/vehiclesDetail";
import VehicleForm from "./features/vehicleForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*rutas publicas*/}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/*rutas privada*/}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/addorder"
          element={
            <PrivateRoute>
              <OrderForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/editOrder/:id"
          element={
            <PrivateRoute>
              <OrderForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <PrivateRoute>
              <VehicleList />
            </PrivateRoute>
          }
        />
        <Route path="/addvehicle" element={<VehicleForm />} />
        <Route
          path="/orderdetails/:id"
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        ></Route>

        <Route
          path="/ordershistory"
          element={
            <PrivateRoute>
              <OrdersHistory />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
