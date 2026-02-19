const mongoose = require('mongoose');

const EquipoSchema = new mongoose.Schema({
  torneo_id: mongoose.Schema.Types.ObjectId,
  nombre: String,
  miembros: [String],
  categoria: String
});

module.exports = mongoose.model('Equipo', EquipoSchema);
