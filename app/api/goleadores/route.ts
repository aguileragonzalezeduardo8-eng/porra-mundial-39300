export async function GET() {
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

  const datos =
    await respuesta.json();

  return Response.json(datos);
}