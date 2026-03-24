import { useEffect, useState } from "react";
import KanbanCard from "../components/cards/KanbanCard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Operations() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/incidents/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setIncidents(data));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const incidentId = active.id;
    const newStatus = over.id;

    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: newStatus }
          : incident
      )
    );

    fetch(`http://localhost:8000/api/incidents/${incidentId}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const grouped = {
    OPEN: incidents.filter((i) => i.status === "OPEN"),
    IN_PROGRESS: incidents.filter((i) => i.status === "IN_PROGRESS"),
    RESOLVED: incidents.filter((i) => i.status === "RESOLVED"),
  };

  return (
    <div>
      <h1 style={styles.heading}>Operations Center</h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={styles.board}>
          {Object.keys(grouped).map((status) => (
            <Column
              key={status}
              id={status}
              title={status}
              data={grouped[status]}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Column({ id, title, data }) {
  return (
    <div style={styles.column}>
      <h3 style={styles.columnTitle}>
        {title} ({data.length})
      </h3>

      <SortableContext
        items={data.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {data.map((incident) => (
          <KanbanCard key={incident.id} incident={incident} />
        ))}
      </SortableContext>
    </div>
  );
}

const styles = {
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "30px",
    color: "#111827",
  },
  board: {
    display: "flex",
    gap: "25px",
    alignItems: "flex-start",
  },
  column: {
    flex: 1,
    padding: "20px",
    borderRadius: "16px",
    minHeight: "600px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
  },
  columnTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
};
