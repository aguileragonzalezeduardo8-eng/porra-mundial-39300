"use client";

import { useEffect, useState } from "react";

const selecciones = [
  "Alemania",
  "Arabia Saudí",
  "Argelia",
  "Argentina",
  "Australia",
  "Austria",
  "Bélgica",
  "Bosnia y Herzegovina",
  "Brasil",
  "Cabo Verde",
  "Canadá",
  "Chequia",
  "Colombia",
  "Corea del Sur",
  "Costa de Marfil",
  "Croacia",
  "Curazao",
  "Ecuador",
  "Egipto",
  "Escocia",
  "España",
  "Estados Unidos",
  "Francia",
  "Ghana",
  "Haití",
  "Inglaterra",
  "Irak",
  "Irán",
  "Japón",
  "Jordania",
  "Marruecos",
  "México",
  "Noruega",
  "Nueva Zelanda",
  "Países Bajos",
  "Panamá",
  "Paraguay",
  "Portugal",
  "Qatar",
  "RD Congo",
  "Senegal",
  "Sudáfrica",
  "Suecia",
  "Suiza",
  "Túnez",
  "Turquía",
  "Uruguay",
  "Uzbekistán"
];

const goleadores = [
  "Kylian Mbappé",
  "Erling Haaland",
  "Lamine Yamal",
  "Vinicius Jr",
  "Harry Kane",
  "Julián Álvarez",
  "Robert Lewandowski",
  "Jamal Musiala",
  "Jude Bellingham",
  "Cristiano Ronaldo",
  "Ousmane Dembélé",
  "Raphinha",
  "Endrick",
  "Alexander Isak",
  "Viktor Gyökeres",
  "Benjamin Sesko",
  "Lautaro Martínez",
  "Lionel Messi",
  "Mikel Oyarzabal",
  "Nico Williams",
  "Memphis Depay",
  "Cody Gakpo",
  "Donyell Malen",
  "Marcus Rashford",
  "Bukayo Saka",
  "Ollie Watkins",
  "Jonathan David",
  "Matheus Cunha",
  "Cyle Larin",
  "Igor Thiago",
  "Neymar",
  "Gabriel Martinelli",
  "Rayan",
  "Edin Dzeko",
  "Patrik Schick",
  "Breel Embolo",
  "Brahim Díaz",
  "Ez Abde",
  "Ayoub El Kaabi",
  "Pulisic",
  "Florian Wirtz",
  "Kai Havertz",
  "Nick Woltemade",
  "Deniz Undav",
  "Nicolas Pepé",
  "Yan Diomande",
  "Anthony Elanga",
  "Michael Olise",
  "Rayan Cherki",
  "Jeremy Doku",
  "Leandro Trossard",
  "Ferrán Torres",
  "Yeremy Pino",
  "Borja Iglesias",
  "Víctor Muñoz",
  "Marcus Thuram",
  "Desirée Doué",
  "Bradley Barcola",
  "Jean-Philippe Mateta",
  "Alexander Sorloth",
  "Jorgn Strand Larsen",
  "Sadio Mané",
  "Ismaila Sarr",
  "Darwin Núñez",
  "Fede Viñas",
  "Rasmus Højlund",
  "Romelu Lukaku",
  "Loïs Openda",
  "Victor Boniface",
  "Victor Osimhen",
  "Mohamed Salah",
  "Achraf Hakimi",
  "Youssef En-Nesyri",
  "Sofiane Rahimi",
  "Takefusa Kubo",
  "Kaoru Mitoma",
  "Hwang Hee-chan",
  "Son Heung-min",
  "Mehdi Taremi",
  "Sardar Azmoun",
  "Salem Al-Dawsari",
  "Akram Afif",
  "Santiago Giménez",
  "Raúl Jiménez",
  "Darwin Núñez",
  "Federico Valverde",
  "Nico Paz",
  "Gonçalo Guedes",
  "Gonçalo Ramos",
  "Rafa Leao",
  "Pedro Neto",
  "Bruno Fernandes",
  "Joao Félix",
  "Anthony Gordon",
  "Iván Toney",
  "Noni Madueke",
  "Eberechi Eze",
  "Ante Budimir",
  "Iván Perisic",
  "Cucho Hernández",
  "Marko Arnautovic",
  "Jhon Durán",
  "Luis Díaz",
  "Richard Ríos",
  "Igor Jesús",
  "Mika Biereth",
  "Arda Güler",
  "Kerem Aktürkoğlu",
  "Breel Embolo",
  "Zeki Amdouni",
  "Chemsdine Talbi",
  "Simon Adingra",
  "Yoane Wissa",
  "Mohamed Amoura",
  "Tolu Arokodare",
  "Tajon Buchanan",
  "Chris Wood",
  "Musa Al-Taamari",
  "Aymen Hussein"
];

