import { useEffect, useState } from "react";
import StatCard from "../components/ui/StatCard";
import ChartCard from "../components/ui/ChartCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/incidents/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setIncidents(data));
  }, []);

  const activeIncidents = incidents.filter(
    (i) => i.status !== "RESOLVED"
  ).length;

  const criticalOpen = incidents.filter(
    (i) => i.status !== "RESOLVED" && i.urgency === "CRITICAL"
  ).length;

  const resolved = incidents.filter(
    (i) => i.status === "RESOLVED"
  ).length;

  const avgResolution =
    incidents
      .filter((i) => i.resolution_time)
      .reduce((acc, curr) => acc + curr.resolution_time, 0) /
    (incidents.filter((i) => i.resolution_time).length || 1);

  // Agrupar por categoría
  const categoryData = Object.values(
    incidents.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || {
        name: curr.category,
        value: 0,
      };
      acc[curr.category].value += 1;
      return acc;
    }, {})
  );

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b"];

  return (
    <div>
      <h1 style={styles.heading}>Executive Dashboard</h1>

      <div style={styles.grid}>
        <StatCard
          title="Active Incidents"
          value={activeIncidents}
          color="#2563eb"
        />
        <StatCard
          title="Critical Open"
          value={criticalOpen}
          color="#dc2626"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          color="#16a34a"
        />
        <StatCard
          title="Avg Resolution (hrs)"
          value={avgResolution.toFixed(2)}
          color="#9333ea"
        />
      </div>

      <ChartCard title="Incidents by Category">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
};
