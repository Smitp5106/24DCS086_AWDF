function Header({ name }) {
  return (
    <header>
      <span className="font-label-mono">SELECTED WORK & PRACTICE</span>
      <h1 className="font-display">{name.toUpperCase()}</h1>
    </header>
  );
}

export default Header;
