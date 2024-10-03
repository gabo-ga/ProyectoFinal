import "./App.css";
import LoginCard from "./components/LoginCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/DashboardCard";

function App() {
  return (
    <div>
      <Header></Header>
      <Dashboard></Dashboard>
      <Footer></Footer>
    </div>
  );
}

export default App;
