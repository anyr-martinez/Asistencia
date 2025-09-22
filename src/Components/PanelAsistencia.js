import React, { useState } from "react";
import { User, CheckCircle, Clock, Plus, Search } from "lucide-react";
import AgregarP from "../Hooks/AgregarP";
import ConfirmacionModal from "../Hooks/ConfirmacionModal";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import toast from "react-hot-toast";

const PanelAsistencia = ({ participantes = [], busqueda = "", setBusqueda }) => {
  const [lista, setLista] = useState(participantes);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ open: false, id: null });

  // Ordenar por nombre
  const listaOrdenada = [...lista].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );

  // Filtrar
  const participantesFiltrados = listaOrdenada.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.telefono.includes(busqueda)
  );

  // Agregar participante
  const agregarParticipante = async (nuevo) => {
    try {
      const participanteNuevo = {
        ...nuevo,
        asistencia: "No Activo",
        fecha: new Date().toISOString(),
      };
      const docRef = await addDoc(
        collection(db, "participantes"),
        participanteNuevo
      );
      setLista([...lista, { ...participanteNuevo, id: docRef.id }]);
      toast.success("¡Participante creado correctamente!", {
        duration: 4000,
        position: "top-right",
      });
    } catch (error) {
      toast.error("Error al crear participante.");
    }
  };

  // Marcar asistencia
  const handleMarcarAsistencia = async (id) => {
    try {
      await updateDoc(doc(db, "participantes", id), { asistencia: "Activo" });
      setLista((prev) =>
        prev.map((p) => (p.id === id ? { ...p, asistencia: "Activo" } : p))
      );
      toast.success("¡Asistencia marcada correctamente!");
    } catch (error) {
      toast.error("Error al marcar asistencia.");
    }
  };

  // Abrir confirmación para desmarcar
  const handleDesmarcarAsistencia = (id) => {
    setConfirmData({ open: true, id });
  };

  // Confirmar desmarcar
  const confirmarDesmarcar = async () => {
    const id = confirmData.id;
    try {
      await updateDoc(doc(db, "participantes", id), { asistencia: "No Activo" });
      setLista((prev) =>
        prev.map((p) => (p.id === id ? { ...p, asistencia: "No Activo" } : p))
      );
      toast.success("¡Asistencia desmarcada correctamente!");
    } catch (error) {
      toast.error("Error al desmarcar asistencia.");
    } finally {
      setConfirmData({ open: false, id: null });
    }
  };

  // Resumen
  const presentes = participantesFiltrados.filter(
    (p) => p.asistencia === "Activo"
  ).length;
  const total = participantesFiltrados.length;

 return (
  <div className="bg-gray-50">
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header: Buscador y botón en la misma fila */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Buscador */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-xl bg-white
                      focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                      transition-all duration-200 shadow-sm"
          />
        </div>
        {/* Botón agregar (en azul) */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-600 
                    text-white px-5 py-3 rounded-xl 
                    hover:from-blue-700 hover:to-blue-700 
                    transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-medium">Agregar Participante</span>
        </button>
      </div>

      {/* Tabla en escritorio */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
              <div className="col-span-4">👤 Participante</div>
              <div className="col-span-2 text-left">📍 Departamento</div>
              <div className="col-span-2 text-left">📝 Tipo</div>
              <div className="col-span-2 text-left">📞 Contacto</div>
              <div className="col-span-2 text-left">✔️ Asistencia </div>
            </div>
          </div>
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "320px",
              minHeight: "0",
            }}
          >
            {participantesFiltrados.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">
                  No se encontraron participantes
                </p>
                <p className="text-sm text-gray-400">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            ) : (
              participantesFiltrados.map((participante, index) => (
                <div
                  key={participante.id}
                  className={`px-6 py-4 grid grid-cols-12 gap-4 items-center border-b border-gray-50 hover:bg-gray-25 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  <div className="col-span-4">
                    <span className="font-semibold text-gray-900">
                      {participante.nombre}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {participante.departamento}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-600 font-medium">
                    {participante.tipo}
                  </div>
                  <div className="col-span-2 text-gray-600 font-mono">
                    {participante.telefono.replace(/(\d{4})(\d{4})/, "$1-$2")}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    {participante.asistencia === "Activo" ? (
                      <button
                        onClick={() =>
                          handleDesmarcarAsistencia(participante.id)
                        }
                        className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Desmarcar
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleMarcarAsistencia(participante.id)
                        }
                        className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        <Clock className="w-4 h-4 mr-1" /> Marcar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Footer del card: presentes, ausentes y mostrando */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-2 border-t border-gray-100 bg-white">
            {/* Mostrando a la izquierda */}
            <div className="text-xs text-gray-500 mb-1 md:mb-0">
              Mostrando {participantesFiltrados.length} de {lista.length} participantes
            </div>
          </div>
        </div>
      </div>

      {/* Cards mejoradas para móvil y tablet */}
      <div className="lg:hidden">
        {participantesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2 text-gray-600">
              No se encontraron participantes
            </p>
            <p className="text-sm text-gray-400">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {participantesFiltrados.map((participante) => (
              <div
                key={participante.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Header de la card con nombre y estado */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                        {participante.nombre}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {participante.tipo}
                      </p>
                    </div>
                    {/* Indicador de estado visual */}
                    <div className="ml-3">
                      {participante.asistencia === "Activo" ? (
                        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1.5 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs font-semibold">Presente</span>
                        </div>
                      ) : (
                        <div className="flex items-center bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                          <span className="text-xs font-semibold">Ausente</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenido principal de la card */}
                <div className="p-5">
                  {/* Información en grid */}
                  <div className="grid grid-cols-1 gap-4 mb-5">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm">📍</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Departamento</p>
                          <p className="text-gray-900 font-semibold text-sm">
                            {participante.departamento}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-green-600 text-sm">📞</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Teléfono</p>
                          <p className="text-gray-900 font-semibold text-sm font-mono">
                            {participante.telefono.replace(/(\d{4})(\d{4})/, "$1-$2")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de acción en la parte inferior */}
                  <div className="pt-2">
                    {participante.asistencia === "Activo" ? (
                      <button
                        onClick={() => handleDesmarcarAsistencia(participante.id)}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform active:scale-95"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Quitar Asistencia
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarcarAsistencia(participante.id)}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform active:scale-95"
                      >
                        <Clock className="w-5 h-5 mr-2" />
                        Marcar Presente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Texto al final del listado en móvil */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="text-sm text-gray-600 font-medium">
              Mostrando {participantesFiltrados.length} de {lista.length} participantes
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Modal agregar */}
    <AgregarP
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onAgregar={agregarParticipante}
    />

    {/* Modal de confirmación */}
    <ConfirmacionModal
      isOpen={confirmData.open}
      onClose={() => setConfirmData({ open: false, id: null })}
      onConfirm={confirmarDesmarcar}
      mensaje="¿Estás seguro que deseas quitar la asistencia de este participante?"
    />
  </div>
);
};

export default PanelAsistencia;