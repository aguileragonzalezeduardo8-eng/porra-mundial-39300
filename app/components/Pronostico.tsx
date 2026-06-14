"use client";

import { useEffect, useState } from "react";

export default function Pronostico({
  partidoId,
  estado,
  golesRealLocal,
  golesRealVisitante,
  fechaPartido,
}: {
  partidoId: number;
  estado: string;
  golesRealLocal: number | null;
  golesRealVisitante: number | null;
  fechaPartido: string;
}) {
  const [golesLocal, setGolesLocal] = useState("");
  const [golesVisitante, setGolesVisitante] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarPronostico() {
      const participanteId =
        localStorage.getItem("id");

      if (!participanteId) {
        setCargando(false);
        return;
      }

      try {
        const respuesta = await fetch(
          "/api/pronosticos?participante_id=" +
            participanteId
        );

        const pronosticos =
          await respuesta.json();

        const pronostico =
          pronosticos.find(
            (p: any) =>
              p.partido_id === partidoId
          );

        if (pronostico) {
          setGolesLocal(
            String(pronostico.goles_local)
          );

          setGolesVisitante(
            String(
              pronostico.goles_visitante
            )
          );
        }
      } catch (error) {
        console.error(error);
      }

      setCargando(false);
    }

    cargarPronostico();
  }, [partidoId]);

  async function guardarPronostico() {
    const participanteId =
      localStorage.getItem("id");

    const token =
      localStorage.getItem("token");

    if (!participanteId || !token) {
      setMensaje(
        "❌ Debes registrarte primero"
      );
      return;
    }

    if (
      golesLocal === "" ||
      golesVisitante === ""
    ) {
      setMensaje(
        "❌ Introduce ambos resultados"
      );
      return;
    }

    try {
      const respuesta = await fetch(
        "/api/pronosticos",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            participante_id:
              Number(participanteId),
            token,
            partido_id: partidoId,
            goles_local:
              Number(golesLocal),
            goles_visitante:
              Number(golesVisitante),
          }),
        }
      );

      const resultado =
        await respuesta.json();

      if (respuesta.ok) {
        setMensaje(
          "✅ Pronóstico guardado"
        );
      } else {
        setMensaje(
          resultado.error ||
            "❌ Error al guardar"
        );
      }
    } catch (error) {
      console.error(error);

      setMensaje(
        "❌ Error de conexión"
      );
    }
  }

  if (cargando) {
    return <div>Cargando...</div>;
  }

  const ahora = new Date();
  const fecha = new Date(fechaPartido);

  const partidoEmpezado =
    fecha <= ahora;

  const fechaApertura = new Date(fecha);

  fechaApertura.setDate(
    fechaApertura.getDate() - 2
  );

  fechaApertura.setHours(
    0,
    0,
    0,
    0
  );

 const pronosticoDisponible =
  partidoId === 11 ||
  ahora >= fechaApertura;

  if (estado === "finalizado") {
    let puntos = 0;

    const pronLocal =
      Number(golesLocal);

    const pronVisitante =
      Number(golesVisitante);

    if (
      golesRealLocal === pronLocal &&
      golesRealVisitante ===
        pronVisitante
    ) {
      puntos = 5;
    } else {
      const signoReal =
        golesRealLocal! >
        golesRealVisitante!
          ? "1"
          : golesRealLocal! <
            golesRealVisitante!
          ? "2"
          : "X";

      const signoPron =
        pronLocal > pronVisitante
          ? "1"
          : pronLocal <
            pronVisitante
          ? "2"
          : "X";

      if (
        signoReal === signoPron
      ) {
        puntos = 2;
      }
    }

    return (
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          border:
            "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        🏆 <strong>{puntos} puntos</strong>
      </div>
    );
  }

  if (!pronosticoDisponible) {
    return (
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          border:
            "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        📅{" "}
        <strong>
          Disponible desde dos días antes
        </strong>
      </div>
    );
  }

  if (partidoEmpezado) {
    return (
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          border:
            "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        🔒{" "}
        <strong>
          Pronósticos cerrados
        </strong>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <input
          type="number"
          min="0"
          value={golesLocal}
          onChange={(e) =>
            setGolesLocal(
              e.target.value
            )
          }
          style={{
            width: "70px",
            padding: "8px",
            border:
              "1px solid #ccc",
            borderRadius: "6px",
            color: "#111827",
fontWeight: "bold",
fontSize: "18px",
textAlign: "center",
          }}
        />

        <input
          type="number"
          min="0"
          value={golesVisitante}
          onChange={(e) =>
            setGolesVisitante(
              e.target.value
            )
          }
          style={{
            width: "70px",
            padding: "8px",
            border:
              "1px solid #ccc",
            borderRadius: "6px",
            color: "#111827",
fontWeight: "bold",
fontSize: "18px",
textAlign: "center",
          }}
        />
      </div>

      <button
        onClick={
          guardarPronostico
        }
        style={{
          backgroundColor:
            "#16a34a",
          color: "white",
          padding: "10px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Guardar pronóstico
      </button>

      {mensaje && (
        <p
          style={{
            marginTop: "10px",
          }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}