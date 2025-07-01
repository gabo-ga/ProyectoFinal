import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import AddButton from "../../components/AddButton/button";
import ActionBar from "../../components/ActionsBar/Actions";
import Order from "../../components/OrderListComponent";
import FilterButton from "../../components/FilterButton";
import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { FilterProvider } from "../../contexts/FilterContext";
import DownloadButton from "../../components/DownloadButton";

function OrdersHistory() {
  const {userId} = useAuth();
  const [filtros, setFiltros] = useState({ cliente: "", estado: "" });
  const [pedidos, setPedidos] = useState([]);


  const handleFiltroChange = (nuevosFiltros) => {
    console.log("Filtros recibidos:", nuevosFiltros);
    setFiltros(nuevosFiltros);
  };

  return (
    <>
      <FilterProvider>
        <Header></Header>
        <div className="bg-[#ecf0f1] h-screen p-4 flex flex-col items-start gap-2 flex-shrink-0">
          {/*Gestion de pedidos y botones*/}
          <div className="w-full grid grid-cols-2">
              <p className="flex self-end text-md font-bold m-0 lg:text-xl">GESTIÓN DE PEDIDOS</p>
            <div className="flex justify-end h-auto gap-2 lg:gap-4">
              <FilterButton onFiltrar={handleFiltroChange}></FilterButton>
              <DownloadButton data={pedidos}></DownloadButton>
              {userId === 6 && <AddButton redirectTo="/addorder"></AddButton>}
            </div>
          </div>
          {/*barra de titulos*/}
          
            <ActionBar
              label1="ID"
              label2="CLIENTE"
              label3="ESTADO"
              label4="DESTINO"
              label5="ACCIONES"
            ></ActionBar>
            <Order filtros={filtros} onPedidosLoad={setPedidos}></Order>
          
        
        </div>
        {/*<Footer></Footer>*/}
      </FilterProvider>
    </>
  );
}

export default OrdersHistory;
