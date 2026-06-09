"use client";

import { useEffect, useState } from "react";

export default function PerfilPage() {
  const [cargando, setCargando] =
    useState(true);

  const [perfil, setPerfil] =
    useState<any>(null);

  const [pronosticos, setPronosticos] =
    useState<any[]>([]);

  const [partidos, setPartidos] =
    useState<any[]>([]);
    const [participantes, setParticipantes] =
  useState<any[]>([]);

const [estadisticas, setEstadisticas] =
  useState({
    posicion: 0,
    total: 0,
    puntos: 0,
    exactos: 0,
    signos: 0,
    distancia: 0,
  });

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const participanteId =
          localStorage.getItem("id");

        if (!participanteId) {
          setCargando(false);
          return;
        }

        const participantesRes =
          await fetch(
            "/api/participantes"
          );

        const participantes =
          await participantesRes.json();
          setParticipantes(
  participantes || []
);

        const participante =
          participantes.find(
            (p: any) =>
              p.id ===
              Number(participanteId)
          );

        setPerfil(participante);

        const pronosticosRes =
          await fetch(
            "/api/pronosticos?participante_id=" +
              participanteId
          );

        const pronosticosData =
          await pronosticosRes.json();

        setPronosticos(
          pronosticosData || []
        );

        const partidosRes =
          await fetch(
            "/api/partidos"
          );

        const partidosData =
          await partidosRes.json();

        setPartidos(
          partidosData || []
        );
      } catch (error) {
        console.error(error);
      }

      setCargando(false);
    }

    cargarPerfil();
  }, []);
useEffect(() => {
  if (
    !perfil ||
    participantes.length === 0 ||
    partidos.length === 0
  ) {
    return;
  }

  let misPuntos = 0;
  let misExactos = 0;
  let misSignos = 0;

  pronosticos.forEach(
    (pronostico) => {
      const partido =
        partidos.find(
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
        misPuntos += 5;
        misExactos += 1;
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
        pronLocal >
        pronVisitante
          ? "1"
          : pronLocal <
            pronVisitante
          ? "2"
          : "X";

      if (
        signoReal === signoPron
      ) {
        misPuntos += 2;
        misSignos += 1;
      }
    }
  );

  const clasificacion =
    participantes.map(
      (participante) => ({
        id: participante.id,
        puntos:
          participante.id ===
          perfil.id
            ? misPuntos
            : participante.puntos ??
              0,
      })
    );

  clasificacion.sort(
    (a, b) =>
      b.puntos - a.puntos
  );

  const posicion =
    clasificacion.findIndex(
      (p) =>
        p.id === perfil.id
    ) + 1;

  const lider =
    clasificacion[0];

  setEstadisticas({
    posicion,
    total:
      clasificacion.length,
    puntos: misPuntos,
    exactos: misExactos,
    signos: misSignos,
    distancia:
      lider.puntos -
      misPuntos,
  });
}, [
  perfil,
  participantes,
  partidos,
  pronosticos,
]);
  if (cargando) {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        Cargando perfil...
      </main>
    );
  }

  if (!perfil) {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h1>
          Debes registrarte primero
        </h1>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #2563eb, #1e40af)",
          color: "white",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "10px",
          }}
        >
          👤 Mi perfil
        </h1>

        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {perfil.nombre}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          📊 Resumen
        </h2>

        <p>
          🆔 ID participante:{" "}
          {perfil.id}
        </p>

       <p>
  🏅 Posición:{" "}
  {estadisticas.posicion}
  º de{" "}
  {estadisticas.total}
</p>

<p>
  🏆 Puntos:{" "}
  {estadisticas.puntos}
</p>

<p>
  📝 Pronósticos:{" "}
  {pronosticos.length}
</p>

<p>
  🎯 Exactos:{" "}
  {estadisticas.exactos}
</p>

<p>
  ⚽ Signos:{" "}
  {estadisticas.signos}
</p>

<p>
  📉 Distancia al líder:{" "}
  {estadisticas.distancia}
</p>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "25px",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          📝 Mis pronósticos
        </h2>

        {pronosticos.length === 0 ? (
          <p>
            Aún no has realizado
            ningún pronóstico.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "10px",
            }}
          >
            {pronosticos.map(
              (pronostico) => {
                const partido =
                  partidos.find(
                    (p) =>
                      p.id ===
                      pronostico.partido_id
                  );

                return (
                  <div
                    key={
                      pronostico.id
                    }
                    style={{
                      border:
                        "1px solid #eee",
                      borderRadius:
                        "8px",
                      padding:
                        "12px",
                    }}
                  >
                    <div
  style={{
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "6px",
  }}
>
  {partido
    ? `${partido.equipo_local} vs ${partido.equipo_visitante}`
    : `Partido ID ${pronostico.partido_id}`}
</div>

{partido && (
  <>
    <div
      style={{
        color: "#666",
        fontSize: "14px",
      }}
    >
      📅{" "}
      {new Date(
        partido.fecha_partido
      ).toLocaleString("es-ES")}
    </div>

    <div
      style={{
        color: "#666",
        fontSize: "14px",
        marginBottom: "10px",
      }}
    >
      🏷️ Grupo {partido.grupo}
    </div>
  </>
)}

                    <div
  style={{
    marginTop: "5px",
  }}
>
  Pronóstico:{" "}
  {pronostico.goles_local}
  -
  {pronostico.goles_visitante}
</div>

{partido?.estado ===
"finalizado" ? (
  <>
    <div>
      Resultado:{" "}
      {partido.goles_local}
      -
      {partido.goles_visitante}
    </div>

    <div
      style={{
        fontWeight: "bold",
        marginTop: "5px",
      }}
    >
      {(() => {
        const realLocal =
          partido.goles_local;

        const realVisitante =
          partido.goles_visitante;

        const pronLocal =
          pronostico.goles_local;

        const pronVisitante =
          pronostico.goles_visitante;

        if (
          realLocal ===
            pronLocal &&
          realVisitante ===
            pronVisitante
        ) {
return "🟢 🏆 +5 puntos";        }

        const signoReal =
          realLocal >
          realVisitante
            ? "1"
            : realLocal <
              realVisitante
            ? "2"
            : "X";

        const signoPron =
          pronLocal >
          pronVisitante
            ? "1"
            : pronLocal <
              pronVisitante
            ? "2"
            : "X";

        if (
          signoReal ===
          signoPron
        ) {
          return "🟢 ⚽ +2 puntos";
        }

        return "🔴 ❌ 0 puntos";
      })()}
    </div>
  </>
) : (
  <div
    style={{
      marginTop: "5px",
      color: "#2563eb",
      fontWeight: "bold",
    }}
  >
    ⏳ Pendiente
  </div>
)}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}