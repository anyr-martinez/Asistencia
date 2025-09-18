import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import Navigation from "../Components/Navigation";
import PanelAsistencia from "../Components/PanelAsistencia";
import Dashboard from "../Components/Dashboard";
import Reportes from "../Components/Reportes";
import toast from "react-hot-toast";

const Asistencia = () => {
  const [participantes, setParticipantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [activeTab, setActiveTab] = useState('lista');
  const [cargando, setCargando] = useState(true);

  // Inicializar asistencia si falta el campo
  const inicializarAsistencia = async () => {
    const querySnapshot = await getDocs(collection(db, "participantes"));
    const promises = querySnapshot.docs.map(async (document) => {
      const data = document.data();
      if (!("asistencia" in data)) {
        await updateDoc(doc(db, "participantes", document.id), {
          asistencia: "No Activo"
        });
      }
    });
    await Promise.all(promises);
  };

  // Traer participantes de Firebase
  const cargarParticipantes = async () => {
    try {
      setCargando(true);
      const querySnapshot = await getDocs(collection(db, "participantes"));
      const datos = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setParticipantes(datos);
    } catch (error) {
      console.error("Error cargando participantes:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const cargarYActualizar = async () => {
      await inicializarAsistencia();
      await cargarParticipantes();
    };
    cargarYActualizar();
    
  }, []);

  // Marcar asistencia como "Activo"
  const marcarAsistencia = async (id) => {
    try {
      await updateDoc(doc(db, "participantes", id), { 
        asistencia: "Activo" 
      });
      setParticipantes(prev => 
        prev.map(p => 
          p.id === id ? { ...p, asistencia: "Activo"} : p
        )
      );
      toast.success("¡Asistencia marcada correctamente!");
    } catch (error) {
      console.error("Error marcando asistencia:", error);
      toast.error("Error al marcar asistencia. Intente nuevamente.");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header fijo */}
      <div className="bg-white shadow-sm fixed top-0 left-0 w-full z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 -mt-2">
              Control de Asistencia
            </h1>
          </div>
        </div>
      </div>
      
      {/* Navigation fija justo debajo del header */}
      <div className="fixed top-[72px] md:top-[88px] left-0 w-full z-30">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Padding top para que el contenido no quede debajo del header y la navegación */}
      <div className="pt-[128px] md:pt-[144px]">
        <div className="max-w-6xl mx-auto px-2 md:px-6 pb-18">
          {activeTab === 'lista' && (
            <PanelAsistencia 
              participantes={participantes}
              marcarAsistencia={marcarAsistencia}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
            />
          )}
          
          {activeTab === 'dashboard' && (
            <Dashboard participantes={participantes} />
          )}
          
          {activeTab === 'reportes' && (
            <Reportes participantes={participantes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Asistencia;