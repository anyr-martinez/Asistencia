import React from "react";
import { List, BarChart3, PieChart } from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'lista', name: 'Lista de Asistencia', icon: List },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'reportes', name: 'Reportes', icon: PieChart }
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-2 md:px-0">
        <nav className="flex flex-nowrap md:flex-wrap overflow-x-auto no-scrollbar space-x-2 md:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-2 md:px-3 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;