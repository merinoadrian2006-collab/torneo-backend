import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import CardEquipo from "../components/CardEquipo";
import CardPartido from "../components/CardPartido";
import Clasificacion from "../components/Clasificacion";

const TorneoDetalle = ({ torneo, volver }) => {
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [nuevoEquipo, setNuevoEquipo] = useState("");
  const [nuevoPartido, setNuevoPartido] = useState({ equipo1Id: "", equipo2Id: "" });

  const cargarDatos = async () => {
    if (!torneo?._id) return;
    try {
      const eqRes = await fetch(`${BACKEND_URL}/equipos/${torneo._id}`);
      const eqData = await eqRes.json();
      setEquipos(eqData);

      const pRes = await fetch(`${BACKEND_URL}/partidos/${torneo._id}`);
      const pData = await pRes.json();

      const partidosMap = pData.map(p => ({
        ...p,
        equipo1: eqData.find(eq => eq._id === p.equipo1_id),
        equipo2: eqData.find(eq => eq._id === p.equipo2_id)
      }));
      setPartidos(partidosMap);
    } catch (err) {
      console.error(err);
      alert("Error cargando datos del torneo: " + err.message);
    }
  };

  useEffect(() => { cargarDatos(); }, [torneo]);

  // --- Equipos ---
  const agregarEquipo = async e => {
    e.preventDefault();
    if (!nuevoEquipo.trim()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/equipos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoEquipo, torneo_id: torneo._id })
      });
      if (!res.ok) throw new Error("No se pudo crear el equipo");
      setNuevoEquipo("");
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const borrarEquipo = async (id) => {
    if (!window.confirm("¿Eliminar este equipo?")) return;
    try {
      await fetch(`${BACKEND_URL}/equipos/${id}`, { method: "DELETE" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error borrando equipo: " + err.message);
    }
  };

  // --- Partidos ---
  const agregarPartido = async e => {
    e.preventDefault();
    if (!nuevoPartido.equipo1Id || !nuevoPartido.equipo2Id || nuevoPartido.equipo1Id === nuevoPartido.equipo2Id) {
      alert("Selecciona dos equipos diferentes");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/partidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          torneo_id: torneo._id,
          equipo1_id: nuevoPartido.equipo1Id,
          equipo2_id: nuevoPartido.equipo2Id,
          fecha_hora: new Date(),
          resultado_equipo1: null,
          resultado_equipo2: null,
          estado: "pendiente"
        })
      });
      if (!res.ok) throw new Error("No se pudo crear el partido");
      setNuevoPartido({ equipo1Id: "", equipo2Id: "" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const borrarPartido = async (id) => {
    if (!window.confirm("¿Eliminar este partido?")) return;
    try {
      await fetch(`${BACKEND_URL}/partidos/${id}`, { method: "DELETE" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error borrando partido: " + err.message);
    }
  };

  const actualizarResultado = async (partidoId, res1, res2) => {
    try {
      await fetch(`${BACKEND_URL}/partidos/${partidoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultado_equipo1: res1, resultado_equipo2: res2 })
      });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error actualizando resultado: " + err.message);
    }
  };

  // --- Torneo ---
  const borrarTorneo = async () => {
    if (!window.confirm("¿Eliminar este torneo?")) return;
    try {
      await fetch(`${BACKEND_URL}/torneos/${torneo._id}`, { method: "DELETE" });
      volver();
    } catch (err) {
      console.error(err);
      alert("Error borrando torneo: " + err.message);
    }
  };

  return (
    <div className="container">
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
        <button onClick={volver}>⬅ Volver</button>
        <button style={{ backgroundColor:"red", color:"white" }} onClick={borrarTorneo}>Eliminar Torneo</button>
      </div>

      <div className="card">
        <h1>{torneo.nombre}</h1>
        <p>Deporte: {torneo.deporte}</p>
        {torneo.ubicacion && <p>Ubicación: {torneo.ubicacion}</p>}
      </div>

      {/* Equipos */}
      <div className="card">
        <h2>Equipos</h2>
        <form onSubmit={agregarEquipo} style={{ display:"flex", gap:"6px", marginBottom:"10px" }}>
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={nuevoEquipo}
            onChange={e => setNuevoEquipo(e.target.value)}
          />
          <button type="submit">Agregar</button>
        </form>
        {equipos.map(eq => (
          <div key={eq._id} style={{ display:"flex", alignItems:"center", marginBottom:"6px" }}>
            <CardEquipo equipo={eq} onDelete={borrarEquipo} />
          </div>
        ))}
      </div>

      {/* Partidos */}
      <div className="card">
        <h2>Partidos</h2>
        <form onSubmit={agregarPartido} style={{ display:"flex", gap:"6px", marginBottom:"10px" }}>
          <select value={nuevoPartido.equipo1Id} onChange={e => setNuevoPartido({ ...nuevoPartido, equipo1Id: e.target.value })}>
            <option value="">Equipo 1</option>
            {equipos.map(eq => <option key={eq._id} value={eq._id}>{eq.nombre}</option>)}
          </select>
          <select value={nuevoPartido.equipo2Id} onChange={e => setNuevoPartido({ ...nuevoPartido, equipo2Id: e.target.value })}>
            <option value="">Equipo 2</option>
            {equipos.map(eq => <option key={eq._id} value={eq._id}>{eq.nombre}</option>)}
          </select>
          <button type="submit">Agregar</button>
        </form>
        {partidos.map(p => (
          <div key={p._id} style={{ display:"flex", alignItems:"center", marginBottom:"6px" }}>
            <CardPartido partido={p} actualizarResultado={actualizarResultado} />
            <button
              className="delete"
              style={{ marginLeft:"8px" }}
              onClick={() => borrarPartido(p._id)}
            >❌</button>
          </div>
        ))}
      </div>

      {/* Clasificación */}
      <div className="card">
        <Clasificacion
          equipos={equipos.map(e => e.nombre)}
          partidos={partidos.map(p => ({
            local: p.equipo1?.nombre,
            visitante: p.equipo2?.nombre,
            golesLocal: p.resultado_equipo1,
            golesVisitante: p.resultado_equipo2
          }))}
        />
      </div>
    </div>
  );
};

export default TorneoDetalle;