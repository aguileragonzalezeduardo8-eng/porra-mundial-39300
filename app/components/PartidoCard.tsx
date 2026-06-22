import Pronostico from "./Pronostico";
import { banderas } from "./banderas";

export default function PartidoCard({
  partido,
  pronosticos,
}: {
  partido: any;
pronosticos: any[] | null;
}) {

  const totalPronosticos =
  pronosticos?.filter(
    (p) =>
      p.partido_id ===
      partido.id
  ).length ?? 0;

  function formatearFecha(fecha: string) {
    const d = new Date(fecha);

    const fechaTexto =
      d.toLocaleDateString("es-ES", {
        timeZone: "Europe/Madrid",
      });

    const horaTexto =
      d.toLocaleTimeString("es-ES", {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit",
      });

    return `${fechaTexto} ${horaTexto}`;
  }


  function tiempoRestante(fecha: string) {
    const ahora = new Date();
    const partidoFecha = new Date(fecha);

    const diferencia =
      partidoFecha.getTime() - ahora.getTime();

    if (diferencia <= 0) {
      return "Pronósticos cerrados";
    }

    const horas = Math.floor(
      diferencia / (1000 * 60 * 60)
    );

    const minutos = Math.floor(
      (diferencia % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    if (horas >= 24) {
      const dias = Math.floor(horas / 24);

      return `${dias} día${
        dias !== 1 ? "s" : ""
      }`;
    }

    return `${horas}h ${minutos}m`;
  }

  const banderaLocal =
    banderas[partido.equipo_local] ?? "🏳️";

    console.log(
  partido.equipo_local,
  banderaLocal
);

  const banderaVisitante =
    banderas[partido.equipo_visitante] ?? "🏳️";

  const fecha = new Date(
    partido.fecha_partido
  );

const apertura = new Date(fecha);

apertura.setDate(
  apertura.getDate() - 2
);

  const ahora = new Date();

const abierto =
  (
    partido.id === 11 ||
    ahora >= apertura
  ) &&
  ahora < fecha &&
  partido.estado !== "finalizado";

  const pronosticosPartido =
  pronosticos?.filter(
    (p) =>
      p.partido_id === partido.id
  ) || [];

let exactos = 0;
let signos = 0;

const contadorResultados:
  Record<string, number> = {};

pronosticosPartido.forEach(
  (p) => {
    const resultado =
      `${p.goles_local}-${p.goles_visitante}`;

    contadorResultados[
      resultado
    ] =
      (contadorResultados[
        resultado
      ] || 0) + 1;

    if (
      partido.estado ===
      "finalizado"
    ) {
      if (
        p.goles_local ===
          partido.goles_local &&
        p.goles_visitante ===
          partido.goles_visitante
      ) {
        exactos++;
      } else {
        const signoReal =
          partido.goles_local >
          partido.goles_visitante
            ? "1"
            : partido.goles_local <
              partido.goles_visitante
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

        if (
          signoReal ===
          signoPron
        ) {
          signos++;
        }
      }
    }
  });

const pronosticoPopular =
  Object.entries(
    contadorResultados
  ).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div
      style={{
        background: abierto
          ? "#f0fdf4"
          : "white",
        border: abierto
          ? "2px solid #22c55e"
          : "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "12px",
          fontSize: "14px",
        }}
      >
        <span>
          🏷️ Grupo {partido.grupo}
        </span>

  <span>
  {partido.estado ===
  "finalizado"
    ? "🏁 Finalizado"
    : abierto
    ? "🔥 Abierto"
    : new Date() >=
      new Date(
        partido.fecha_partido
      )
    ? "🔴 En juego"
    : "📅 Próximamente"}
</span>
      </div>

      <div
        style={{
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
 <div
  style={{
    fontSize: "24px",
    fontWeight: "bold",
  }}
>
  {banderaLocal} {partido.equipo_local}
</div>

        <div
          style={{
            margin: "12px 0",
            fontWeight: "bold",
            color: "#2563eb",
            fontSize: "18px",
          }}
        >
          VS
        </div>

<div
  style={{
    fontSize: "24px",
    fontWeight: "bold",
  }}
>
  {banderaVisitante} {partido.equipo_visitante}
</div>
</div>

      {partido.estado ===
  "finalizado" && (
  <>
    <div
      style={{
        textAlign: "center",
        fontSize: "42px",
        fontWeight: "bold",
        marginBottom: "12px",
        color: "#111827",
      }}
    >
      {partido.goles_local} -{" "}
      {partido.goles_visitante}
    </div>

    <div
      style={{
        textAlign: "center",
        marginBottom: "16px",
        fontSize: "14px",
        color: "#374151",
      }}
    >
      {pronosticoPopular && (
        <div>
          👥 Más votado:{" "}
          <strong>
            {pronosticoPopular[0]}
          </strong>{" "}
          ({pronosticoPopular[1]} usuarios)
        </div>
      )}

      <div
        style={{
          marginTop: "6px",
        }}
      >
        🏆 {exactos} exactos
      </div>

      <div>
        🎯 {signos} signos
      </div>
    </div>
  </>
)}

      <div
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "10px",
        }}
      >
        📅{" "}
        {formatearFecha(
          partido.fecha_partido
        )}
      </div>

      {partido.estado !==
        "finalizado" && (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: abierto
              ? "#16a34a"
              : "#2563eb",
            marginBottom: "16px",
          }}
        >
          {abierto
            ? `⏳ Cierra en ${tiempoRestante(
                partido.fecha_partido
              )}`
            : "📅 Se abrirá 48h antes"}
        </div>
      )}

      {abierto && (
  <div
    style={{
      textAlign: "center",
      color: "#6b7280",
      marginBottom: "16px",
      fontWeight: "bold",
    }}
  >
    👥 {totalPronosticos}/35
    participantes ya han
    pronosticado
  </div>
)}

 {new Date() >=
  new Date(
    partido.fecha_partido
  ) && (
  <div
    style={{
      textAlign: "center",
      marginBottom: "16px",
    }}
  >
    <a
      href={`/partido/${partido.id}`}
      style={{
        display: "inline-block",
        padding:
          "10px 16px",
        background:
          "#2563eb",
        color: "white",
        textDecoration:
          "none",
        borderRadius:
          "10px",
        fontWeight:
          "bold",
      }}
    >
      👥 Ver pronósticos
    </a>
  </div>
)}
      
      <Pronostico
        partidoId={partido.id}
        estado={partido.estado}
        golesRealLocal={
          partido.goles_local
        }
        golesRealVisitante={
          partido.goles_visitante
        }
        fechaPartido={
          partido.fecha_partido
        }
      />
    </div>
  );
}