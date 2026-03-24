import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Badge from "../ui/Badge";

export default function KanbanCard({ incident }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: incident.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...styles.card, ...style }}
      {...attributes}
      {...listeners}
    >
      <div style={styles.title}>{incident.title}</div>

      <div style={styles.meta}>
        <span>{incident.location}</span>
        <Badge label={incident.urgency} type={incident.urgency} />
      </div>

      <div style={styles.footer}>
        {incident.assigned_to ? "Assigned" : "Unassigned"}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    marginBottom: "18px",
    cursor: "grab",
    transition: "all 0.2s ease",
  },
  title: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#111827",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: "#6b7280",
  },
  footer: {
    marginTop: "12px",
    fontSize: "12px",
    color: "#9ca3af",
  },
};
