// src/api.js

const BASE_URL = "https://torneo-backend-1.onrender.com";

// --------------------- TORNEOS ---------------------

export const crearTorneo = async (torneo) => {
  const res = await fetch(`${BASE_URL}/torneos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(torneo),
  });
  return await res.json();
};

export const obtenerTorneos = async () => {
  const res = await fetch(`${BASE_URL}/torneos`);
  return await res.json();
};

export const borrarTorneo = async (id) => {
  const res = await fetch(`${BASE_URL}/torneos/${id}`, { method: "DELETE" });
  return await res.json();
};

// --------------------- EQUIPOS ---------------------

export const crearEquipo = async (equipo) => {
  const res = await fetch(`${BASE_URL}/equipos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipo),
  });
  return await res.json();
};

export const obtenerEquipos = async (torneoId) => {
  const res = await fetch(`${BASE_URL}/equipos/${torneoId}`);
  return await res.json();
};

export const borrarEquipo = async (id) => {
  const res = await fetch(`${BASE_URL}/equipos/${id}`, { method: "DELETE" });
  return await res.json();
};

// --------------------- PARTIDOS ---------------------

export const crearPartido = async (partido) => {
  const res = await fetch(`${BASE_URL}/partidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partido),
  });
  return await res.json();
};

export const obtenerPartidos = async (torneoId) => {
  const res = await fetch(`${BASE_URL}/partidos/${torneoId}`);
  return await res.json();
};

export const borrarPartido = async (id) => {
  const res = await fetch(`${BASE_URL}/partidos/${id}`, { method: "DELETE" });
  return await res.json();
};

export const actualizarResultado = async (id, resultado) => {
  const res = await fetch(`${BASE_URL}/partidos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resultado),
  });
  return await res.json();
};