import { supabase } from "../../../lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      goles_local,
      goles_visitante,
      estado,
    } = body;

    const { error } = await supabase
      .from("partidos")
      .update({
        goles_local,
        goles_visitante,
        estado,
      })
      .eq("id", Number(id));

    if (error) {
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("partidos")
      .delete()
      .eq("id", Number(id));

    if (error) {
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