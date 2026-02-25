import React, { useState, useEffect } from "react";
import { obtenerPartidos, crearPartido, borrarPartido, actualizarPartido } from "../api";

export default function Partidos({ torneoId, equipos }) {
  const [partidos, setPartidos] = useState([]);
  const [equipo1, setEquipo1] = useState("");
  const [equipo2, setEquipo2] = useState("");

  useEffect(() => {
    if (torneoId) fetchPartidos();
  }, [torneoId]);

  const fetchPartidos = async () => {
    const data = await obtenerPartidos(torneoId);
    setPartidos(data);
  };

  const handleCrear = async () => {
    if (!equipo1 || !equipo2 || equipo1 === equipo2)
      return alert("Selecciona dos equipos distintos");
    await crearPartido({ torneo_id: torneoId, equipo1_id: equipo1, equipo2_id: equipo2 });
    setEquipo1("");
    setEquipo2("");
    fetchPartidos();
  };

  const handleBorrar = async (id) => {
    await borrarPartido(id);
    fetchPartidos();
  };

  const handleResultado = async (id, r1, r2) => {
    await actualizarPartido(id, r1, r2);
    fetchPartidos();
  };

  return (
    <div>
      <h3>Partidos</h3>

      <select value={equipo1} onChange={(e) => setEquipo1(e.target.value)}>
        <option value="">Equipo 1</option>
        {equipos.map((eq) => <option key={eq._id} value={eq._id}>{eq.nombre}</option>)}
      </select>

      <select value={equipo2} onChange={(e) => setEquipo2(e.target.value)}>
        <option value="">Equipo 2</option>
        {equipos.map((eq) => <option key={eq._id} value={eq._id}>{eq.nombre}</option>)}
      </select>

      <button onClick={handleCrear}>Crear Partido</button>

      <ul>
        {partidos.map((p) => (
          <li key={p._id}>
            {equipos.find(e => e._id === p.equipo1_id)?.nombre || "?"} vs{" "}
            {equipos.find(e => e._id === p.equipo2_id)?.nombre || "?"} | 
            {p.estado === "jugado" ? `${p.resultado_equipo1} - ${p.resultado_equipo2}` : "Pendiente"}
            <button onClick={() => handleBorrar(p._id)}>Borrar</button>
            <button onClick={() => handleResultado(p._id, prompt("Resultado equipo 1:"), prompt("Resultado equipo 2:"))}>
              Actualizar Resultado
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}