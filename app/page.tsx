import Link from "next/link";
import { supabase } from "./lib/supabase";
import Registro from "./components/Registro";
import PronosticosEspeciales from "./components/PronosticosEspeciales";
import Hero from "./components/Hero";
import Top3 from "./components/Top3";
import PartidoCard from "./components/PartidoCard";
import Goleadores from "./components/goleadores";

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

const {
  data: pronosticos,
  count: totalPronosticosReal,
  error,
} = await supabase
  .from("pronosticos")
  .select("*", {
    count: "exact",
  });

console.log(
  "ERROR:",
  error
);

console.log(
  "TOTAL REAL:",
  totalPronosticosReal
);

console.log(
  "TOTAL CARGADOS:",
  pronosticos?.length
);

    const {
  data: pronosticosEspeciales,
} = await supabase
  .from("pronosticos_especiales")
  .select("*");

const totalPronosticos =
  totalPronosticosReal ?? 0;

    console.log(
  "TOTAL PRONOSTICOS:",
  pronosticos?.length
);

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

const gruposEliminatorias = [
  "Dieciseisavos",
  "Octavos",
  "Cuartos",
  "Semifinales",
  "3º y 4º puesto",
  "Final",
];

const clasificacionEliminatorias =
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
            "finalizado" ||
          !gruposEliminatorias.includes(
            partido.grupo
          )
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

    const pronosticosEliminatorias =
      pronosticosParticipante.filter(
        (pronostico) => {
          const partido =
            partidos?.find(
              (p) =>
                p.id ===
                pronostico.partido_id
            );

          return (
            partido &&
            gruposEliminatorias.includes(
              partido.grupo
            )
          );
        }
      ).length;

    return {
      id: participante.id,
      nombre:
        participante.nombre,
      puntos,
      exactos,
      signos,
      pronosticos:
        pronosticosEliminatorias,
    };
  }) || [];

clasificacionEliminatorias.sort(
  (a, b) => {
    if (
      b.puntos !==
      a.puntos
    ) {
      return (
        b.puntos -
        a.puntos
      );
    }

    if (
      b.exactos !==
      a.exactos
    ) {
      return (
        b.exactos -
        a.exactos
      );
    }

    if (
      b.signos !==
      a.signos
    ) {
      return (
        b.signos -
        a.signos
      );
    }

    return a.nombre.localeCompare(
      b.nombre
    );
  }
);

const liderEliminatorias =
  clasificacionEliminatorias[0];

const reyExactosEliminatorias =
  [...clasificacionEliminatorias].sort(
    (a, b) =>
      b.exactos -
      a.exactos
  )[0];

const reySignosEliminatorias =
  [...clasificacionEliminatorias].sort(
    (a, b) =>
      b.signos -
      a.signos
  )[0];

const partidosEliminatoriasFinalizados =
  partidos?.filter(
    (p) =>
      gruposEliminatorias.includes(
        p.grupo
      ) &&
      p.estado ===
        "finalizado"
  ).length ?? 0;

  const lider = clasificacion[0];

const reyExactos =
  [...clasificacion].sort(
    (a, b) => b.exactos - a.exactos
  )[0];

const reySignos =
  [...clasificacion].sort(
    (a, b) => b.signos - a.signos
  )[0];

const ultimos10Partidos =
  partidos
    ?.filter(
      (p) =>
        p.estado ===
        "finalizado"
    )
    .sort(
      (a, b) =>
        new Date(
          b.fecha_partido
        ).getTime() -
        new Date(
          a.fecha_partido
        ).getTime()
    )
    .slice(0, 10) || [];

const mejorRacha =
  clasificacion
    .map((participante) => {
      let puntosRacha = 0;

      const pronosticosJugador =
        pronosticos?.filter(
          (p) =>
            p.participante_id ===
            participante.id
        ) || [];

      ultimos10Partidos.forEach(
        (partido) => {
          const pronostico =
            pronosticosJugador.find(
              (p) =>
                p.partido_id ===
                partido.id
            );

          if (!pronostico) {
            return;
          }

          const realLocal =
            partido.goles_local;

          const realVisitante =
            partido.goles_visitante;

          if (
            realLocal ===
              pronostico.goles_local &&
            realVisitante ===
              pronostico.goles_visitante
          ) {
            puntosRacha += 5;
            return;
          }

          const signoReal =
            realLocal >
            realVisitante
              ? "1"
              : realLocal <
                realVisitante
              ? "2"
              : "X";

          const signoPron =
            pronostico.goles_local >
            pronostico.goles_visitante
              ? "1"
              : pronostico.goles_local <
                pronostico.goles_visitante
              ? "2"
              : "X";

          if (
            signoReal ===
            signoPron
          ) {
            puntosRacha += 2;
          }
        }
      );

      return {
        nombre:
          participante.nombre,
        puntosRacha,
      };
    })
    .sort(
      (a, b) =>
        b.puntosRacha -
        a.puntosRacha
    )[0];

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
  <details
  style={{
    marginBottom: "20px",
  }}
