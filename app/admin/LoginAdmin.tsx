"use client";

import { useState } from "react";

export default function LoginAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [autorizado, setAutorizado] = useState(false);
  const [password, setPassword] = useState("");

  function comprobarPassword() {
    if (password === "39300TLV") {
      setAutorizado(true);
    } else {
      alert("Contraseña incorrecta");
    }
  }

  if (!autorizado) {
    return (
      <main
        style={{
          maxWidth: "400px",
          margin: "80px auto",
          textAlign: "center",
        }}
      >
        <h1>🔐 Acceso administrador</h1>

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          onClick={comprobarPassword}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </main>
    );
  }

  return <>{children}</>;
}