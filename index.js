const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // PRIMERÍSIMO

const app = express();
app.use(cors({
  origin: "https://merinoadrian2006-collab.github.io"
}));
app.use(express.json());

// Importar rutas
const rutas = require("./rutas");
app.use("/", rutas);

// Conexión a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en http://localhost:${PORT}`));