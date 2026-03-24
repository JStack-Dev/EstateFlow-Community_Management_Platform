import { useEffect, useState } from "react";

export default function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const API = "http://localhost:8000/api/notifications/resident/";

  const loadNotifications = async () => {

    try {

      const response = await fetch(API, {
        credentials: "include"
      });

      if (!response.ok) {
        console.error("Error cargando notificaciones");
        return;
      }

      const data = await response.json();

      setNotifications(data);

    } catch (error) {

      console.error("Error cargando notificaciones", error);

    }

  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  return (

    <div style={styles.container}>

      <div style={styles.bell} onClick={() => setOpen(!open)}>
        🔔
        {unread > 0 && (
          <span style={styles.badge}>{unread}</span>
        )}
      </div>

      {open && (

        <div style={styles.dropdown}>

          <h4 style={styles.title}>Notificaciones</h4>

          {notifications.length === 0 && (
            <p style={styles.empty}>No hay notificaciones</p>
          )}

          {notifications.map(n => (

            <div key={n.id} style={styles.item}>
              {n.message}
            </div>

          ))}

        </div>

      )}

    </div>

  );

}

const styles = {

  container: {
    position: "relative"
  },

  bell: {
    cursor: "pointer",
    fontSize: "20px",
    position: "relative"
  },

  badge: {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px"
  },

  dropdown: {
    position: "absolute",
    top: "35px",
    right: "0",
    background: "white",
    width: "250px",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
    padding: "15px",
    zIndex: 100,
    color: "#111827"
  },

  title: {
    marginBottom: "10px",
    color: "#111827"
  },

  empty: {
    color: "#374151"
  },

  item: {
    padding: "8px",
    borderBottom: "1px solid #eee",
    color: "#111827"
  }

};