import Link from "next/link";
export default function Top3({
  clasificacion,
}: {
  clasificacion: any[];
}) {
  const top3 = clasificacion.slice(0, 3);

  if (top3.length === 0) {
    return null;
  }

  const estilos = [
    {
      emoji: "🥇",
      color: "#facc15",
      altura: "220px",
    },
    {
      emoji: "🥈",
      color: "#d1d5db",
      altura: "180px",
    },
    {
      emoji: "🥉",
      color: "#d97706",
      altura: "140px",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "30px",
      }}
    >
      {top3.map((usuario, index) => (
        <div
          key={usuario.id}
          style={{
            width: "220px",
            height: estilos[index].altura,
            background: estilos[index].color,
            borderRadius: "16px 16px 0 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              fontSize: "40px",
              marginBottom: "10px",
            }}
          >
            {estilos[index].emoji}
          </div>

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
      textAlign: "center",
      padding: "0 10px",
      cursor: "pointer",
    }}
  >
    {usuario.nombre}
  </div>
</Link>

          <div
            style={{
              marginTop: "10px",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {usuario.puntos} pts
          </div>

          <div
            style={{
              marginTop: "5px",
              fontSize: "14px",
            }}
          >
            {usuario.pronosticos} pronósticos
          </div>
        </div>
      ))}
    </div>
  );
}