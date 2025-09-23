import React, { useState } from "react";
import { Filter, Search, Tag, MapPin, Eye, Users, Download, Phone, Calendar, Palette } from "lucide-react";
import * as XLSX from "xlsx";

const departamentosHonduras = [
  "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés",
  "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía",
  "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
];

const tiposFijos = ["Todos", "Cliente", "Empleado", "Agroservicio", "Proveedor", "Otros"];

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  let dateObj;
  if (fecha.seconds) {
    dateObj = new Date(fecha.seconds * 1000);
  } else {
    dateObj = new Date(fecha);
  }
  const dia = String(dateObj.getDate()).padStart(2, '0');
  const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
  const anio = dateObj.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

const colorNombre = (color) => {
  if (!color) return "N/T";
  return color.charAt(0).toUpperCase() + color.slice(1);
};

const colorBg = {
  verde: "bg-green-500 text-white",
  amarillo: "bg-yellow-400 text-gray-900",
  anaranjado: "bg-orange-500 text-white",
  negro: "bg-black text-white",
  rojo: "bg-red-500 text-white",
  azul: "bg-blue-600 text-white",
};

const Reportes = ({ participantes }) => {
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('Todos');
  const [filtroAsistencia, setFiltroAsistencia] = useState('Todos');
  const [busqueda, setBusqueda] = useState("");

  const participantesFiltrados = participantes.filter(p => {
    return (filtroTipo === 'Todos' || p.tipo === filtroTipo) &&
           (filtroDepartamento === 'Todos' || p.departamento === filtroDepartamento) &&
           (filtroAsistencia === 'Todos' || 
            (filtroAsistencia === 'Presentes' && p.asistencia === 'Activo') ||
            (filtroAsistencia === 'Ausentes' && p.asistencia === 'No Activo')) &&
           (
             p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
             p.telefono?.includes(busqueda) ||
             p.departamento?.toLowerCase().includes(busqueda.toLowerCase())
           );
  });

  const participantesOrdenados = [...participantesFiltrados].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
  );

  // Exportar a Excel con encabezados en azul y negrita
  const exportarExcel = () => {
    if (participantesOrdenados.length === 0) return;
    const datosExport = participantesOrdenados.map(p => ({
      Nombre: p.nombre,
      Teléfono: mostrarTelefono(p.telefono),
      Departamento: p.departamento,
      Tipo: p.tipo,
      Color: colorNombre(p.color),
      'Fecha Registro': formatearFecha(p.fecha),
      Estado: p.asistencia === 'Activo' ? 'Presente' : 'Ausente',
    }));

    // Crear hoja y libro (sin origin: "A2")
    const ws = XLSX.utils.json_to_sheet(datosExport);

    // Aplica estilos a los encabezados (negrita y color)
    const headers = [
      "Nombre",
      "Teléfono",
      "Departamento",
      "Tipo",
      "Color",
      "Fecha Registro",
      "Estado"
    ];
    headers.forEach((_, idx) => {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: idx })];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2563EB" } }
        };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    XLSX.writeFile(wb, `Reporte_asistencia_${new Date().toLocaleDateString()}.xlsx`);
  };

  const mostrarTelefono = (telefono) => {
    if (!telefono) return '';
    return telefono.includes('-')
      ? telefono
      : telefono.replace(/^(\d{4})(\d{4})$/, '$1-$2');
  };

  const limpiarFiltros = () => {
    setFiltroTipo('Todos');
    setFiltroDepartamento('Todos');
    setFiltroAsistencia('Todos');
    setBusqueda('');
  };

  return (
    <div className="space-y-6 mt-8 px-4 md:px-0">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
            </div>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors self-start sm:self-auto"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          {/* Filtros en móvil: stack vertical */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4 mr-2" />
                Tipo de Participante
              </label>
              <select 
                value={filtroTipo} 
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {tiposFijos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 mr-2" />
                Departamento
              </label>
              <select 
                value={filtroDepartamento} 
                onChange={(e) => setFiltroDepartamento(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Todos">Todos</option>
                {departamentosHonduras.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Eye className="w-4 h-4 mr-2" />
                Estado de Asistencia
              </label>
              <select 
                value={filtroAsistencia} 
                onChange={(e) => setFiltroAsistencia(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Presentes">Solo presentes</option>
                <option value="Ausentes">Solo ausentes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Resultados ({participantesOrdenados.length})
              </h3>
            </div>
            <button 
              onClick={exportarExcel}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 text-sm font-medium shadow-sm"
              disabled={participantesOrdenados.length === 0}
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          {participantesOrdenados.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-600">Prueba ajustando los filtros de búsqueda</p>
            </div>
          ) : (
            <>
              {/* Tabla para desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-5 font-semibold text-gray-800 bg-blue-50">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-800" />
                          Participante
                        </div>
                      </th>
                      <th className="text-left p-5 font-semibold text-gray-800 bg-blue-50">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-800" />
                          Teléfono
                        </div>
                      </th>
                      <th className="text-left p-5 font-semibold text-gray-800 bg-blue-50">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-2 text-gray-800" />
                          Tipo
                        </div>
                      </th>
                      <th className="text-left p-5 font-semibold text-gray-800 bg-blue-50">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-800" />
                          Departamento
                        </div>
                      </th>
                      <th className="text-center p-5 font-semibold text-gray-800 bg-blue-50">
                        <div className="flex items-center justify-center">
                          <Palette className="w-4 h-4 mr-2 text-gray-800" />
                          Color
                        </div>
                      </th>
                      <th className="text-left p-5 font-semibold text-gray-800 bg-blue-50">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-800" />
                          Fecha Registro
                        </div>
                      </th>
                      <th className="text-center p-5 font-semibold text-gray-800 bg-blue-50">
                        <div className="flex items-center justify-center">
                          <Eye className="w-4 h-4 mr-2 text-gray-800" />
                          Estado
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantesOrdenados.map((participante, index) => (
                      <tr 
                        key={participante.id} 
                        className={`border-b border-gray-100 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="p-5">
                          <div className="font-semibold text-gray-900">
                            {participante.nombre}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="text-gray-600 font-medium">
                            {mostrarTelefono(participante.telefono)}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-semibold text-gray-900">
                            {participante.tipo}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="text-gray-700 font-medium">
                            {participante.departamento}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${colorBg[participante.color] || "bg-gray-100 text-gray-700"}`}>
                            {colorNombre(participante.color)}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="text-gray-600">
                            {formatearFecha(participante.fecha)}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 shadow-sm ${
                            participante.asistencia === 'Activo' 
                              ? 'bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 border-2 border-red-300 hover:bg-red-200'
                          }`}>
                            {participante.asistencia === 'Activo' ? (
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Presente
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                Ausente
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards para móvil y tablet */}
              <div className="lg:hidden space-y-4">
                {participantesOrdenados.map((participante) => (
                  <div
                    key={participante.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    {/* Header de la card */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">
                            {participante.nombre}
                          </h4>
                          <p className="text-gray-600 text-sm font-medium">
                            {participante.tipo}
                          </p>
                        </div>
                        {/* Estado */}
                        <div className="ml-3">
                          {participante.asistencia === 'Activo' ? (
                            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1.5 rounded-full border border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-xs font-bold">Presente</span>
                            </div>
                          ) : (
                            <div className="flex items-center bg-red-100 text-red-800 px-3 py-1.5 rounded-full border border-red-200">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-xs font-bold">Ausente</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contenido de la card */}
                    <div className="p-5">
                      <div className="space-y-4">
                        {/* Teléfono */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Teléfono</p>
                            <p className="text-gray-900 font-semibold font-mono">
                              {mostrarTelefono(participante.telefono)}
                            </p>
                          </div>
                        </div>

                        {/* Departamento */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Departamento</p>
                            <p className="text-gray-900 font-semibold">
                              {participante.departamento}
                            </p>
                          </div>
                        </div>
                      {/* Color */}
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${colorBg[participante.color] || "bg-gray-100"}`}>
                          <Palette className="w-4 h-4" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <p className="text-xs text-gray-500 mb-0.5">Color</p>
                          <span className="text-xs font-semibold mt-1">
                            {colorNombre(participante.color)}
                          </span>
                        </div>
                      </div>

                        {/* Fecha de registro */}
                        <div className="flex items-center pt-2 border-t border-gray-100">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                            <Calendar className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Fecha de Registro</p>
                            <p className="text-gray-700 font-medium">
                              {formatearFecha(participante.fecha)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Contador final para móvil */}
      {participantesOrdenados.length > 0 && (
        <div className="lg:hidden text-center">
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="text-sm text-gray-600 font-medium">
              {participantesOrdenados.length} participante{participantesOrdenados.length !== 1 ? 's' : ''} encontrado{participantesOrdenados.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
      
      <div className="h-12" />
    </div>
  );
};

export default Reportes;