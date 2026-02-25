const express = require("express");
const router = express.Router();
const Torneo = require("./torneo");
const Equipo = require("./equipo");
const Partido = require("./partido");

// --------------------- TORNEOS ---------------------

router.post("/torneos", async (req, res) => {
  try {
    const torneo = new Torneo(req.body);
    await torneo.save();
    res.status(201).json(torneo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando torneo" });
  }
});

router.get("/torneos", async (req, res) => {
  try {
    const torneos = await Torneo.find();
    res.json(torneos);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo torneos" });
  }
});

router.delete("/torneos/:id", async (req, res) => {
  try {
    const torneoId = req.params.id;

    await Torneo.findByIdAndDelete(torneoId);
    await Equipo.deleteMany({ torneo_id: torneoId });
    await Partido.deleteMany({ torneo_id: torneoId });

    res.json({ message: "Torneo eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error borrando torneo" });
  }
});

// --------------------- EQUIPOS ---------------------

router.post("/equipos", async (req, res) => {
  try {
    const equipo = new Equipo(req.body);
    await equipo.save();
    res.status(201).json(equipo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando equipo" });
  }
});

router.get("/equipos/:torneoId", async (req, res) => {
  try {
    const equipos = await Equipo.find({ torneo_id: req.params.torneoId });
    res.json(equipos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo equipos" });
  }
});

// ✅ NUEVO: borrar equipo
router.delete("/equipos/:id", async (req, res) => {
  try {
    const equipoId = req.params.id;

    await Equipo.findByIdAndDelete(equipoId);

    // borrar partidos donde participe
    await Partido.deleteMany({
      $or: [
        { equipo1_id: equipoId },
        { equipo2_id: equipoId }
      ]
    });

    res.json({ message: "Equipo eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error borrando equipo" });
  }
});

// --------------------- PARTIDOS ---------------------

router.post("/partidos", async (req, res) => {
  try {
    const partido = new Partido({
      ...req.body,
      resultado_equipo1:
        req.body.resultado_equipo1 !== null
          ? Number(req.body.resultado_equipo1)
          : null,
      resultado_equipo2:
        req.body.resultado_equipo2 !== null
          ? Number(req.body.resultado_equipo2)
          : null,
    });

    await partido.save();
    res.status(201).json(partido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando partido" });
  }
});

router.get("/partidos/:torneoId", async (req, res) => {
  try {
    const partidos = await Partido.find({ torneo_id: req.params.torneoId });
    res.json(partidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo partidos" });
  }
});

// ✅ NUEVO: borrar partido
router.delete("/partidos/:id", async (req, res) => {
  try {
    await Partido.findByIdAndDelete(req.params.id);
    res.json({ message: "Partido eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error borrando partido" });
  }
});

// actualizar resultado
router.put("/partidos/:id", async (req, res) => {
  try {
    const partido = await Partido.findByIdAndUpdate(
      req.params.id,
      {
        resultado_equipo1:
          req.body.resultado_equipo1 !== null
            ? Number(req.body.resultado_equipo1)
            : null,
        resultado_equipo2:
          req.body.resultado_equipo2 !== null
            ? Number(req.body.resultado_equipo2)
            : null,
        estado: "jugado",
      },
      { new: true }
    );

    res.json(partido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando partido" });
  }
});

module.exports = router;