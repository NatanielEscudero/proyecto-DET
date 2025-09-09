import { useEffect, useState } from "react";
import { obtenerRegistros, borrarRegistro, buscarRegistro } from "../api/consultas";
import '../Principal.css';

export default function Principal() {
  const [registros, setRegistros] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [registroToDelete, setRegistroToDelete] = useState(null);

  // Cargar registros al inicio
  useEffect(() => {
    obtenerRegistros().then(setRegistros);
  }, []);

  // Preparar registro para eliminar
  const handleDeleteClick = (registro) => {
    setRegistroToDelete(registro);
    setShowModal(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (registroToDelete) {
      await borrarRegistro(registroToDelete.Id_equipo);
      setRegistros(registros.filter(u => u.Id_equipo !== registroToDelete.Id_equipo));
      setShowModal(false);
      setRegistroToDelete(null);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowModal(false);
    setRegistroToDelete(null);
  };

  // Búsqueda de registros
const handleSearch = async (e) => {
  e.preventDefault();
  try {
    if (query.trim() === "") {
      const all = await obtenerRegistros();
      setRegistros(all);
    } else {
      
      const results = await buscarRegistro(query);
      setRegistros(Array.isArray(results) ? results : []);
    }
  } catch (error) {
    console.error("Error al buscar:", error);
    setRegistros([]);
  }
};

  return (
    <div>
      <h1>Registros</h1>
      <form
        onSubmit={handleSearch}
        style={{ marginBottom: "1em", display: "flex", justifyContent: "center", gap: "1em" }}
      >
        <input
          type="text"
          placeholder="Buscar por numero de serie, fecha o generacion"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, maxWidth: 300 }}
        />
        <button type="submit">Buscar</button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            obtenerRegistros().then(setRegistros);
          }}
        >
          Limpiar
        </button>
      </form>

      <a href="/formulario">Crear registro</a>

      <table>
        <thead>
          <tr>
            <th>Numero de serie</th>
            <th>Modelo exacto</th>
            <th>Generacion</th>
            <th>Observaciones</th>
            <th>Diagnostico</th>
            <th>Estado</th>
            <th>Fecha diagnostico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(registros) ? registros : []).map(registro => (
            <tr key={registro.Id_equipo}>
              <td data-label="Numero_de_serie">{registro.Numero_de_serie}</td>
              <td data-label="Modelo_exacto">{registro.Modelo_exacto}</td>
              <td data-label="Generacion">{registro.Generacion}</td>
              <td data-label="Observaciones">{registro.Observaciones}</td>
              <td data-label="Diagnostico">{registro.Diagnostico}</td>
              <td data-label="Estado">{registro.Estado}</td>
              <td data-label="Fecha diagnostico">{registro.Fecha_diagnostico ? registro.Fecha_diagnostico.split("T")[0] : ""}</td>
              <td>
                <a href={`/formulario?Id_equipo=${registro.Id_equipo}`}>Editar</a>{" | "}
                <button onClick={() => handleDeleteClick(registro)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {Array.isArray(registros) && registros.length === 0 && (
        <div>No se encontraron registros.</div>
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
            <h3>¿Seguro que quieres eliminar este registro?</h3>
            <p>
              <b>{registroToDelete?.Numero_de_serie} {registroToDelete?.Modelo_exacto}</b>
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
