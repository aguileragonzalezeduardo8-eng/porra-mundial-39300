import { supabase } from "./lib/supabase";
import Registro from "./components/Registro";
import Hero from "./components/Hero";
import Top3 from "./components/Top3";
import PartidoCard from "./components/PartidoCard";

export default async function Home() {
  const { count } = await supabase
    .from("participantes")
    .select("*", { count: "exact", head: true });

  const { data: partidos } = await supabase
    .from("partidos")
    .select("*")
    .order("fecha_partido", { ascending: true });

  const { data: participantes } = await supabase
    .from("participantes")
    .select("*");

  const { data: pronosticos } = await supabase
    .from("pronosticos")
    .select("*");

  const clasificacion =
    participantes?.map((participante) => {
      let puntos = 0;

      const pronosticosParticipante =
        pronosticos?.filter(
          (p) => p.participante_id === participante.id
        ) || [];

      pronosticosParticipante.forEach((pronostico) => {
        const partido = partidos?.find(
          (p) => p.id === pronostico.partido_id
        );

        if (!partido || partido.estado !== "finalizado") {
          return;
        }

        const realLocal = partido.goles_local;
        const realVisitante = partido.goles_visitante;

        const pronLocal = pronostico.goles_local;
        const pronVisitante = pronostico.goles_visitante;

        if (
          realLocal === pronLocal &&
          realVisitante === pronVisitante
        ) {
          puntos += 5;
          return;
        }

        const realSigno =
          realLocal > realVisitante
            ? "1"
            : realLocal < realVisitante
            ? "2"
            : "X";

        const pronSigno =
          pronLocal > pronVisitante
            ? "1"
            : pronLocal < pronVisitante
            ? "2"
            : "X";

        if (realSigno === pronSigno) {
          puntos += 2;
        }
      });

      return {
        id: participante.id,
        nombre: participante.nombre,
        puntos,
        pronosticos: pronosticosParticipante.length,
      };
    }) || [];

  clasificacion.sort((a, b) => b.puntos - a.puntos);

  const lider = clasificacion[0];

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <Hero participantes={count ?? 0} />

      <Registro />

      {lider && (
        <div
          style={{
            background: "#fff7d6",
            border: "2px solid #facc15",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            🏆 Líder actual
          </h2>

          <div
            style={{
              marginTop: "10px",
              fontSize: "20px",
            }}
          >
            {lider.nombre}
          </div>

          <div>
            {lider.puntos} puntos
          </div>
        </div>
      )}

      <section style={{ marginTop: "40px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          🏆 Podio
        </h2>

        <Top3 clasificacion={clasificacion} />
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          📊 Clasificación completa
        </h2>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {clasificacion.map((usuario, index) => (
            <div
              key={usuario.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
                borderBottom:
                  index !== clasificacion.length - 1
                    ? "1px solid #eee"
                    : "none",
              }}
            >
              <div>
                {index + 1}. {usuario.nombre}
              </div>

              <strong>
                {usuario.puntos} pts
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "50px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          ⚽ Partidos
        </h2>

        {!partidos || partidos.length === 0 ? (
          <p>No hay partidos cargados todavía.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {partidos.map((partido) => (
              <PartidoCard
                key={partido.id}
                partido={partido}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}