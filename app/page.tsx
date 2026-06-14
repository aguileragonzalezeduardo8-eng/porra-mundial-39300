import Link from "next/link";
import { supabase } from "./lib/supabase";
import Registro from "./components/Registro";
import PronosticosEspeciales from "./components/PronosticosEspeciales";
import Hero from "./components/Hero";
import Top3 from "./components/Top3";
import PartidoCard from "./components/PartidoCard";

export const dynamic = "force-dynamic";

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
    console.log(
  "Participantes:",
  participantes
);

  const { data: pronosticos } = await supabase
    .from("pronosticos")
    .select("*");

    const {
  data: pronosticosEspeciales,
} = await supabase
  .from("pronosticos_especiales")
  .select("*");

  const totalPronosticos =
    pronosticos?.length ?? 0;

  const totalPartidosFinalizados =
    partidos?.filter(
      (p) => p.estado === "finalizado"
    ).length ?? 0;

  const clasificacion =
    participantes?.map((participante) => {
      let puntos = 0;
      let exactos = 0;
      let signos = 0;

      const pronosticosParticipante =
        pronosticos?.filter(
          (p) =>
            p.participante_id ===
            participante.id
        ) || [];

      pronosticosParticipante.forEach(
        (pronostico) => {
          const partido =
            partidos?.find(
              (p) =>
                p.id ===
                pronostico.partido_id
            );

          if (
            !partido ||
            partido.estado !==
              "finalizado"
          ) {
            return;
          }

          const realLocal =
            partido.goles_local;

          const realVisitante =
            partido.goles_visitante;

          const pronLocal =
            pronostico.goles_local;

          const pronVisitante =
            pronostico.goles_visitante;

          if (
            realLocal === pronLocal &&
            realVisitante ===
              pronVisitante
          ) {
            puntos += 5;
            exactos += 1;
            return;
          }

          const realSigno =
            realLocal >
            realVisitante
              ? "1"
              : realLocal <
                realVisitante
              ? "2"
              : "X";

          const pronSigno =
            pronLocal >
            pronVisitante
              ? "1"
              : pronLocal <
                pronVisitante
              ? "2"
              : "X";

          if (
            realSigno ===
            pronSigno
          ) {
            puntos += 2;
            signos += 1;
          }
        }
      );

      return {
        id: participante.id,
        nombre:
          participante.nombre,
        puntos,
        exactos,
        signos,
        pronosticos:
          pronosticosParticipante.length,
      };
    }) || [];

  clasificacion.sort(
    (a, b) => b.puntos - a.puntos
  );

  const lider = clasificacion[0];

  const ahora = new Date();
  const aperturaEspeciales =
  new Date(
    "2026-06-11T21:00:00+02:00"
  );

const especialesVisibles =
  ahora >= aperturaEspeciales;

  const partidosPronosticables =
    partidos?.filter((partido) => {
      if (
        partido.estado ===
        "finalizado"
      ) {
        return false;
      }

      const fecha = new Date(
        partido.fecha_partido
      );

      const apertura =
        new Date(fecha);

apertura.setDate(
  apertura.getDate() - 2
);
apertura.setHours(
  0,
  0,
  0,
  0
);

 return (
  (partido.id === 11 ||
    ahora >= apertura) &&
  ahora < fecha
);
}) || [];

  const partidosProximos =
    partidos?.filter((partido) => {
      if (
        partido.estado ===
        "finalizado"
      ) {
        return false;
      }

      const fecha = new Date(
        partido.fecha_partido
      );

      const apertura =
        new Date(fecha);

apertura.setDate(
  apertura.getDate() - 2
);
apertura.setHours(
  0,
  0,
  0,
  0
);
return (
  partido.id !== 11 &&
  ahora < apertura
);
}) || [];

  const partidosFinalizados =
    partidos?.filter(
      (partido) =>
        partido.estado ===
        "finalizado"
    ) || [];

    const partidosEnJuego =
  partidos?.filter((partido) => {
    if (
      partido.estado ===
      "finalizado"
    ) {
      return false;
    }

    const fecha = new Date(
      partido.fecha_partido
    );

    return ahora >= fecha;
  }) || [];

    
  
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <Hero
        participantes={count ?? 0}
        pronosticos={
          totalPronosticos
        }
        partidosFinalizados={
          totalPartidosFinalizados
        }
      />

      <Registro />
      <section
  style={{
    marginTop: "40px",
    marginBottom: "40px",
  }}
