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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CertificateModal from './CertificateModal';
import ReportCardModal from './ReportCardModal';
import { readFileAsDataURL } from '../lib/fileUpload';

export default function StudentPortal() {
  const {
    currentUser,
    updateUserProfile,
    grades,
    evaluationPlans,
    schedules,
    attendances,
    certificates,
    memories,
    addMemory,
    institution,
    subjects,
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('grades'); // 'grades', 'schedule', 'plans', 'certificates', 'attendance', 'memories', 'profile'
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [reportCardModalOpen, setReportCardModalOpen] = useState(false);

  // Profile photo upload input ref
  const profilePhotoInputRef = useRef(null);

  // Current student object (or null defaults)
  const student = currentUser || {
    id: 'student-temp',
    name: 'Estudiante',
    email: 'estudiante@integralvenezuela.edu.ve',
    studentIdNumber: 'Sin asignar',
    gradeLevel: 'Sin asignar',
    avatar: '',
  };

  // Memory modal state
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [memoryImagePreview, setMemoryImagePreview] = useState('');
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    category: 'Proyectos',
    description: ''
  });
  const memoryFileInputRef = useRef(null);

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
    (c) => c.studentId === student.id || c.studentName === student.name
  );

  // Attendances for this student
  const studentAtts = attendances.filter(
    (a) => a.studentId === student.id || a.studentName === student.name
  );

  // Handle student profile photo upload directly
  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataURL(file);
      await updateUserProfile({ avatar: dataUrl });
      notify('Foto de perfil actualizada correctamente');
    } catch (err) {
      notify('No se pudo procesar la imagen seleccionada', 'error');
    }
  };

  // Handle memory photo upload directly
  const handleMemoryFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataURL(file);
      setMemoryImagePreview(dataUrl);
    } catch (err) {
      notify('Error al cargar la foto', 'error');
    }
  };

  const handleSaveMemory = async (e) => {
    e.preventDefault();
    if (!memoryImagePreview) {
      notify('Por favor selecciona una foto para tu recuerdo', 'error');
      return;
    }

    await addMemory({
      title: memoryForm.title,
      category: memoryForm.category,
      description: memoryForm.description,
      image: memoryImagePreview,
      authorName: student.name,
      gradeYear: student.gradeLevel || 'Bachillerato'
    });

    setMemoryModalOpen(false);
    setMemoryImagePreview('');
    setMemoryForm({ title: '', category: 'Proyectos', description: '' });
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* 1. Header Banner (Apple / Google Matte Glass Design) */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Portal del Estudiante</span>
          </div>

          <div className="glass-surface p-6 sm:p-7 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => profilePhotoInputRef.current?.click()}
                  title="Cambiar foto de perfil"
                  className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={profilePhotoInputRef}
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[11px] font-semibold border border-blue-400/20 inline-block mb-1">
                  Estudiante Regular
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                  {student.name}
                </h1>
                <p className="text-xs text-slate-400">
                  {student.studentIdNumber || 'C.I. Sin registrar'} • {student.gradeLevel || 'Año no asignado'} • {institution.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center w-full md:w-auto">
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-white">{generalAvg}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Promedio</div>
              </div>
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-emerald-400">
                  {student.attendanceRate || 0}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Asistencia</div>
              </div>
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-blue-400">
                  {studentCerts.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Certificados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="glass-surface rounded-xl p-1 flex gap-1 overflow-x-auto text-xs font-semibold shadow-md">
          <button
            onClick={() => setActiveSubTab('grades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'grades' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Calificaciones y Boletín</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'schedule' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Horario de Clases</span>
          </button>

          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'plans' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Planes de Evaluación</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'certificates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificados y Menciones ({studentCerts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Asistencias y Faltas ({studentAtts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('memories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'memories' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Recuerdos de Mi Año ({memories.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mis Datos y Foto de Perfil</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SUBTAB: GRADES & REPORT CARD */}
        {activeSubTab === 'grades' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Boletín y Resumen de Calificaciones
                </h2>
                <p className="text-xs text-slate-400">
                  Consulta de notas parciales, ponderaciones y emisión del boletín adaptado
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReportCardModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Boletín Oficial</span>
                </button>
              </div>
            </div>

            {/* Asignaturas Grid */}
            {subjects.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <div className="font-bold text-white text-sm">No hay asignaturas registradas</div>
                <p className="text-xs text-slate-400 mt-1">
                  El administrador del plantel aún no ha cargado las materias del año escolar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectAverages.map((sub) => (
                  <div key={sub.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm">{sub.name}</span>
                        <span className="text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-0.5 rounded-md">
                          {sub.average !== null ? `${sub.average} / 20` : 'Sin nota'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mb-3">{sub.teacherName || 'Docente asignado'}</div>

                      <div className="space-y-2 border-t border-slate-800 pt-3">
                        {sub.grades.length === 0 ? (
                          <div className="text-xs text-slate-500 italic py-2 text-center">
                            Sin evaluaciones cargadas
                          </div>
                        ) : (
                          sub.grades.map((gr) => (
                            <div
                              key={gr.id}
                              className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
                            >
                              <div>
                                <div className="font-medium text-slate-200">{gr.evaluationTitle}</div>
                                <div className="text-[10px] text-slate-400">{gr.percentage}% • {gr.date}</div>
                              </div>
                              <span className="font-bold text-blue-400">{gr.score}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: SCHEDULE (with recess, day off, free module support) */}
        {activeSubTab === 'schedule' && (
          <div className="glass-card p-6 sm:p-7 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">Horario Semanal de Clases</h2>
                <p className="text-xs text-slate-400">
                  {student.gradeLevel || 'Bachillerato'} • Turno Matutino • Incluye recesos y módulos
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition no-print"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Horario</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {daysOfWeek.map((day) => {
                const dayBlocks = schedules.filter((s) => s.day === day || s.day_of_week === day);
                const isDayOff = dayBlocks.some((b) => b.entry_type === 'day_off');

                return (
                  <div key={day} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
                    <div className="bg-slate-950 text-slate-200 font-medium text-xs py-2 text-center border-b border-slate-800">
                      {day}
                    </div>
                    <div className="p-2 space-y-2">
                      {isDayOff ? (
                        <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-900/30 text-center text-xs text-blue-300">
                          <span className="font-semibold block mb-0.5">Día Libre</span>
                          <span className="text-[10px] text-slate-400">Sin actividades académicas</span>
                        </div>
                      ) : dayBlocks.length === 0 ? (
                        <div className="text-xs text-slate-500 py-6 text-center italic">Sin clases</div>
                      ) : (
                        dayBlocks.map((item, idx) => {
                          const isRecess = item.entry_type === 'recess';
                          const isFree = item.entry_type === 'free_module';

                          if (isRecess) {
                            return (
                              <div key={idx} className="p-2 rounded-lg bg-amber-950/20 border border-amber-900/40 text-center text-xs text-amber-300">
                                <span className="font-semibold block text-[11px]">Receso Escolar</span>
                                <span className="text-[10px] text-slate-400">{item.time}</span>
                              </div>
                            );
                          }

                          if (isFree) {
                            return (
                              <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs text-slate-400">
                                <span className="font-medium text-slate-300 block">Módulo Libre</span>
                                <span className="text-[10px]">{item.time}</span>
                              </div>
                            );
                          }

                          return (
                            <div key={idx} className="p-3 rounded-lg border border-slate-800 bg-slate-900/90 text-xs">
                              <div className="font-bold text-white mb-0.5">{item.subject}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{item.time}</span>
                              </div>
                              <div className="text-[10px] text-blue-400 font-medium">
                                {item.classroom}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB: EVALUATION PLANS */}
        {activeSubTab === 'plans' && (
          <div className="glass-card p-6 sm:p-7 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-heading text-white">Planes de Evaluación</h2>
                <p className="text-xs text-slate-400">Fechas de entrega y ponderaciones asignadas</p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition no-print"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Planes</span>
              </button>
            </div>

            {evaluationPlans.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-500 italic">
                No hay planes de evaluación publicados todavía.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Materia</th>
                      <th className="py-2.5 px-3">Evaluación</th>
                      <th className="py-2.5 px-3">Modalidad</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3 text-center">Ponderación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {evaluationPlans.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-bold text-white">{p.subjectName}</td>
                        <td className="py-3 px-3 text-slate-200">{p.title}</td>
                        <td className="py-3 px-3 text-slate-400">{p.type}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">{p.dueDate}</td>
                        <td className="py-3 px-3 text-center font-bold text-blue-400">{p.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: CERTIFICATES & HONORS */}
        {activeSubTab === 'certificates' && (
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Certificados y Reconocimientos Oficiales
                </h2>
                <p className="text-xs text-slate-400">
                  Emitidos por la Dirección General de Larry González con validación electrónica
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                {studentCerts.length} Otorgados
              </span>
            </div>

            {studentCerts.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl">
                <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <div className="font-bold text-white text-sm">Sin certificados emitidos aún</div>
                <p className="text-xs text-slate-400 mt-1">
                  Los certificados son asignados exclusivamente por la Dirección General.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentCerts.map((cert) => (
                  <div key={cert.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded">
                        {cert.category === 'grade' ? 'Calificación / Nota' : 'Reconocimiento'}
                      </span>
                      <h3 className="font-bold text-white text-sm font-heading mt-2 mb-1">{cert.title}</h3>
                      <p className="text-xs text-slate-400 mb-3">{cert.description}</p>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {cert.issue_date || cert.issueDate} • Cód: {cert.certificate_code || cert.code}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
                    >
                      Ver Diploma e Imprimir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="glass-card p-6 sm:p-7 rounded-2xl space-y-4">
            <h2 className="text-base font-bold font-heading text-white">
              Historial de Inasistencias y Faltas
            </h2>
            {studentAtts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic">
                Asistencia íntegra. No posees inasistencias registradas.
              </div>
            ) : (
              <div className="space-y-3">
                {studentAtts.map((att) => (
                  <div key={att.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{att.subject} • {att.date}</div>
                      <div className="text-slate-400 mt-0.5">{att.notes}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      {att.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: RECUERDOS (Students Upload Directly with Image Files) */}
        {activeSubTab === 'memories' && (
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">Anuario y Recuerdos de Mi Año</h2>
                <p className="text-xs text-slate-400">
                  Sube tus fotos y momentos compartidos con tus compañeros de clase
                </p>
              </div>

              <button
                onClick={() => setMemoryModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Subir Mi Recuerdo</span>
              </button>
            </div>

            {memories.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl">
                <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <div className="font-bold text-white text-sm">Aún no hay recuerdos publicados</div>
                <p className="text-xs text-slate-400 mt-1">
                  Sé el primero de tu promoción en subir una fotografía al anuario escolar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {memories.map((m) => (
                  <div key={m.id} className="glass-card rounded-2xl overflow-hidden text-xs">
                    <div className="h-44 overflow-hidden relative">
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-medium backdrop-blur-xs">
                        {m.gradeYear || m.grade_year || 'Bachillerato'} • {m.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-white text-sm mb-1">{m.title}</div>
                      <p className="text-slate-400 leading-relaxed mb-3">{m.description}</p>
                      <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                        <span>Por: {m.authorName || m.author_name || 'Estudiante'}</span>
                        <span>{m.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: STUDENT PROFILE & PHOTO EDIT */}
        {activeSubTab === 'profile' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 max-w-2xl">
            <h2 className="text-base font-bold font-heading text-white">Datos Personales del Estudiante</h2>

            {/* Direct Avatar Upload */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              {student.avatar ? (
                <img src={student.avatar} alt="Avatar" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <User className="w-7 h-7" />
                </div>
              )}
              <div>
                <div className="font-bold text-white text-sm mb-1">Foto de Perfil</div>
                <p className="text-xs text-slate-400 mb-2">Selecciona un archivo desde tu dispositivo</p>
                <button
                  type="button"
                  onClick={() => profilePhotoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Foto Directamente</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 block mb-0.5">Nombre Completo</label>
                <div className="font-bold text-white text-sm">{student.name}</div>
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Cédula de Identidad</label>
                <div className="font-bold text-white text-sm">{student.studentIdNumber || 'Sin registrar'}</div>
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Año y Sección</label>
                <div className="font-bold text-white text-sm">{student.gradeLevel || 'Sin asignar'}</div>
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Correo Electrónico</label>
                <div className="font-bold text-white text-sm">{student.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Memory Upload Modal */}
      {memoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold font-heading text-white mb-4">
              Subir Foto o Recuerdo al Anuario
            </h3>

            <form onSubmit={handleSaveMemory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Encuentro Deportivo en Colinas del Neverí"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Categoría</label>
                <select
                  value={memoryForm.category}
                  onChange={(e) => setMemoryForm({ ...memoryForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Proyectos">Proyectos y Ciencia</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Eventos">Eventos y Aniversario</option>
                  <option value="Vida Escolar">Vida Escolar</option>
                </select>
              </div>

              {/* Direct File Upload Button */}
              <div>
                <label className="block text-slate-400 mb-1">Fotografía del Recuerdo</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => memoryFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white font-medium flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Seleccionar Archivo de Foto</span>
                  </button>
                  <input
                    type="file"
                    ref={memoryFileInputRef}
                    accept="image/*"
                    onChange={handleMemoryFileChange}
                    className="hidden"
                  />
                  {memoryImagePreview && (
                    <span className="text-[11px] text-emerald-400 font-medium">Foto cargada</span>
                  )}
                </div>

                {memoryImagePreview && (
                  <div className="mt-2.5 h-28 rounded-lg overflow-hidden border border-slate-700">
                    <img src={memoryImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descripción / Anécdota</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escribe qué pasó en este momento..."
                  value={memoryForm.description}
                  onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMemoryModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg"
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
    </div>
  );
}
