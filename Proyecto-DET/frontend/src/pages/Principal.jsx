import { useEffect, useState } from "react";
import { obtenerRegistros, borrarRegistro, buscarRegistro } from "../api/consultas";
import "../Principal.css";

export default function Principal() {
  const [registros, setRegistros] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [registroToDelete, setRegistroToDelete] = useState(null);
  const [ordenDescendente, setOrdenDescendente] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Cargar registros y modo oscuro al inicio
  useEffect(() => {
    obtenerRegistros().then(setRegistros);
    const darkGuardado = localStorage.getItem("modoOscuro") === "true";
    setDarkMode(darkGuardado);
  }, []);

  // Ordenar por fecha
  const ordenarPorFecha = () => {
    const ordenados = [...registros].sort((a, b) => {
      const fechaA = a.Fecha_diagnostico ? new Date(a.Fecha_diagnostico) : new Date(0);
      const fechaB = b.Fecha_diagnostico ? new Date(b.Fecha_diagnostico) : new Date(0);
      return ordenDescendente ? fechaB - fechaA : fechaA - fechaB;
    });
    setRegistros(ordenados);
    setOrdenDescendente(!ordenDescendente);
  };

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
    <div className={`contenedor-principal ${darkMode ? "oscuro" : ""}`}>
      <h1>Registros</h1>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="formulario-busqueda">
        <input
          type="text"
          placeholder="Buscar por número de serie, fecha o generación"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit"><img src="../src/assets/busqueda.svg" /></button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            obtenerRegistros().then(setRegistros);
          }}
        >
          <img src="../src/assets/cruz.svg" />
        </button>
      </form>

      {/* Controles superiores */}
      <div className="controles-superiores">
        <button type="button" className={`boton-icono ordenar ${ordenDescendente ? "desc" : "asc"}`} onClick={ordenarPorFecha}>
          <img src="../src/assets/direccion.svg" alt="Ordenar" />
        </button>
        <button type="button" className="boton-icono darkmode" onClick={() => {
          const nuevoModo = !darkMode;
          setDarkMode(nuevoModo);
          localStorage.setItem("modoOscuro", nuevoModo);
        }}>
          {darkMode ? (
            <img src="../src/assets/modo-claro.svg" alt="Modo oscuro" />
          ) : (
            <img src="../src/assets/modo-oscuro.svg" alt="Modo claro" />
          )}
        </button>
      </div>

      {/* Botón crear registro */}
      <a href="/formulario" className="boton-crear">
        <img src="../src/assets/agregar.svg" alt="Agregar" />
      </a>

      {/* Tabla */}
      <table className="tabla-registros">
        <thead>
          <tr>
            <th>Número de serie</th>
            <th>Modelo exacto</th>
            <th>Generación</th>
            <th>Observaciones</th>
            <th>Diagnóstico</th>
            <th>Estado</th>
            <th>Fecha diagnóstico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(registros) ? registros : []).map(registro => (
            <tr key={registro.Id_equipo}>
              <td data-label="Número de serie">{registro.Numero_de_serie}</td>
              <td data-label="Modelo exacto">{registro.Modelo_exacto}</td>
              <td data-label="Generación">{registro.Generacion === "G-0" ? "---" : registro.Generacion}</td>
              <td data-label="Observaciones">{registro.Observaciones}</td>
              <td data-label="Diagnóstico">{registro.Diagnostico}</td>
              <td data-label="Estado">{registro.Estado}</td>
              <td data-label="Fecha diagnóstico">{registro.Fecha_diagnostico ? registro.Fecha_diagnostico.split("T")[0] : ""}</td>
              <td className="acciones">
                <a href={`/formulario?Id_equipo=${registro.Id_equipo}`}><img src="../src/assets/editar.svg" alt="Editar" /></a>
                {" | "}
                <button onClick={() => handleDeleteClick(registro)}><img src="../src/assets/borrar.svg" alt="Eliminar" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {Array.isArray(registros) && registros.length === 0 && (
        <div className="sin-registros">No se encontraron registros.</div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <h3>¿Seguro que quieres eliminar este registro?</h3>
            <p><b>{registroToDelete?.Numero_de_serie} {registroToDelete?.Modelo_exacto}</b></p>
            <div className="modal-acciones">
              <button onClick={confirmDelete}>Eliminar</button>
              <button onClick={cancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
