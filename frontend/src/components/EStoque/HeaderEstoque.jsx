export default function HeaderEstoque({
  onNovoProduto,
  onRetirada,
  onListProduto
}) {
  return (
    <header className="top">
      <div className="top-letras">
        <h1>Estoque</h1>
        <p>Produtos Cadastrados</p>
      </div>

      <div className="actions">

        <button
          className="active"
          onClick={onListProduto}
        >
          Estoque
        </button>

        <button onClick={onRetirada}>
          Retirada
        </button>

        <button onClick={onNovoProduto}>
          + Novo Produto
        </button>

      </div>
    </header>
  );
}