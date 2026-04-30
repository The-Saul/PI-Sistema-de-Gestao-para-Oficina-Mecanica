function Header({ title, subtitle, action }) {
  return (
    <header className="header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}

export default Header;