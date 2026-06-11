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
  pronosticos?.map((p) => {
    const participante =
      participantes?.find(
        (part) =>
          part.id ===
          p.participante_id
      );

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
        "white",
      display: "flex",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    }}
  >
    <div>
      👤{" "}
      {
        participante?.nombre
      }
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
      {p.goles_visitante}
    </div>
  </div>
);
  })
)}
  </main>
);
}