import React from 'react';
import { X, Printer, FileText, ShieldCheck } from 'lucide-react';

export default function ReportCardModal({ student, grades, subjects, onClose }) {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const studentGrades = grades.filter(
    (g) => g.studentId === student.id || g.studentName === student.name
  );

  // Calculate subject averages
  const subjectsWithGrades = subjects.map((sub) => {
    const list = studentGrades.filter(
      (g) => g.subjectId === sub.id || g.subjectName === sub.name
    );
    const total = list.reduce((acc, curr) => acc + Number(curr.score), 0);
    const avg = list.length > 0 ? (total / list.length).toFixed(1) : 'Sin calificar';
    return {
      name: sub.name,
      teacher: sub.teacherName || sub.teacher || 'Docente asignado',
      grades: list,
      average: avg
    };
  });

  const validAvgs = subjectsWithGrades
    .map((s) => parseFloat(s.average))
    .filter((a) => !isNaN(a));
  const generalAvg =
    validAvgs.length > 0
      ? (validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length).toFixed(1)
      : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-6">
        {/* Top Actions (Hidden on Print) */}
        <div className="bg-slate-950 px-6 py-3.5 flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Boletín Oficial de Calificaciones</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Exportar a PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                República Bolivariana de Venezuela • Zona Educativa de Anzoátegui
              </div>
              <h1 className="text-xl font-black font-heading text-slate-950 uppercase mt-0.5">
                U.E. Colegio Integral Venezuela
              </h1>
              <p className="text-xs italic font-serif text-slate-700">
                "Enseñando a vivir" • Fundado el 10 de noviembre de 1989
              </p>
              <div className="text-[10px] text-slate-500">
                Calle 11, sector Colinas del Neverí, Barcelona, Anzoátegui
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="inline-block px-3 py-1 rounded bg-slate-100 font-bold text-slate-900">
                AÑO ESCOLAR 2024 - 2025
              </span>
              <div className="text-[10px] text-slate-500 mt-1">Control de Estudios</div>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Estudiante:</span>
              <strong className="text-slate-900 text-sm">{student.name}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Cédula / Carnet:</span>
              <span className="font-mono font-semibold text-slate-800">{student.studentIdNumber || 'V-31.452.981'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Año y Sección:</span>
              <span className="font-semibold text-slate-800">{student.gradeLevel || '4to Año'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Promedio General:</span>
              <span className="font-bold text-blue-700 text-sm">{generalAvg} / 20</span>
            </div>
          </div>

          {/* Grades Table */}
          <div className="mb-8">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase text-[10px]">
                  <th className="py-2.5 px-3 border-r border-slate-300">Asignatura</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Docente</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">Evaluaciones</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">Calificación (0-20)</th>
                  <th className="py-2.5 px-3 text-center">Apreciación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subjectsWithGrades.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400 italic">
                      No hay asignaturas registradas en el sistema.
                    </td>
                  </tr>
                ) : (
                  subjectsWithGrades.map((sub, idx) => {
                    const scoreNum = parseFloat(sub.average);
                    const isPassing = !isNaN(scoreNum) && scoreNum >= 10;
                    return (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                          {sub.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 border-r border-slate-200">
                          {sub.teacher}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                          {sub.grades.length} parciales
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-900 border-r border-slate-200">
                          {sub.average}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-[11px]">
                          {isNaN(scoreNum) ? (
                            <span className="text-slate-400">Pendiente</span>
                          ) : isPassing ? (
                            <span className="text-emerald-700">Aprobado</span>
                          ) : (
                            <span className="text-rose-700">Aplazado</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Official Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-300 max-w-lg mx-auto text-center text-xs">
            <div>
              <div className="font-serif italic font-bold text-slate-900 text-sm mb-1">Larry González</div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                Prof. Larry González
              </div>
              <div className="text-[10px] text-slate-500">Director General</div>
            </div>

            <div>
              <div className="font-serif italic font-bold text-slate-900 text-sm mb-1">Control de Estudios</div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                Secretaría de Evaluación
              </div>
              <div className="text-[10px] text-slate-500">U.E. Colegio Integral Venezuela</div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>BOLETÍN ELECTRÓNICO OFICIAL • CÓDIGO DEA</span>
            <span>Documento emitido para {student.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
