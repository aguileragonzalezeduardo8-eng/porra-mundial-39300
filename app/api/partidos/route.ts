import { supabase } from "../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      equipo_local,
      equipo_visitante,
      fecha_partido,
      grupo,
      estado,
    } = body;

    const { error } = await supabase
      .from("partidos")
      .insert([
        {
          equipo_local,
          equipo_visitante,
          fecha_partido,
          grupo,
          estado,
        },
      ]);

    if (error) {
      console.error(error);

      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error general" },
      { status: 500 }
    );
  }
}