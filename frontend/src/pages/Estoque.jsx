import Sidebar from "../components/Sidebar";
import HeaderEstoque from "../components/HeaderEstoque";
import CardEstoque from "../components/CardEstoque";
import ListEstoque from "../components/ListaEstoque";
function Estoque() {
  return (
    <div className="estoque-page">
      <Sidebar />
      <div className="app-estoque">
        <HeaderEstoque/>
        <CardEstoque/>
        <ListEstoque/>
      </div>
    </div>
    
  );
}

export default Estoque;