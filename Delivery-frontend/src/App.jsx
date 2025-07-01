import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./features/dashboard";
import OrdersHistory from "./features/ordersList";
import PrivateRoute from "./PrivateRoute";
import OrderForm from "./features/OrderForm";
import UserPage from "./features/UserConfiguration";
import OrderDetails from "./features/orderDetails";
import VehicleList from "./features/vehiclesDetail";
import VehicleForm from "./features/vehicleForm";
import MetricsPage from "./features/MetricsPage/Index";
import { AuthProvider } from "./AuthContext";
import Login from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
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
            path="/user/:id"
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
          <Route
            path="/edit-vehicles/:id"
            element={
              <PrivateRoute>
                <VehicleForm/>
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

          <Route
            path="/metrics"
            element={
              <PrivateRoute>
                <MetricsPage />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
