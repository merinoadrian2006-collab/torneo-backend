const mongoose = require("mongoose");

const PartidoSchema = new mongoose.Schema({
  torneo_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  equipo1_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  equipo2_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  fecha_hora: { type: Date, default: Date.now },
  resultado_equipo1: { type: Number, default: null },
  resultado_equipo2: { type: Number, default: null },
  estado: { type: String, default: "pendiente" }
});

module.exports = mongoose.models.Partido || mongoose.model("Partido", PartidoSchema);