import React, { useEffect, useState } from "react";
import { crearTorneo, obtenerTorneos, borrarTorneo } from "../api";

export default function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [deporte, setDeporte] = useState("");

  // Traer torneos al cargar la página
  useEffect(() => {
    fetchTorneos();
  }, []);

  const fetchTorneos = async () => {
    const data = await obtenerTorneos();
    setTorneos(data);
  };

  const handleCrear = async () => {
    if (!nombre || !deporte) return alert("Rellena todos los campos");
    await crearTorneo({ nombre, deporte });
    setNombre("");
    setDeporte("");
    fetchTorneos();
  };

  const handleBorrar = async (id) => {
    await borrarTorneo(id);
    fetchTorneos();
  };

  return (
    <div>
      <h2>Torneos</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Deporte"
        value={deporte}
        onChange={(e) => setDeporte(e.target.value)}
      />
      <button onClick={handleCrear}>Crear Torneo</button>

      <ul>
        {torneos.map((t) => (
          <li key={t._id}>
            {t.nombre} ({t.deporte})
            <button onClick={() => handleBorrar(t._id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}