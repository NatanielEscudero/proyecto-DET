import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { crearRegistro, obtenerRegistros, actualizarRegisto } from "../api/consultas";
import "../Formulario.css";

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
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
  const darkGuardado = localStorage.getItem("modoOscuro") === "true";
  setModoOscuro(darkGuardado);
  if(darkGuardado) document.body.classList.add("oscuro");
  else document.body.classList.remove("oscuro");
}, []);


  useEffect(() => {
    if (Id_equipo) {
      obtenerRegistros().then(todos => {
        const registro = todos.find(r => r.Id_equipo.toString() === Id_equipo.toString());
        if (registro) setFormulario({ ...initialState, ...registro });
      }).catch(console.error);
    }
  }, [Id_equipo]);

  const manejarCambios = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const validarFecha = (fecha) => {
    if (!fecha) return "La fecha es obligatoria";
    const añoFormulario = new Date(fecha).getFullYear();
    const añoActual = new Date().getFullYear();
    if (añoFormulario !== añoActual) return `La fecha debe estar en el año ${añoActual}`;
    return null;
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.Numero_de_serie?.trim()) nuevosErrores.Numero_de_serie = "El número de serie es obligatorio";
    if (!formulario.Modelo_exacto?.trim()) nuevosErrores.Modelo_exacto = "El modelo exacto es obligatorio";
    if (!formulario.Generacion?.trim()) nuevosErrores.Generacion = "La generación es obligatoria";
    else {
      const match = formulario.Generacion.match(/^G-(\d{1,2})$/);
      if (!match || Number(match[1]) < 0 || Number(match[1]) > 15)
        nuevosErrores.Generacion = "La generación debe estar entre G-0 y G-15";
    }
    if (!formulario.Observaciones?.trim()) nuevosErrores.Observaciones = "Las observaciones son obligatorias";
    if (!formulario.Diagnostico?.trim()) nuevosErrores.Diagnostico = "El diagnóstico es obligatorio";
    if (!formulario.Estado?.trim()) nuevosErrores.Estado = "El estado es obligatorio";

    const errorFecha = validarFecha(formulario.Fecha_diagnostico);
    if (errorFecha) nuevosErrores.Fecha_diagnostico = errorFecha;

    return nuevosErrores;
  };

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
      if (Id_equipo) await actualizarRegisto(Id_equipo, formulario);
      else await crearRegistro(formulario);
      navegar("/");
    } catch (error) {
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
    <div className={`form-container ${modoOscuro ? "oscuro" : ""}`}>
      <h2>{Id_equipo ? "Editar registro" : "Crear registro"}</h2>

      {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

      <form onSubmit={manejarSubida} className="user-form">
        {/* Campos */}
        {["Numero_de_serie","Modelo_exacto","Generacion"].map(campo => (
          <div className="form-group" key={campo}>
            <label htmlFor={campo}>{campo.replace(/_/g," ")} *</label>
            <input
              type="text"
              id={campo}
              name={campo}
              value={formulario[campo]}
              onChange={manejarCambios}
              className={errores[campo] ? "error" : ""}
            />
            {errores[campo] && <span className="error-text">{errores[campo]}</span>}
          </div>
        ))}

        {["Observaciones","Diagnostico"].map(campo => (
          <div className="form-group" key={campo}>
            <label htmlFor={campo}>{campo.replace(/_/g," ")} *</label>
            <textarea
              id={campo}
              name={campo}
              value={formulario[campo]}
              onChange={manejarCambios}
              className={errores[campo] ? "error" : ""}
            />
            {errores[campo] && <span className="error-text">{errores[campo]}</span>}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="Estado">Estado *</label>
          <select id="Estado" name="Estado" value={formulario.Estado} onChange={manejarCambios} className={errores.Estado ? "error" : ""}>
            <option value="">-- Selecciona un estado --</option>
            <option value="Terminado">Terminado</option>
            <option value="En proceso">En proceso</option>
            <option value="Sin comenzar">Sin comenzar</option>
          </select>
          {errores.Estado && <span className="error-text">{errores.Estado}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Fecha_diagnostico">Fecha diagnóstico *</label>
          <input type="date" id="Fecha_diagnostico" name="Fecha_diagnostico" value={formulario.Fecha_diagnostico} onChange={manejarCambios} className={errores.Fecha_diagnostico ? "error" : ""} />
          {errores.Fecha_diagnostico && <span className="error-text">{errores.Fecha_diagnostico}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={estaSubiendo} className="btn btn-primary">
            {estaSubiendo ? "Guardando..." : Id_equipo ? "Actualizar" : "Crear"}
          </button>
          <button type="button" onClick={() => navegar("/")} className="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
