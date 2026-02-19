const mongoose = require('mongoose');

const TorneoSchema = new mongoose.Schema({
  nombre: String,
  deporte: String,
  fecha_inicio: Date,
  fecha_fin: Date,
  ubicacion: String
});

module.exports = mongoose.model('Torneo', TorneoSchema);
