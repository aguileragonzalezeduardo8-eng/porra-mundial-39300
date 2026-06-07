export default function Top3({
  clasificacion,
}: {
  clasificacion: {
    id: number;
    nombre: string;
    puntos: number;
  }[];
}) {
  const primero = clasificacion[0];
  const segundo = clasificacion[1];
  const tercero = clasificacion[2];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "30px",
      }}
    >
      {primero && (
        <div
          style={{
            background: "#fef3c7",
            border: "2px solid #facc15",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px" }}>
            🥇
          </div>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginTop: "10px",
            }}
          >
            {primero.nombre}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {primero.puntos} pts
          </div>
        </div>
      )}

      {segundo && (
        <div
          style={{
            background: "#f3f4f6",
            border: "2px solid #d1d5db",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px" }}>
            🥈
          </div>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginTop: "10px",
            }}
          >
            {segundo.nombre}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {segundo.puntos} pts
          </div>
        </div>
      )}

      {tercero && (
        <div
          style={{
            background: "#fed7aa",
            border: "2px solid #fb923c",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px" }}>
            🥉
          </div>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginTop: "10px",
            }}
          >
            {tercero.nombre}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {tercero.puntos} pts
          </div>
        </div>
      )}
    </div>
  );
}