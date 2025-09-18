import React, { useState } from "react";

const Reportes = ({ participantes }) => {
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('Todos');
  const [filtroAsistencia, setFiltroAsistencia] = useState('Todos');

  const tipos = ['Todos', ...new Set(participantes.map(p => p.tipo))];
  const departamentos = ['Todos', ...new Set(participantes.map(p => p.departamento))];

  const participantesFiltrados = participantes.filter(p => {
    return (filtroTipo === 'Todos' || p.tipo === filtroTipo) &&
           (filtroDepartamento === 'Todos' || p.departamento === filtroDepartamento) &&
           (filtroAsistencia === 'Todos' || 
            (filtroAsistencia === 'Presentes' && p.asistencia === 'Activo') ||
            (filtroAsistencia === 'Ausentes' && p.asistencia === 'No Activo'));
  });

  const exportarExcel = () => {
    const datosExport = participantesFiltrados.map(p => ({
      Nombre: p.nombre,
      Teléfono: p.telefono,
      Departamento: p.departamento,
      Tipo: p.tipo,
      Estado: p.asistencia === 'Activo' ? 'Presente' : 'Ausente',
      'Fecha Registro': p.fecha 
        ? new Date(p.fecha.seconds ? p.fecha.seconds * 1000 : p.fecha).toLocaleDateString()
        : 'Sin fecha'
    }));

    const headers = Object.keys(datosExport[0]).join(',');
    const csvContent = datosExport.map(row => Object.values(row).join(',')).join('\n');
    const csv = headers + '\n' + csvContent;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_asistencia_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select 
              value={filtroTipo} 
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
            <select 
              value={filtroDepartamento} 
              onChange={(e) => setFiltroDepartamento(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departamentos.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asistencia</label>
            <select 
              value={filtroAsistencia} 
              onChange={(e) => setFiltroAsistencia(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Todos">Todos</option>
              <option value="Presentes">Presentes</option>
              <option value="Ausentes">Ausentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados - Tabla en escritorio, cards en móvil */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="text-lg font-semibold">Resultados ({participantesFiltrados.length} participantes)</h3>
          <button 
            onClick={exportarExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Exportar CSV
          </button>
        </div>
        
        {/* Tabla solo en md+ */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left p-3 font-semibold">Nombre</th>
                <th className="text-left p-3 font-semibold">Teléfono</th>
                <th className="text-left p-3 font-semibold">Tipo</th>
                <th className="text-left p-3 font-semibold">Departamento</th>
                <th className="text-left p-3 font-semibold">Fecha Registro</th>
                <th className="text-left p-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {participantesFiltrados.map((participante, index) => (
                <tr key={participante.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3">{participante.nombre}</td>
                  <td className="p-3">{participante.telefono}</td>
                  <td className="p-3">{participante.tipo}</td>
                  <td className="p-3">{participante.departamento}</td>
                  <td className="p-3">
                    {participante.fecha 
                      ? new Date(participante.fecha.seconds ? participante.fecha.seconds * 1000 : participante.fecha).toLocaleDateString()
                      : 'Sin fecha'
                    }
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      participante.asistencia === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {participante.asistencia === 'Activo' ? 'Presente' : 'Ausente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards en móvil */}
        <div className="md:hidden space-y-4">
          {participantesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
              <p className="text-sm">No se encontraron participantes</p>
            </div>
          ) : (
            participantesFiltrados.map((participante) => (
              <div key={participante.id} className="bg-blue-50 rounded-lg shadow border p-4 space-y-2">
                <div className="font-medium text-gray-900">{participante.nombre}</div>
                <div className="text-gray-600 text-sm">
                  <span className="font-semibold">Teléfono:</span> {participante.telefono}
                </div>
                <div className="text-gray-900 text-sm">
                  <span className="font-semibold">Tipo:</span> {participante.tipo}
                </div>
                <div className="text-gray-600 text-sm">
                  <span className="font-semibold">Departamento:</span> {participante.departamento}
                </div>
                <div className="text-gray-600 text-sm">
                  <span className="font-semibold">Fecha Registro:</span>{" "}
                  {participante.fecha 
                    ? new Date(participante.fecha.seconds ? participante.fecha.seconds * 1000 : participante.fecha).toLocaleDateString()
                    : 'Sin fecha'
                  }
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    participante.asistencia === 'Activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {participante.asistencia === 'Activo' ? 'Presente' : 'Ausente'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Espacio extra antes del footer */}
      <div className="h-12" />
    </div>
  );
};

export default Reportes;