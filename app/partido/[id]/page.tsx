import { supabase } from "@/app/lib/supabase";

export default async function PartidoPage({
  params,
}: any) {

  const resolvedParams =
    await params;

  const partidoId = Number(
    resolvedParams.id
  );

  const { data: partido } =
    await supabase
      .from("partidos")
      .select("*")
      .eq("id", partidoId)
      .single();

      const { data: pronosticos } =
  await supabase
    .from("pronosticos")
    .select("*")
    .eq("partido_id", partidoId);

    const { data: participantes } =
  await supabase
    .from("participantes")
    .select("*");

    const ahora = new Date();

const partidoEmpezado =
  partido &&
  ahora >=
    new Date(
      partido.fecha_partido
    );

    console.log(
  "ESTADO PARTIDO:",
  partido?.estado
);

    const pronosticosOrdenados =
  [...(pronosticos || [])].sort(
    (a, b) => {

      if (
        partido?.estado !==
        "finalizado"
      ) {
        return 0;
      }

      const calcularValor = (
        pronostico: any
      ) => {

        const exacto =
          pronostico.goles_local ===
            partido.goles_local &&
          pronostico.goles_visitante ===
            partido.goles_visitante;

        if (exacto) {
          return 3;
        }

        const signoReal =
          partido.goles_local >
          partido.goles_visitante
            ? "1"
            : partido.goles_local <
              partido.goles_visitante
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
          return 2;
        }

        return 1;
      };

      return (
        calcularValor(b) -
        calcularValor(a)
      );
    }
  );

  const victoriasLocal =
  pronosticosOrdenados.filter(
    (p) =>
      p.goles_local >
      p.goles_visitante
  );

const empates =
  pronosticosOrdenados.filter(
    (p) =>
      p.goles_local ===
      p.goles_visitante
  );

const victoriasVisitante =
  pronosticosOrdenados.filter(
    (p) =>
      p.goles_local <
      p.goles_visitante
  );

  const renderPronostico = (
  p: any
) => {
  const participante =
    participantes?.find(
      (part) =>
        part.id ===
        p.participante_id
    );


  let fondo = "white";
  let textoResultado = "";
  let puntos = 0;

  if (
    partido?.estado ===
    "finalizado"
  ) {
    const realLocal =
      partido.goles_local;

    const realVisitante =
      partido.goles_visitante;

    const exacto =
      p.goles_local ===
        realLocal &&
      p.goles_visitante ===
        realVisitante;

    const signoReal =
      realLocal >
      realVisitante
        ? "1"
        : realLocal <
          realVisitante
        ? "2"
        : "X";

    const signoPron =
      p.goles_local >
      p.goles_visitante
        ? "1"
        : p.goles_local <
          p.goles_visitante
        ? "2"
        : "X";

    if (exacto) {
      fondo = "#dcfce7";
      textoResultado =
        "🎯 Exacto";
      puntos = 5;
    } else if (
      signoReal ===
      signoPron
    ) {
      fondo = "#fef9c3";
      textoResultado =
        "⚽ Signo";
      puntos = 2;
    } else {
      textoResultado =
        "❌ Fallo";
    }
  }

  return (
    <div
      key={p.id}
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius:
          "12px",
        padding: "12px",
        marginBottom: "10px",
        background:
          fondo,
        display: "flex",
        justifyContent:
          "space-between",
        alignItems:
          "center",
      }}
    >
      <div>
        <div>
          👤{" "}
          {
            participante?.nombre
          }
        </div>

        {partido?.estado ===
          "finalizado" && (
          <div
            style={{
              marginTop:
                "4px",
              fontSize:
                "14px",
              fontWeight:
                "bold",
            }}
          >
            {
              textoResultado
            } (+{puntos})
          </div>
        )}
      </div>

      <div
        style={{
          fontWeight:
            "bold",
          fontSize:
            "20px",
        }}
      >
        {p.goles_local}-
        {
          p.goles_visitante
        }
      </div>
    </div>
  );
};

const renderGrupo = (
  titulo: string,
  lista: any[]
) => (
  <div
    style={{
      marginBottom: "40px",
    }}
  >
    <h3
      style={{
        marginTop: "20px",
        marginBottom: "15px",
        paddingBottom: "8px",
        borderBottom:
          "3px solid #2563eb",
        color: "#2563eb",
        fontSize: "22px",
      }}
    >
      {titulo} ({lista.length})
    </h3>

    {lista.map(
      renderPronostico
    )}
  </div>
);

  return (
  <main
    style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "30px",
    }}
  >
    <h1>
      👥 Pronósticos del partido
    </h1>

    <h2>
      {partido?.equipo_local} vs{" "}
      {partido?.equipo_visitante}
    </h2>
    <p
  style={{
    color: "#666",
    marginBottom: "20px",
  }}
>
  📅{" "}
  {new Date(
    partido.fecha_partido
  ).toLocaleString("es-ES")}
</p>

    <hr />

  {!partidoEmpezado ? (
  <div
    style={{
      marginTop: "20px",
      padding: "20px",
      border:
        "1px solid #ddd",
      borderRadius: "12px",
      textAlign: "center",
    }}
  >
    🔒 Los pronósticos se
    mostrarán cuando
    empiece el partido.
  </div>
) : (
  <>
    {renderGrupo(
      `🏠 Victoria ${partido.equipo_local}`,
      victoriasLocal
    )}

    {renderGrupo(
      "🤝 Empate",
      empates
    )}

    {renderGrupo(
      `✈️ Victoria ${partido.equipo_visitante}`,
      victoriasVisitante
    )}
  </>
)}
  </main>
);
}