>
  <summary
    style={{
      fontSize: "28px",
      fontWeight: "bold",
      cursor: "pointer",
      marginBottom: "20px",
    }}
  >
    🏆 Ver todos los pronósticos especiales
  </summary>

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
  </details>
</section>

<Goleadores />

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
        <div
  style={{
    background: "#f8fafc",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "25px",
  }}
>
  <h2
    style={{
      marginTop: 0,
      marginBottom: "15px",
    }}
  >
    🏅 Distinciones
  </h2>

  <div>
    🎯 Más exactos:{" "}
    <strong>
      {reyExactos?.nombre}
    </strong>{" "}
    ({reyExactos?.exactos})
  </div>

  <div
    style={{
      marginTop: "8px",
    }}
  >
    ⚽ Más signos:{" "}
    <strong>
      {reySignos?.nombre}
    </strong>{" "}
    ({reySignos?.signos})
  </div>

  <div
  style={{
    marginTop: "8px",
  }}
>
  🔥 Mejor racha:{" "}
  <strong>
    {mejorRacha?.nombre}
  </strong>{" "}
  ({mejorRacha?.puntosRacha} pts en los últimos 10 partidos)
</div>
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
    marginTop: "4px",
    fontSize: "13px",
    color: "#666",
  }}
>
  🎯 {usuario.exactos} exactos · ⚽{" "}
  {usuario.signos} signos · 📝{" "}
  {usuario.pronosticos} pronósticos
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

      <details
  style={{
    marginTop: "30px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
  }}
>
  <summary
    style={{
      cursor: "pointer",
      padding: "18px",
      fontSize: "24px",
      fontWeight: "bold",
      background: "#fef3c7",
      userSelect: "none",
    }}
  >
    🏆 Clasificación de Eliminatorias ▼
  </summary>

  <div
  style={{
    padding: "18px",
    borderBottom: "1px solid #eee",
    background: "#fafafa",
  }}
>
  <div
    style={{
      color: "#666",
      fontSize: "14px",
      marginBottom: "12px",
    }}
  >
    ⚽ Se han disputado{" "}
    {partidosEliminatoriasFinalizados} de
    32 partidos.
  </div>

  <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "15px",
    fontWeight: "bold",
  }}
>
  <div>
    🥇 Líder:
    <br />
    {liderEliminatorias?.nombre} (
    {liderEliminatorias?.puntos} pts)
  </div>

  <div>
    🎯 Rey de Exactos:
    <br />
    {reyExactosEliminatorias?.nombre} (
    {reyExactosEliminatorias?.exactos})
  </div>

  <div>
    ⚽ Rey de Signos:
    <br />
    {reySignosEliminatorias?.nombre} (
    {reySignosEliminatorias?.signos})
  </div>
</div>
</div>

  {clasificacionEliminatorias.map(
    (usuario, index) => {
      let puesto = `${index + 1}`;

      if (index === 0)
        puesto = "🥇";

      if (index === 1)
        puesto = "🥈";

      if (index === 2)
        puesto = "🥉";

      const liderEliminatorias =
        clasificacionEliminatorias[0];

      const diferencia =
        liderEliminatorias
          ? liderEliminatorias.puntos -
            usuario.puntos
          : 0;

      return (
        <div
          key={usuario.id}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            padding: "18px",
            borderBottom:
              index !==
              clasificacionEliminatorias.length - 1
                ? "1px solid #eee"
                : "none",
            background:
  index === 0
    ? "#fef3c7"
    : "#fffaf0",
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
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {puesto} {usuario.nombre}
              </div>
            </Link>

            <div
  style={{
    marginTop: "4px",
    fontSize: "13px",
    color: "#666",
  }}
>
  🎯 {usuario.exactos} exactos · ⚽{" "}
  {usuario.signos} signos · 📝{" "}
  {usuario.pronosticos}/32 pronósticos
</div>
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              {usuario.puntos} pts
            </div>

            {index > 0 && (
              <div
                style={{
                  color: "#666",
                  fontSize: "13px",
                }}
              >
                -{diferencia} del líder
              </div>
            )}
          </div>
        </div>
      );
    }
  )}
</details>

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
  pronosticos={pronosticos}
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
  key={partido.id}
  partido={partido}
  pronosticos={pronosticos}
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
  key={partido.id}
  partido={partido}
  pronosticos={pronosticos}
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
  key={partido.id}
  partido={partido}
  pronosticos={pronosticos}
/>
            )
          )}
        </div>
      </section>
    </main>
  );
}