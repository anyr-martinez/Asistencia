import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, User, MapPin, Briefcase, Phone } from "lucide-react";
import toast from "react-hot-toast";
import Select, { components } from "react-select";

const departamentosHonduras = [
  "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés",
  "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá",
  "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho",
  "Santa Bárbara", "Valle", "Yoro"
];

const tiposParticipante = [
  "Cliente",
  "Empleado",
  "Proveedor",
  "Agroservicio",
  "Otros"
];

// Custom Control para React Select con icono al principio
const CustomControl = (props) => (
  <components.Control {...props}>
    <MapPin className="text-gray-400 w-5 h-5 ml-3 mr-2" />
    {props.children}
  </components.Control>
);

const CustomTipoControl = (props) => (
  <components.Control {...props}>
    <Briefcase className="text-gray-400 w-5 h-5 ml-3 mr-2" />
    {props.children}
  </components.Control>
);

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: '0.75rem',
    backgroundColor: state.isFocused ? '#fff' : '#f9fafb',
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    minHeight: '48px',
    boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
    fontSize: '1rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 0,
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: 0,
    display: 'flex',
    alignItems: 'center',
  }),
  input: (provided) => ({
    ...provided,
    marginLeft: 0,
    fontSize: '1rem',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: '0.75rem',
    fontSize: '1rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? '#e0e7ff'
      : state.isSelected
      ? '#3b82f6'
      : '#fff',
    color: state.isSelected ? '#fff' : '#111827',
    fontSize: '1rem',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#111827',
    fontSize: '1rem',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6b7280',
    fontSize: '1rem',
  }),
};

const AgregarP = ({ isOpen, onClose, onAgregar, participantes = [] }) => {
  const [datos, setDatos] = useState({
    nombre: "",
    departamento: "",
    tipo: "",
    telefono: ""
  });

  // Hacer handleCancelar estable para useEffect
  const handleCancelar = useCallback(() => {
    setDatos({ nombre: "", departamento: "", tipo: "", telefono: "" });
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleCancelar();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleCancelar]);

  const handleTelefonoChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
    setDatos({ ...datos, telefono: value });
  };

    const handleAgregar = () => {
    if (!datos.nombre || !datos.departamento || !datos.tipo || !datos.telefono) {
      toast.error("Debe completar todos los campos.");
      return;
    }
    if (!/^\d{4}-\d{4}$/.test(datos.telefono)) {
      toast.error("El teléfono debe tener 8 dígitos (ej: 9865-8758).");
      return;
    }

    //validacion de unicidad 
    const telefonoSinGuion = datos.telefono.replace("-", "");
    const nombreExiste = participantes.some(
      (p) => p.nombre.trim().toLowerCase() === datos.nombre.trim().toLowerCase()
    );
    const telefonoExiste = participantes.some(
      (p) => p.telefono.replace("-", "") === telefonoSinGuion
    );
    if (nombreExiste) {
      toast.error("¡Ya existe un participante con ese nombre!");
      return;
    }
    if (telefonoExiste) {
      toast.error("¡Ya existe un participante con ese número de teléfono!");
      return;
    }
    const participante = {
      ...datos,
      telefono: telefonoSinGuion, 
      fecha: new Date().toISOString()
    };
    onAgregar(participante);
    toast.success("¡Participante agregado correctamente!");
    setDatos({ nombre: "", departamento: "", tipo: "", telefono: "" });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleCancelar();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-200 scale-100 animate-in">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={handleCancelar}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Agregar Participante</h2>
              <p className="text-gray-600 text-sm">Complete la información del nuevo participante</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Ingrese el nombre completo"
                value={datos.nombre}
                onChange={e => setDatos({ ...datos, nombre: e.target.value })}
                autoFocus
              />
            </div>
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento
            </label>
            <div className="relative">
              <Select
                options={departamentosHonduras.map(dep => ({ value: dep, label: dep }))}
                value={
                  datos.departamento
                    ? { value: datos.departamento, label: datos.departamento }
                    : null
                }
                onChange={option =>
                  setDatos({ ...datos, departamento: option ? option.value : "" })
                }
                placeholder="Seleccione un departamento"
                menuPlacement="auto"
                styles={customSelectStyles}
                components={{ Control: CustomControl }}
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Participante
            </label>
            <div className="relative">
              <Select
                options={tiposParticipante.map(tipo => ({ value: tipo, label: tipo }))}
                value={
                  datos.tipo
                    ? { value: datos.tipo, label: datos.tipo }
                    : null
                }
                onChange={option =>
                  setDatos({ ...datos, tipo: option ? option.value : "" })
                }
                placeholder="Seleccione un tipo"
                menuPlacement="auto"
                styles={customSelectStyles}
                components={{ Control: CustomTipoControl }}
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono"
                placeholder="9865-8758"
                value={datos.telefono}
                onChange={handleTelefonoChange}
                inputMode="numeric"
                maxLength={9}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={handleCancelar}
            className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleAgregar}
            className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarP;