import { supabase } from "../../lib/supabase";

export async function GET() {
  try {
    const { data, error } =
      await supabase
        .from("participantes")
        .select("*");

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const nombre =
      body.nombre?.trim();

    if (!nombre) {
      return Response.json(
        {
          error:
            "Nombre obligatorio",
        },
        { status: 400 }
      );
    }

    const nombreNormalizado =
      nombre.toLowerCase().trim();

    const {
      data: existente,
    } = await supabase
      .from("participantes")
      .select("id")
      .eq(
        "nombre_normalizado",
        nombreNormalizado
      )
      .maybeSingle();

    if (existente) {
  const { data: participante } = await supabase
    .from("participantes")
    .select("*")
    .eq("id", existente.id)
    .single();

  return Response.json(participante);
}

    const { data, error } =
      await supabase
        .from("participantes")
        .insert([
          {
            nombre,
            nombre_normalizado:
              nombreNormalizado,
            token:
              crypto.randomUUID(),
            puntos: 0,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(error);

      return Response.json(
        {
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Error interno",
      },
      { status: 500 }
    );
  }
}