import React, { useMemo } from "react";

const Clasificacion = ({ equipos, partidos }) => {
  const tabla = useMemo(() => {
    if (!equipos) return [];

    const stats = {};
    equipos.forEach(eq => {
      stats[eq] = { equipo: eq, PJ:0, PG:0, PE:0, PP:0, GF:0, GC:0, PTS:0 };
    });

    if (!partidos) return Object.values(stats);

    partidos.forEach(p => {
      if (p.golesLocal === null || p.golesVisitante === null) return;

      const gl = Number(p.golesLocal);
      const gv = Number(p.golesVisitante);

      if (!stats[p.local] || !stats[p.visitante]) return;

      stats[p.local].PJ++;
      stats[p.visitante].PJ++;
      stats[p.local].GF += gl;
      stats[p.local].GC += gv;
      stats[p.visitante].GF += gv;
      stats[p.visitante].GC += gl;

      if(gl>gv){
        stats[p.local].PG++; stats[p.local].PTS +=3;
        stats[p.visitante].PP++;
      } else if(gl<gv){
        stats[p.visitante].PG++; stats[p.visitante].PTS +=3;
        stats[p.local].PP++;
      } else{
        stats[p.local].PE++; stats[p.visitante].PE++;
        stats[p.local].PTS++; stats[p.visitante].PTS++;
      }
    });

    return Object.values(stats).sort((a,b)=>b.PTS-a.PTS);
  }, [equipos, partidos]);

  return (
    <table className="tabla-clasificacion">
      <thead>
        <tr>
          <th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>PTS</th>
        </tr>
      </thead>
      <tbody>
        {tabla.map(e=>(
          <tr key={e.equipo}>
            <td>{e.equipo}</td>
            <td>{e.PJ}</td>
            <td>{e.PG}</td>
            <td>{e.PE}</td>
            <td>{e.PP}</td>
            <td>{e.GF}</td>
            <td>{e.GC}</td>
            <td>{e.PTS}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Clasificacion;