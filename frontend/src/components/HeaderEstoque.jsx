export default function HeaderEstoque() {
  return (
    <header className="top">
      <div>
        <h1>Estoque</h1>
        <p>200 Produtos Cadastrados</p>
      </div>

      <div className="actions">
        <button>Estoque</button>
        <button>Rstirada</button>
        <button className="primary">+ Novo Produto</button>
      </div>
    </header>
  );
}