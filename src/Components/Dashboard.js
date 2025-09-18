import React from "react";
import { MapPin } from "lucide-react";

const Dashboard = ({ participantes }) => {
  const totalParticipantes = participantes.length;
  const totalAsistieron = participantes.filter(p => p.asistencia === "Activo").length;
  const porcentajeAsistencia = totalParticipantes > 0 ? Math.round((totalAsistieron / totalParticipantes) * 100) : 0;

  // Conteo por tipo
  const conteosPorTipo = participantes.reduce((acc, participante) => {
    const tipo = participante.tipo;
    if (!acc[tipo]) {
      acc[tipo] = { total: 0, asistieron: 0 };
    }
    acc[tipo].total++;
    if (participante.asistencia === "Activo") {
      acc[tipo].asistieron++;
    }
    return acc;
  }, {});

  // Conteo por departamento
  const conteosPorDepartamento = participantes.reduce((acc, participante) => {
    const dept = participante.departamento;
    if (!acc[dept]) {
      acc[dept] = { total: 0, asistieron: 0 };
    }
    acc[dept].total++;
    if (participante.asistencia === "Activo") {
      acc[dept].asistieron++;
    }
    return acc;
  }, {});

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'Cliente': return { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' };
      case 'Empleado': return { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600' };
      case 'Agroservicio': return { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600' };
      case 'Otros': return { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600' };
      default: return { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-8 mb-16 px-2">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">Resumen general del evento</h2>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 md:p-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold">{totalParticipantes}</div>
            <div className="text-blue-100 mt-1 text-sm md:text-base">Total Registrados</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 md:p-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold">{totalAsistieron}</div>
            <div className="text-green-100 mt-1 text-sm md:text-base">Presentes</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 md:p-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold">{totalParticipantes - totalAsistieron}</div>
            <div className="text-red-100 mt-1 text-sm md:text-base">Ausentes</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 md:p-6">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold">{porcentajeAsistencia}%</div>
            <div className="text-purple-100 mt-1 text-sm md:text-base">Asistencia</div>
          </div>
        </div>
      </div>

      {/* Asistencia por Tipo */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Asistencia por Tipo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(conteosPorTipo).map(([tipo, datos]) => {
            const colors = getTipoColor(tipo);
            const porcentaje = datos.total > 0 ? Math.round((datos.asistieron / datos.total) * 100) : 0;
            return (
              <div key={tipo} className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="text-center">
                  <h4 className={`text-lg md:text-xl font-bold mb-3 ${colors.text}`}>{tipo}</h4>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {datos.asistieron}/{datos.total}
                  </div>
                  <div className="text-gray-600 mb-3 text-sm md:text-base">{porcentaje}% asistencia</div>
                  <div className={`h-2 rounded-full ${colors.light}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${colors.bg}`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asistencia por Departamento */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Asistencia por Departamento</h3>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="space-y-4">
            {Object.entries(conteosPorDepartamento).map(([departamento, datos]) => {
              const porcentaje = datos.total > 0 ? Math.round((datos.asistieron / datos.total) * 100) : 0;
              return (
                <div key={departamento} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2 md:mb-0">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{departamento}</h4>
                      <p className="text-sm text-gray-600">{datos.asistieron} de {datos.total} participantes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{porcentaje}%</div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Espacio extra antes del footer */}
      <div className="h-12" />
    </div>
  );
};

export default Dashboard;