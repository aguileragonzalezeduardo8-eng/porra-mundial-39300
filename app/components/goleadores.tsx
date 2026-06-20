export default async function Goleadores() {
const respuesta = await fetch(
  "https://api.football-data.org/v4/competitions/WC/scorers",
  {
    headers: {
      "X-Auth-Token":
        process.env.FOOTBALL_DATA_API_KEY!,
    },
    cache: "no-store",
  }
);

  const datos = await respuesta.json();

  const goleadores =
    datos.scorers ?? [];

  const paises: Record<
    string,
    string
  > = {
    Argentina: "Argentina",
    Canada: "Canadá",
    Brazil: "Brasil",
    Germany: "Alemania",
    France: "Francia",
    Morocco: "Marruecos",
    Sweden: "Suecia",
    "United States":
      "Estados Unidos",
    "New Zealand":
      "Nueva Zelanda",
  };

  return (
    <details
      style={{
        marginBottom: "30px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "15px",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "22px",
        }}
      >
        ⚽ Clasificación de goleadores
      </summary>

      <div
        style={{
          marginTop: "15px",
        }}
      >
        {goleadores
          .slice(0, 10)
          .map(
            (
              goleador: any,
              index: number
            ) => {
              const pais =
                paises[
                  goleador.team.name
                ] ??
                goleador.team.name;

              const puesto =
                index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : `#${index + 1}`;

              return (
                <div
                  key={
                    goleador.player.id
                  }
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    padding:
                      "10px",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <div>
                    {puesto}{" "}
                    <img
                      src={
                        goleador.team
                          .crest
                      }
                      alt=""
                      width="20"
                      style={{
                        verticalAlign:
                          "middle",
                        marginRight:
                          "8px",
                      }}
                    />

                    {
                      goleador.player
                        .name
                    }

                    {" · "}

                    {pais}
                  </div>

                  <strong>
                    ⚽{" "}
                    {
                      goleador.goals
                    }
                  </strong>
                </div>
              );
            }
          )}
      </div>
    </details>
  );
}