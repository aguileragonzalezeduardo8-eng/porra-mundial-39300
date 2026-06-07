"use client";

import { useState } from "react";

export default function CrearPartido() {
  const [equipoLocal, setEquipoLocal] = useState("");
  const [equipoVisitante, setEquipoVisitante] = useState("");
  const [fechaPartido, setFechaPartido] = useState("");
  const [grupo, setGrupo] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function crearPartido() {
    const respuesta = await fetch("/api/partidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        equipo_local: equipoLocal,
        equipo_visitante: equipoVisitante,
        fecha_partido: fechaPartido,
        grupo,
        estado: "programado",
      }),
    });

    if (respuesta.ok) {
      setMensaje("✅ Partido creado");

      setEquipoLocal("");
      setEquipoVisitante("");
      setFechaPartido("");
      setGrupo("");
    } else {
      setMensaje("❌ Error al crear");
    }
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        ➕ Crear partido
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <input
          value={equipoLocal}
          onChange={(e) =>
            setEquipoLocal(e.target.value)
          }
          placeholder="Equipo local"
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <input
          value={equipoVisitante}
          onChange={(e) =>
            setEquipoVisitante(e.target.value)
          }
          placeholder="Equipo visitante"
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <input
          type="datetime-local"
          value={fechaPartido}
          onChange={(e) =>
            setFechaPartido(e.target.value)
          }
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <input
          value={grupo}
          onChange={(e) =>
            setGrupo(e.target.value)
          }
          placeholder="Grupo"
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          onClick={crearPartido}
          style={{
            backgroundColor: "#16a34a",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Crear partido
        </button>

        {mensaje && (
          <p>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}