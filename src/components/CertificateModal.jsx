import React from 'react';
import { X, Printer, Award, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        {/* Controls Toolbar (hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-sm">Visualizador Oficial de Certificados y Menciones</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Diploma Canvas */}
        <div className="p-8 sm:p-12 bg-amber-50/30">
          <div className="border-8 border-double border-amber-600/40 p-8 sm:p-12 bg-white rounded-2xl relative shadow-inner text-center">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 text-amber-600/40 text-xl font-serif">❖</div>
            <div className="absolute top-3 right-3 text-amber-600/40 text-xl font-serif">❖</div>
            <div className="absolute bottom-3 left-3 text-amber-600/40 text-xl font-serif">❖</div>
            <div className="absolute bottom-3 right-3 text-amber-600/40 text-xl font-serif">❖</div>

            {/* School Header */}
            <div className="mb-6">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                República Bolivariana de Venezuela • Ministerio del Poder Popular para la Educación
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-heading tracking-wide">
                LICEO EXPERIMENTAL BICENTENARIO
              </div>
              <div className="text-xs text-amber-700 italic font-serif mt-1">
                "Ciencia, Excelencia y Valores al Servicio de la Sociedad"
              </div>
            </div>

            {/* Medal / Badge Icon */}
            <div className="my-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-white shadow-lg border-2 border-amber-200">
                <Award className="w-9 h-9" />
              </div>
            </div>

            {/* Title */}
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
              El Consejo Directivo y Técnico Docente confieren el presente
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading uppercase tracking-tight text-blue-900 mb-4">
              {certificate.title}
            </h1>

            {/* Student Name */}
            <div className="text-sm text-slate-600 italic font-serif mb-2">a el / la estudiante:</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 border-b-2 border-slate-300 inline-block px-8 pb-1 mb-4 font-serif">
              {certificate.studentName || 'Estudiante Destacado'}
            </div>

            {/* Details */}
            <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed mb-6 font-serif">
              {certificate.description}
            </p>

            <div className="text-xs text-slate-500 font-medium mb-10">
              Año Escolar {certificate.academicYear || '2024 - 2025'} • {certificate.gradeLevel || '4to Año'} • Expedido el {certificate.issueDate}
            </div>

            {/* Signatures and Seals */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 max-w-lg mx-auto">
              <div>
                <div className="font-serif italic text-base text-blue-900 font-bold mb-1">
                  Carmen T. Mendoza
                </div>
                <div className="border-t border-slate-400 pt-1 text-xs font-semibold text-slate-700">
                  Dra. Carmen Teresa Mendoza
                </div>
                <div className="text-[10px] text-slate-500">Directora General</div>
              </div>

              <div>
                <div className="font-serif italic text-base text-blue-900 font-bold mb-1">
                  Marcos A. Peña
                </div>
                <div className="border-t border-slate-400 pt-1 text-xs font-semibold text-slate-700">
                  Prof. Marcos Aurelio Peña
                </div>
                <div className="text-[10px] text-slate-500">Dirección Académica y Control</div>
              </div>
            </div>

            {/* Verification Code & Stamp */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-slate-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                CÓDIGO DE VALIDACIÓN: {certificate.code || 'CERT-2024-VERIFIED'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 sm:mt-0">
                Verificación electrónica válida en liceobicentenario.edu.ve/validar
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
