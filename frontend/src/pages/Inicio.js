import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

const Inicio = ({ seleccionarTorneo }) => {
  const [torneos, setTorneos] = useState([]);
  const [nuevoTorneo, setNuevoTorneo] = useState({ nombre: "", deporte: "" });

  useEffect(() => {
    fetch(`${BACKEND_URL}/torneos`)
      .then(res => res.json())
      .then(data => setTorneos(data))
      .catch(err => console.error(err));
  }, []);

  const agregarTorneo = e => {
    e.preventDefault();
    if (!nuevoTorneo.nombre || !nuevoTorneo.deporte) return;

    fetch(`${BACKEND_URL}/torneos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoTorneo)
    })
      .then(res => res.json())
      .then(data => setTorneos([...torneos, data]))
      .catch(err => console.error(err));

    setNuevoTorneo({ nombre: "", deporte: "" });
  };

  const eliminarTorneo = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este torneo?")) return;
    try {
      await fetch(`${BACKEND_URL}/torneos/${id}`, { method: "DELETE" });
      setTorneos(torneos.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">🏆 Mis Torneos</h1>

      <form onSubmit={agregarTorneo} className="form-torneo">
        <input
          type="text"
          placeholder="Nombre del torneo"
          value={nuevoTorneo.nombre}
          onChange={e => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Deporte"
          value={nuevoTorneo.deporte}
          onChange={e => setNuevoTorneo({ ...nuevoTorneo, deporte: e.target.value })}
        />
        <button type="submit" className="btn-crear-torneo">Crear torneo</button>
      </form>

      <div className="torneos-list">
        {torneos.map(t => (
          <div key={t._id} className="card-torneo">
            <h2>{t.nombre}</h2>
            <p className="deporte">{t.deporte}</p>
            <div className="card-actions">
              <button onClick={() => seleccionarTorneo(t)} className="btn-detalle">Ver detalles</button>
              <button onClick={() => eliminarTorneo(t._id)} className="btn-cruz">✖</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;