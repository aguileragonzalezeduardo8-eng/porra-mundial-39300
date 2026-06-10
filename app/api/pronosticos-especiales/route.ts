import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const participanteId =
    searchParams.get(
      "participante_id"
    );

  if (!participanteId) {
    return NextResponse.json(
      null
    );
  }

  const { data } =
    await supabase
      .from(
        "pronosticos_especiales"
      )
      .select("*")
      .eq(
        "participante_id",
        participanteId
      )
      .single();

  return NextResponse.json(
    data
  );
}

export async function POST(
  request: Request
) {
  const body =
    await request.json();

    const fechaLimite = new Date(
  "2026-06-11T21:00:00+02:00"
);

if (new Date() >= fechaLimite) {
  return NextResponse.json(
    {
      error:
        "Pronósticos especiales cerrados",
    },
    { status: 403 }
  );
}

  const {
    participante_id,
    campeon,
    maximo_goleador,
  } = body;

 const { data, error } =
  await supabase
    .from(
      "pronosticos_especiales"
    )
.upsert(
  {
    participante_id: Number(participante_id),
    campeon,
    maximo_goleador,
  },
  {
    onConflict: "participante_id",
  }
);

console.log("DATA:", data);
console.log("ERROR:", error);
console.log(
  participante_id,
  campeon,
  maximo_goleador
);

  if (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
  });
}