import { supabase } from "../lib/supabase";
import AdminPartido from "../components/AdminPartido";
import CrearPartido from "../components/CrearPartido";
import LoginAdmin from "./LoginAdmin";

export default async function AdminPage() {
  const { data: partidos } = await supabase
    .from("partidos")
    .select("*")
    .order("fecha_partido", {
      ascending: true,
    });

  return (
    <LoginAdmin>
      <main className="p-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          ⚙️ Panel Administrador
        </h1>

        <CrearPartido />

        {!partidos || partidos.length === 0 ? (
          <p>No hay partidos.</p>
        ) : (
          <div>
            {partidos.map((partido) => (
              <AdminPartido
                key={partido.id}
                partido={partido}
              />
            ))}
          </div>
        )}
      </main>
    </LoginAdmin>
  );
}