"use client";

import { useEffect } from "react";

export default function RecuperarPage() {
  useEffect(() => {
    async function recuperar() {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const id =
        params.get("id");

      if (!id) {
        window.location.href =
          "/";
        return;
      }

      localStorage.setItem(
        "id",
        id
      );

      try {
        const respuesta =
          await fetch(
            "/api/participantes"
          );

        const participantes =
          await respuesta.json();

        const usuario =
          participantes.find(
            (p: any) =>
              p.id.toString() ===
              id
          );

        if (usuario) {
          localStorage.setItem(
            "nombre",
            usuario.nombre
          );
        }
      } catch (error) {
        console.error(error);
      }

      window.location.href =
        "/";
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
      <h1>
        🔄 Recuperando acceso...
      </h1>

      <p>
        Te estamos
        redirigiendo a la
        porra.
      </p>
    </main>
  );
}