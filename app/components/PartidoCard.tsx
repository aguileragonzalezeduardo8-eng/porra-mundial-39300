import Pronostico from "./Pronostico";
import { banderas } from "./banderas";

export default function PartidoCard({
  partido,
}: {
  partido: any;
}) {
  function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const codigoLocal =
    banderas[partido.equipo_local];

  const codigoVisitante =
    banderas[partido.equipo_visitante];

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <span>🏷️ Grupo {partido.grupo}</span>

        <span>
          {partido.estado === "finalizado"
            ? "✅ Finalizado"
            : "⏳ Programado"}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {codigoLocal && (
            <img
              src={`https://flagcdn.com/w40/${codigoLocal}.png`}
              alt={partido.equipo_local}
              width={32}
              height={24}
            />
          )}

          {partido.equipo_local}
        </div>

        <div
          style={{
            margin: "14px 0",
            fontWeight: "bold",
            color: "#2563eb",
            fontSize: "18px",
          }}
        >
          VS
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {codigoVisitante && (
            <img
              src={`https://flagcdn.com/w40/${codigoVisitante}.png`}
              alt={partido.equipo_visitante}
              width={32}
              height={24}
            />
          )}

          {partido.equipo_visitante}
        </div>
      </div>

      {partido.estado === "finalizado" && (
        <div
          style={{
            textAlign: "center",
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          {partido.goles_local} -{" "}
          {partido.goles_visitante}
        </div>
      )}

      <div
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "16px",
        }}
      >
        📅 {formatearFecha(partido.fecha_partido)}
      </div>

      <Pronostico
        partidoId={partido.id}
        estado={partido.estado}
        golesRealLocal={partido.goles_local}
        golesRealVisitante={partido.goles_visitante}
        fechaPartido={partido.fecha_partido}
      />
    </div>
  );
}