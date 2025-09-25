import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import Navigation from "../Components/Navigation";
import PanelAsistencia from "../Components/PanelAsistencia";
import Dashboard from "../Components/Dashboard";
import Reportes from "../Components/Reportes";
import toast from "react-hot-toast";
import { CalendarCheck } from "lucide-react";

const Asistencia = () => {
  const [participantes, setParticipantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [activeTab, setActiveTab] = useState("lista");
  const [cargando, setCargando] = useState(true);

  // Listener en tiempo real
  useEffect(() => {
    setCargando(true);
    const unsubscribe = onSnapshot(
      collection(db, "Viveros2025"),
      (snapshot) => {
        const datos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setParticipantes(datos);
        setCargando(false);
      },
      (error) => {
        toast.error("Error al sincronizar participantes");
        setCargando(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Marcar asistencia como "Activo"
  const marcarAsistencia = async (id) => {
    try {
      await updateDoc(doc(db, "participantes", id), {
        asistencia: "Activo",
      });
      toast.success("¡Asistencia marcada correctamente!");
    } catch (error) {
      toast.error("Error al marcar asistencia. Intente nuevamente.");
    }
  };

  // AGREGAR PARTICIPANTE
  const agregarParticipante = async (nuevo) => {
    try {
      const participanteNuevo = {
        ...nuevo,
        asistencia: "No Activo",
        color: null, 
        fecha: new Date().toISOString(),
      };
      await addDoc(collection(db, "Viveros2025"), participanteNuevo);
      // No necesitas recargar, el listener lo hará automáticamente
    } catch (error) {
      toast.error("Error al crear participante.");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Sincronizando datos del evento...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
            <span
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></span>
            <span
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header con glassmorphism */}
      <div className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 md:p-3 rounded-xl shadow-lg">
              <CalendarCheck className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
                Control de Asistencia
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed top-[84px] md:top-[80px] left-0 w-full z-30 bg-transparent">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Contenido principal */}
      <div className="pt-[140px] md:pt-[135px]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-10">
          {activeTab === "lista" && (
            <PanelAsistencia
              participantes={participantes}
              marcarAsistencia={marcarAsistencia}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              agregarParticipante={agregarParticipante}
            />
          )}

          {activeTab === "dashboard" && (
            <Dashboard participantes={participantes} />
          )}

          {activeTab === "reportes" && <Reportes participantes={participantes} />}
        </div>
      </div>
    </div>
  );
};

export default Asistencia;