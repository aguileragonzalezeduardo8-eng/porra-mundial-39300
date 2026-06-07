import { supabase } from "../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nombre = body.nombre?.trim();

    if (!nombre) {
      return Response.json(
        { error: "Nombre obligatorio" },
        { status: 400 }
      );
    }

    const { data: existentes } = await supabase
      .from("participantes")
      .select("*");

    const duplicado = existentes?.find(
      (p) =>
        p.nombre.trim().toLowerCase() ===
        nombre.toLowerCase()
    );

    if (duplicado) {
      return Response.json(
        {
          error:
            "Ya existe un participante con ese nombre",
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("participantes")
      .insert([
        {
          nombre,
          token: crypto.randomUUID(),
        },
      ])
      .select();

    if (error) {
      console.log("ERROR SUPABASE:", error);

      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data[0]);
  } catch (e) {
    console.error("ERROR GENERAL:", e);

    return Response.json(
      { error: "Error general" },
      { status: 500 }
    );
  }
}