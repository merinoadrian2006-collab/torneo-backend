const mongoose = require("mongoose");

const TorneoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  deporte: { type: String, required: true },
  fecha_inicio: { type: Date, default: Date.now },
  fecha_fin: { type: Date },
  ubicacion: { type: String }
});

module.exports = mongoose.models.Torneo || mongoose.model("Torneo", TorneoSchema);