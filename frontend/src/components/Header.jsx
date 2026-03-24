function Header({ currentUser, onToggleForm }) {
  return (
    <header className="header">
      <h1>IssueFlow</h1>
      <div className="header-actions">
        {currentUser && (
          <span className="user-info">
            {currentUser.username} ({currentUser.role})
          </span>
        )}
        <button className="btn" onClick={onToggleForm}>
          Nueva incidencia
        </button>
      </div>
    </header>
  );
}

export default Header;
