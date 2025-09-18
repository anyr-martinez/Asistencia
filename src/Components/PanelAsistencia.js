import React from "react";
import { User, CheckCircle, Clock } from "lucide-react";
import Buscador from "../Hooks/Buscador";

const PanelAsistencia = ({ participantes = [], marcarAsistencia, busqueda = "", setBusqueda }) => {
  const participantesFiltrados = participantes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.telefono.includes(busqueda)
  );

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'Cliente': return 'bg-blue-100 text-blue-800';
      case 'Empleado': return 'bg-green-100 text-green-800';
      case 'Agroservicio': return 'bg-purple-100 text-purple-800';
      case 'Otros': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const presentes = participantesFiltrados.filter(p => p.asistencia === "Activo").length;
  const total = participantesFiltrados.length;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow border overflow-hidden">
        {/* Header de tabla */}
        <div className="bg-blue-50 border-b px-4 py-3 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
          <div className="col-span-4">Nombre</div>
          <div className="col-span-2">Departamento</div>
          <div className="col-span-2">Tipo</div>
          <div className="col-span-2">Número</div>
          <div className="col-span-2 text-center">Estado</div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {participantesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <User className="mx-auto mb-2 w-8 h-8" />
              <p className="text-sm">No se encontraron participantes</p>
            </div>
          ) : (
            participantesFiltrados.map((participante, index) => (
              <div 
                key={participante.id} 
                className={`px-4 py-3 grid grid-cols-12 gap-4 items-center text-sm border-b hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                {/* Nombre */}
                <div className="col-span-4 font-medium text-gray-900 flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  {participante.nombre}
                </div>
                {/* Departamento */}
                <div className="col-span-2 text-gray-600">
                  {participante.departamento}
                </div>
                {/* Tipo */}
                <div className="col-span-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(participante.tipo)}`}>
                    {participante.tipo}
                  </span>
                </div>
                {/* Número */}
                <div className="col-span-2 text-gray-600">
                  {participante.telefono.replace(/(\d{4})(\d{4})/, '$1-$2')}
                </div>
                {/* Estado */}
                <div className="col-span-2 flex items-center justify-center">
                  {participante.asistencia === "Activo" ? (
                    <div className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Presente</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => marcarAsistencia(participante.id)}
                      className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Marcar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {participantesFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
            <User className="mx-auto mb-2 w-8 h-8" />
            <p className="text-sm">No se encontraron participantes</p>
          </div>
        ) : (
          participantesFiltrados.map((participante) => (
            <div key={participante.id} className="bg-white rounded-lg shadow border p-4 space-y-2">
              <div className="flex items-center font-medium text-gray-900">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                {participante.nombre}
              </div>
              <div className="text-gray-600 text-sm">
                <span className="font-semibold">Departamento:</span> {participante.departamento}
              </div>
              <div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(participante.tipo)}`}>
                  {participante.tipo}
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                <span className="font-semibold">Número:</span> {participante.telefono.replace(/(\d{4})(\d{4})/, '$1-$2')}
              </div>
              <div>
                {participante.asistencia === "Activo" ? (
                  <div className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded-lg w-fit">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Presente</span>
                  </div>
                ) : (
                  <button
                    onClick={() => marcarAsistencia(participante.id)}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Marcar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resumen al final */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-2">
        <div>Mostrando {participantesFiltrados.length} de {participantes.length} participantes</div>
        <div className="flex space-x-4">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Presentes: {presentes}
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
            Ausentes: {total - presentes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PanelAsistencia;