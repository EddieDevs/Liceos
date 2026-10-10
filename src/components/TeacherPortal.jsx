import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  PlusCircle,
  Edit2,
  Trash2,
  Building,
  Upload,
  ChevronRight,
  ShieldCheck,
  Send,
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TeacherPortal() {
  const {
    currentUser,
    teacher,
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
    attendances,
    recordAttendance,
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('my-schedule'); // 'my-schedule', 'grades', 'plans', 'attendance'
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].name);
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');

  const currentTeacher = currentUser?.role === 'teacher' ? currentUser : teacher;

  // Filter schedules specifically for this teacher
  const myTeacherSchedules = schedules.filter(
    (s) =>
      s.teacherId === currentTeacher.id ||
      s.teacher?.toLowerCase().includes('carlos') ||
      (currentTeacher.name && s.teacher?.toLowerCase().includes(currentTeacher.name.toLowerCase()))
  );

  // Grade Form State
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradeFormData, setGradeFormData] = useState({
    id: null,
    studentId: students[0].id,
    studentName: students[0].name,
    subjectName: subjects[0].name,
    evaluationTitle: '',
    score: 18,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    comments: ''
  });

  // Plan Form State
  const [planFormData, setPlanFormData] = useState({
    subjectName: subjects[0].name,
    title: '',
    description: '',
    dueDate: '',
    percentage: 20,
    term: '1er Lapso',
    type: 'Examen Escrito'
  });

  // Attendance Form State
  const [attendanceFormData, setAttendanceFormData] = useState({
    studentId: students[0].id,
    studentName: students[0].name,
    subject: subjects[0].name,
    date: new Date().toISOString().split('T')[0],
    status: 'absent',
    notes: 'Inasistencia a clase sin aviso previo.',
  });

  const handleOpenGradeModal = (existing = null) => {
    if (existing) {
      setGradeFormData({ ...existing });
    } else {
      setGradeFormData({
        id: null,
        studentId: students[0].id,
        studentName: students[0].name,
        subjectName: selectedSubject,
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
    const st = students.find((s) => s.id === gradeFormData.studentId) || students[0];
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
      subjectName: selectedSubject,
      title: '',
      description: '',
      dueDate: '',
      percentage: 20,
      term: selectedTerm,
      type: 'Examen Escrito'
    });
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === attendanceFormData.studentId) || students[0];
    await recordAttendance({
      ...attendanceFormData,
      studentName: st.name,
      statusLabel: attendanceFormData.status === 'absent' ? 'Falta Injustificada' : 'Falta Justificada',
      sentTo: st.email
    });
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Top Header */}
      <div className="bg-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
              Inicio
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Portal del Docente</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/70">
            <div className="flex items-center gap-4">
              <img
                src={currentTeacher.avatar || teacher.avatar}
                alt="Docente"
                className="w-16 h-16 rounded-xl object-cover border border-slate-600"
              />
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-400/20 inline-block mb-1">
                  Cuerpo Docente Titular
                </span>
                <h1 className="text-2xl font-bold font-heading text-white">{currentTeacher.name}</h1>
                <p className="text-xs text-slate-300">
                  {teacher.department} • Asignado a: 4to Año "A"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-white font-heading">{myTeacherSchedules.length}</div>
                <div className="text-[10px] text-slate-400 uppercase">Bloques/Semana</div>
              </div>
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-white font-heading">{students.length}</div>
                <div className="text-[10px] text-slate-400 uppercase">Estudiantes</div>
              </div>
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-blue-400 font-heading">{evaluationPlans.length}</div>
                <div className="text-[10px] text-slate-400 uppercase">Planes Activos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1 flex gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('my-schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'my-schedule' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mi Horario y Aulas Asignadas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('grades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'grades' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cargar y Modificar Calificaciones</span>
          </button>

          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'plans' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Subir Planes de Evaluación</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'attendance' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Notificar Faltas de Estudiantes</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SUBTAB 1: MI HORARIO DE PROFESOR Y AULAS */}
        {activeSubTab === 'my-schedule' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Horario de Clases del Docente
                </h2>
                <p className="text-xs text-slate-500">
                  Consulta tus días de guardia, materias y en qué aula te corresponde impartir cada clase
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-medium border border-blue-200">
                  {currentTeacher.name} • 4to Año de Bachillerato
                </span>
              </div>
            </div>

            {/* Weekly Schedule by Days for the Teacher */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {daysOfWeek.map((day) => {
                const dayBlocks = myTeacherSchedules.filter((s) => s.day === day);
                return (
                  <div key={day} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-900 text-white font-medium text-xs py-2.5 text-center">
                      {day}
                    </div>
                    <div className="p-2 space-y-2">
                      {dayBlocks.length === 0 ? (
                        <div className="text-xs text-slate-400 py-6 text-center italic">
                          Sin clases este día
                        </div>
                      ) : (
                        dayBlocks.map((block, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs hover:border-blue-300 transition"
                          >
                            <div className="font-bold text-slate-900 mb-1">{block.subject}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{block.time}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 text-[11px] flex items-center gap-1.5 font-medium text-blue-700">
                              <Building className="w-3.5 h-3.5" />
                              <span className="truncate">{block.classroom}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Catálogo de Aulas del Colegio */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Directorio y Ubicación de Aulas Disponibles en el Colegio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {classrooms.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="font-bold text-slate-800">{c.name}</div>
                    <div className="text-blue-700 font-mono text-[11px] mt-0.5">{c.code}</div>
                    <div className="text-slate-500 text-[11px] mt-1">{c.floor} • Cap: {c.capacity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: GRADES */}
        {activeSubTab === 'grades' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Carga y Modificación de Calificaciones
                </h2>
                <p className="text-xs text-slate-500">
                  Edita puntuaciones parciales y registra comentarios cualitativos
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50"
                >
                  <option value="1er Lapso">1er Lapso</option>
                  <option value="2do Lapso">2do Lapso</option>
                  <option value="3er Lapso">3er Lapso</option>
                </select>

                <button
                  onClick={() => handleOpenGradeModal()}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nueva Nota</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Estudiante</th>
                      <th className="py-3 px-3">Evaluación</th>
                      <th className="py-3 px-3">Lapso</th>
                      <th className="py-3 px-3 text-center">Nota</th>
                      <th className="py-3 px-3 text-center">Pond. %</th>
                      <th className="py-3 px-3">Observaciones</th>
                      <th className="py-3 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grades.filter((g) => g.subjectName === selectedSubject).map((gr) => (
                      <tr key={gr.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">{gr.studentName}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{gr.evaluationTitle}</td>
                        <td className="py-3 px-3 text-slate-500">{gr.term}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {gr.score} / {gr.maxScore || 20}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-slate-600">{gr.percentage}%</td>
                        <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{gr.comments || '—'}</td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenGradeModal(gr)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteGrade(gr.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Eliminar"
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
          </div>
        )}

        {/* SUBTAB 3: EVALUATION PLANS */}
        {activeSubTab === 'plans' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 font-heading mb-1">
                Publicar Plan de Evaluación
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Visible inmediatamente para los estudiantes y sus representantes
              </p>

              <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Materia</label>
                  <select
                    value={planFormData.subjectName}
                    onChange={(e) => setPlanFormData({ ...planFormData, subjectName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Título de la Evaluación</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Taller Práctico de Vectores"
                    value={planFormData.title}
                    onChange={(e) => setPlanFormData({ ...planFormData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Ponderación (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={planFormData.percentage}
                      onChange={(e) => setPlanFormData({ ...planFormData, percentage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Fecha de Entrega</label>
                    <input
                      type="date"
                      required
                      value={planFormData.dueDate}
                      onChange={(e) => setPlanFormData({ ...planFormData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tipo de Actividad</label>
                  <select
                    value={planFormData.type}
                    onChange={(e) => setPlanFormData({ ...planFormData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Examen Escrito Individual">Examen Escrito Individual</option>
                    <option value="Taller Práctico Grupal">Taller Práctico Grupal</option>
                    <option value="Práctica de Laboratorio">Práctica de Laboratorio</option>
                    <option value="Proyecto y Defensa">Proyecto y Defensa</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition"
                >
                  Publicar Plan
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Planes Vigentes ({evaluationPlans.length})
              </h3>
              {evaluationPlans.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <div className="text-slate-500 mt-0.5">{p.subjectName} • {p.dueDate}</div>
                  </div>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded h-fit">
                    {p.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 font-heading mb-1">
                Reportar Inasistencia de Alumno
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                La notificación se transmite directamente al correo del representante
              </p>

              <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Alumno</label>
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.studentIdNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Materia</label>
                    <select
                      value={attendanceFormData.subject}
                      onChange={(e) => setAttendanceFormData({ ...attendanceFormData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Condición</label>
                    <select
                      value={attendanceFormData.status}
                      onChange={(e) => setAttendanceFormData({ ...attendanceFormData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="absent">Falta Injustificada</option>
                      <option value="justified">Falta Justificada</option>
                      <option value="late">Tardanza</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Observaciones</label>
                  <textarea
                    rows={2}
                    value={attendanceFormData.notes}
                    onChange={(e) => setAttendanceFormData({ ...attendanceFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg shadow-xs transition"
                >
                  Registrar y Notificar
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Inasistencias Registradas ({attendances.length})
              </h3>
              {attendances.map((a) => (
                <div key={a.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{a.studentName}</div>
                    <div className="text-slate-500 mt-0.5">{a.subject} • {a.date}</div>
                  </div>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded h-fit">
                    {a.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grade Edit Modal */}
      {gradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              {gradeFormData.id ? 'Modificar Calificación' : 'Registrar Calificación'}
            </h3>
            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Estudiante</label>
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
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.studentIdNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Título de la Evaluación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Examen Parcial I"
                  value={gradeFormData.evaluationTitle}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, evaluationTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Calificación (0 - 20)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    required
                    value={gradeFormData.score}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, score: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ponderación %</label>
                  <input
                    type="number"
                    value={gradeFormData.percentage}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, percentage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Comentarios al Alumno</label>
                <textarea
                  rows={2}
                  value={gradeFormData.comments}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, comments: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
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
