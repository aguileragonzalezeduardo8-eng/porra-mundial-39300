import { supabase } from "@/app/lib/supabase";

export default async function ParticipantePage({
  params,
}: any) {

const resolvedParams =
  await params;

const participanteId = Number(
  resolvedParams.id
);

  console.log(
    "ID obtenido:",
    participanteId
  );
  
const {
  data: participante,
  error,
} = await supabase
  .from("participantes")
  .select("*")
  .eq("id", participanteId)
  .single();

console.log(
  "ID:",
  participanteId
);

console.log(
  "Participante:",
  participante
);

console.log(
  "Error:",
  error
);

  if (!participante) {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h1>
          Participante no encontrado
        </h1>
      </main>
    );
  }

  const {
    data: pronosticos,
  } = await supabase
    .from("pronosticos")
    .select("*")
    .eq(
      "participante_id",
      participanteId
    );

  const { data: partidos } =
    await supabase
      .from("partidos")
      .select("*");

  let puntos = 0;
  let exactos = 0;
  let signos = 0;

  pronosticos?.forEach(
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
        puntos += 2;
        signos += 1;
      }
    }
  );

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
            "linear-gradient(135deg,#2563eb,#1e40af)",
          color: "white",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
        }}
      >
        <h1>
          👤 Participante
        </h1>

        <h2>
          {participante.nombre}
        </h2>
      </div>

      <div
        style={{
          border:
            "1px solid #ddd",
          borderRadius:
            "12px",
          padding: "25px",
          marginBottom:
            "30px",
        }}
      >
        <h2>
          📊 Estadísticas
        </h2>

        <p>
          🏆 Puntos: {puntos}
        </p>

        <p>
          🎯 Exactos: {exactos}
        </p>

        <p>
          ⚽ Signos: {signos}
        </p>

        <p>
          📝 Pronósticos:{" "}
          {
            pronosticos?.length
          }
        </p>
      </div>

      <div
        style={{
          border:
            "1px solid #ddd",
          borderRadius:
            "12px",
          padding: "25px",
        }}
      >
        <h2>
          📝 Pronósticos
        </h2>

        {pronosticos
  ?.filter((pronostico) => {
    const partido =
      partidos?.find(
        (p) =>
          p.id ===
          pronostico.partido_id
      );

    return (
      partido?.estado ===
        "en_juego" ||
      partido?.estado ===
        "finalizado"
    );
  })
  .map((pronostico) => {
    const partido =
      partidos?.find(
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
          marginTop:
            "10px",
        }}
      >
        <strong>
          {partido?.equipo_local}{" "}
          vs{" "}
          {
            partido?.equipo_visitante
          }
        </strong>

        <div>
          Pronóstico:{" "}
          {
            pronostico.goles_local
          }
          -
          {
            pronostico.goles_visitante
          }
        </div>
      </div>
    );
  })}
      </div>
    </main>
  );
}