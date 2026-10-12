import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Building,
  ChevronRight,
  ShieldCheck,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TeacherPortal() {
  const {
    currentUser,
    setTargetAuthRole,
    setAuthModalOpen,
    students,
    subjects,
    classrooms,
    grades,
    addOrUpdateGrade,
    deleteGrade,
    evaluationPlans,
    addEvaluationPlan,
    deleteEvaluationPlan,
    schedules,
    addScheduleBlock,
    attendances,
    recordAttendance,
    institution,
    notify
  } = useApp();

  // Guard: Ensure user is authenticated as teacher
  if (!currentUser || currentUser.role !== 'teacher') {
    return (
      <div className="min-h-screen denim-pattern text-slate-100 flex items-center justify-center p-4">
        <div className="denim-card p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#223C63] border-2 border-[#DCB35C] flex items-center justify-center mx-auto text-[#DCB35C] shadow-lg">
            <School className="w-8 h-8 text-[#DCB35C]" />
          </div>
          <h2 className="text-xl font-bold font-slab text-white">Portal de Docentes</h2>
          <p className="text-xs text-slate-300">
            Para consultar tu carga horaria, aulas y registrar calificaciones o planes de evaluación, debes iniciar sesión con tu cuenta oficial de docente.
          </p>
          <button
            onClick={() => {
              setTargetAuthRole('teacher');
              setAuthModalOpen(true);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-lg text-xs shadow-md cursor-pointer hover:brightness-105 transition"
          >
            Iniciar Sesión como Docente
          </button>
        </div>
      </div>
    );
  }

  const [activeSubTab, setActiveSubTab] = useState('my-schedule'); // 'my-schedule', 'grades', 'plans', 'attendance'
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '');
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');

  const currentTeacher = {
    id: currentUser.id || 'teacher-temp',
    name: currentUser.full_name || currentUser.name || 'Docente Titular',
    email: currentUser.email || 'docente@integralvenezuela.edu.ve',
    specialty: currentUser.specialty || 'Educación Media General',
    avatar: currentUser.avatar || currentUser.avatar_url || ''
  };

  const activeYear = institution.currentSchoolYear || '2027-2028';

  // Schedules for this teacher
  const myTeacherSchedules = schedules.filter(
    (s) =>
      s.teacherId === currentTeacher.id ||
      (currentTeacher.name && s.teacher_name?.toLowerCase().includes(currentTeacher.name.toLowerCase())) ||
      (currentTeacher.name && s.teacher?.toLowerCase().includes(currentTeacher.name.toLowerCase()))
  );

  // Free module modal state
  const [freeModuleModalOpen, setFreeModuleModalOpen] = useState(false);
  const [freeModuleForm, setFreeModuleForm] = useState({
    day: 'Lunes',
    time: '07:00 - 08:30 AM',
    notes: 'Módulo libre para planificación y atención al estudiante'
  });

  // Grade Form State (Selectors for student & subject)
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradeFormData, setGradeFormData] = useState({
    id: null,
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    subjectName: subjects[0]?.name || '',
    evaluationTitle: '',
    score: 20,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    comments: ''
  });

  // Plan Form State (Empty by default)
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planFormData, setPlanFormData] = useState({
    subjectName: subjects[0]?.name || '',
    unit_title: '',
    strategy: 'Evaluación Escrita',
    instrument: 'Escala de Estimación',
    percentage: 20,
    lapso: 1,
    evaluation_date: new Date().toISOString().split('T')[0]
  });

  // Attendance Form State (Selector for student)
  const [attModalOpen, setAttModalOpen] = useState(false);
  const [attendanceFormData, setAttendanceFormData] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    date: new Date().toISOString().split('T')[0],
    status: 'ausente',
    reason: '',
  });

  // Handle Free Module submit
  const handleFreeModuleSubmit = (e) => {
    e.preventDefault();
    addScheduleBlock({
      day: freeModuleForm.day,
      time: freeModuleForm.time,
      subject: 'Módulo Libre / Planificación',
      subject_name: 'Módulo Libre / Planificación',
      teacher: currentTeacher.name,
      teacher_name: currentTeacher.name,
      classroom: 'Sala de Profesores',
      entry_type: 'free_module',
      notes: freeModuleForm.notes
    });
    setFreeModuleModalOpen(false);
  };

  // Handle Grade submit
  const handleGradeSubmit = (e) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === gradeFormData.studentId);
    addOrUpdateGrade({
      ...gradeFormData,
      studentName: stu ? stu.name : gradeFormData.studentName,
      score: Number(gradeFormData.score)
    });
    setGradeModalOpen(false);
  };

  // Handle Plan submit
  const handlePlanSubmit = (e) => {
    e.preventDefault();
    addEvaluationPlan(planFormData);
    setPlanModalOpen(false);
  };

  // Handle Attendance submit
  const handleAttSubmit = (e) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === attendanceFormData.studentId);
    recordAttendance({
      ...attendanceFormData,
      studentName: stu ? stu.name : attendanceFormData.studentName
    });
    setAttModalOpen(false);
  };

  return (
    <div className="min-h-screen denim-pattern text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Profile Summary */}
        <div className="denim-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            {currentTeacher.avatar ? (
              <img
                src={currentTeacher.avatar}
                alt={currentTeacher.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#DCB35C] shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#223C63] border-2 border-[#DCB35C] flex items-center justify-center text-[#DCB35C] shadow-lg">
                <School className="w-8 h-8 text-[#DCB35C]" />
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-2 denim-patch px-2.5 py-0.5 text-[11px] mb-1">
                <Sparkles className="w-3 h-3 text-[#DCB35C]" />
                <span>Portal del Docente Titular</span>
                <span className="text-slate-500">•</span>
                <span className="text-white font-semibold">Año Escolar {activeYear}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-slab text-white tracking-tight">
                {currentTeacher.name}
              </h1>
              <p className="text-xs text-slate-300 font-mono">
                {currentTeacher.email} • {currentTeacher.specialty || 'Área Pedagógica'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setFreeModuleModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Coffee className="w-4 h-4" />
              <span>Agregar Módulo Libre</span>
            </button>
            <button
              onClick={() => setGradeModalOpen(true)}
              className="px-3.5 py-2.5 bg-[#101c30] hover:bg-[#1A2B45] text-white border border-stitch-subtle rounded-xl text-xs font-bold font-slab flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#DCB35C]" />
              <span>Registrar Nota</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3 text-xs font-medium">
          {[
            { id: 'my-schedule', label: 'Mi Horario y Aulas', icon: Clock },
            { id: 'grades', label: 'Cargar Calificaciones', icon: BookOpen },
            { id: 'plans', label: 'Planes de Evaluación', icon: Calendar },
            { id: 'attendance', label: 'Control de Inasistencias', icon: FileText },
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

        {/* SUBTAB: MY SCHEDULE & CLASSROOMS */}
        {activeSubTab === 'my-schedule' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Mi Horario de Clases y Módulos</h2>
                <p className="text-xs text-slate-400">
                  Carga horaria asignada y módulos libres del Año Escolar {activeYear}
                </p>
              </div>
              <button
                onClick={() => setFreeModuleModalOpen(true)}
                className="px-3.5 py-2 bg-[#223C63] hover:bg-[#1A2B45] text-[#f0c36d] border border-[#DCB35C]/40 rounded-lg text-xs font-bold font-slab flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Módulo Libre al Horario</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
                const dayBlocks = schedules.filter((s) => s.day_of_week === day || s.day === day);
                return (
                  <div key={day} className="p-3.5 rounded-lg bg-[#101c30] border border-slate-700 space-y-2.5">
                    <div className="font-bold font-slab text-sm text-[#f0c36d] border-b border-slate-800 pb-1">{day}</div>
                    {dayBlocks.length === 0 ? (
                      <div className="text-[11px] text-slate-500 italic py-2">Sin horas</div>
                    ) : (
                      dayBlocks.map((b) => {
                        const isRecess = b.entry_type === 'recess' || b.subject_name?.toLowerCase().includes('receso') || b.subject?.toLowerCase().includes('receso');
                        const isDayOff = b.entry_type === 'day_off';
                        const isFree = b.entry_type === 'free_module';
                        const title = isRecess ? 'Receso' : (isDayOff ? 'Día Libre' : (isFree ? (b.subject_name || b.subject || 'Módulo Libre') : (b.subject_name || b.subject || 'Clase Regular')));

                        return (
                          <div
                            key={b.id}
                            className={`p-2 rounded-lg border text-xs space-y-0.5 ${
                              isFree
                                ? 'bg-blue-950/40 border-blue-400/40 text-blue-200'
                                : isRecess
                                ? 'bg-amber-950/40 border-amber-400/40 text-amber-200'
                                : isDayOff
                                ? 'bg-rose-950/40 border-rose-400/40 text-rose-200'
                                : 'bg-[#16253c] border-slate-700 text-slate-200'
                            }`}
                          >
                            <div className="font-bold text-white text-xs flex items-center justify-between">
                              <span>{title}</span>
                              {isRecess && (
                                <span className="text-[9px] bg-amber-500/20 text-[#f0c36d] px-1 py-0.2 rounded font-mono">
                                  Receso
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{b.start_time || b.time?.split('-')[0]?.trim()} - {b.end_time || b.time?.split('-')[1]?.trim() || b.time}</div>
                            {b.classroom_name && <div className="text-[10px] text-[#DCB35C]">Aula: {b.classroom_name}</div>}
                            {b.notes && <div className="text-[10px] text-slate-400 italic">{b.notes}</div>}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB: GRADES (Selectors for student & subject) */}
        {activeSubTab === 'grades' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Registro de Calificaciones Parciales</h2>
                <p className="text-xs text-slate-400">Selecciona al alumno matriculado y la asignatura a evaluar</p>
              </div>
              <button
                onClick={() => setGradeModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Asignar Calificación</span>
              </button>
            </div>

            {grades.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-slate-300 font-slab">No has registrado notas aún</div>
                <p className="text-xs text-slate-500 mt-1">Usa el botón de arriba para registrar notas a los alumnos matriculados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#101c30] text-[#f0c36d] border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3 font-slab">Estudiante</th>
                      <th className="py-2.5 px-3 font-slab">Asignatura</th>
                      <th className="py-2.5 px-3 font-slab">Evaluación</th>
                      <th className="py-2.5 px-3 text-center font-slab">Lapso</th>
                      <th className="py-2.5 px-3 text-center font-slab">Calificación</th>
                      <th className="py-2.5 px-3 text-right font-slab">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {grades.map((g) => (
                      <tr key={g.id} className="hover:bg-[#1A2B45]/50 transition">
                        <td className="py-2.5 px-3 font-bold text-white">{g.studentName || g.student_name}</td>
                        <td className="py-2.5 px-3 text-slate-300">{g.subjectName || g.subject_name}</td>
                        <td className="py-2.5 px-3 text-slate-400">{g.evaluationTitle || g.evaluation_title}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">{g.term || `${g.lapso}° Lapso`}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-[#f0c36d] text-sm">
                          {g.score || g.nota} / 20
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => deleteGrade(g.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: EVALUATION PLANS */}
        {activeSubTab === 'plans' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Planes de Evaluación</h2>
                <p className="text-xs text-slate-400">Cronograma de unidades, estrategias y porcentajes</p>
              </div>
              <button
                onClick={() => setPlanModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Plan</span>
              </button>
            </div>

            {evaluationPlans.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-slate-300 font-slab">No hay planes de evaluación publicados</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {evaluationPlans.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-[#101c30] border border-slate-700 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="denim-patch px-2 py-0.5 text-[10px]">{p.subject_name || p.subjectName}</span>
                        <h3 className="font-bold text-white text-sm font-slab mt-1">{p.unit_title || p.title}</h3>
                      </div>
                      <span className="font-mono font-bold text-[#f0c36d]">{p.percentage}%</span>
                    </div>
                    <div className="text-slate-400">Estrategia: {p.strategy || p.type}</div>
                    <div className="text-slate-500 font-mono text-[11px]">Fecha: {p.evaluation_date || p.dueDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Control de Asistencia y Faltas</h2>
                <p className="text-xs text-slate-400">Registra inasistencias de los estudiantes a tus cátedras</p>
              </div>
              <button
                onClick={() => setAttModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Inasistencia</span>
              </button>
            </div>

            {attendances.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-slate-300 font-slab">No hay inasistencias registradas</div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {attendances.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-[#101c30] border border-slate-700 flex justify-between items-center">
                    <div>
                      <strong className="text-white font-slab">{a.studentName || a.student_name}</strong>
                      <div className="text-slate-400">{a.reason || a.notes}</div>
                    </div>
                    <span className="font-mono text-slate-400">{a.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: MÓDULO LIBRE */}
      {freeModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">Agregar Módulo Libre</h3>
              <button onClick={() => setFreeModuleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFreeModuleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Día</label>
                  <select
                    value={freeModuleForm.day}
                    onChange={(e) => setFreeModuleForm({ ...freeModuleForm, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Horario</label>
                  <input
                    type="text"
                    required
                    placeholder="07:00 - 08:30 AM"
                    value={freeModuleForm.time}
                    onChange={(e) => setFreeModuleForm({ ...freeModuleForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Propósito del Módulo Libre</label>
                <input
                  type="text"
                  required
                  placeholder="Planificación pedagógica / Atención a estudiantes..."
                  value={freeModuleForm.notes}
                  onChange={(e) => setFreeModuleForm({ ...freeModuleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setFreeModuleModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  Guardar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CARGAR NOTA (Selectores Requisito 6) */}
      {gradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">Asignar Calificación</h3>
              <button onClick={() => setGradeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3.5 text-xs">
              {/* Selector de Estudiante */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Estudiante a Calificar (Selector)</label>
                <select
                  value={gradeFormData.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    setGradeFormData({
                      ...gradeFormData,
                      studentId: e.target.value,
                      studentName: st ? st.name : ''
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.grade_year || s.gradeLevel})</option>
                  ))}
                </select>
              </div>

              {/* Selector de Asignatura */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Asignatura (Selector)</label>
                <select
                  value={gradeFormData.subjectName}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, subjectName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.gradeLevel})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Título de la Evaluación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Examen Parcial de Álgebra"
                  value={gradeFormData.evaluationTitle}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, evaluationTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Calificación (0 - 20 Puntos)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    required
                    value={gradeFormData.score}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, score: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Lapso Académico</label>
                  <select
                    value={gradeFormData.term}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, term: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="1er Lapso">1er Lapso</option>
                    <option value="2do Lapso">2do Lapso</option>
                    <option value="3er Lapso">3er Lapso</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  Guardar Calificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INASISTENCIA (Selector Requisito 6) */}
      {attModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">Registrar Inasistencia</h3>
              <button onClick={() => setAttModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Estudiante (Selector)</label>
                <select
                  value={attendanceFormData.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    setAttendanceFormData({
                      ...attendanceFormData,
                      studentId: e.target.value,
                      studentName: st ? st.name : ''
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.grade_year || s.gradeLevel})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Motivo u Observación</label>
                <input
                  type="text"
                  required
                  value={attendanceFormData.reason}
                  onChange={(e) => setAttendanceFormData({ ...attendanceFormData, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setAttModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  Guardar Inasistencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PLAN DE EVALUACIÓN */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">Publicar Plan de Evaluación</h3>
              <button onClick={() => setPlanModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlanSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Asignatura (Selector)</label>
                <select
                  value={planFormData.subjectName}
                  onChange={(e) => setPlanFormData({ ...planFormData, subjectName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.gradeLevel})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Unidad o Contenido</label>
                <input
                  type="text"
                  required
                  value={planFormData.unit_title}
                  onChange={(e) => setPlanFormData({ ...planFormData, unit_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Estrategia</label>
                  <input
                    type="text"
                    required
                    value={planFormData.strategy}
                    onChange={(e) => setPlanFormData({ ...planFormData, strategy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Ponderación (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={planFormData.percentage}
                    onChange={(e) => setPlanFormData({ ...planFormData, percentage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  Publicar Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
