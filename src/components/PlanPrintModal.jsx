import React, { useState } from 'react';
import { X, Printer, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PlanPrintModal({ student, plans, onClose }) {
  const { institution } = useApp();
  const [selectedLapso, setSelectedLapso] = useState('all'); // 'all', '1', '2', '3'

  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const schoolYear = institution?.currentSchoolYear || '2027-2028';
  const cedula = student.cedula || 'Pendiente';
  const gradeYear = student.grade_year || student.gradeLevel || '1er Año';
  const section = student.section || 'Sección A';

  // Filter plans for this student's grade
  const studentPlans = plans.filter((p) => {
    const planGrade = p.grade_year || p.gradeYear;
    if (!planGrade) return true; // fallback if general
    return planGrade.toLowerCase().trim() === gradeYear.toLowerCase().trim();
  });

  const displayedPlans = selectedLapso === 'all'
    ? studentPlans
    : studentPlans.filter((p) => String(p.lapso) === String(selectedLapso) || p.lapso === `${selectedLapso}er Lapso` || p.lapso === `${selectedLapso}do Lapso` || p.lapso === `${selectedLapso}er Lapso`);

  const totalPercentage = displayedPlans.reduce((acc, p) => acc + (Number(p.percentage) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#152338] border border-stitch rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden my-6">
        {/* Top Bar (Hidden on Print) */}
        <div className="bg-[#101c30] px-6 py-3.5 flex items-center justify-between border-b border-slate-700/60 no-print">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <Calendar className="w-4 h-4 text-[#DCB35C]" />
            <span className="font-slab">Plan Oficial de Evaluación de los Aprendizajes</span>
            <div className="hidden sm:flex items-center gap-1.5 ml-4">
              <span className="text-slate-400 text-[11px]">Lapso:</span>
              <select
                value={selectedLapso}
                onChange={(e) => setSelectedLapso(e.target.value)}
                className="bg-[#1A2B45] border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-hidden"
              >
                <option value="all">Todos los Lapsos</option>
                <option value="1">1er Lapso</option>
                <option value="2">2do Lapso</option>
                <option value="3">3er Lapso</option>
              </select>
            </div>
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
        <div className="p-8 sm:p-12 bg-white text-slate-900 font-sans print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div className="flex items-start gap-4">
              <img src="/logo.png" alt="Sello Institucional" className="w-14 h-14 object-contain mt-1" />
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#1E3A8A]">
                  República Bolivariana de Venezuela
                </div>
                <div className="text-[10px] uppercase font-semibold text-slate-700">
                  Ministerio del Poder Popular para la Educación
                </div>
                <div className="text-base font-black tracking-tight text-slate-900 uppercase font-slab">
                  {institution.name}
                </div>
                <div className="text-[10px] text-slate-600 font-mono">
                  Código DEA: <strong>{institution.deaCode || 'PD11370304'}</strong> • {institution.city || 'Barcelona, Anzoátegui'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block border border-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-100 font-slab">
                Año Escolar {schoolYear}
              </span>
              <div className="text-[10px] text-slate-500 mt-1 font-mono uppercase font-semibold">
                Plan de Evaluación Oficial
              </div>
              <div className="text-[10px] text-slate-600 font-bold">
                {selectedLapso === 'all' ? 'Todos los Lapsos' : `${selectedLapso}° Lapso`}
              </div>
            </div>
          </div>

          {/* Student & Section Details */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Estudiante:</span>
              <strong className="text-slate-900 text-sm font-slab">{student.name}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Cédula de Identidad:</span>
              <strong className="text-slate-900 font-mono">{cedula}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Nivel Escolar:</span>
              <strong className="text-slate-900">{gradeYear} - {section}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Modalidad:</span>
              <span className="text-slate-700 font-medium">Educación Media General</span>
            </div>
          </div>

          {/* Evaluation Plans Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-slab text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 border-r border-slate-800">Asignatura</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">Lapso</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">Unidad / Contenido</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">Estrategia</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">Instrumento</th>
                  <th className="py-2.5 px-3 border-r border-slate-800 text-center">Fecha</th>
                  <th className="py-2.5 px-3 text-center">Pond. (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {displayedPlans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      No se registran actividades evaluativas cargadas para este período o año escolar.
                    </td>
                  </tr>
                ) : (
                  displayedPlans.map((p, idx) => (
                    <tr key={p.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-2.5 px-3 font-bold border-r border-slate-200">
                        {p.subject_name || p.subjectName || p.subject || 'General'}
                        {p.teacher_name && (
                          <div className="text-[10px] text-slate-500 font-normal italic">
                            Prof. {p.teacher_name}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-[11px] whitespace-nowrap">
                        {p.lapso ? `${p.lapso}° Lapso` : '1er Lapso'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                        {p.unit_title || p.title || 'Evaluación'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200">
                        {p.strategy || 'Evaluación Escrita'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600">
                        {p.instrument || 'Escala de Estimación'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-[11px] whitespace-nowrap">
                        {p.evaluation_date || p.date || 'Por fijar'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                        {p.percentage || 20}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {displayedPlans.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                    <td colSpan={6} className="py-2.5 px-3 text-right uppercase text-[11px] tracking-wider font-slab">
                      Total Ponderación Acumulada:
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#1E3A8A]">
                      {totalPercentage}%
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Legal Note */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-[10px] text-slate-600 mb-8 space-y-1">
            <p>
              <strong>Fundamento Legal:</strong> Conforme al Reglamento General de la Ley Orgánica de Educación y la normativa vigente del Ministerio del Poder Popular para la Educación de la República Bolivariana de Venezuela, las actividades de evaluación formativa y sumativa deben ser notificadas oportunamente a los estudiantes y sus representantes legales al inicio de cada lapso académico.
            </p>
          </div>

          {/* Footer & Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-8 text-center text-xs">
            <div>
              <div className="h-12 flex items-end justify-center">
                <span className="font-serif italic text-slate-400">Firma del Docente</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 font-bold uppercase text-slate-900 text-[11px]">
                Docente Titular
              </div>
              <div className="text-[10px] text-slate-500">Cátedra Asignada</div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center">
                <span className="font-serif italic text-slate-400">Sello y Firma</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 font-bold uppercase text-slate-900 text-[11px]">
                Coordinación de Evaluación
              </div>
              <div className="text-[10px] text-slate-500">Control de Estudios</div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center">
                <span className="font-serif italic text-slate-400">Firma y Sello</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 font-bold uppercase text-slate-900 text-[11px]">
                {institution.principal || 'Dirección General'}
              </div>
              <div className="text-[10px] text-slate-500">U.E. Colegio Integral Venezuela</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
