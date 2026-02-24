import React, { useState, useEffect } from "react";
import { obtenerEquipos, crearEquipo, borrarEquipo } from "../api";

export default function Equipos({ torneoId }) {
  const [equipos, setEquipos] = useState([]);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (torneoId) fetchEquipos();
  }, [torneoId]);

  const fetchEquipos = async () => {
    const data = await obtenerEquipos(torneoId);
    setEquipos(data);
  };

  const handleCrear = async () => {
    if (!nombre) return alert("Escribe un nombre de equipo");
    await crearEquipo({ nombre, torneo_id: torneoId });
    setNombre("");
    fetchEquipos();
  };

  const handleBorrar = async (id) => {
    await borrarEquipo(id);
    fetchEquipos();
  };

  return (
    <div>
      <h3>Equipos</h3>
      <input
        type="text"
        placeholder="Nombre del equipo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={handleCrear}>Añadir Equipo</button>

      <ul>
        {equipos.map((e) => (
          <li key={e._id}>
            {e.nombre} 
            <button onClick={() => handleBorrar(e._id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}