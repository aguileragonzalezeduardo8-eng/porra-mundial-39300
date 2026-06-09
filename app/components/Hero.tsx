import Link from "next/link";

export default function Hero({
  participantes,
  pronosticos,
  partidosFinalizados,
}: {
  participantes: number;
  pronosticos: number;
  partidosFinalizados: number;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #2563eb, #1e40af)",
        color: "white",
        borderRadius: "16px",
        padding: "32px",
        marginBottom: "30px",
        textAlign: "center",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: "42px",
          marginBottom: "10px",
        }}
      >
        🏆
      </div>

      <h1
        style={{
          fontSize: "34px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        PORRAS MUNDIALISTAS
      </h1>

      <h2
        style={{
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        39300
      </h2>

      <div
        style={{
          fontSize: "18px",
          marginBottom: "10px",
        }}
      >
        ⚽ Mundial FIFA 2026
      </div>

      <div
        style={{
          fontSize: "16px",
          opacity: 0.9,
          marginBottom: "25px",
        }}
      >
        🌎 Estados Unidos · México · Canadá
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            background:
              "rgba(255,255,255,0.15)",
            padding: "10px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
          }}
        >
          👥 {participantes} participantes
        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.15)",
            padding: "10px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
          }}
        >
          ⚽ {pronosticos} pronósticos
        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.15)",
            padding: "10px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
          }}
        >
          🏁 {partidosFinalizados} finalizados
        </div>
      </div>

      <Link
        href="/perfil"
        style={{
          display: "inline-block",
          background: "white",
          color: "#1e40af",
          padding: "12px 24px",
          borderRadius: "10px",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        👤 Mi perfil
      </Link>
    </div>
  );
}