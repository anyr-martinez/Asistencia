import React from "react";
import { List, BarChart3, PieChart } from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'lista', name: 'Lista de Asistencia', icon: List, shortName: 'Lista' },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, shortName: 'Dashboard' },
    { id: 'reportes', name: 'Reportes', icon: PieChart, shortName: 'Reportes' }
  ];

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <nav className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 min-w-full md:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center px-4 md:px-6 py-3 md:py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap group rounded-lg
                    ${isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-100'
                    }`}
                  style={{ outline: "none" }}
                >
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 transition-colors
                    ${isActive
                      ? 'text-blue-600'
                      : 'text-gray-500 group-hover:text-blue-700'
                    }`}
                  />
                  
                  {/* Texto completo en desktop */}
                  <span className="hidden md:inline">{tab.name}</span>
                  {/* Texto corto en móvil */}
                  <span className="md:hidden">{tab.shortName}</span>
                  
                  {/* Indicador activo */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
                    isActive ? 'bg-blue-600' : 'bg-transparent'
                  }`} />
                  
                  {/* Indicador hover */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
                    !isActive ? 'bg-blue-200 opacity-0 group-hover:opacity-100' : 'bg-transparent'
                  }`} />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;