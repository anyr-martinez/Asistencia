import React from "react";

const ConfirmacionModal = ({ isOpen, onClose, onConfirm, mensaje }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 max-w-xs border border-gray-100 relative">
        {/* Icono de advertencia */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">¿Eliminar asistencia?</h2>
        <p className="text-gray-600 mb-6 text-center">{mensaje}</p>
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition font-semibold shadow"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionModal;