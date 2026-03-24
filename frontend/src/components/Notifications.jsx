import { useEffect, useState } from "react";

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {

    const response = await fetch(
      "http://localhost:8000/api/notifications/resident/",
      {
        credentials: "include"
      }
    );

    const data = await response.json();

    setNotifications(data);

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