import { supabase } from "../../lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const participanteId = searchParams.get("participante_id");

    const { data, error } = await supabase
      .from("pronosticos")
      .select("*")
      .eq("participante_id", Number(participanteId));

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (e) {
    console.error(e);

    return Response.json(
      { error: "Error general" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      participante_id,
      partido_id,
      goles_local,
      goles_visitante,
    } = body;

    const { data: existente } = await supabase
      .from("pronosticos")
      .select("*")
      .eq("participante_id", participante_id)
      .eq("partido_id", partido_id)
      .maybeSingle();

    if (existente) {
      const { data, error } = await supabase
        .from("pronosticos")
        .update({
          goles_local,
          goles_visitante,
        })
        .eq("id", existente.id)
        .select();

      if (error) {
        return Response.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return Response.json(data);
    }

    const { data, error } = await supabase
      .from("pronosticos")
      .insert([
        {
          participante_id,
          partido_id,
          goles_local,
          goles_visitante,
        },
      ])
      .select();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (e) {
    console.error("ERROR GENERAL:", e);

    return Response.json(
      { error: "Error general" },
      { status: 500 }
    );
  }
}