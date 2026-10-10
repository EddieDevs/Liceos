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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TeacherPortal() {
  const {
    currentUser,
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
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('my-schedule'); // 'my-schedule', 'grades', 'plans', 'attendance'
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '');
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');

  const currentTeacher = currentUser || {
    id: 'teacher-temp',
    name: 'Docente Titular',
    email: 'docente@integralvenezuela.edu.ve',
    department: 'Ciencias y Humanidades'
  };

  // Schedules for this teacher
  const myTeacherSchedules = schedules.filter(
    (s) =>
      s.teacherId === currentTeacher.id ||
      (currentTeacher.name && s.teacher?.toLowerCase().includes(currentTeacher.name.toLowerCase()))
  );

  // Free module modal state (Teachers can add free modules as requested!)
  const [freeModuleModalOpen, setFreeModuleModalOpen] = useState(false);
  const [freeModuleForm, setFreeModuleForm] = useState({
    day: 'Lunes',
    time: '07:00 - 08:30 AM',
    notes: 'Hora libre para planificación pedagógica'
  });

  // Grade Form State
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradeFormData, setGradeFormData] = useState({
    id: null,
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    subjectName: subjects[0]?.name || '',
    evaluationTitle: '',
    score: 18,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    comments: ''
  });

  // Plan Form State
  const [planFormData, setPlanFormData] = useState({
    subjectName: subjects[0]?.name || '',
    title: '',
    description: '',
    dueDate: '',
    percentage: 20,
    term: '1er Lapso',
    type: 'Examen Escrito Individual'
  });

  // Attendance Form State
  const [attendanceFormData, setAttendanceFormData] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    subject: subjects[0]?.name || '',
    date: new Date().toISOString().split('T')[0],
    status: 'absent',
    notes: 'Inasistencia a clase sin justificación previa.',
  });

  const handleOpenGradeModal = (existing = null) => {
    if (existing) {
      setGradeFormData({ ...existing });
    } else {
      setGradeFormData({
        id: null,
        studentId: students[0]?.id || '',
        studentName: students[0]?.name || '',
        subjectName: selectedSubject || subjects[0]?.name || '',
        evaluationTitle: '',
        score: 18,
        maxScore: 20,
        percentage: 20,
        term: selectedTerm,
        comments: ''
      });
    }
    setGradeModalOpen(true);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === gradeFormData.studentId) || { name: gradeFormData.studentName };
    await addOrUpdateGrade({
      ...gradeFormData,
      studentName: st.name,
      score: Number(gradeFormData.score),
      maxScore: Number(gradeFormData.maxScore),
      percentage: Number(gradeFormData.percentage)
    });
    setGradeModalOpen(false);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    await addEvaluationPlan({
      ...planFormData,
      percentage: Number(planFormData.percentage)
    });
    setPlanFormData({
      subjectName: selectedSubject || subjects[0]?.name || '',
      title: '',
      description: '',
      dueDate: '',
      percentage: 20,
      term: selectedTerm,
      type: 'Examen Escrito Individual'
    });
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === attendanceFormData.studentId) || { name: attendanceFormData.studentName };
    await recordAttendance({
      ...attendanceFormData,
      studentName: st.name,
      statusLabel: attendanceFormData.status === 'absent' ? 'Falta Injustificada' : 'Falta Justificada',
      sentTo: st.email
    });
  };

  const handleSaveFreeModule = async (e) => {
    e.preventDefault();
    await addScheduleBlock({
      day: freeModuleForm.day,
      time: freeModuleForm.time,
      entry_type: 'free_module',
      subject: 'Módulo Libre',
      classroom: 'Sala de Profesores',
      teacher: currentTeacher.name,
      teacherId: currentTeacher.id,
      notes: freeModuleForm.notes
    });
    setFreeModuleModalOpen(false);
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Portal del Docente</span>
          </div>

          <div className="glass-surface p-6 sm:p-7 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[11px] font-semibold border border-blue-400/20 inline-block mb-1">
                  Cuerpo Docente Titular
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">{currentTeacher.name}</h1>
                <p className="text-xs text-slate-400">
                  {currentTeacher.email} • Departamento Pedagógico
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center w-full md:w-auto">
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-white">{myTeacherSchedules.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Mis Bloques</div>
              </div>
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-white">{students.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Alumnos</div>
              </div>
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-blue-400">{evaluationPlans.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Planes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="glass-surface rounded-xl p-1 flex gap-1 overflow-x-auto text-xs font-semibold shadow-md">
          <button
            onClick={() => setActiveSubTab('my-schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'my-schedule' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mi Horario y Aulas Asignadas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('grades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'grades' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cargar y Modificar Calificaciones</span>
          </button>

          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'plans' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Subir Planes de Evaluación</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Notificar Faltas de Estudiantes</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SUBTAB 1: MI HORARIO DE PROFESOR Y AULAS + MODULO LIBRE */}
        {activeSubTab === 'my-schedule' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Mi Cronograma Semanal y Aulas
                </h2>
                <p className="text-xs text-slate-400">
                  Visualiza en qué salón y a qué hora impartes clase, o registra módulos libres
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFreeModuleModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Agregar Módulo Libre</span>
                </button>
              </div>
            </div>

            {/* Matrix of Days */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {daysOfWeek.map((day) => {
                const dayBlocks = myTeacherSchedules.filter((s) => s.day === day || s.day_of_week === day);

                return (
                  <div key={day} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
                    <div className="bg-slate-950 text-slate-200 font-medium text-xs py-2 text-center border-b border-slate-800">
                      {day}
                    </div>
                    <div className="p-2 space-y-2">
                      {dayBlocks.length === 0 ? (
                        <div className="text-xs text-slate-500 py-6 text-center italic">Sin clases</div>
                      ) : (
                        dayBlocks.map((block, idx) => {
                          const isFree = block.entry_type === 'free_module';

                          if (isFree) {
                            return (
                              <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs">
                                <span className="font-medium text-slate-300 block mb-0.5">Módulo Libre</span>
                                <span className="text-[10px] text-slate-400">{block.time}</span>
                                {block.notes && <div className="text-[10px] text-slate-500 mt-1 italic">{block.notes}</div>}
                              </div>
                            );
                          }

                          return (
                            <div key={idx} className="p-3 rounded-lg border border-slate-800 bg-slate-900/90 text-xs">
                              <div className="font-bold text-white mb-0.5">{block.subject}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1.5">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{block.time}</span>
                              </div>
                              <div className="pt-1.5 border-t border-slate-800 text-[10px] flex items-center gap-1 font-medium text-blue-400">
                                <Building className="w-3 h-3" />
                                <span className="truncate">{block.classroom || 'Aula asignada'}</span>
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

        {/* SUBTAB 2: GRADES */}
        {activeSubTab === 'grades' && (
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Carga y Modificación de Notas
                </h2>
                <p className="text-xs text-slate-400">Edita calificaciones y ponderaciones</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {subjects.length > 0 && (
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() => handleOpenGradeModal()}
                  disabled={subjects.length === 0 || students.length === 0}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Nota</span>
                </button>
              </div>
            </div>

            {subjects.length === 0 ? (
              <div className="glass-card p-10 text-center rounded-2xl text-xs text-slate-500 italic">
                El administrador aún no ha cargado asignaturas en la base de datos.
              </div>
            ) : grades.length === 0 ? (
              <div className="glass-card p-10 text-center rounded-2xl text-xs text-slate-500 italic">
                No hay calificaciones cargadas aún. Pulsa en "Nueva Nota".
              </div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                        <th className="py-2.5 px-3">Estudiante</th>
                        <th className="py-2.5 px-3">Evaluación</th>
                        <th className="py-2.5 px-3">Lapso</th>
                        <th className="py-2.5 px-3 text-center">Nota</th>
                        <th className="py-2.5 px-3 text-center">Pond. %</th>
                        <th className="py-2.5 px-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {grades.map((gr) => (
                        <tr key={gr.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-bold text-white">{gr.studentName}</td>
                          <td className="py-3 px-3 text-slate-200">{gr.evaluationTitle}</td>
                          <td className="py-3 px-3 text-slate-400">{gr.term}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded">
                              {gr.score} / {gr.maxScore || 20}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-300 font-medium">{gr.percentage}%</td>
                          <td className="py-3 px-3 text-right space-x-1">
                            <button
                              onClick={() => handleOpenGradeModal(gr)}
                              className="p-1 text-blue-400 hover:bg-slate-800 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteGrade(gr.id)}
                              className="p-1 text-rose-400 hover:bg-slate-800 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: EVALUATION PLANS */}
        {activeSubTab === 'plans' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 glass-card p-6 rounded-2xl">
              <h2 className="text-base font-bold font-heading text-white mb-1">
                Publicar Plan de Evaluación
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Visible inmediatamente para los estudiantes y representantes
              </p>

              <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Materia</label>
                  {subjects.length === 0 ? (
                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-500 border border-slate-800">
                      Sin materias registradas en el sistema
                    </div>
                  ) : (
                    <select
                      value={planFormData.subjectName}
                      onChange={(e) => setPlanFormData({ ...planFormData, subjectName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Título de la Evaluación</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Taller Práctico de Vectores"
                    value={planFormData.title}
                    onChange={(e) => setPlanFormData({ ...planFormData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Ponderación (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={planFormData.percentage}
                      onChange={(e) => setPlanFormData({ ...planFormData, percentage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Fecha Límite</label>
                    <input
                      type="date"
                      required
                      value={planFormData.dueDate}
                      onChange={(e) => setPlanFormData({ ...planFormData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={subjects.length === 0}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-xs transition disabled:opacity-50"
                >
                  Publicar Plan
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-sm font-heading">
                Planes Activos ({evaluationPlans.length})
              </h3>
              {evaluationPlans.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 italic">
                  No hay planes de evaluación activos.
                </div>
              ) : (
                evaluationPlans.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{p.title}</div>
                      <div className="text-slate-400 mt-0.5">{p.subjectName} • {p.dueDate}</div>
                    </div>
                    <span className="font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded h-fit">
                      {p.percentage}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 4: ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 glass-card p-6 rounded-2xl">
              <h2 className="text-base font-bold font-heading text-white mb-1">
                Reportar Inasistencia de Alumno
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                La notificación se transmite automáticamente al representante
              </p>

              <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Alumno</label>
                  {students.length === 0 ? (
                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-500 border border-slate-800">
                      Sin estudiantes inscritos actualmente
                    </div>
                  ) : (
                    <select
                      value={attendanceFormData.studentId}
                      onChange={(e) => {
                        const st = students.find((s) => s.id === e.target.value);
                        setAttendanceFormData({
                          ...attendanceFormData,
                          studentId: e.target.value,
                          studentName: st?.name || ''
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Materia</label>
                    <select
                      value={attendanceFormData.subject}
                      onChange={(e) => setAttendanceFormData({ ...attendanceFormData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Condición</label>
                    <select
                      value={attendanceFormData.status}
                      onChange={(e) => setAttendanceFormData({ ...attendanceFormData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="absent">Falta Injustificada</option>
                      <option value="justified">Falta Justificada</option>
                      <option value="late">Tardanza</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Observaciones</label>
                  <textarea
                    rows={2}
                    value={attendanceFormData.notes}
                    onChange={(e) => setAttendanceFormData({ ...attendanceFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={students.length === 0}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg shadow-xs transition disabled:opacity-50"
                >
                  Registrar y Notificar
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-sm font-heading">
                Inasistencias Registradas ({attendances.length})
              </h3>
              {attendances.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 italic">
                  No hay inasistencias reportadas en tu área.
                </div>
              ) : (
                attendances.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{a.studentName}</div>
                      <div className="text-slate-400 mt-0.5">{a.subject} • {a.date}</div>
                    </div>
                    <span className="font-bold text-rose-400 bg-rose-950 border border-rose-800 px-2 py-0.5 rounded h-fit">
                      {a.statusLabel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Free Module Modal for Teachers */}
      {freeModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold font-heading text-white mb-4">
              Bloquear Módulo Libre
            </h3>
            <form onSubmit={handleSaveFreeModule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Día de la Semana</label>
                  <select
                    value={freeModuleForm.day}
                    onChange={(e) => setFreeModuleForm({ ...freeModuleForm, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Horario del Módulo</label>
                  <input
                    type="text"
                    required
                    placeholder="07:00 - 08:30 AM"
                    value={freeModuleForm.time}
                    onChange={(e) => setFreeModuleForm({ ...freeModuleForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Motivo / Notas</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Planificación de evaluaciones"
                  value={freeModuleForm.notes}
                  onChange={(e) => setFreeModuleForm({ ...freeModuleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFreeModuleModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg"
                >
                  Guardar Módulo Libre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold font-heading text-white mb-4">
              {gradeFormData.id ? 'Modificar Calificación' : 'Registrar Calificación'}
            </h3>
            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Estudiante</label>
                <select
                  value={gradeFormData.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    setGradeFormData({
                      ...gradeFormData,
                      studentId: e.target.value,
                      studentName: st?.name || ''
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Título de la Evaluación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Examen Parcial I"
                  value={gradeFormData.evaluationTitle}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, evaluationTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Calificación (0 - 20)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    required
                    value={gradeFormData.score}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, score: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-blue-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Ponderación %</label>
                  <input
                    type="number"
                    value={gradeFormData.percentage}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, percentage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
