function Header({ title, subtitle }) {
  return (
    <header className="header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  );
}

export default Header;