import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { crearRegistro, obtenerRegistros, actualizarRegisto} from "../api/consultas";
import '../Principal.css';

const initialState = {
  Numero_de_serie: "",
  Modelo_exacto: "",
  Generacion: "",
  Observaciones: "",
  Diagnostico: "",
  Estado: "",
  Fecha_diagnostico: "",
};

export default function Formulario() {
  const [parametrosBusqueda] = useSearchParams();
  const navegar = useNavigate();
  const Id_equipo = parametrosBusqueda.get("Id_equipo");
  const [formulario, setFormulario] = useState(initialState);
  const [errores, setErrores] = useState({});
  const [estaSubiendo, setEstaSubiendo] = useState(false);
  const [mensajeError, setMensajeError] = useState("");


  useEffect(() => {
  if (Id_equipo) {
    obtenerRegistros() // traemos todos los registros
      .then((todos) => {
        const registro = todos.find(r => r.Id_equipo.toString() === Id_equipo.toString());
        if (registro) {
          // Asegura que siempre haya todas las claves
          setFormulario({ ...initialState, ...registro });
        }
      })
      .catch((error) => {
        console.error("Error al cargar registro:", error);
      });
  }
}, [Id_equipo]);


  // Manejar cambios de input
  const manejarCambios = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const validarFecha = (fecha) => {
    if (!fecha) return "La fecha es obligatoria";
    const añoFormulario = new Date(fecha).getFullYear();
    const añoActual = new Date().getFullYear();
    if (añoFormulario !== añoActual) return `La fecha debe estar en el año ${añoActual}`;
    return null;
  };


  // hacer los campos obligatorios (validarlos)
  const validar = () => {
  const nuevosErrores = {};

  if (!formulario.Numero_de_serie?.trim())
    nuevosErrores.Numero_de_serie = "El número de serie es obligatorio, en caso de no existir poner 0";

  if (!formulario.Modelo_exacto?.trim())
    nuevosErrores.Modelo_exacto = "El modelo exacto es obligatorio";

  if (!formulario.Generacion?.trim()) {
    nuevosErrores.Generacion = "La generación es obligatoria";
  } else {
    // Validamos que esté en el rango G-1 a G-15
    const match = formulario.Generacion.match(/^G-(\d{1,2})$/);
    if (!match || Number(match[1]) < 0 || Number(match[1]) > 15) {
      nuevosErrores.Generacion = "La generación debe estar entre G-0 (no es del gobierno) y G-15";
    }
  }

  if (!formulario.Observaciones?.trim())
    nuevosErrores.Observaciones = "Las observaciones son obligatorias";

  if (!formulario.Diagnostico?.trim())
    nuevosErrores.Diagnostico = "El diagnóstico es obligatorio";

  if (!formulario.Estado?.trim())
    nuevosErrores.Estado = "El estado es obligatorio";

  const errorFecha = validarFecha(formulario.Fecha_diagnostico);
  if (errorFecha) nuevosErrores.Fecha_diagnostico = errorFecha;


  return nuevosErrores;
};


  // manejar el POST (distinguir editar de crear, campos validados, etc)
  const manejarSubida = async (e) => {
    e.preventDefault();
    setEstaSubiendo(true);

    const erroresValidacion = validar();
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length > 0) {
      setEstaSubiendo(false);
      return;
    }

    try {
  if (Id_equipo) {
    await actualizarRegisto(Id_equipo, formulario);
  } else {
    await crearRegistro(formulario);
  }
  navegar("/");
} catch (error) {
  // Aquí ahora sí llega el mensaje exacto del backend
  if (error.message.includes("número de serie ya está registrado")) {
    setErrores({ Numero_de_serie: error.message });
  } else {
    setMensajeError(error.message || "Hubo un error al guardar el registro");
  }
} finally {
  setEstaSubiendo(false);
}





  };

  return (
    <div className="form-container">
      <h2>{Id_equipo ? "Editar registro" : "Crear registro"}</h2>

      
      {mensajeError && (
        <div className="alert alert-danger">
          {mensajeError}
        </div>
      )}

      <form onSubmit={manejarSubida} className="user-form">
        <div className="form-group">
          <label htmlFor="Numero_de_serie">Número de serie *</label>
          <input
            type="text"
            id="Numero_de_serie"
            name="Numero_de_serie"
            value={formulario.Numero_de_serie}
            onChange={manejarCambios}
            maxLength={50}
            className={errores.Numero_de_serie ? "error" : ""}
          />
          {errores.Numero_de_serie && (
            <span className="error-text">{errores.Numero_de_serie}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Modelo_exacto">Modelo exacto *</label>
          <input
            type="text"
            id="Modelo_exacto"
            name="Modelo_exacto"
            value={formulario.Modelo_exacto}
            onChange={manejarCambios}
            maxLength={50}
            className={errores.Modelo_exacto ? "error" : ""}
          />
          {errores.Modelo_exacto && (
            <span className="error-text">{errores.Modelo_exacto}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Generacion">Generación *</label>
          <input
            type="text"
            id="Generacion"
            name="Generacion"
            value={formulario.Generacion}
            onChange={manejarCambios}
            maxLength={100}
            className={errores.Generacion ? "error" : ""}
          />
          {errores.Generacion && (
            <span className="error-text">{errores.Generacion}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Observaciones">Observaciones *</label>
          <textarea
            id="Observaciones"
            name="Observaciones"
            value={formulario.Observaciones}
            onChange={manejarCambios}
            maxLength={500} // ampliado para texto descriptivo
            className={errores.Observaciones ? "error" : ""}
          />
          {errores.Observaciones && (
            <span className="error-text">{errores.Observaciones}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Diagnostico">Diagnóstico *</label>
          <textarea
            id="Diagnostico"
            name="Diagnostico"
            value={formulario.Diagnostico}
            onChange={manejarCambios}
            maxLength={300} // ampliado para texto
            className={errores.Diagnostico ? "error" : ""}
          />
          {errores.Diagnostico && (
            <span className="error-text">{errores.Diagnostico}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Estado">Estado *</label>
          <select
            id="Estado"
            name="Estado"
            value={formulario.Estado}
            onChange={manejarCambios}
            className={errores.Estado ? "error" : ""}
          >
            <option value="">-- Selecciona un estado --</option>
            <option value="Terminado">Terminado</option>
            <option value="En proceso">En proceso</option>
            <option value="Sin comenzar">Sin comenzar</option>
          </select>
          {errores.Estado && (
            <span className="error-text">{errores.Estado}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Fecha_diagnostico">Fecha diagnóstico *</label>
          <input
            id="Fecha_diagnostico"
            name="Fecha_diagnostico"
            type="date"
            value={formulario.Fecha_diagnostico}
            onChange={manejarCambios}
            className={errores.Fecha_diagnostico ? "error" : ""}
          />
          {errores.Fecha_diagnostico && (
            <span className="error-text">{errores.Fecha_diagnostico}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={estaSubiendo}
            className="btn btn-primary"
          >
            {estaSubiendo
              ? "Guardando..."
              : Id_equipo
              ? "Actualizar"
              : "Crear"}
          </button>

          <button
            type="button"
            onClick={() => navegar("/")}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
