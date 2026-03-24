export default function Badge({ label, type }) {
  const colors = {
    NORMAL: "#2563eb",
    HIGH: "#f59e0b",
    CRITICAL: "#dc2626",
  };

  return (
    <span
      style={{
        backgroundColor: colors[type] || "#6b7280",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500",
      }}
    >
      {label}
    </span>
  );
}
