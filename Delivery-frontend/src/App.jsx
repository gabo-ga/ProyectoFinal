import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import Dashboard from "./features/dashboard";
import OrdersHistory from "./features/ordersList";
import PrivateRoute from "./PrivateRoute";
import OrderForm from "./features/OrderForm";
import UserPage from "./features/UserConfiguration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"></Navigate>}></Route>
        <Route path="/login" element={<LoginCard></LoginCard>}></Route>
        <Route path="/addorder" element={<OrderForm></OrderForm>}></Route>
        <Route path="/editOrder/:id" element={<OrderForm />}></Route>
        <Route path="/user" element={<UserPage></UserPage>}></Route>
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
