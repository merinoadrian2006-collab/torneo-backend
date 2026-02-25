import React, { useState, useEffect } from "react";

const FasesEliminatorias = ({ equipos }) => {
  const [rondas, setRondas] = useState([]);

  useEffect(() => {
    if (!equipos || equipos.length < 2) return;

    const nextPowerOf2 = 2 ** Math.ceil(Math.log2(equipos.length));
    const equiposConByes = [...equipos];
    while (equiposConByes.length < nextPowerOf2) {
      equiposConByes.push({ id: null, nombre: "Bye" });
    }

    const ronda1 = [];
    for (let i = 0; i < equiposConByes.length; i += 2) {
      ronda1.push({
        id: `${i / 2}`,
        equipo1: equiposConByes[i],
        equipo2: equiposConByes[i + 1],
        res1: "",
        res2: "",
        ganador: null,
      });
    }

    setRondas([ronda1]);
  }, [equipos]);

  const actualizarResultado = (rondaIdx, partidoIdx, res1, res2) => {
    const nuevasRondas = [...rondas];
    const partido = nuevasRondas[rondaIdx][partidoIdx];
    partido.res1 = res1;
    partido.res2 = res2;

    if (res1 !== "" && res2 !== "") {
      if (!partido.equipo1.id) partido.ganador = partido.equipo2;
      else if (!partido.equipo2.id) partido.ganador = partido.equipo1;
      else partido.ganador = parseInt(res1) >= parseInt(res2) ? partido.equipo1 : partido.equipo2;
    } else {
      partido.ganador = null;
    }

    const siguienteRonda = [];
    const rondaActual = nuevasRondas[rondaIdx];

    for (let i = 0; i < rondaActual.length; i += 2) {
      const p1 = rondaActual[i].ganador;
      const p2 = rondaActual[i + 1]?.ganador;
      if (p1 && p2) {
        siguienteRonda.push({
          id: `${rondaIdx + 1}-${i / 2}`,
          equipo1: p1,
          equipo2: p2,
          res1: "",
          res2: "",
          ganador: null,
        });
      }
    }

    if (siguienteRonda.length > 0) {
      if (rondas.length > rondaIdx + 1) {
        nuevasRondas[rondaIdx + 1] = siguienteRonda;
      } else {
        nuevasRondas.push(siguienteRonda);
      }
    }

    setRondas(nuevasRondas);
  };

  const nombreFase = (numPartidos) => {
    if (numPartidos >= 8) return "Octavos";
    if (numPartidos === 4) return "Cuartos";
    if (numPartidos === 2) return "Semifinal";
    if (numPartidos === 1) return "Final";
    return "";
  };

  return (
    <div>
      {rondas.map((ronda, idx) => (
        <div key={idx} className="fase">
          {ronda.map((p, i) => (
            <div
              key={p.id}
              className={`partido ${p.ganador === null && p.res1 !== "" && p.res2 !== "" ? "eliminado" : ""}`}
            >
              <strong>{nombreFase(ronda.length)}</strong>
              <p>{p.equipo1?.nombre} vs {p.equipo2?.nombre}</p>
              {p.equipo2?.id && (
                <>
                  <input type="number" placeholder="0" value={p.res1} onChange={(e)=>actualizarResultado(idx,i,e.target.value,p.res2)} />
                  <input type="number" placeholder="0" value={p.res2} onChange={(e)=>actualizarResultado(idx,i,p.res1,e.target.value)} />
                </>
              )}
              {p.ganador && <p style={{ color: "#0f0" }}>Ganador: {p.ganador.nombre}</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FasesEliminatorias;
