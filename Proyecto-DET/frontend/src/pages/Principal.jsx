import { useEffect, useState } from "react";
import { obtenerRegistros, borrarRegistro, borrarRegistro } from "../api/users";

export default function Principal() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    obtenerRegistros().then(setUsers);
  }, []);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await borrarRegistro(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      obtenerRegistros().then(setUsers);
    } else {
      const results = await borrarRegistro(query);
      setUsers(Array.isArray(results) ? results : []);
    }
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: "1em", display: "flex", justifyContent: "center", gap: "1em" }}>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, maxWidth: 300 }}
        />
        <button type="submit">Buscar</button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            obtenerRegistros().then(setUsers);
          }}
        >
          Limpiar
        </button>
      </form>
      <a href="/form">Crear usuario</a>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Fecha de nacimiento</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(users) ? users : []).map(user => (
            <tr key={user.id}>
              <td data-label="Nombre">{user.Nombre}</td>
              <td data-label="Apellido">{user.Apellido}</td>
              <td data-label="Dirección">{user.Direccion}</td>
              <td data-label="DNI">{user.Dni}</td>
              <td data-label="Teléfono">{user.Teléfono}</td>
              <td data-label="Fecha de nacimiento">{user["Fecha de nacimiento"]}</td>
              <td data-label="Email">{user.Email}</td>
              <td>
                <a href={`/form?id=${user.id}`}>Editar</a>{" | "}
                <button onClick={() => handleDeleteClick(user)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {Array.isArray(users) && users.length === 0 && (
        <div>No se encontraron usuarios.</div>
      )}

      {/* Modal de confirmación */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#fff", padding: "2em", borderRadius: "8px", boxShadow: "0 2px 8px #0002", minWidth: "300px"
          }}>
            <h3>¿Seguro que quieres eliminar este usuario?</h3>
            <p>
              <b>{userToDelete?.Nombre} {userToDelete?.Apellido}</b>
            </p>
            <div style={{ marginTop: "1.5em", display: "flex", justifyContent: "center", gap: "1em" }}>
              <button onClick={confirmDelete} style={{ background: "#e11d48" }}>Eliminar</button>
              <button onClick={cancelDelete} style={{ background: "#2563eb" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}