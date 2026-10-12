import React from 'react';
import { X, Printer, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SchedulePrintModal({ student, schedules, onClose }) {
  const { institution } = useApp();
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const schoolYear = institution?.currentSchoolYear || '2027-2028';
  const cedula = student.cedula || 'Pendiente';
  const gradeYear = student.grade_year || student.gradeLevel || '1er Año';
  const section = student.section || 'Sección A';
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#152338] border border-stitch rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden my-6">
        {/* Top Actions (Hidden on Print) */}
        <div className="bg-[#101c30] px-6 py-3.5 flex items-center justify-between border-b border-slate-700/60 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Clock className="w-4 h-4 text-[#DCB35C]" />
            <span className="font-slab">Horario Oficial de Actividades Académicas</span>
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
                <div className="text-base font-black tracking-tight text-slate-900 uppercase">
                  {institution.name}
                </div>
                <div className="text-[10px] text-slate-600 font-mono">
                  Código DEA: <strong>{institution.deaCode || 'PD11370304'}</strong> • {institution.city || 'Barcelona, Anzoátegui'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block border border-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-100">
                Año Escolar {schoolYear}
              </span>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Horario de Clases Regular
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
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Año y Sección:</span>
              <strong className="text-slate-900">{gradeYear} - {section}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Modalidad:</span>
              <span className="text-slate-700 font-medium">Educación Media General</span>
            </div>
          </div>

          {/* Timetable Matrix */}
          <div className="border border-slate-300 rounded-lg overflow-hidden mb-8">
            <div className="grid grid-cols-5 bg-slate-900 text-white text-center text-xs font-bold py-2 uppercase tracking-wider font-slab">
              {days.map((d) => (
                <div key={d} className="px-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-5 divide-x divide-slate-200 min-h-[320px] text-xs">
              {days.map((day) => {
                const daySchedules = schedules.filter((s) => s.day_of_week === day || s.day === day);
                return (
                  <div key={day} className="p-2 space-y-2 bg-white">
                    {daySchedules.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic text-center py-6">Sin módulos</div>
                    ) : (
                      daySchedules.map((b) => {
                        const isRecess = b.entry_type === 'recess' || b.subject_name?.toLowerCase().includes('receso') || b.subject?.toLowerCase().includes('receso');
                        const isDayOff = b.entry_type === 'day_off';
                        const isFree = b.entry_type === 'free_module';

                        return (
                          <div
                            key={b.id}
                            className={`p-2 rounded border text-[11px] space-y-0.5 ${
                              isRecess
                                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold text-center'
                                : isDayOff
                                ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold text-center'
                                : isFree
                                ? 'bg-blue-50 border-blue-300 text-blue-900'
                                : 'bg-slate-50 border-slate-300 text-slate-900'
                            }`}
                          >
                            <div className="font-bold leading-tight">
                              {isRecess ? 'Receso Escolar' : (isDayOff ? 'Día Libre' : (b.subject_name || b.subject || 'Clase Regular'))}
                            </div>
                            <div className="text-[10px] text-slate-600 font-mono">
                              {b.start_time || b.time?.split('-')[0]?.trim()} - {b.end_time || b.time?.split('-')[1]?.trim() || b.time}
                            </div>
                            {b.classroom_name && (
                              <div className="text-[10px] text-slate-700">Aula: {b.classroom_name}</div>
                            )}
                            {b.teacher_name && !isRecess && !isDayOff && (
                              <div className="text-[10px] text-slate-500 italic">Prof. {b.teacher_name}</div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer & Signatures */}
          <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-2 gap-12 text-center text-xs">
            <div>
              <div className="h-12 flex items-end justify-center">
                <span className="font-serif italic text-slate-400">Firma y Sello</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 font-bold uppercase text-slate-900 text-[11px]">
                Control de Estudios
              </div>
              <div className="text-[10px] text-slate-500">U.E. Colegio Integral Venezuela</div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center">
                <span className="font-serif italic text-slate-400">Firma del Director</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 font-bold uppercase text-slate-900 text-[11px]">
                {institution.principal}
              </div>
              <div className="text-[10px] text-slate-500">Director General</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
