import React from 'react';
import { X, Printer, Award, ShieldCheck } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const isGradeType = certificate.category === 'grade';
  const template = certificate.template_type || 'academic';

  let templateTitle = 'Certificado de Excelencia Académica';
  let badgeLabel = 'Mérito y Rendimiento';

  if (template === 'sports') {
    templateTitle = 'Certificado de Reconocimiento Deportivo';
    badgeLabel = 'Espíritu y Disciplina Atlética';
  } else if (template === 'anniversary') {
    templateTitle = 'Certificado de Participación Conmemorativa';
    badgeLabel = 'Aniversario Institucional';
  } else if (template === 'values') {
    templateTitle = 'Reconocimiento a los Valores y Convivencia';
    badgeLabel = 'Civismo y Convivencia Escolar';
  }

  const studentName = certificate.studentName || certificate.student_name || 'Estudiante';
  const gradeLevel = certificate.gradeLevel || certificate.grade_level || 'Bachillerato';
  const code = certificate.certificate_code || certificate.verification_code || certificate.code || 'CIV-CERT-OFICIAL';
  const issueDate = certificate.issue_date || certificate.issued_date || certificate.issueDate || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#152338] border border-stitch rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-[#101c30] px-6 py-3.5 flex items-center justify-between border-b border-slate-700/60 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Award className="w-4 h-4 text-[#DCB35C]" />
            <span className="font-slab">Documento Oficial Certificado</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] rounded-xl text-xs font-bold font-slab flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Exportar a PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2B45] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-6 sm:p-10 bg-slate-950 text-slate-900">
          <div className="bg-white border-8 border-double border-[#1E3A8A] p-8 sm:p-12 rounded-xl text-center relative shadow-lg">
            {/* Subtle Gold Ornamental Corners */}
            <div className="absolute top-3 left-3 text-[#DCB35C] select-none">
              <Award className="w-4 h-4" />
            </div>
            <div className="absolute top-3 right-3 text-[#DCB35C] select-none">
              <Award className="w-4 h-4" />
            </div>
            <div className="absolute bottom-3 left-3 text-[#DCB35C] select-none">
              <Award className="w-4 h-4" />
            </div>
            <div className="absolute bottom-3 right-3 text-[#DCB35C] select-none">
              <Award className="w-4 h-4" />
            </div>

            {/* Header */}
            <div className="mb-5 space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#1E3A8A]">
                República Bolivariana de Venezuela • Zona Educativa de Anzoátegui
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-slab tracking-wide text-slate-950 uppercase">
                U.E. Colegio Integral Venezuela
              </h2>
              <p className="text-xs italic font-serif text-[#B87333]">
                "Enseñando a vivir" • Fundado el 10 de noviembre de 1989
              </p>
              <div className="text-[10px] text-slate-500 font-mono">
                Barcelona, Estado Anzoátegui • Código DEA Oficial
              </div>
            </div>

            {/* Official Institutional Seal */}
            <div className="my-3 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1 border-2 border-[#1E3A8A] shadow-xs">
                <img src="/logo.png" alt="Sello Institucional" className="w-13 h-13 object-contain" />
              </div>
            </div>

            {/* Template Title */}
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1 font-serif">
              La Dirección General y la Coordinación de Control de Estudios confieren el presente
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-slab uppercase tracking-tight text-[#1E3A8A] mb-3">
              {certificate.title || templateTitle}
            </h1>

            {/* Student Name */}
            <div className="text-xs text-slate-500 font-serif italic mb-1">a el / la estudiante:</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 border-b-2 border-[#1E3A8A] inline-block px-8 pb-1 mb-2 font-serif">
              {studentName}
            </div>

            {certificate.studentIdNumber && (
              <div className="text-xs text-slate-600 font-mono mb-2">
                Cédula de Identidad: {certificate.studentIdNumber}
              </div>
            )}

            {/* REQUISITO 7: Los puntos / nota SIEMPRE debajo del nombre y perfectamente centrados */}
            {(isGradeType || certificate.scoreNote) && (
              <div className="my-3 flex justify-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-50 border border-[#DCB35C] text-[#1E3A8A] shadow-xs">
                  <span className="text-xs uppercase font-semibold text-amber-800">Calificación / Promedio:</span>
                  <span className="text-lg font-black font-mono text-[#1E3A8A]">
                    {certificate.scoreNote} Puntos
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed my-4 font-serif">
              {certificate.description || certificate.customText || 'Por su destacada trayectoria, constancia y apego a los valores de nuestra institución educativa.'}
            </p>

            <div className="text-[11px] text-slate-500 mb-8 font-serif">
              Nivel: {gradeLevel} • Expedido en Barcelona el {issueDate}
            </div>

            {/* REQUISITO 7: Firmas en blanco para firmar manuscritamente tras imprimir */}
            <div className="grid grid-cols-2 gap-10 pt-4 border-t border-slate-200 max-w-md mx-auto">
              <div className="flex flex-col items-center">
                {/* Empty signing space for physical ink signature */}
                <div className="h-16 w-36 flex items-end justify-center mb-1">
                  <span className="text-[9px] text-slate-300 font-mono italic select-none">[ Firma ]</span>
                </div>
                <div className="w-full border-t border-slate-700 pt-1 text-[11px] font-bold text-slate-900">
                  Prof. Larry González
                </div>
                <div className="text-[10px] text-slate-500">Director General</div>
                <div className="mt-1 w-12 h-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-300">
                  Sello
                </div>
              </div>

              <div className="flex flex-col items-center">
                {/* Empty signing space for physical ink signature */}
                <div className="h-16 w-36 flex items-end justify-center mb-1">
                  <span className="text-[9px] text-slate-300 font-mono italic select-none">[ Firma ]</span>
                </div>
                <div className="w-full border-t border-slate-700 pt-1 text-[11px] font-bold text-slate-900">
                  Control de Estudios
                </div>
                <div className="text-[10px] text-slate-500">Secretaría de Evaluación</div>
                <div className="mt-1 w-12 h-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-300">
                  Sello
                </div>
              </div>
            </div>

            {/* Footer validation code */}
            <div className="mt-6 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1 text-[#1E3A8A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>CÓDIGO: {code}</span>
              </span>
              <span>U.E. Colegio Integral Venezuela • {badgeLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
