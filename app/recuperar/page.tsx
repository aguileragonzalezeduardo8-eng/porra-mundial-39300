"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RecuperarPage() {
  const searchParams =
    useSearchParams();

  useEffect(() => {
    const id =
      searchParams.get("id");

    if (!id) return;

    localStorage.setItem(
      "id",
      id
    );

    window.location.href =
      "/";
  }, [searchParams]);

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