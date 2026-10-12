import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  FileText,
  Printer,
  ChevronRight,
  Camera,
  Plus,
  Upload,
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  IdCard,
  Sparkles,
  Save,
  X,
  School
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CertificateModal from './CertificateModal';
import ReportCardModal from './ReportCardModal';
import SchedulePrintModal from './SchedulePrintModal';
import PlanPrintModal from './PlanPrintModal';
import { readFileAsDataURL } from '../lib/fileUpload';

export default function StudentPortal() {
  const {
    currentUser,
    updateStudentProfile,
    grades,
    evaluationPlans,
    schedules,
    attendances,
    certificates,
    memories,
    addMemory,
    institution,
    subjects,
    sections,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('grades'); // 'grades', 'schedule', 'plans', 'certificates', 'attendance', 'memories', 'carnet', 'profile'
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [reportCardModalOpen, setReportCardModalOpen] = useState(false);
  const [schedulePrintModalOpen, setSchedulePrintModalOpen] = useState(false);
  const [planPrintModalOpen, setPlanPrintModalOpen] = useState(false);

  // Student object (Solo Lectura - Administrado por Dirección)
  const student = {
    id: currentUser?.id || 'stu-temp',
    name: currentUser?.name || 'Estudiante Regular',
    email: currentUser?.email || 'estudiante@integralvenezuela.edu.ve',
    cedula: currentUser?.cedula || '',
    gradeLevel: currentUser?.gradeLevel || currentUser?.grade_year || '1er Año',
    section: currentUser?.section || 'Sección A',
    avatar: currentUser?.avatar || '',
    phone: currentUser?.phone || ''
  };

  const activeYear = institution.currentSchoolYear || '2027-2028';

  // Check if profile is incomplete (missing cedula or section)
  const isProfileIncomplete = !student.cedula || !student.section;

  // Memory modal state
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [memoryImagePreview, setMemoryImagePreview] = useState('');
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    category: 'Proyectos',
    description: ''
  });
  const memoryFileInputRef = useRef(null);

  // Memory file change
  const handleMemoryFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setMemoryImagePreview(dataUrl);
      } catch (err) {
        notify('Error al cargar la foto del recuerdo', 'error');
      }
    }
  };

  const handleSaveMemory = (e) => {
    e.preventDefault();
    if (!memoryImagePreview) {
      notify('Por favor selecciona una foto para el recuerdo', 'error');
      return;
    }

    addMemory({
      title: memoryForm.title,
      category: memoryForm.category,
      description: memoryForm.description,
      image: memoryImagePreview,
      authorName: student.name,
      gradeYear: `${student.gradeLevel} - ${student.section}`
    });

    setMemoryModalOpen(false);
    setMemoryForm({ title: '', category: 'Proyectos', description: '' });
    setMemoryImagePreview('');
  };

  // Student specific grades
  const studentGrades = grades.filter(
    (g) => g.studentId === student.id || g.studentName === student.name
  );

  // Subject averages
  const subjectAverages = subjects.map((sub) => {
    const list = studentGrades.filter(
      (g) => g.subjectId === sub.id || g.subjectName === sub.name
    );
    const total = list.reduce((acc, curr) => acc + Number(curr.score), 0);
    const avg = list.length > 0 ? (total / list.length).toFixed(1) : null;
    return {
      ...sub,
      grades: list,
      average: avg
    };
  });

  const validAverages = subjectAverages
    .map((s) => (s.average !== null ? parseFloat(s.average) : null))
    .filter((a) => a !== null && !isNaN(a));

  const generalAvg =
    validAverages.length > 0
      ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1)
      : '0.0';

  // Certificates for this student
  const studentCerts = certificates.filter(
    (c) => c.studentId === student.id || c.studentName?.toLowerCase() === student.name.toLowerCase()
  );

  return (
    <div className="min-h-screen denim-pattern text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner de Datos Incompletos (Requisito 1) */}
        {isProfileIncomplete && (
          <div className="p-4 rounded-2xl bg-amber-950/60 border border-[#DCB35C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#223C63] border border-[#DCB35C]/60 flex items-center justify-center text-[#DCB35C] shrink-0">
                <AlertCircle className="w-5 h-5 text-[#f0c36d]" />
              </div>
              <div className="text-xs">
                <div className="font-bold font-slab text-[#f0c36d] text-sm">
                  Expediente Escolar Incompleto
                </div>
                <div className="text-slate-300">
                  Agrega tu <strong>Cédula de Identidad</strong> y confirma tu <strong>Año y Sección</strong> para emitir tu carnet estudiantil y boletines del Año {activeYear}.
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab('profile')}
              className="px-4 py-2 bg-[#223C63] hover:bg-[#1A2B45] text-[#f0c36d] border border-[#DCB35C]/40 font-bold font-slab text-xs rounded-lg transition shrink-0 cursor-pointer"
            >
              Ver Mi Expediente
            </button>
          </div>
        )}

        {/* Header Profile Summary (Denim Card with Stitching) */}
        <div className="denim-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-5">
            <div className="relative">
               {student.avatar ? (
                 <img
                   src={student.avatar}
                   alt={student.name}
                   className="w-20 h-20 rounded-2xl object-cover border-2 border-[#DCB35C]/60 shadow-xl"
                 />
               ) : (
                 <div className="w-20 h-20 rounded-2xl bg-[#1A2B45] border-2 border-[#DCB35C]/60 shadow-xl flex items-center justify-center text-[#DCB35C]">
                   <User className="w-10 h-10 text-[#DCB35C]/70" />
                 </div>
               )}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 denim-patch px-2.5 py-0.5 text-[11px]">
                <Sparkles className="w-3 h-3 text-[#DCB35C]" />
                <span>Año Escolar {activeYear}</span>
                <span className="text-slate-500">•</span>
                <span className="text-white font-semibold">{student.gradeLevel} ({student.section})</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-slab text-white tracking-tight">
                {student.name}
              </h1>
              <p className="text-xs text-slate-300 font-mono flex items-center gap-4">
                <span>C.I: <strong className="text-white font-bold">{student.cedula || 'Sin Cédula'}</strong></span>
                <span>•</span>
                <span>{student.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setReportCardModalOpen(true)}
              className="px-4 py-2.5 bg-[#101c30] hover:bg-[#1A2B45] text-[#f0c36d] border border-stitch-subtle rounded-xl text-xs font-bold font-slab flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-[#DCB35C]" />
              <span>Ver Boletín Oficial</span>
            </button>
            <button
              onClick={() => setMemoryModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] rounded-xl text-xs font-bold font-slab flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Foto al Anuario</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3 text-xs font-medium">
          {[
            { id: 'grades', label: 'Mis Calificaciones', icon: BookOpen },
            { id: 'schedule', label: 'Horario Escolar', icon: Clock },
            { id: 'carnet', label: 'Mi Carnet Estudiantil', icon: IdCard },
            { id: 'plans', label: 'Planes de Evaluación', icon: Calendar },
            { id: 'certificates', label: `Certificados (${studentCerts.length})`, icon: Award },
            { id: 'attendance', label: 'Inasistencias', icon: FileText },
            { id: 'memories', label: 'Anuario y Recuerdos', icon: Camera },
            { id: 'profile', label: 'Expediente & Cédula', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#223C63] text-white font-bold font-slab border border-[#DCB35C]/50 shadow-inner'
                    : 'bg-[#152338]/80 text-slate-300 hover:text-white hover:bg-[#1A2B45] border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DCB35C]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SUBTAB: GRADES */}
        {activeSubTab === 'grades' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="denim-card p-5">
                <div className="text-xs text-slate-400 font-medium uppercase font-slab">Promedio General</div>
                <div className="text-3xl font-black font-slab text-[#f0c36d] mt-1">{generalAvg} <span className="text-sm text-slate-400">/ 20</span></div>
                <p className="text-[11px] text-slate-400 mt-1">Escala oficial de evaluación venezolana</p>
              </div>

              <div className="denim-card p-5">
                <div className="text-xs text-slate-400 font-medium uppercase font-slab">Asignaturas Matriculadas</div>
                <div className="text-3xl font-black font-slab text-white mt-1">{subjects.length}</div>
                <p className="text-[11px] text-slate-400 mt-1">Plan de estudio del {student.gradeLevel}</p>
              </div>

              <div className="denim-card p-5">
                <div className="text-xs text-slate-400 font-medium uppercase font-slab">Año y Sección Activa</div>
                <div className="text-3xl font-black font-slab text-white mt-1">{student.gradeLevel}</div>
                <p className="text-[11px] text-[#DCB35C] mt-1">{student.section} • Año Escolar {activeYear}</p>
              </div>
            </div>

            {/* Subject List */}
            <div className="denim-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-base font-bold font-slab text-white">Rendimiento por Asignatura</h2>
                  <p className="text-xs text-slate-400">Calificaciones acumuladas registradas por el cuerpo docente</p>
                </div>
                <button
                  onClick={() => setReportCardModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#223C63] hover:bg-[#1A2B45] text-white border border-[#DCB35C]/40 rounded-xl text-xs font-bold font-slab flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-[#DCB35C]" />
                  <span>Imprimir Boletín</span>
                </button>
              </div>

              {subjects.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                  <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <div className="font-bold text-slate-300 font-slab">No hay asignaturas registradas</div>
                  <p className="text-xs text-slate-500 mt-1">
                    La dirección cargará las materias oficiales del plan curricular.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectAverages.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-xl bg-[#101c30] border border-slate-700/80 hover:border-[#DCB35C]/50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-white text-sm font-slab">{sub.name}</div>
                          <div className="text-[11px] text-slate-400">Prof: {sub.teacherName || 'Docente titular'}</div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-black font-mono ${sub.average && parseFloat(sub.average) >= 10 ? 'text-[#f0c36d]' : 'text-slate-400'}`}>
                            {sub.average ? `${sub.average} pts` : 'Sin nota'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                        <span>Evaluaciones: {sub.grades.length}</span>
                        <span>Código: {sub.code || 'MAT-CIV'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB: CARNET ESTUDIANTIL (Requisito 1 & 2) */}
        {activeSubTab === 'carnet' && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="text-center space-y-1 mb-2">
              <h2 className="text-xl font-bold font-slab text-white">Carnet Estudiantil Oficial</h2>
              <p className="text-xs text-slate-400">Identificación institucional para el Año Escolar {activeYear}</p>
            </div>

            {/* Official Venezuelan High School ID Card */}
            <div className="bg-gradient-to-br from-[#1A2B45] via-[#223C63] to-[#101c30] rounded-xl p-6 border-2 border-[#DCB35C] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#DCB35C]/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header with Official School Crest */}
              <div className="flex items-center justify-between border-b border-[#DCB35C]/30 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#101c30] border border-[#DCB35C]/50 flex items-center justify-center p-1 shrink-0 shadow-sm">
                    <img src="/logo.png" alt="Crest" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#f0c36d] tracking-widest font-slab">República Bolivariana de Venezuela</div>
                    <div className="text-xs font-black font-slab text-white uppercase">{institution.name}</div>
                  </div>
                </div>
                <span className="denim-patch px-2 py-0.5 text-[10px] font-mono">{activeYear}</span>
              </div>

              {/* Card Body */}
              <div className="flex flex-col sm:flex-row items-center gap-5 my-3">
                <div className="relative shrink-0">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-24 h-28 rounded-lg object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-28 rounded-lg bg-[#1A2B45] border-2 border-white shadow-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute -bottom-2 inset-x-0 bg-[#DCB35C] text-[#1A2B45] text-[9px] font-bold uppercase text-center rounded py-0.5">
                    Estudiante
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left text-xs w-full">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Nombre Completo:</span>
                    <strong className="text-white text-base font-slab">{student.name}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Cédula de Identidad:</span>
                      <strong className="text-[#f0c36d] font-mono text-sm">{student.cedula || 'Pendiente'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Año y Sección:</span>
                      <strong className="text-white">{student.gradeLevel} - {student.section}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Válido para:</span>
                    <span className="text-slate-300 font-mono text-[11px]">Año Escolar {activeYear} • Barcelona, Anzoátegui</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Barcode & DEA */}
              <div className="pt-3 border-t border-[#DCB35C]/30 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>CÓDIGO DEA • CIV-EST-{String(student?.id || '000000').slice(-6).toUpperCase()}</span>
                <span className="text-[#f0c36d] font-medium">Matrícula Regular</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] rounded-lg text-xs font-bold font-slab flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Carnet Físico</span>
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB: SCHEDULE */}
        {activeSubTab === 'schedule' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Horario de Clases y Actividades</h2>
                <p className="text-xs text-slate-400">Distribución semanal para {student.gradeLevel} ({student.section})</p>
              </div>
              <button
                onClick={() => setSchedulePrintModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#223C63] hover:bg-[#1A2B45] text-white border border-[#DCB35C]/40 rounded-xl text-xs font-bold font-slab flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#DCB35C]" />
                <span>Imprimir Horario (PDF)</span>
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="p-8 text-center rounded-lg bg-[#101c30] border-stitch-subtle">
                <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-slate-300 font-slab">Horario no publicado</div>
                <p className="text-xs text-slate-500 mt-1">Control de Estudios publicará el cronograma del {activeYear}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
                  const daySchedules = schedules.filter((s) => s.day_of_week === day || s.day === day);
                  return (
                    <div key={day} className="p-3.5 rounded-lg bg-[#101c30] border border-slate-700/80 space-y-2.5">
                      <div className="font-bold font-slab text-sm text-[#f0c36d] border-b border-slate-800 pb-1">{day}</div>
                      {daySchedules.length === 0 ? (
                        <div className="text-[11px] text-slate-500 italic py-2">Sin bloques</div>
                      ) : (
                        daySchedules.map((b) => {
                          const isRecess = b.entry_type === 'recess' || b.subject_name?.toLowerCase().includes('receso') || b.subject?.toLowerCase().includes('receso');
                          const isDayOff = b.entry_type === 'day_off';
                          const isFree = b.entry_type === 'free_module';
                          const title = isRecess ? 'Receso' : (isDayOff ? 'Día Libre' : (isFree ? 'Módulo Libre' : (b.subject_name || b.subject || 'Clase Regular')));

                          return (
                            <div
                              key={b.id}
                              className={`p-2 rounded-lg border text-xs space-y-1 ${
                                isRecess
                                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                                  : isDayOff
                                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                                  : isFree
                                  ? 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                                  : 'bg-[#16253c] border-slate-700 text-slate-200'
                              }`}
                            >
                              <div className="font-semibold text-white flex items-center justify-between">
                                <span>{title}</span>
                                {isRecess && (
                                  <span className="text-[9px] bg-amber-500/20 text-[#f0c36d] px-1.5 py-0.5 rounded">
                                    Receso
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{b.start_time || b.time?.split('-')[0]?.trim()} - {b.end_time || b.time?.split('-')[1]?.trim() || b.time}</div>
                              {b.classroom_name && (
                                <div className="text-[10px] text-[#DCB35C]">Aula: {b.classroom_name}</div>
                              )}
                              {b.notes && (
                                <div className="text-[10px] text-slate-400 italic">{b.notes}</div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: EVALUATION PLANS */}
        {activeSubTab === 'plans' && (() => {
          const termNum = selectedTerm.charAt(0);
          const studentPlans = evaluationPlans.filter((p) => {
            const planGrade = p.grade_year || p.gradeYear;
            const matchesGrade = !planGrade || planGrade.toLowerCase().trim() === student.gradeLevel.toLowerCase().trim();
            const matchesLapso = !selectedTerm || String(p.lapso) === termNum || p.lapso === selectedTerm;
            return matchesGrade && matchesLapso;
          });

          return (
            <div className="denim-card p-6 space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
                <div>
                  <h2 className="text-base font-bold font-slab text-white">Planes de Evaluación</h2>
                  <p className="text-xs text-slate-400">
                    Cronograma pedagógico, instrumentos y ponderaciones para {student.gradeLevel} ({activeYear})
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {['1er Lapso', '2do Lapso', '3er Lapso'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSelectedTerm(term)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-slab transition cursor-pointer ${
                          selectedTerm === term
                            ? 'bg-[#223C63] text-white border border-[#DCB35C]/50 shadow-xs'
                            : 'bg-[#152338] text-slate-400 hover:text-white'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPlanPrintModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#223C63] hover:bg-[#1A2B45] text-[#f0c36d] border border-[#DCB35C]/40 rounded-xl text-xs font-bold font-slab flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#DCB35C]" />
                    <span>Imprimir Plan (PDF)</span>
                  </button>
                </div>
              </div>

              {studentPlans.length === 0 ? (
                <div className="p-8 text-center rounded-lg bg-[#101c30] border-stitch-subtle">
                  <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <div className="font-bold text-slate-300 font-slab">No hay planes de evaluación cargados</div>
                  <p className="text-xs text-slate-500 mt-1">Los docentes publicarán las fechas y ponderaciones de cada unidad para {student.gradeLevel} aquí.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentPlans.map((plan) => (
                    <div key={plan.id} className="p-4 rounded-lg bg-[#101c30] border border-slate-700/80 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="denim-patch px-2 py-0.5 text-[10px]">
                            {plan.subjectName || plan.subject_name || plan.subject || 'Asignatura'}
                          </span>
                          <h3 className="font-bold text-white text-sm font-slab mt-1.5">{plan.unit_title || plan.title || 'Unidad de Evaluación'}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-[#223C63] text-[#f0c36d] font-mono text-xs font-bold border border-[#DCB35C]/30 shrink-0">
                          {plan.percentage || 20}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Estrategia:</span>
                          <span>{plan.strategy || 'Evaluación Escrita'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Instrumento:</span>
                          <span>{plan.instrument || 'Escala de Estimación'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 font-mono">
                        <span>Fecha: {plan.evaluation_date || plan.date || 'Por anunciar'}</span>
                        <span className="text-[#DCB35C] font-semibold">{plan.lapso ? `${plan.lapso}° Lapso` : selectedTerm}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* SUBTAB: CERTIFICATES */}
        {activeSubTab === 'certificates' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div>
              <h2 className="text-base font-bold font-slab text-white">Certificados y Reconocimientos Oficiales</h2>
              <p className="text-xs text-slate-400">Reconocimientos de mérito, excelencia y participación emitidos por la Dirección General</p>
            </div>

            {studentCerts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                <Award className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-slate-300 font-slab">No posees certificados emitidos</div>
                <p className="text-xs text-slate-500 mt-1">Los reconocimientos asignados por la Dirección se reflejarán aquí para su impresión.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentCerts.map((cert) => (
                  <div key={cert.id} className="p-5 rounded-2xl bg-[#101c30] border border-[#DCB35C]/30 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="denim-patch px-2 py-0.5 text-[10px]">{cert.template_type || 'Académico'}</span>
                        <h3 className="font-bold text-white text-base font-slab mt-1">{cert.title}</h3>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-[#223C63] border border-[#DCB35C]/60 flex items-center justify-center text-[#DCB35C] shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{cert.description}</p>

                    {cert.score_note && (
                      <div className="text-xs font-mono text-[#f0c36d] font-bold">
                        Calificación: {cert.score_note} pts
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-slate-500 font-mono">Emisión: {cert.issue_date || cert.issued_date}</span>
                      <button
                        onClick={() => setSelectedCertificate(cert)}
                        className="px-3 py-1.5 bg-[#DCB35C] hover:bg-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Ver e Imprimir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: MEMORIES / ANUARIO */}
        {activeSubTab === 'memories' && (
          <div className="denim-card p-6 space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Anuario Escolar & Recuerdos</h2>
                <p className="text-xs text-slate-400">Comparte momentos con tu promoción en el Colegio Integral Venezuela</p>
              </div>
              <button
                onClick={() => setMemoryModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Subir Nueva Fotografía</span>
              </button>
            </div>

            {memories.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-slate-300 font-slab">El anuario está esperando fotos</div>
                <p className="text-xs text-slate-500 mt-1">Sé el primero de tu sección en subir una foto conmemorativa.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {memories.map((m) => (
                  <div key={m.id} className="rounded-2xl overflow-hidden bg-[#101c30] border border-slate-700/80 text-xs shadow-md">
                    <div className="h-44 overflow-hidden relative">
                      <img src={m.image || m.photo_url} alt={m.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md denim-patch text-[10px]">
                        {m.grade_year || m.year_title || 'Bachillerato'}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <div className="font-bold text-white text-sm font-slab">{m.title}</div>
                      <p className="text-slate-300 line-clamp-2 leading-relaxed">{m.description}</p>
                      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                        <span>Por: {m.author_name || m.student_name || 'Estudiante'}</span>
                        <span>{m.date || 'Año 2027-2028'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: PROFILE & CEDULA (Solo Lectura) */}
        {activeSubTab === 'profile' && (
          <div className="denim-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Expediente Escolar Oficial</h2>
                <p className="text-xs text-slate-400">Ficha académica certificada por el Departamento de Control de Estudios</p>
              </div>
              <div className="denim-patch px-3 py-1 text-[11px] flex items-center gap-1.5 text-[#DCB35C]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Expediente Certificado</span>
              </div>
            </div>

            {/* Official Photo Badge (Solo Lectura) */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-[#101c30] border border-stitch-subtle">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#DCB35C]/60 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#1A2B45] border-2 border-[#DCB35C]/60 flex items-center justify-center shrink-0 text-[#DCB35C]">
                  <User className="w-8 h-8 text-[#DCB35C]/70" />
                </div>
              )}
              <div className="space-y-1">
                <div className="font-bold text-white text-sm font-slab">Fotografía Oficial del Expediente</div>
                <p className="text-xs text-slate-400">
                  La fotografía del carnet y los recaudos son digitalizados y validados exclusivamente por la Dirección y Control de Estudios.
                </p>
              </div>
            </div>

            {/* Student Data Grid (Solo Lectura) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Nombre Completo:</span>
                <strong className="text-white text-sm font-slab">{student.name}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Cédula de Identidad:</span>
                <strong className="text-[#f0c36d] text-sm font-mono">{student.cedula || 'Pendiente de Registro'}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Año Cursado:</span>
                <strong className="text-white text-sm">{student.gradeLevel}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Sección Asignada:</span>
                <strong className="text-white text-sm">{student.section}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Año Escolar:</span>
                <strong className="text-[#DCB35C] font-mono">{activeYear}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Estatus Académico:</span>
                <strong className="text-emerald-400">Matrícula Regular Activa</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800 sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Correo Institucional:</span>
                <strong className="text-slate-300 font-mono">{student.email}</strong>
              </div>
            </div>

            {/* Institutional Security Notice */}
            <div className="p-3.5 rounded-xl bg-[#1A2B45] border border-stitch-subtle flex items-start gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-[#DCB35C] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Seguridad de Control de Estudios:</span> Por normativa institucional, los estudiantes no pueden modificar sus datos personales, cédula o fotografía. Cualquier actualización de recaudos debe solicitarse a través de su representante en la oficina de Dirección General.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Memory Upload Modal */}
      {memoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold font-slab text-white">
                Subir Fotografía al Anuario
              </h3>
              <button onClick={() => setMemoryModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Aniversario del Colegio / Feria Científica"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:outline-hidden focus:border-[#DCB35C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Categoría</label>
                <select
                  value={memoryForm.category}
                  onChange={(e) => setMemoryForm({ ...memoryForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:outline-hidden focus:border-[#DCB35C]"
                >
                  <option value="Proyectos">Proyectos y Ciencia</option>
                  <option value="Deportes">Deportes y Juegos</option>
                  <option value="Eventos">Eventos y Aniversario</option>
                  <option value="Vida Escolar">Convivencia y Amigos</option>
                </select>
              </div>

              {/* Direct File Upload Button */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Fotografía (Archivo)</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => memoryFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-[#223C63] hover:bg-[#1A2B45] border border-[#DCB35C]/50 rounded-lg text-[#f0c36d] font-bold font-slab flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Seleccionar Archivo</span>
                  </button>
                  <input
                    type="file"
                    ref={memoryFileInputRef}
                    accept="image/*"
                    onChange={handleMemoryFileChange}
                    className="hidden"
                  />
                  {memoryImagePreview && (
                    <span className="text-[11px] text-emerald-400 font-medium">Foto lista para subir</span>
                  )}
                </div>

                {memoryImagePreview && (
                  <div className="mt-2.5 h-28 rounded-lg overflow-hidden border border-slate-700">
                    <img src={memoryImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Descripción o Mensaje</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Relata qué vivieron en ese momento..."
                  value={memoryForm.description}
                  onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:outline-hidden focus:border-[#DCB35C]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMemoryModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-lg shadow-md cursor-pointer"
                >
                  Publicar Recuerdo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* Official Report Card Modal */}
      {reportCardModalOpen && (
        <ReportCardModal
          student={student}
          grades={grades}
          subjects={subjects}
          onClose={() => setReportCardModalOpen(false)}
        />
      )}

      {/* Official Schedule Print Modal */}
      {schedulePrintModalOpen && (
        <SchedulePrintModal
          student={student}
          schedules={schedules}
          onClose={() => setSchedulePrintModalOpen(false)}
        />
      )}

      {/* Official Evaluation Plan Print Modal */}
      {planPrintModalOpen && (
        <PlanPrintModal
          student={student}
          plans={evaluationPlans}
          onClose={() => setPlanPrintModalOpen(false)}
        />
      )}
    </div>
  );
}
