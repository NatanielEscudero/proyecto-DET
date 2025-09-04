const API_URL = "http://localhost:3000/usuarios";

export async function obtenerRegistros() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function obtenerRegisto(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
} // obtener un usuario por ID

export async function crearRegistro(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
} // crear un usuario

export async function actualizarRegisto(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}  // actualizar un usuario

export async function borrarRegistro(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
} // eliminar un usuario

export async function buscarRegistro(query) {
  const res = await fetch(`http://localhost:3000/usuarios/buscar/${encodeURIComponent(query)}`);
  return res.json();
}