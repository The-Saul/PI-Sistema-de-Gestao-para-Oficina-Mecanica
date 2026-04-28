export default function HeaderEstoque({ onNovoProduto ,onRetirada}) {
  return (
    <header className="top">
      <div>
        <h1>Estoque</h1>
        <p>200 Produtos Cadastrados</p>
      </div>

      <div className="actions">
        <button className="active">Estoque</button>
        <button onClick={onRetirada}>Retirada</button>

        <button onClick={onNovoProduto}>
          + Novo Produto
        </button>
      </div>
    </header>
  );
}