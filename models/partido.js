const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  torneo_id: mongoose.Schema.Types.ObjectId,
  equipo1_id: mongoose.Schema.Types.ObjectId,
  equipo2_id: mongoose.Schema.Types.ObjectId,
  fecha_hora: Date,
  resultado_equipo1: Number,
  resultado_equipo2: Number,
  estado: String
});

module.exports = mongoose.model('Partido', PartidoSchema);
