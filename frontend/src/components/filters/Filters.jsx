function Filters({ onFilterChange }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <button className="btn" onClick={() => onFilterChange("ALL")}>
        Todas
      </button>{" "}
      <button className="btn" onClick={() => onFilterChange("OPEN")}>
        Abiertas
      </button>{" "}
      <button className="btn" onClick={() => onFilterChange("IN_PROGRESS")}>
        En proceso
      </button>{" "}
      <button className="btn" onClick={() => onFilterChange("RESOLVED")}>
        Resueltas
      </button>
    </div>
  );
}

export default Filters;
