import React, { useState } from 'react';
import {
  School,
  BookOpen,
  Calendar,
  Award,
  Clock,
  FileText,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Send,
  Users,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Save,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CertificateModal from './CertificateModal';

export default function TeacherPortal() {
  const {
    currentUser,
    teacher,
    students,
    subjects,
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
    certificates,
    issueCertificate,
    memories,
    addMemory,
    announcements,
    addAnnouncement,
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('grades'); // 'grades', 'plans', 'attendance', 'certificates', 'schedules', 'memories', 'announcements'
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].name);
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');

  // Grade Form State (for adding/editing a grade)
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
    notes: 'Inasistencia sin justificación previa.',
  });

  // Certificate Form State
  const [certFormData, setCertFormData] = useState({
    studentId: students[0].id,
    studentName: students[0].name,
    title: 'Mención de Honor al Rendimiento Académico',
    type: 'honor',
    typeLabel: 'Excelencia Académica',
    gradeLevel: '4to Año de Bachillerato',
    academicYear: '2024 - 2025',
    description: 'Otorgado en reconocimiento por su destacada disciplina académica, entrega y valores institucionales.',
  });

  // Schedule Block State
  const [schedFormData, setSchedFormData] = useState({
    day: 'Lunes',
    time: '07:00 - 08:30 AM',
    subject: subjects[0].name,
    classroom: 'Aula 204',
    teacher: teacher.name,
    color: 'bg-blue-50 border-blue-500 text-blue-700'
  });

  // Memory Form State
  const [memoryFormData, setMemoryFormData] = useState({
    title: '',
    category: 'Proyectos',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: ''
  });

  // Announcement Form State
  const [annFormData, setAnnFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    priorityLabel: 'Académico',
    roleTarget: 'Todos'
  });

  const [previewCert, setPreviewCert] = useState(null);

  // Handlers
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
    const studentObj = students.find((s) => s.id === gradeFormData.studentId) || students[0];
    await addOrUpdateGrade({
      ...gradeFormData,
      studentName: studentObj.name,
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
    let label = 'Presente';
    if (attendanceFormData.status === 'absent') label = 'Falta Injustificada';
    if (attendanceFormData.status === 'justified') label = 'Falta Justificada';
    if (attendanceFormData.status === 'late') label = 'Llegada Tarde';

    await recordAttendance({
      ...attendanceFormData,
      studentName: st.name,
      statusLabel: label,
      sentTo: st.email
    });
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === certFormData.studentId) || students[0];
    const newCert = issueCertificate({
      ...certFormData,
      studentName: st.name,
      average: '19.0 pts'
    });
    setPreviewCert(newCert);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    addScheduleBlock(schedFormData);
  };

  const handleSaveMemory = (e) => {
    e.preventDefault();
    addMemory(memoryFormData);
    setMemoryFormData({
      title: '',
      category: 'Proyectos',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      description: ''
    });
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    addAnnouncement(annFormData);
    setAnnFormData({
      title: '',
      content: '',
      priority: 'normal',
      priorityLabel: 'Académico',
      roleTarget: 'Todos'
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-indigo-200 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white">
              Inicio
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Panel de Profesores y Administrador</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/10 p-6 rounded-3xl border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatar || teacher.avatar}
                alt={currentUser?.name || teacher.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Docente Titular / Administrador</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {currentUser?.name || teacher.name}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
                  {teacher.department} • Asignado a: 4to Año "A"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl font-black text-white font-heading">
                  {students.length}
                </div>
                <div className="text-[10px] text-indigo-200 uppercase font-semibold">Alumnos</div>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl font-black text-amber-300 font-heading">
                  {grades.length}
                </div>
                <div className="text-[10px] text-indigo-200 uppercase font-semibold">Notas Cargadas</div>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl font-black text-emerald-300 font-heading">
                  {evaluationPlans.length}
                </div>
                <div className="text-[10px] text-indigo-200 uppercase font-semibold">Planes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-1.5 flex flex-wrap gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('grades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'grades'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cargar / Modificar Notas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'plans'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Subir Planes de Evaluación</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Notificar Faltas y Asistencias</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'certificates'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Generar Certificados y Menciones</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'schedules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Gestionar Horarios</span>
          </button>

          <button
            onClick={() => setActiveSubTab('memories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'memories'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Subir Recuerdos / Galería</span>
          </button>

          <button
            onClick={() => setActiveSubTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'announcements'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Publicar Comunicados</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SUBTAB: GRADES MANAGEMENT */}
        {activeSubTab === 'grades' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Gestión y Carga de Calificaciones
                </h2>
                <p className="text-xs text-slate-500">
                  Modifica calificaciones en tiempo real, añade evaluaciones y registra observaciones
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1er Lapso">1er Lapso</option>
                  <option value="2do Lapso">2do Lapso</option>
                  <option value="3er Lapso">3er Lapso</option>
                </select>

                <button
                  onClick={() => handleOpenGradeModal()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nueva Calificación</span>
                </button>
              </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Listado de Calificaciones Registradas en {selectedSubject}
                </div>
                <div className="text-xs text-slate-400">
                  {grades.filter((g) => g.subjectName === selectedSubject).length} registros
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Estudiante</th>
                      <th className="py-3 px-4">Evaluación</th>
                      <th className="py-3 px-4">Lapso</th>
                      <th className="py-3 px-4 text-center">Nota Obtenida</th>
                      <th className="py-3 px-4 text-center">Pond. %</th>
                      <th className="py-3 px-4">Observaciones</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grades.filter((g) => g.subjectName === selectedSubject).length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400">
                          No hay calificaciones registradas para esta materia aún. Haz clic en "Nueva Calificación".
                        </td>
                      </tr>
                    ) : (
                      grades
                        .filter((g) => g.subjectName === selectedSubject)
                        .map((gr) => (
                          <tr key={gr.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {gr.studentName}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700">
                              {gr.evaluationTitle}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">{gr.term}</td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full font-bold ${
                                  gr.score >= 16
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : gr.score >= 10
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {gr.score} / {gr.maxScore || 20}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-slate-600">
                              {gr.percentage}%
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                              {gr.comments || 'Sin comentarios'}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1">
                              <button
                                onClick={() => handleOpenGradeModal(gr)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteGrade(gr.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: EVALUATION PLANS MANAGEMENT */}
        {activeSubTab === 'plans' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-slate-900 mb-1">
                Publicar Nuevo Plan de Evaluación
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Este plan será visible inmediatamente por los alumnos y representantes
              </p>

              <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Materia</label>
                  <select
                    value={planFormData.subjectName}
                    onChange={(e) => setPlanFormData({ ...planFormData, subjectName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Título de la Evaluación</label>
                  <input
                    type="text"
                    required
                    value={planFormData.title}
                    onChange={(e) => setPlanFormData({ ...planFormData, title: e.target.value })}
                    placeholder="Ej. Taller Práctico de Funciones"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ponderación (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={planFormData.percentage}
                      onChange={(e) => setPlanFormData({ ...planFormData, percentage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fecha Límite</label>
                    <input
                      type="date"
                      required
                      value={planFormData.dueDate}
                      onChange={(e) => setPlanFormData({ ...planFormData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lapso</label>
                    <select
                      value={planFormData.term}
                      onChange={(e) => setPlanFormData({ ...planFormData, term: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="1er Lapso">1er Lapso</option>
                      <option value="2do Lapso">2do Lapso</option>
                      <option value="3er Lapso">3er Lapso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Actividad</label>
                    <select
                      value={planFormData.type}
                      onChange={(e) => setPlanFormData({ ...planFormData, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Examen Escrito Individual">Examen Escrito Individual</option>
                      <option value="Taller Práctico Grupal">Taller Práctico Grupal</option>
                      <option value="Proyecto y Defensa">Proyecto y Defensa</option>
                      <option value="Práctica de Laboratorio">Práctica de Laboratorio</option>
                      <option value="Ensayo y Exposición">Ensayo y Exposición</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Descripción y Contenido</label>
                  <textarea
                    rows={3}
                    value={planFormData.description}
                    onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                    placeholder="Instrucciones sobre temas a evaluar, materiales o pautas..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publicar Plan de Evaluación</span>
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-1 font-heading">
                  Planes de Evaluación Activos ({evaluationPlans.length})
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Visualización de las evaluaciones planificadas para los estudiantes
                </p>

                <div className="space-y-3">
                  {evaluationPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 transition flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            {plan.subjectName}
                          </span>
                          <span className="font-semibold text-slate-700">{plan.type}</span>
                          <span className="text-blue-600 font-bold">({plan.percentage}%)</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{plan.title}</h4>
                        <p className="text-slate-600 text-[11px] mb-2">{plan.description}</p>
                        <div className="text-[10px] text-slate-400">
                          Fecha programada: <strong className="text-slate-600">{plan.dueDate}</strong> • {plan.term}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteEvaluationPlan(plan.id)}
                        className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition shrink-0"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: ATTENDANCE & ABSENCES NOTIFICATIONS */}
        {activeSubTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Take attendance form */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-slate-900 mb-1">
                Registrar y Notificar Inasistencia
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Envía una alerta inmediata al estudiante y a su representante
              </p>

              <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seleccionar Alumno</label>
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
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
                    <label className="block font-semibold text-slate-700 mb-1">Asignatura</label>
                    <select
                      value={attendanceFormData.subject}
                      onChange={(e) => setAttendanceFormData({ ...attendanceFormData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fecha</label>
                    <input
                      type="date"
                      required
                      value={attendanceFormData.date}
                      onChange={(e) => setAttendanceFormData({ ...attendanceFormData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Condición de Asistencia</label>
                  <select
                    value={attendanceFormData.status}
                    onChange={(e) => setAttendanceFormData({ ...attendanceFormData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="absent">Falta Injustificada (Ausente)</option>
                    <option value="justified">Falta Justificada (Reposo/Cita médica)</option>
                    <option value="late">Tardanza / Retraso</option>
                    <option value="present">Presente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Motivo / Observación enviada a representantes
                  </label>
                  <textarea
                    rows={3}
                    value={attendanceFormData.notes}
                    onChange={(e) => setAttendanceFormData({ ...attendanceFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Notificar Inasistencia al Representante</span>
                </button>
              </form>
            </div>

            {/* List of registered attendances */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Historial de Avisos y Faltas Registradas ({attendances.length})
              </h3>
              <p className="text-xs text-slate-500">
                Notificaciones despachadas a los correos de los representantes
              </p>

              <div className="space-y-3">
                {attendances.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{att.studentName}</span>
                        <span className="text-slate-400">• {att.date}</span>
                      </div>
                      <div className="text-slate-600 mb-1">{att.notes}</div>
                      <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enviado a: {att.sentTo || att.studentName}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        att.status === 'absent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {att.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: CERTIFICATES & HONORS GENERATOR */}
        {activeSubTab === 'certificates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-slate-900 mb-1">
                Generador de Certificados y Menciones de Honor
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Emite diplomas oficiales con código QR y validación electrónica
              </p>

              <form onSubmit={handleSaveCert} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estudiante Beneficiario</label>
                  <select
                    value={certFormData.studentId}
                    onChange={(e) => {
                      const st = students.find((s) => s.id === e.target.value);
                      setCertFormData({
                        ...certFormData,
                        studentId: e.target.value,
                        studentName: st?.name || ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.studentIdNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Título del Reconocimiento</label>
                  <input
                    type="text"
                    required
                    value={certFormData.title}
                    onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                    placeholder="Ej. Diploma de Honor por Rendimiento Académico"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Mención</label>
                    <select
                      value={certFormData.type}
                      onChange={(e) => {
                        let lbl = 'Excelencia Académica';
                        if (e.target.value === 'merit') lbl = 'Mérito Científico';
                        if (e.target.value === 'conduct') lbl = 'Valores y Convivencia';
                        if (e.target.value === 'sports') lbl = 'Mérito Deportivo';
                        setCertFormData({ ...certFormData, type: e.target.value, typeLabel: lbl });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="honor">Excelencia Académica (Cuadro de Honor)</option>
                      <option value="merit">Mérito Científico / Olimpiadas</option>
                      <option value="conduct">Valores y Buena Conducta</option>
                      <option value="sports">Mérito Deportivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Año Lectivo</label>
                    <input
                      type="text"
                      value={certFormData.academicYear}
                      onChange={(e) => setCertFormData({ ...certFormData, academicYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Texto Conmemorativo</label>
                  <textarea
                    rows={3}
                    value={certFormData.description}
                    onChange={(e) => setCertFormData({ ...certFormData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Emitir y Visualizar Diploma Oficial</span>
                </button>
              </form>
            </div>

            {/* Issued Certificates List */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Certificados Recientes Emitidos ({certificates.length})
              </h3>

              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{cert.studentName}</div>
                      <div className="text-amber-800 font-semibold">{cert.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {cert.issueDate} • Cód: {cert.code}
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-[11px] transition shrink-0"
                    >
                      Imprimir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: SCHEDULES */}
        {activeSubTab === 'schedules' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-slate-900 mb-1">
                Añadir Bloque de Horario
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Programa clases por día, aula y profesor
              </p>

              <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Día de la Semana</label>
                  <select
                    value={schedFormData.day}
                    onChange={(e) => setSchedFormData({ ...schedFormData, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Horario</label>
                    <input
                      type="text"
                      required
                      value={schedFormData.time}
                      onChange={(e) => setSchedFormData({ ...schedFormData, time: e.target.value })}
                      placeholder="07:00 - 08:30 AM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Aula / Salón</label>
                    <input
                      type="text"
                      required
                      value={schedFormData.classroom}
                      onChange={(e) => setSchedFormData({ ...schedFormData, classroom: e.target.value })}
                      placeholder="Aula 204"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Materia</label>
                  <select
                    value={schedFormData.subject}
                    onChange={(e) => setSchedFormData({ ...schedFormData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Añadir Bloque de Horario</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base font-heading mb-4">
                Bloques Registrados en el Sistema ({schedules.length})
              </h3>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
                {schedules.map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {sc.day} • {sc.time}
                      </div>
                      <div className="text-slate-600">
                        {sc.subject} ({sc.classroom}) - {sc.teacher}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: MEMORIES / YEARBOOK UPLOAD */}
        {activeSubTab === 'memories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-slate-900 mb-1">
                Subir Foto o Recuerdo Institucional
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Publica momentos especiales de torneos, ferias y promociones
              </p>

              <form onSubmit={handleSaveMemory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Título de la Actividad</label>
                  <input
                    type="text"
                    required
                    value={memoryFormData.title}
                    onChange={(e) => setMemoryFormData({ ...memoryFormData, title: e.target.value })}
                    placeholder="Ej. Encuentro de Voleibol Femenino"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                    <select
                      value={memoryFormData.category}
                      onChange={(e) => setMemoryFormData({ ...memoryFormData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Proyectos">Proyectos y Feria</option>
                      <option value="Deportes">Deportes y Juegos</option>
                      <option value="Graduaciones">Graduaciones</option>
                      <option value="Cultura">Cultura y Danza</option>
                      <option value="Medio Ambiente">Medio Ambiente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">URL de la Imagen</label>
                    <input
                      type="url"
                      required
                      value={memoryFormData.image}
                      onChange={(e) => setMemoryFormData({ ...memoryFormData, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Descripción del Evento</label>
                  <textarea
                    rows={3}
                    value={memoryFormData.description}
                    onChange={(e) => setMemoryFormData({ ...memoryFormData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publicar en la Galería</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base font-heading mb-4">
                Recuerdos Publicados ({memories.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {memories.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                    <img src={m.image} alt={m.title} className="w-full h-24 object-cover" />
                    <div className="p-2.5">
                      <div className="font-bold text-slate-900 line-clamp-1">{m.title}</div>
                      <div className="text-[10px] text-slate-400">{m.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: ANNOUNCEMENTS */}
        {activeSubTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-slate-900 mb-1">
                Redactar Comunicado Oficial
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Aparecerá en el portal web y en los paneles de estudiantes y profesores
              </p>

              <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Título del Comunicado</label>
                  <input
                    type="text"
                    required
                    value={annFormData.title}
                    onChange={(e) => setAnnFormData({ ...annFormData, title: e.target.value })}
                    placeholder="Ej. Convocatoria a Consejo de Docentes"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dirigido A</label>
                  <select
                    value={annFormData.roleTarget}
                    onChange={(e) => setAnnFormData({ ...annFormData, roleTarget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Todos">Toda la Comunidad (Público)</option>
                    <option value="Estudiantes">Solo Estudiantes y Representantes</option>
                    <option value="Profesores">Solo Personal Docente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contenido del Mensaje</label>
                  <textarea
                    rows={4}
                    required
                    value={annFormData.content}
                    onChange={(e) => setAnnFormData({ ...annFormData, content: e.target.value })}
                    placeholder="Detalles sobre fechas, instrucciones o avisos..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar Comunicado</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Avisos Oficiales Vigentes ({announcements.length})
              </h3>
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">{a.title}</span>
                      <span className="text-[10px] text-slate-400">{a.date}</span>
                    </div>
                    <p className="text-slate-600">{a.content}</p>
                    <div className="mt-2 text-[10px] text-blue-600 font-semibold">
                      Dirigido a: {a.roleTarget}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grade Edit Modal */}
      {gradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 animate-fade-in">
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-1">
              {gradeFormData.id ? 'Modificar Calificación' : 'Registrar Nueva Calificación'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ajusta la puntuación y comentarios pedagógicos
            </p>

            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estudiante</label>
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.studentIdNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Materia</label>
                <select
                  value={gradeFormData.subjectName}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, subjectName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título de la Evaluación</label>
                <input
                  type="text"
                  required
                  value={gradeFormData.evaluationTitle}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, evaluationTitle: e.target.value })}
                  placeholder="Ej. Examen Parcial I: Vectores"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nota (0 - 20)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    required
                    value={gradeFormData.score}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, score: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Escala Máx</label>
                  <input
                    type="number"
                    value={gradeFormData.maxScore}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, maxScore: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ponderación %</label>
                  <input
                    type="number"
                    value={gradeFormData.percentage}
                    onChange={(e) => setGradeFormData({ ...gradeFormData, percentage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observaciones al Alumno</label>
                <textarea
                  rows={2}
                  value={gradeFormData.comments}
                  onChange={(e) => setGradeFormData({ ...gradeFormData, comments: e.target.value })}
                  placeholder="Comentario sobre fortalezas y aspectos a mejorar..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                >
                  Guardar Calificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diploma Preview Modal */}
      <CertificateModal certificate={previewCert} onClose={() => setPreviewCert(null)} />
    </div>
  );
}
