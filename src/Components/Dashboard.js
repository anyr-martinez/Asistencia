import React from "react";
import { MapPin } from "lucide-react";

const Dashboard = ({ participantes }) => {
  const totalParticipantes = participantes.length;
  const totalAsistieron = participantes.filter(p => p.asistencia === "Activo").length;
  const porcentajeAsistencia = totalParticipantes > 0 ? Math.round((totalAsistieron / totalParticipantes) * 100) : 0;

  // Conteo por tipo
  const conteosPorTipo = participantes.reduce((acc, participante) => {
    const tipo = participante.tipo || "Otros";
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
  const departamentosHonduras = [
    "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés",
    "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía",
    "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
  ];
  const conteosPorDepartamento = {};
  departamentosHonduras.forEach(dep => {
    conteosPorDepartamento[dep] = { total: 0, asistieron: 0 };
  });
  participantes.forEach(participante => {
    const dept = participante.departamento || "Sin departamento";
    if (conteosPorDepartamento[dept]) {
      conteosPorDepartamento[dept].total++;
      if (participante.asistencia === "Activo") {
        conteosPorDepartamento[dept].asistieron++;
      }
    }
  });

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'Cliente': return { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' };
      case 'Empleado': return { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600' };
      case 'Agroservicio': return { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600' };
      case 'Proveedor': return { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'Otros': return { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600' };
      default: return { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-8 mb-16 px-2 mt-5">

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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-3"></div>
            Asistencia por Tipo
          </h3>
        </div>
        <div className="p-6">
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
      </div>

      {/* Asistencia por Departamento */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-3"></div>
            Distribución Geográfica
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(conteosPorDepartamento)
              .sort(([,a], [,b]) => b.asistieron - a.asistieron)
              .map(([departamento, datos]) => {
              const porcentaje = datos.total > 0 ? Math.round((datos.asistieron / datos.total) * 100) : 0;
              return (
                <div key={departamento} className="group p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{departamento}</h4>
                        <p className="text-gray-600">{datos.asistieron} de {datos.total} participantes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{porcentaje}%</div>
                      </div>
                      <div className="w-32">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out transform"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
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