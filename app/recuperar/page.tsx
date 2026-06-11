"use client";

import { useEffect } from "react";

export default function RecuperarPage() {
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const id = params.get("id");

    if (id) {
      localStorage.setItem("id", id);
    }

    window.location.href = "/";
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
        Te estamos redirigiendo a la porra.
      </p>
    </main>
  );
}