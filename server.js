const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Torneo = require('./models/torneo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// RUTAS DEL BACKEND
// =====================

// Crear torneo
app.post('/api/torneos', async (req, res) => {
    try {
        const { name, sessionId } = req.body;
        if (!name || !sessionId) return res.status(400).json({ message: 'Faltan datos' });

        const nuevoTorneo = new Torneo({ name, sessionId, teams: [], matches: [] });
        await nuevoTorneo.save();
        res.status(201).json(nuevoTorneo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando el torneo' });
    }
});

// Listar torneos
app.get('/api/torneos/:sessionId', async (req,res) => {
    try {
        const torneos = await Torneo.find({ sessionId: req.params.sessionId });
        res.json(torneos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cargando torneos' });
    }
});

// Obtener torneo por ID
app.get('/api/torneos/id/:id', async (req,res) => {
    try{
        const torneo = await Torneo.findById(req.params.id);
        if(!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
        res.json(torneo);
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo torneo' });
    }
});

// =====================
// EQUIPOS
// =====================

// Añadir equipo
app.put('/api/torneos/:torneoId/equipos', async (req,res)=>{
    try{
        const torneo = await Torneo.findById(req.params.torneoId);
        if(!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
        const { name } = req.body;
        torneo.teams.push({ name, points:0, wins:0, draws:0, losses:0, goalsFor:0, goalsAgainst:0 });
        await torneo.save();
        res.json({ message: 'Equipo añadido' });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error añadiendo equipo' });
    }
});

// Eliminar equipo
app.delete('/api/torneos/:torneoId/equipos/:equipoId', async (req,res)=>{
    try{
        const torneo = await Torneo.findById(req.params.torneoId);
        if(!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
        torneo.teams = torneo.teams.filter(t => t._id.toString() !== req.params.equipoId);
        await torneo.save();
        res.json({ message: 'Equipo eliminado' });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error eliminando equipo' });
    }
});

// =====================
// PARTIDOS
// =====================

// Añadir partido
app.put('/api/torneos/:torneoId/partidos', async (req,res)=>{
    try{
        const torneo = await Torneo.findById(req.params.torneoId);
        if(!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });

        const { teamA, teamB, scoreA, scoreB } = req.body;
        const equipo1 = torneo.teams.find(t => t.name === teamA);
        const equipo2 = torneo.teams.find(t => t.name === teamB);
        if(!equipo1 || !equipo2) return res.status(400).json({ message: 'Equipo no encontrado' });

        torneo.matches.push({ teamA, teamB, scoreA, scoreB });

        equipo1.goalsFor += scoreA;
        equipo1.goalsAgainst += scoreB;
        equipo2.goalsFor += scoreB;
        equipo2.goalsAgainst += scoreA;

        if(scoreA > scoreB){
            equipo1.points +=3; equipo1.wins +=1; equipo2.losses +=1;
        } else if(scoreA < scoreB){
            equipo2.points +=3; equipo2.wins +=1; equipo1.losses +=1;
        } else{
            equipo1.points +=1; equipo2.points +=1; equipo1.draws +=1; equipo2.draws +=1;
        }

        await torneo.save();
        res.json({ message: 'Partido añadido' });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error añadiendo partido' });
    }
});

// Eliminar partido
app.delete('/api/torneos/:torneoId/partidos/:matchId', async (req,res)=>{
    try{
        const torneo = await Torneo.findById(req.params.torneoId);
        if(!torneo) return res.status(404).json({ message: 'Torneo no encontrado' });
        torneo.matches = torneo.matches.filter(m => m._id.toString() !== req.params.matchId);
        await torneo.save();
        res.json({ message: 'Partido eliminado' });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error eliminando partido' });
    }
});

// =====================
// ELIMINAR TORNEO
// =====================
app.delete('/api/torneos/:torneoId', async (req,res)=>{
    try{
        await Torneo.findByIdAndDelete(req.params.torneoId);
        res.json({ message: 'Torneo eliminado' });
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error eliminando torneo' });
    }
});

// =====================
// SERVIR FRONTEND
// =====================
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});

// =====================
// CONEXIÓN MONGO
// =====================
const mongoURI = process.env.MONGO_URI;
if(!mongoURI){
    console.error('❌ Error: MONGO_URI no definida');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(()=>console.log('✅ MongoDB conectado'))
    .catch(err=>{
        console.error('❌ Error conectando a MongoDB', err);
        process.exit(1);
    });

// =====================
// PUERTO
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`🚀 Backend corriendo en puerto ${PORT}`));