import { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiClient";

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {

    const response = await apiFetch("/api/notifications/resident/");

    if (response && response.ok) {
      const data = await response.json();
      setNotifications(data);
    }

  };

  useEffect(() => {

    loadNotifications();

  }, []);

  return (

    <div>

      <h3>Notificaciones</h3>

      {notifications.length === 0 && (
        <p>No hay notificaciones</p>
      )}

      {notifications.map(n => (

        <div key={n.id} style={styles.item}>
          {n.message}
        </div>

      ))}

    </div>

  );

}

const styles = {

  item: {
    background: "white",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px"
  }

};