>
  <h2
    style={{
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
    }}
  >
    🏆 Pronósticos especiales
  </h2>

  {!especialesVisibles ? (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      🔒 Los pronósticos especiales se
      harán públicos al inicio del
      Mundial.
    </div>
  ) : (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {pronosticosEspeciales?.map(
        (p) => {
          const participante =
            participantes?.find(
              (usuario) =>
                usuario.id ===
                p.participante_id
            );

          return (
            <div
              key={p.id}
              style={{
                padding: "18px",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {
                  participante?.nombre
                }
              </div>

              <div>
                🏆 Campeón: {p.campeon}
              </div>

              <div>
                ⚽ Máximo goleador:{" "}
                {
                  p.maximo_goleador
                }
              </div>
            </div>
          );
        }
      )}
    </div>
  )}
</section>

      <PronosticosEspeciales />

      {lider && (
        <div
          style={{
            background:
              "#fff7d6",
            border:
              "2px solid #facc15",
            borderRadius:
              "12px",
            padding: "20px",
            marginTop: "30px",
            marginBottom:
              "30px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight:
                "bold",
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

      <section
        style={{
          marginTop: "40px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight:
              "bold",
            marginBottom:
              "20px",
          }}
        >
          🏆 Podio
        </h2>

        <Top3
          clasificacion={
            clasificacion
          }
        />
      </section>

      <section
        style={{
          marginTop: "40px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight:
              "bold",
            marginBottom:
              "20px",
          }}
        >
          📊 Clasificación completa
        </h2>

        <div
          style={{
            border:
              "1px solid #ddd",
            borderRadius:
              "12px",
            overflow:
              "hidden",
          }}
        >
          {clasificacion.map(
            (
              usuario,
              index
            ) => {
              let puesto = `${
                index + 1
              }`;

              if (index === 0)
                puesto = "🥇";

              if (index === 1)
                puesto = "🥈";

              if (index === 2)
                puesto = "🥉";

              const diferencia =
                lider
                  ? lider.puntos -
                    usuario.puntos
                  : 0;

              return (
                <div
                  key={
                    usuario.id
                  }
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    padding:
                      "18px",
                    borderBottom:
                      index !==
                      clasificacion.length -
                        1
                        ? "1px solid #eee"
                        : "none",
                    background:
                      index ===
                      0
                        ? "#fefce8"
                        : "white",
                  }}
                >
                  <div>
                    <Link
  href={`/participante/${usuario.id}`}
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <div
    style={{
      fontWeight:
        "bold",
      fontSize:
        "18px",
      cursor:
        "pointer",
    }}
  >
    {puesto}{" "}
    {usuario.nombre}
  </div>
</Link>

                    <div
                      style={{
                        marginTop:
                          "4px",
                        fontSize:
                          "13px",
                        color:
                          "#666",
                      }}
                    >
                      🎯{" "}
                      {
                        usuario.exactos
                      }{" "}
                      exactos · ⚽{" "}
                      {
                        usuario.signos
                      }{" "}
                      signos · 📝{" "}
                      {
                        usuario.pronosticos
                      }{" "}
                      pronósticos
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "22px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {
                        usuario.puntos
                      }{" "}
                      pts
                    </div>

                    {index >
                      0 && (
                      <div
                        style={{
                          color:
                            "#666",
                          fontSize:
                            "13px",
                        }}
                      >
                        -
                        {
                          diferencia
                        }{" "}
                        del líder
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      <section
        style={{
          marginTop: "50px",
        }}
      >
       
        <h2
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  }}
>
  🔴 En juego
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    marginBottom: "50px",
  }}
>
  {partidosEnJuego.map(
    (partido) => (
      <PartidoCard
        key={partido.id}
        partido={partido}
      />
    )
  )}
</div>
       
        <h2
          style={{
            fontSize: "28px",
            fontWeight:
              "bold",
            marginBottom:
              "20px",
          }}
        >
          🔥 Pronosticables ahora
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginBottom:
              "50px",
          }}
        >
          {partidosPronosticables.map(
            (
              partido
            ) => (
              <PartidoCard
                key={
                  partido.id
                }
                partido={
                  partido
                }
              />
            )
          )}
        </div>

        <h2
          style={{
            fontSize: "28px",
            fontWeight:
              "bold",
            marginBottom:
              "20px",
          }}
        >
          📅 Próximamente
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginBottom:
              "50px",
          }}
        >
          {partidosProximos.map(
            (
              partido
            ) => (
              <PartidoCard
                key={
                  partido.id
                }
                partido={
                  partido
                }
              />
            )
          )}
        </div>

       

<h2
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  }}
>
  🏁 Finalizados
</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {partidosFinalizados.map(
            (
              partido
            ) => (
              <PartidoCard
                key={
                  partido.id
                }
                partido={
                  partido
                }
              />
            )
          )}
        </div>
      </section>
    </main>
  );
}