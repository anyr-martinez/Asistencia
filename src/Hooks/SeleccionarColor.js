import React from "react";

const colores = [
  { nombre: "Verde", valor: "verde", color: "#22c55e" },
  { nombre: "Amarillo", valor: "amarillo", color: "#eab308" },
  { nombre: "Anaranjado", valor: "anaranjado", color: "#f97316" },
  { nombre: "Negro", valor: "negro", color: "#000000" },
  { nombre: "Rojo", valor: "rojo", color: "#ef4444" },
  { nombre: "Azul", valor: "azul", color: "#2563eb" },
];

const SeleccionarColor = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-center">Selecciona un color</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {colores.map((c) => (
            <button
              key={c.valor}
              className="flex flex-col items-center focus:outline-none"
              onClick={() => onSelect(c.valor)}
            >
              <span
                className="w-10 h-10 rounded-full border-2 border-gray-200 mb-1"
                style={{ background: c.color }}
              ></span>
              <span className="text-xs font-medium">{c.nombre}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-2 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SeleccionarColor;