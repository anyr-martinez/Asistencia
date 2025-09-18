import React from "react";
import { Search, X } from "lucide-react";

const Buscador = ({ busqueda, setBusqueda, placeholder = "Buscar por nombre o número de teléfono..." }) => {
  const limpiarBusqueda = () => {
    setBusqueda("");
  };

  return (
    <div className="mb-6 -mt-3">
      <div className="relative max-w-md">
        {/* Icono de búsqueda */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder={placeholder}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm 
                     bg-white shadow-sm transition-all duration-200
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-md
                     hover:border-gray-400 outline-none
                     placeholder-gray-500 " 
        />
        
        {/* Botón para limpiar */}
        {busqueda && (
          <button
            onClick={limpiarBusqueda}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors duration-150
                       p-1 rounded-full hover:bg-gray-100"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {/* Indicador de resultados */}
      {busqueda && (
        <div className="mt-2 text-xs text-gray-500">
          Buscando: "{busqueda}"
        </div>
      )}
    </div>
  );
};

export default Buscador;