const mongoose = require("mongoose");

const EquipoSchema = new mongoose.Schema({
  torneo_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  nombre: { type: String, required: true },
  miembros: { type: [String], default: [] },
  puntos: { type: Number, default: 0 } // puntos del equipo
});

module.exports = mongoose.models.Equipo || mongoose.model("Equipo", EquipoSchema);