export default function PronosticosEspeciales() {
  const [campeon, setCampeon] = useState("");
  const [goleador, setGoleador] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [publicos, setPublicos] = useState([]);

  const fechaLimite = new Date(
    "2026-06-11T21:00:00+02:00"
  );

const cerrado =
  new Date() >= fechaLimite;

useEffect(() => {
  cargar();

 
  if (cerrado) {
    cargarPublicos();
  }
}, []);

async function cargarPublicos() {
  const res = await fetch(
    "/api/pronosticos-especiales/publicos"
  );

  if (!res.ok) return;

  const datos = await res.json();

  setPublicos(datos);
}


  async function cargar() {
    const participanteId =
      localStorage.getItem("id");

    if (!participanteId) return;

  const res = await fetch(
  `/api/pronosticos-especiales?participante_id=${participanteId}`
);

    if (!res.ok) return;

    const datos = await res.json();

    if (datos) {
      setCampeon(datos.campeon || "");
      setGoleador(
        datos.maximo_goleador || ""
      );
    }
  }

  async function guardar() {
    const participanteId =
      localStorage.getItem("id");

    if (!participanteId) {
      setMensaje(
        "Debes registrarte primero"
      );
      return;
    }

    const res = await fetch(
      "/api/pronosticos-especiales",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          participante_id:
            participanteId,
          campeon,
          maximo_goleador:
            goleador,
        }),
      }
    );

if (res.ok) {
  setMensaje("✅ Guardado");
} else {
  const error = await res.text();
  setMensaje("❌ Error: " + error);
}
  }

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "30px",
      }}
    >
      <h2>
        🏆 Pronósticos especiales
      </h2>

      {cerrado ? (
  <div>
  <p
    style={{
      fontWeight: "bold",
      marginBottom: "20px",
    }}
  >
    🔓 Pronósticos especiales públicos
  </p>

  {publicos.map(
    (p: any, index) => (
      <div
        key={index}
        style={{
          border:
            "1px solid #ddd",
          borderRadius:
            "12px",
          padding: "15px",
          marginBottom:
            "12px",
          background:
            "white",
        }}
      >
        <div
          style={{
            fontWeight:
              "bold",
            marginBottom:
              "6px",
          }}
        >
          👤{" "}
          {
            p.participantes
              ?.nombre
          }
        </div>

        <div>
          🏆 Campeón:
          {" "}
          {p.campeon}
        </div>

        <div>
          ⚽ Goleador:
          {" "}
          {
            p.maximo_goleador
          }
        </div>
      </div>
    )
  )}
</div>
) : (
        <>
          <div>
            <label>
              Campeón
            </label>

            <select
  value={campeon}
  onChange={(e) =>
    setCampeon(e.target.value)
  }
>
  <option value="">
    Selecciona una opción
  </option>

  {selecciones.map((equipo) => (
    <option
      key={equipo}
      value={equipo}
    >
      {equipo}
    </option>
  ))}
</select>
          </div>

          <div
            style={{
              marginTop: "15px",
            }}
          >
            <label>
              Máximo goleador
            </label>

            <select
              value={goleador}
              onChange={(e) =>
                setGoleador(
                  e.target.value
                )
              }
            >
              <option value="">
                Selecciona
              </option>

              {goleadores.map(
                (g) => (
                  <option
                    key={g}
                    value={g}
                  >
                    {g}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            onClick={guardar}
            style={{
              marginTop: "20px",
            }}
          >
            Guardar
          </button>

          <p>{mensaje}</p>
        </>
      )}
    </div>
  );
}