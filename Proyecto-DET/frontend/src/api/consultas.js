const API_URL = "http://localhost:3000/seguimiento_tecnico";

export async function obtenerRegistros() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener registros");
  return res.json();
}

export async function obtenerRegisto(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener registro");
  return res.json();
}

export async function crearRegistro(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json(); // Leemos el JSON del backend

  if (!res.ok) {
    // Lanzamos un error con el mensaje real
    throw new Error(responseData.error || "Error al crear registro");
  }

  return responseData;
}


export async function actualizarRegisto(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar registro");
  return res.json();
}

export async function borrarRegistro(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al borrar registro");
}

export async function buscarRegistro(query) {
  const res = await fetch(`${API_URL}/buscar/${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Error en búsqueda");
  return res.json();
}
