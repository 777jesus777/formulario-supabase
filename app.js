// 1. Pega aquí los datos de tu proyecto (Supabase > Project Settings > API)
const SUPABASE_URL = "https://slalnhqawydoqevhohpw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_NH5PiaPUr6bHIHOC_LK71g_4lzLG0YY";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const formulario = document.getElementById("formulario");
const btn = document.getElementById("btn");
const estado = document.getElementById("estado");
const lista = document.getElementById("lista");

function mostrarEstado(texto, tipo) {
  estado.textContent = texto;
  estado.className = tipo;
}

// Guardar datos
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!formulario.checkValidity()) {
    mostrarEstado("Completa el nombre y un correo válido.", "error");
    return;
  }

  const datos = {
    nombre: formulario.nombre.value.trim(),
    correo: formulario.correo.value.trim(),
    telefono: formulario.telefono.value.trim(),
    mensaje: formulario.mensaje.value.trim(),
  };

  btn.disabled = true;
  mostrarEstado("Guardando...", "");

  const { error } = await db.from("registros").insert([datos]);

  btn.disabled = false;

  if (error) {
    console.error(error);
    mostrarEstado("No se pudo guardar: " + error.message, "error");
    return;
  }

  mostrarEstado("Datos guardados.", "ok");
  formulario.reset();
  cargarRegistros();
});

// Mostrar los últimos registros
async function cargarRegistros() {
  const { data, error } = await db
    .from("registros")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return;
  }

  lista.innerHTML = "";

  if (!data.length) {
    lista.innerHTML = '<li class="vacio">Aún no hay registros.</li>';
    return;
  }

  data.forEach((r) => {
    const li = document.createElement("li");
    const nombre = document.createElement("strong");
    const detalle = document.createElement("span");
    nombre.textContent = r.nombre;
    detalle.textContent = [r.correo, r.telefono].filter(Boolean).join(" - ");
    li.append(nombre, detalle);
    lista.appendChild(li);
  });
}

cargarRegistros();
