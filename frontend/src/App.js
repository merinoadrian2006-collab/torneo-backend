// App.js
import React, { useState, useEffect } from "react";
import Inicio from "./pages/Inicio";
import TorneoDetalle from "./pages/TorneoDetalle";
import { BACKEND_URL } from "./config";
import "./styles.css";

function App() {
  const [pagina, setPagina] = useState("inicio");           // Control de páginas
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [torneos, setTorneos] = useState([]);

  // Traer torneos desde el backend al iniciar la app
  useEffect(() => {
    fetch(`${BACKEND_URL}/torneos`)
      .then(res => res.json())
      .then(data => setTorneos(data))
      .catch(err => console.error("Error obteniendo torneos:", err));
  }, []);

  // Página Inicio
  if (pagina === "inicio") {
    return (
      <Inicio
        torneos={torneos}
        seleccionarTorneo={t => {
          setTorneoSeleccionado(t);
          setPagina("detalle");
        }}
      />
    );
  }

  // Página Detalle de Torneo
  if (pagina === "detalle") {
    return (
      <TorneoDetalle
        torneo={torneoSeleccionado}
        volver={() => setPagina("inicio")}
      />
    );
  }

  // Fallback mientras carga
  return <div>Cargando...</div>;
}

export default App;