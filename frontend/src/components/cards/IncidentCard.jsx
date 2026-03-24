function IncidentCard({ incident, canChangeStatus, onStatusChange }) {

  const getStatusLabel = (status) => {
    switch (status) {
      case "OPEN":
        return "Abierta";
      case "IN_PROGRESS":
        return "En proceso";
      case "RESOLVED":
        return "Resuelta";
      default:
        return status;
    }
  };

  return (
    <div className="card">
      <h3>{incident.title}</h3>

      <p className={`status status-${incident.status}`}>
        {getStatusLabel(incident.status)}
      </p>

      {canChangeStatus && (
        <button
          className="btn"
          style={{ marginTop: "1rem" }}
          onClick={() => onStatusChange(incident)}
        >
          Cambiar estado
        </button>
      )}
    </div>
  );
}

export default IncidentCard;
