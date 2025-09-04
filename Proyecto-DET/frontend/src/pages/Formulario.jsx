import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { crearRegistro, obtenerRegisto, actualizarRegisto } from "../api/consultas";

const initialState = {
  Nombre: "",
  Apellido: "",
  Direccion: "",
  Dni: "",
  Teléfono: "",
  "Fecha de nacimiento": "",
  Email: "",
};

export default function Formulario() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      obtenerRegisto(id)
        .then(data => {
          if (data) {
            setForm(data);
          }
        })
        .catch(error => {
          console.error("Error al cargar usuario:", error);
        });
    }
  }, [id]);

  const validate = () => {
    const newErrors = {};
    
    // Validación de Nombre (solo letras y espacios)
    if (!form.Nombre.trim()) {
      newErrors.Nombre = "El nombre es obligatorio";
    } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(form.Nombre)) {
      newErrors.Nombre = "El nombre solo puede contener letras y espacios";
    } else if (form.Nombre.trim().length < 2) {
      newErrors.Nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validación de Apellido (solo letras y espacios)
    if (!form.Apellido.trim()) {
      newErrors.Apellido = "El apellido es obligatorio";
    } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(form.Apellido)) {
      newErrors.Apellido = "El apellido solo puede contener letras y espacios";
    }

    // Validación de Dirección
    if (!form.Direccion.trim()) {
      newErrors.Direccion = "La dirección es obligatoria";
    } else if (form.Direccion.trim().length < 5) {
      newErrors.Direccion = "La dirección debe tener al menos 5 caracteres";
    }

    // Validación de DNI (solo números, positivo, entre 7 y 8 dígitos)
    if (!form.Dni) {
      newErrors.Dni = "El DNI es obligatorio";
    } else if (!/^\d+$/.test(form.Dni)) {
      newErrors.Dni = "El DNI solo puede contener números";
    } else if (parseInt(form.Dni) <= 0) {
      newErrors.Dni = "El DNI no puede ser 0 o negativo";
    } else if (form.Dni.length < 7 || form.Dni.length > 8) {
      newErrors.Dni = "El DNI debe tener entre 7 y 8 dígitos";
    }

    // Validación de Teléfono (solo números, mínimo 10 dígitos)
    if (!form.Teléfono) {
      newErrors.Teléfono = "El teléfono es obligatorio";
    } else if (!/^\d+$/.test(form.Teléfono)) {
      newErrors.Teléfono = "El teléfono solo puede contener números";
    } else if (form.Teléfono.length < 10) {
      newErrors.Teléfono = "El teléfono debe tener al menos 10 dígitos";
    }

    // Validación de Fecha de Nacimiento (no futura, mayor de 18 años opcional)
    if (!form["Fecha de nacimiento"]) {
      newErrors["Fecha de nacimiento"] = "La fecha de nacimiento es obligatoria";
    } else {
      const birthDate = new Date(form["Fecha de nacimiento"]);
      const today = new Date();
      
      if (birthDate > today) {
        newErrors["Fecha de nacimiento"] = "La fecha de nacimiento no puede ser futura";
      } else {
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          newErrors["Fecha de nacimiento"] = "Debes ser mayor de 18 años";
        }
      }
    }

    // Validación de Email
    if (!form.Email) {
      newErrors.Email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
      newErrors.Email = "Formato de email inválido";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real para DNI (solo números)
    if (name === "Dni" || name === "Teléfono") {
      if (!/^\d*$/.test(value)) return; // Solo permite números
    }
    
    // Validación en tiempo real para Nombre y Apellido (solo letras)
    if (name === "Nombre" || name === "Apellido") {
      if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]*$/.test(value)) return;
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        await actualizarRegisto(id, form);
      } else {
        await crearRegistro(form);
      }
      navigate("/");
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? "Editar usuario" : "Crear usuario"}</h2>
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="Nombre">Nombre *</label>
          <input
            id="Nombre"
            name="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            placeholder="Ej: Juan"
            maxLength={50}
            className={errors.Nombre ? "error" : ""}
          />
          {errors.Nombre && <span className="error-text">{errors.Nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Apellido">Apellido *</label>
          <input
            id="Apellido"
            name="Apellido"
            value={form.Apellido}
            onChange={handleChange}
            placeholder="Ej: Pérez"
            maxLength={50}
            className={errors.Apellido ? "error" : ""}
          />
          {errors.Apellido && <span className="error-text">{errors.Apellido}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Direccion">Dirección *</label>
          <input
            id="Direccion"
            name="Direccion"
            value={form.Direccion}
            onChange={handleChange}
            placeholder="Ej: Calle Principal 123"
            maxLength={100}
            className={errors.Direccion ? "error" : ""}
          />
          {errors.Direccion && <span className="error-text">{errors.Direccion}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Dni">DNI *</label>
          <input
            id="Dni"
            name="Dni"
            value={form.Dni}
            onChange={handleChange}
            placeholder="Ej: 12345678"
            maxLength={8}
            className={errors.Dni ? "error" : ""}
          />
          {errors.Dni && <span className="error-text">{errors.Dni}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Teléfono">Teléfono *</label>
          <input
            id="Teléfono"
            name="Teléfono"
            value={form.Teléfono}
            onChange={handleChange}
            placeholder="Ej: 1123456789"
            maxLength={15}
            className={errors.Teléfono ? "error" : ""}
          />
          {errors.Teléfono && <span className="error-text">{errors.Teléfono}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</label>
          <input
            id="fecha_nacimiento"
            name="Fecha de nacimiento"
            type="date"
            value={form["Fecha de nacimiento"]}
            onChange={handleChange}
            className={errors["Fecha de nacimiento"] ? "error" : ""}
          />
          {errors["Fecha de nacimiento"] && (
            <span className="error-text">{errors["Fecha de nacimiento"]}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Email">Email *</label>
          <input
            id="Email"
            name="Email"
            type="email"
            value={form.Email}
            onChange={handleChange}
            placeholder="Ej: usuario@ejemplo.com"
            maxLength={100}
            className={errors.Email ? "error" : ""}
          />
          {errors.Email && <span className="error-text">{errors.Email}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? "Guardando..." : (id ? "Actualizar" : "Crear")}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate("/")}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}