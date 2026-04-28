export default function HeaderEstoque({ onNovoProduto }) {
  return (
    <header className="top">
      <div>
        <h1>Estoque</h1>
        <p>200 Produtos Cadastrados</p>
      </div>

      <div className="actions">
        <button className="active">Estoque</button>
        <button>Retirada</button>

        <button className="primary" onClick={onNovoProduto}>
          + Novo Produto
        </button>
      </div>
    </header>
  );
}