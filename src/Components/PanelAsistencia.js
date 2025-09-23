import React, { useState } from "react";
import { User, CheckCircle, Clock, Plus, Search, Palette } from "lucide-react";
import AgregarP from "../Hooks/AgregarP";
import ConfirmacionModal from "../Hooks/ConfirmacionModal";
import SeleccionarColor from "../Hooks/SeleccionarColor";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import toast from "react-hot-toast";

// Colores de los botones de asistencia
const asistenciaClases = {
  marcar: "from-green-500 to-green-600",
  desmarcar: "from-red-500 to-red-600",
};

// Colores disponibles para la columna
const colorClases = {
  verde: "bg-green-500",
  amarillo: "bg-yellow-400",
  anaranjado: "bg-orange-500",
  negro: "bg-gray-800",
  rojo: "bg-red-500",
  azul: "bg-blue-600",
};

const PanelAsistencia = ({ participantes = [], busqueda = "", setBusqueda }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ open: false, id: null });
  const [colorModal, setColorModal] = useState({ open: false, id: null });

  // Ordenar por nombre
  const listaOrdenada = [...participantes].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );

  // Filtrar participantes
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
        color: null,
        fecha: new Date().toISOString(),
      };
      await addDoc(collection(db, "participantes"), participanteNuevo);
    } catch (error) {
      toast.error("Error al crear participante.");
    }
  };

  // Abrir modal de color al marcar asistencia
  const handleMarcarAsistencia = (id) => {
    setColorModal({ open: true, id });
  };

  // Guardar color y marcar asistencia
  const marcarConColor = async (color) => {
    const id = colorModal.id;
    try {
      await updateDoc(doc(db, "participantes", id), {
        asistencia: "Activo",
        color: color,
      });
      toast.success("¡Asistencia marcada correctamente!");
    } catch (error) {
      toast.error("Error al marcar asistencia.");
    } finally {
      setColorModal({ open: false, id: null });
    }
  };

  // Abrir confirmación para desmarcar
  const handleDesmarcarAsistencia = (id) => {
    setConfirmData({ open: true, id });
  };

  // Confirmar desmarcar asistencia
  const confirmarDesmarcar = async () => {
    const id = confirmData.id;
    try {
      await updateDoc(doc(db, "participantes", id), {
        asistencia: "No Activo",
        color: null,
      });
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
  const total = participantes.length;

  return (
    <div className="bg-gray-50">
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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

        {/* Tabla escritorio */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-3 text-left">👤 Participante</div>
                <div className="col-span-2 text-left">📍 Departamento</div>
                <div className="col-span-2 text-left">📝 Tipo</div>
                <div className="col-span-2 text-left">📞 Contacto</div>
                <div className="col-span-2 text-center">✔️ Asistencia</div>
                <div className="col-span-1 text-center">🎨 Color</div>
              </div>
            </div>

            {/* Filas */}
            <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
              {participantesFiltrados.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">No se encontraron participantes</p>
                  <p className="text-sm text-gray-400">Intenta con otros términos de búsqueda</p>
                </div>
              ) : (
                participantesFiltrados.map((p, index) => (
                  <div
                    key={p.id}
                    className={`px-6 py-4 grid grid-cols-12 gap-4 items-center border-b border-gray-50 hover:bg-gray-25 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="col-span-3 font-semibold text-gray-900">{p.nombre}</div>
                    <div className="col-span-2 text-gray-700">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">{p.departamento}</span>
                    </div>
                    <div className="col-span-2 text-gray-600 font-medium">{p.tipo}</div>
                    <div className="col-span-2 text-gray-600 font-mono">{p.telefono.replace(/(\d{4})(\d{4})/, "$1-$2")}</div>
                    <div className="col-span-2 flex justify-center">
                      {p.asistencia === "Activo" ? (
                        <button
                          onClick={() => handleDesmarcarAsistencia(p.id)}
                          className={`flex items-center text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md bg-gradient-to-r from-red-500 to-red-600`}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Desmarcar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarcarAsistencia(p.id)}
                          className={`flex items-center text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md bg-gradient-to-r from-green-500 to-green-600`}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Marcar
                        </button>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {p.color ? (
                        <span
                          className={`w-8 h-8 rounded-full border-2 border-gray-200 ${colorClases[p.color]}`}
                          title={p.color}
                        ></span>
                      ) : (
                        <span className="w-8 h-8 rounded-full border-2 border-gray-200 bg-gray-100"></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-2 border-t border-gray-100 bg-white">
              <div className="text-xs text-gray-500 mb-1 md:mb-0">
                Mostrando {participantesFiltrados.length} de {total} participantes
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs font-medium text-gray-700">Presentes: {presentes}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span className="text-xs font-medium text-gray-700">Ausentes: {total - presentes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* Cards móvil */}
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
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg truncate">{participante.nombre}</h3>
                      <p className="text-gray-600 text-sm font-medium">{participante.tipo}</p>
                    </div>
                    <div>
                      {participante.color ? (
                        <span
                          className={`w-6 h-6 rounded-full border-2 border-gray-200 ${colorClases[participante.color]}`}
                          title={participante.color}
                        ></span>
                      ) : (
                        <span className="w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-100"></span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 gap-4 mb-5">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">📍</div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Departamento</p>
                            <p className="text-gray-900 font-semibold text-sm">{participante.departamento}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">📞</div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Teléfono</p>
                            <p className="text-gray-900 font-semibold text-sm font-mono">{participante.telefono.replace(/(\d{4})(\d{4})/, "$1-$2")}</p>
                          </div>
                        </div>
                      </div>
                      {/* Campo Color en móvil */}
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${colorClases[participante.color] || "bg-gray-100"}`}>
                            <Palette className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Color</p>
                            <span className="text-xs font-semibold mt-1 block">
                              {participante.color
                                ? participante.color.charAt(0).toUpperCase() + participante.color.slice(1)
                                : "Sin color"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      {participante.asistencia === "Activo" ? (
                        <button
                          onClick={() => handleDesmarcarAsistencia(participante.id)}
                          className={`w-full flex items-center justify-center text-white py-3 px-4 rounded-xl font-medium shadow-sm hover:shadow-md transform active:scale-95 transition-all duration-200 bg-gradient-to-r ${asistenciaClases.desmarcar}`}
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Quitar Asistencia
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarcarAsistencia(participante.id)}
                          className={`w-full flex items-center justify-center text-white py-3 px-4 rounded-xl font-medium shadow-sm hover:shadow-md transform active:scale-95 transition-all duration-200 bg-gradient-to-r ${asistenciaClases.marcar}`}
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
          <div className="mt-6 text-center">
            <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <span className="text-sm text-gray-600 font-medium">
                Mostrando {participantesFiltrados.length} de {total} participantes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <AgregarP
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAgregar={agregarParticipante}
        participantes={participantes}
      />
      <ConfirmacionModal
        isOpen={confirmData.open}
        onClose={() => setConfirmData({ open: false, id: null })}
        onConfirm={confirmarDesmarcar}
        mensaje="¿Estás seguro que deseas quitar la asistencia de este participante?"
      />
      <SeleccionarColor
        isOpen={colorModal.open}
        onClose={() => setColorModal({ open: false, id: null })}
        onSelect={marcarConColor}
      />
    </div>
  );
};

export default PanelAsistencia;
