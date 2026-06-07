"use client";

import { useState } from "react";

export default function AdminPartido({
  partido,
}: {
  partido: any;
}) {
  const [golesLocal, setGolesLocal] = useState(
    partido.goles_local ?? ""
  );

  const [golesVisitante, setGolesVisitante] = useState(
    partido.goles_visitante ?? ""
  );

  const [mensaje, setMensaje] = useState("");

  async function guardarResultado() {
    const respuesta = await fetch(
      `/api/partidos/${partido.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goles_local: Number(golesLocal),
          goles_visitante: Number(golesVisitante),
          estado: "finalizado",
        }),
      }
    );

    if (respuesta.ok) {
      setMensaje("✅ Resultado guardado");
    } else {
      setMensaje("❌ Error al guardar");
    }
  }

  async function eliminarPartido() {
    const confirmar = confirm(
      `¿Eliminar ${partido.equipo_local} vs ${partido.equipo_visitante}?`
    );

    if (!confirmar) return;

    const respuesta = await fetch(
      `/api/partidos/${partido.id}`,
      {
        method: "DELETE",
      }
    );

    if (respuesta.ok) {
      setMensaje("✅ Partido eliminado");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setMensaje("❌ Error al eliminar");
    }
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      <h3>
        {partido.equipo_local} vs{" "}
        {partido.equipo_visitante}
      </h3>

      <p>
        Estado: {partido.estado}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <input
          type="number"
          value={golesLocal}
          onChange={(e) =>
            setGolesLocal(e.target.value)
          }
          style={{
            width: "70px",
            padding: "8px",
          }}
        />

        <input
          type="number"
          value={golesVisitante}
          onChange={(e) =>
            setGolesVisitante(e.target.value)
          }
          style={{
            width: "70px",
            padding: "8px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <button
          onClick={guardarResultado}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Guardar resultado
        </button>

        <button
          onClick={eliminarPartido}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🗑️ Eliminar partido
        </button>
      </div>

      {mensaje && (
        <p style={{ marginTop: "10px" }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}