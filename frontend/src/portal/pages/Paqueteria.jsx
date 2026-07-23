import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiClient";

export default function Paqueteria() {

  const [packages, setPackages] = useState([]);

  const loadPackages = async () => {

    const response = await apiFetch("/api/packages/resident/");

    if (response && response.ok) {
      const data = await response.json();
      setPackages(data);
    }

  };

  useEffect(() => {

    loadPackages();

  }, []);

  return (

    <div>

      <h1>Mis paquetes</h1>

      <table style={styles.table}>

        <thead>

          <tr>
            <th>Empresa</th>
            <th>Tracking</th>
            <th>Descripción</th>
            <th>Estado</th>
          </tr>

        </thead>

        <tbody>

          {packages.map(pkg => (

            <tr key={pkg.id}>

              <td>{pkg.carrier}</td>

              <td>{pkg.tracking_number}</td>

              <td>{pkg.description}</td>

              <td>
                {pkg.delivered ? "Entregado" : "Pendiente"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

const styles = {

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }

};