import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  const { data, error } =
    await supabase
      .from("pronosticos_especiales")
      .select(`
        campeon,
        maximo_goleador,
        participantes (
          nombre
        )
      `);

  if (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}