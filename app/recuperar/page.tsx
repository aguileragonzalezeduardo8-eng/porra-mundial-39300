"use client";

import { useEffect } from "react";

export default function RecuperarPage() {
  useEffect(() => {
    async function recuperar() {
      const params = new URLSearchParams(
        window.location.search
      );

      const id = params.get("id");

      if (!id) {
        window.location.href = "/";
        return;
      }

      try {
        const respuesta = await fetch(
          "/api/participantes"
        );

        const participantes =
          await respuesta.json();

        const participante =
          participantes.find(
            (p: any) =>
              String(p.id) === id
          );

        if (participante) {
          localStorage.setItem(
            "id",
            participante.id.toString()
          );

          localStorage.setItem(
            "nombre",
            participante.nombre
          );

          localStorage.setItem(
            "token",
            participante.token
          );
        }
      } catch (error) {
        console.error(error);
      }

      window.location.href = "/";
    }

    recuperar();
  }, []);

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      <h1>🔄 Recuperando acceso...</h1>

      <p>
        Te estamos redirigiendo a la
        porra.
      </p>
    </main>
  );
}