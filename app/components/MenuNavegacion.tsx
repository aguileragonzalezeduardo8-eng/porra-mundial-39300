"use client";

export default function MenuNavegacion() {
  const irA = (id: string) => {
    const elemento =
      document.getElementById(id);

    if (elemento) {
  const posicion =
    elemento.offsetTop - 90;

  window.scrollTo({
    top: posicion,
    behavior: "smooth",
  });
}
  };

  const botones = [
    ["🏠 Inicio", "inicio"],
    ["🎯 Especiales", "especiales"],
    ["⚽ Goleadores", "goleadores"],
    ["📊 General", "general"],
    ["🏆 Eliminatorias", "eliminatorias"],
    ["🔴 En juego", "enjuego"],
    ["⏰ Ahora", "pronosticables"],
    ["📅 Próximos", "proximos"],
    ["✅ Finalizados", "finalizados"],
  ];

  return (
    <nav
  style={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "white",
    padding: "12px",
    marginBottom: "25px",
    borderRadius: "12px",
    border: "1px solid #ddd",

    display: "flex",
    gap: "10px",

    overflowX: "auto",
    maxWidth: "100%",
    width: "100%",

    boxSizing: "border-box",

    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
  }}
>
      {botones.map(([texto, id]) => (
        <button
          key={id}
          onClick={() => irA(id)}
          style={{
            border: "none",
            background: "#f8fafc",
            padding: "8px 12px",
            borderRadius: "20px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          }}
        >
          {texto}
        </button>
      ))}
    </nav>
  );
}