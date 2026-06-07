"use client";

import { useEffect, useState } from "react";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    const nombreGuardado =
      localStorage.getItem("nombre");

    if (nombreGuardado) {
      setUsuario(nombreGuardado);
    }
  }, []);

  async function registrar() {
    if (!nombre.trim()) {
      setMensaje(
        "⚠️ Introduce tu nombre"
      );
      return;
    }

    try {
      const respuesta = await fetch(
        "/api/participantes",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            nombre,
          }),
        }
      );

      const participante =
        await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem(
          "id",
          participante.id.toString()
        );

        localStorage.setItem(
          "token",
          participante.token
        );

        localStorage.setItem(
          "nombre",
          participante.nombre
        );

        window.location.reload();
        return;
      }

      if (respuesta.status === 409) {
        setMensaje(
          "❌ Ya existe un participante con ese nombre"
        );
        return;
      }

      setMensaje(
        "❌ Error al inscribirse"
      );
    } catch (error) {
      console.error(error);

      setMensaje(
        "❌ Error al inscribirse"
      );
    }
  }

  if (usuario) {
    return (
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold">
          👋 Bienvenido, {usuario}
        </h2>

        <p className="mt-2">
          Ya estás inscrito en la porra.
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("id");
            localStorage.removeItem("token");
            localStorage.removeItem("nombre");
            window.location.reload();
          }}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Cambiar de participante
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Únete a la porra y recuerda pagar antes de que empiece el Mundial, cabrón
      </h2>

      <input
        type="text"
        placeholder="Escribe tu nombre y un apellido"
        value={nombre}
        onChange={(e) =>
          setNombre(e.target.value)
        }
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={registrar}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Entrar
      </button>

      {mensaje && (
        <p className="mt-4 font-semibold">
          {mensaje}
        </p>
      )}
    </div>
  );
}