import React from 'react';
import { X, Printer, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  // Determine template details
  const isGradeType = certificate.category === 'grade';
  const template = certificate.template_type || 'academic';

  let templateTitle = 'Certificado de Excelencia Académica';
  let badgeLabel = 'Mérito Académico';

  if (template === 'sports') {
    templateTitle = 'Certificado de Reconocimiento Deportivo';
    badgeLabel = 'Espíritu Atlético';
  } else if (template === 'anniversary') {
    templateTitle = 'Certificado de Participación Conmemorativa';
    badgeLabel = 'Aniversario Institucional';
  } else if (template === 'values') {
    templateTitle = 'Reconocimiento a los Valores y Convivencia';
    badgeLabel = 'Civismo y Ética';
  }

  const studentName = certificate.studentName || certificate.student_name || 'Estudiante';
  const gradeLevel = certificate.gradeLevel || certificate.grade_level || 'Bachillerato';
  const code = certificate.certificate_code || certificate.code || 'CERT-IV-OFICIAL';
  const issueDate = certificate.issue_date || certificate.issueDate || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-slate-950/90 px-6 py-3.5 flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Documento Oficial Certificado</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar en PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-6 sm:p-10 bg-slate-950 text-slate-900">
          <div className="bg-white border-8 border-double border-slate-800 p-8 sm:p-12 rounded-xl text-center relative shadow-lg">
            {/* Ornamental Corners */}
            <div className="absolute top-3 left-3 text-slate-400 select-none">
              <Award className="w-4 h-4" />
            </div>
            <div className="absolute top-3 right-3 text-slate-400 select-none">
              <Award className="w-4 h-4" />
            </div>
            <div className="absolute bottom-3 left-3 text-slate-400 select-none">
              <Award className="w-4 h-4" />
            </div>
            <div className="absolute bottom-3 right-3 text-slate-400 select-none">
              <Award className="w-4 h-4" />
            </div>

            {/* Header */}
            <div className="mb-6 space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                República Bolivariana de Venezuela • Zona Educativa de Anzoátegui
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-wide text-slate-950 uppercase">
                U.E. Colegio Integral Venezuela
              </h2>
              <p className="text-xs italic font-serif text-slate-600">
                "Enseñando a vivir" • Fundado el 10 de noviembre de 1989
              </p>
              <div className="text-[10px] text-slate-400">
                Barcelona, Estado Anzoátegui • Código DEA
              </div>
            </div>

            {/* Insignia / Medal Icon */}
            <div className="my-5 flex justify-center">
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-slate-700 shadow-sm">
                <Award className="w-7 h-7 text-blue-300" />
              </div>
            </div>

            {/* Template Title */}
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              La Dirección General y el Consejo Directivo confieren el presente
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-900 mb-3">
              {certificate.title || templateTitle}
            </h1>

            {/* Student Name */}
            <div className="text-xs text-slate-500 font-serif italic mb-1">a el / la estudiante:</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-950 border-b-2 border-slate-300 inline-block px-6 pb-1 mb-3 font-serif">
              {studentName}
            </div>

            {certificate.studentIdNumber && (
              <div className="text-xs text-slate-600 font-mono mb-2">
                Cédula de Identidad: {certificate.studentIdNumber}
              </div>
            )}

            {/* Score / Note if type Grade */}
            {isGradeType && certificate.scoreNote && (
              <div className="my-3 inline-block px-4 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 font-bold text-sm">
                Calificación Obtenida: {certificate.scoreNote}
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed my-4 font-serif">
              {certificate.description || certificate.customText || 'Por su destacada trayectoria, constancia y apego a los valores de nuestra institución educativa.'}
            </p>

            <div className="text-[11px] text-slate-500 mb-8">
              Nivel: {gradeLevel} • Expedido en Barcelona el {issueDate}
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 max-w-md mx-auto">
              <div>
                <div className="font-serif italic text-sm text-slate-900 font-bold mb-1">
                  Larry González
                </div>
                <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-800">
                  Prof. Larry González
                </div>
                <div className="text-[10px] text-slate-500">Director General</div>
              </div>

              <div>
                <div className="font-serif italic text-sm text-slate-900 font-bold mb-1">
                  Control de Estudios
                </div>
                <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-800">
                  Coordinación Académica
                </div>
                <div className="text-[10px] text-slate-500">Evaluación y Certificación</div>
              </div>
            </div>

            {/* Footer validation code */}
            <div className="mt-6 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>CÓDIGO: {code}</span>
              </span>
              <span>U.E. Colegio Integral Venezuela</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
