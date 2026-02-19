const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---- DATOS EN MEMORIA ----
let torneos = [];
let equipos = [];
let partidos = [];
let siguienteId = 1;
let siguienteEquipoId = 1;
let siguientePartidoId = 1;

// ---- RUTAS ----

// Ruta inicial
app.get('/', (req,res) => res.send('Backend del torneo funcionando!'));

// TORNEOS
app.get('/torneos', (req,res) => res.json(torneos));
app.post('/torneos', (req,res) => {
    const torneo = { id: siguienteId++, ...req.body };
    torneos.push(torneo);
    res.json(torneo);
});

// EQUIPOS
app.get('/equipos/:torneoId', (req,res) => {
    const tid = parseInt(req.params.torneoId);
    res.json(equipos.filter(e => e.torneoId === tid));
});
app.post('/equipos', (req,res) => {
    const equipo = { id: siguienteEquipoId++, ...req.body };
    equipos.push(equipo);
    res.json(equipo);
});

// PARTIDOS
app.get('/partidos/:torneoId', (req,res) => {
    const tid = parseInt(req.params.torneoId);
    res.json(partidos.filter(p => p.torneoId === tid));
});
app.post('/partidos', (req,res) => {
    const partido = { id: siguientePartidoId++, resultado1: null, resultado2: null, ...req.body };
    partidos.push(partido);
    res.json(partido);
});

// RESULTADOS
app.post('/resultados/:partidoId', (req,res) => {
    const pid = parseInt(req.params.partidoId);
    const partido = partidos.find(p => p.id === pid);
    if(!partido) return res.status(404).json({error:"Partido no encontrado"});
    partido.resultado1 = req.body.resultado1;
    partido.resultado2 = req.body.resultado2;
    res.json(partido);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
