import React from 'react';
import { X, Printer, FileText, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ReportCardModal({ student, grades, subjects, onClose }) {
  const { institution } = useApp();
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
      teacher: sub.teacherName || sub.teacher || 'Docente titular',
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

  const schoolYear = institution?.currentSchoolYear || '2027-2028';
  const cedula = student.cedula || student.studentIdNumber || 'Sin cédula registrada';
  const gradeYear = student.grade_year || student.gradeLevel || '1er Año';
  const section = student.section || 'Sección A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#152338] border border-stitch rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-6">
        {/* Top Actions (Hidden on Print) */}
        <div className="bg-[#101c30] px-6 py-3.5 flex items-center justify-between border-b border-slate-700/60 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <FileText className="w-4 h-4 text-[#DCB35C]" />
            <span className="font-slab">Boletín Oficial de Calificaciones</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] rounded-xl text-xs font-bold font-slab flex items-center gap-1.5 transition shadow-xs cursor-pointer"
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

        {/* Printable Sheet */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div className="flex items-start gap-4">
              <img src="/logo.png" alt="Sello Institucional" className="w-14 h-14 object-contain mt-1" />
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#1E3A8A]">
                  República Bolivariana de Venezuela • Zona Educativa de Anzoátegui
                </div>
                <h1 className="text-xl font-black font-slab text-slate-950 uppercase mt-0.5">
                  U.E. Colegio Integral Venezuela
                </h1>
                <p className="text-xs italic font-serif text-[#B87333]">
                  "Enseñando a vivir" • Fundado el 10 de noviembre de 1989
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Calle 11, sector Colinas del Neverí, Barcelona, Anzoátegui • Código DEA
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="inline-block px-3 py-1 rounded-lg bg-amber-50 border border-[#DCB35C] font-bold font-mono text-[#1E3A8A]">
                AÑO ESCOLAR {schoolYear}
              </span>
              <div className="text-[10px] text-slate-500 mt-1 font-serif">Control de Estudios</div>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Estudiante:</span>
              <strong className="text-slate-900 text-sm font-slab">{student.name}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Cédula de Identidad:</span>
              <strong className="text-slate-900 font-mono">{cedula}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Año y Sección:</span>
              <strong className="text-slate-900">{gradeYear} - {section}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Promedio General:</span>
              <strong className="text-[#1E3A8A] text-base font-mono">{generalAvg} / 20</strong>
            </div>
          </div>

          {/* Grades Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-xs">
              <thead className="bg-[#1E3A8A] text-white">
                <tr>
                  <th className="py-2.5 px-3 text-left font-slab">Asignatura</th>
                  <th className="py-2.5 px-3 text-left font-slab">Docente Titular</th>
                  <th className="py-2.5 px-3 text-center font-slab">Evaluaciones</th>
                  <th className="py-2.5 px-3 text-center font-slab">Definitiva</th>
                  <th className="py-2.5 px-3 text-center font-slab">Condición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectsWithGrades.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                      No hay asignaturas registradas en el sistema para este período escolar.
                    </td>
                  </tr>
                ) : (
                  subjectsWithGrades.map((sub, idx) => {
                    const scoreNum = parseFloat(sub.average);
                    const isPassing = !isNaN(scoreNum) && scoreNum >= 10;
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                          {sub.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 border-r border-slate-200">
                          {sub.teacher}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                          {sub.grades.length} registradas
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-900 border-r border-slate-200">
                          {sub.average}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-[11px]">
                          {isNaN(scoreNum) ? (
                            <span className="text-slate-400">En curso</span>
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

          {/* Official Physical Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-300 max-w-lg mx-auto text-center text-xs">
            <div className="flex flex-col items-center">
              <div className="h-14 w-36 flex items-end justify-center mb-1">
                <span className="text-[9px] text-slate-300 font-mono italic select-none">[ Firma ]</span>
              </div>
              <div className="w-full border-t border-slate-700 pt-1 font-bold text-slate-800">
                Prof. Larry González
              </div>
              <div className="text-[10px] text-slate-500">Director General</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-14 w-36 flex items-end justify-center mb-1">
                <span className="text-[9px] text-slate-300 font-mono italic select-none">[ Firma ]</span>
              </div>
              <div className="w-full border-t border-slate-700 pt-1 font-bold text-slate-800">
                Coordinación de Evaluación
              </div>
              <div className="text-[10px] text-slate-500">U.E. Colegio Integral Venezuela</div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>BOLETÍN ELECTRÓNICO OFICIAL • CÓDIGO DEA</span>
            <span>Documento emitido para {student.name} • {schoolYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
