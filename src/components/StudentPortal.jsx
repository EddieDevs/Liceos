import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  ChevronRight,
  TrendingUp,
  Download,
  Info,
  Camera,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CertificateModal from './CertificateModal';

export default function StudentPortal() {
  const {
    currentUser,
    students,
    grades,
    evaluationPlans,
    schedules,
    attendances,
    certificates,
    memories,
    institution,
    subjects,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('grades'); // 'grades', 'schedule', 'plans', 'certificates', 'attendance', 'memories', 'directory'
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Find student details or default to first student
  const student =
    students.find((s) => s.id === currentUser?.id || s.email === currentUser?.email) ||
    students[0];

  // Filter grades for this student
  const studentGrades = grades.filter(
    (g) => g.studentId === student.id || g.studentName === student.name
  );

  // Group grades by subject to compute average per subject
  const subjectAverages = subjects.map((sub) => {
    const list = studentGrades.filter(
      (g) => g.subjectId === sub.id || g.subjectName === sub.name
    );
    const totalScore = list.reduce((acc, curr) => acc + Number(curr.score), 0);
    const avg = list.length > 0 ? (totalScore / list.length).toFixed(1) : 'Sin nota';
    return {
      ...sub,
      grades: list,
      average: avg
    };
  });

  // Calculate real general average
  const validAverages = subjectAverages
    .map((s) => parseFloat(s.average))
    .filter((a) => !isNaN(a));
  const generalAvg =
    validAverages.length > 0
      ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1)
      : student.overallAverage;

  // Filter student certificates
  const studentCerts = certificates.filter(
    (c) => c.studentId === student.id || c.studentName === student.name
  );

  // Filter student attendances
  const studentAtts = attendances.filter(
    (a) => a.studentId === student.id || a.studentName === student.name
  );

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white">
              Inicio
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Portal del Estudiante</span>
          </div>

          {/* Student Profile Overview */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/10 p-6 rounded-3xl border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold border border-blue-400/30">
                    Estudiante Regular
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    {student.studentIdNumber || 'V-31.452.981'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {student.name}
                </h1>
                <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
                  {student.gradeLevel || '4to Año - Sección A'} • Año Escolar 2024-2025
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center">
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-heading">
                  {generalAvg}
                </div>
                <div className="text-[10px] text-blue-200 uppercase font-semibold">Promedio</div>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-emerald-300 font-heading">
                  {student.attendanceRate}%
                </div>
                <div className="text-[10px] text-blue-200 uppercase font-semibold">Asistencia</div>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-purple-300 font-heading">
                  {studentCerts.length}
                </div>
                <div className="text-[10px] text-blue-200 uppercase font-semibold">Menciones</div>
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
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Calificaciones y Notas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'schedule'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Horario de Clases</span>
          </button>

          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'plans'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Planes de Evaluación</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'certificates'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificados y Menciones ({studentCerts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'attendance'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Asistencias y Faltas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('memories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'memories'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Anuario & Recuerdos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('directory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
              activeSubTab === 'directory'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Directorio Docente</span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SUBTAB: GRADES */}
        {activeSubTab === 'grades' && (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Boletín de Calificaciones Académicas
                </h2>
                <p className="text-xs text-slate-500">
                  Consulta de notas parciales, acumuladas y observaciones de los docentes
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1er Lapso">1er Lapso Pedagógico</option>
                  <option value="2do Lapso">2do Lapso Pedagógico</option>
                  <option value="3er Lapso">3er Lapso Pedagógico</option>
                </select>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Boletín</span>
                </button>
              </div>
            </div>

            {/* Subject Grade Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectAverages.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: sub.color }}
                      ></span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          parseFloat(sub.average) >= 16
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : parseFloat(sub.average) >= 10
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        Promedio: {sub.average} / 20
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-heading text-slate-900 mb-1">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">{sub.teacher}</p>

                    {/* Evaluations list */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      {sub.grades.length === 0 ? (
                        <div className="text-xs text-slate-400 italic py-2 text-center">
                          Aún no se han publicado notas de este lapso
                        </div>
                      ) : (
                        sub.grades.map((gr) => (
                          <div
                            key={gr.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-slate-800">{gr.evaluationTitle}</div>
                              <div className="text-[10px] text-slate-400">
                                Ponderación: {gr.percentage}% • {gr.date}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-sm text-blue-700">{gr.score}</span>
                              <span className="text-[10px] text-slate-400"> / {gr.maxScore}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {sub.grades.length > 0 && sub.grades[0].comments && (
                    <div className="mt-4 pt-3 border-t border-dashed border-slate-200 text-[11px] text-slate-500 italic">
                      "Observación docente: {sub.grades[0].comments}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: SCHEDULE */}
        {activeSubTab === 'schedule' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Horario Semanal de Clases
                </h2>
                <p className="text-xs text-slate-500">
                  Sección 4to Año "A" • Turno Matutino (7:00 AM a 1:00 PM)
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Sede Central: Aula 204
                </span>
              </div>
            </div>

            {/* Weekly Schedule Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {daysOfWeek.map((day) => {
                const daySchedules = schedules.filter((s) => s.day === day);
                return (
                  <div key={day} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
                    <div className="bg-slate-900 text-white font-heading font-bold text-sm py-2.5 text-center">
                      {day}
                    </div>
                    <div className="p-2 space-y-2">
                      {daySchedules.length === 0 ? (
                        <div className="text-xs text-slate-400 py-6 text-center italic">
                          Sin actividades
                        </div>
                      ) : (
                        daySchedules.map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs shadow-2xs ${item.color}`}
                          >
                            <div className="font-bold text-sm leading-tight mb-1">{item.subject}</div>
                            <div className="text-[11px] flex items-center gap-1 opacity-80">
                              <Clock className="w-3 h-3" />
                              <span>{item.time}</span>
                            </div>
                            <div className="text-[10px] mt-1.5 pt-1 border-t border-current/20 flex items-center justify-between">
                              <span className="font-semibold">{item.classroom}</span>
                              <span className="truncate max-w-[80px]">{item.teacher.split(' ')[1]}</span>
                            </div>
                          </div>
                        ))
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Planes de Evaluación y Cronograma
                </h2>
                <p className="text-xs text-slate-500">
                  Fechas de talleres, pruebas, proyectos y defensas programadas para el período
                </p>
              </div>

              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                Total de Evaluaciones: {evaluationPlans.length}
              </div>
            </div>

            {/* Plans List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Asignatura</th>
                    <th className="py-3 px-4">Actividad / Título</th>
                    <th className="py-3 px-4">Modalidad</th>
                    <th className="py-3 px-4">Fecha Límite</th>
                    <th className="py-3 px-4 text-center">Ponderación</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evaluationPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{plan.subjectName}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{plan.title}</div>
                        <div className="text-[11px] text-slate-500 max-w-sm line-clamp-1">
                          {plan.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {plan.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {plan.dueDate}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                        {plan.percentage}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            plan.status === 'Completado'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : plan.status === 'En Progreso'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {plan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB: CERTIFICATES & RECOGNITIONS */}
        {activeSubTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Cuadro de Honor y Certificados Oficiales
                </h2>
                <p className="text-xs text-slate-500">
                  Reconocimientos académicos, diplomas de excelencia y menciones otorgadas
                </p>
              </div>

              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{studentCerts.length} Diplomas Obtenidos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl p-6 border-2 border-amber-200/80 shadow-md relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-200/30 to-yellow-300/10 rounded-bl-full pointer-events-none"></div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-sm border border-amber-200">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {cert.typeLabel}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base font-heading mt-0.5">
                          {cert.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                      <span>Expedido: {cert.issueDate}</span>
                      <span className="font-mono text-slate-600 font-semibold">{cert.code}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Ver Diploma Oficial Imprimible</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: ATTENDANCE & ABSENCES */}
        {activeSubTab === 'attendance' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Control de Asistencias y Faltas
                </h2>
                <p className="text-xs text-slate-500">
                  Registro diario de puntualidad y notificaciones enviadas a los representantes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Índice de Asistencia: {student.attendanceRate}%
                </span>
              </div>
            </div>

            {/* Attendance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Clases Impartidas</div>
                <div className="text-2xl font-bold text-slate-900 font-heading">68 Horas</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-xs text-amber-700 font-medium">Inasistencias Justificadas</div>
                <div className="text-2xl font-bold text-amber-900 font-heading">1 Falta</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-700 font-medium">Conducta y Puntualidad</div>
                <div className="text-2xl font-bold text-emerald-900 font-heading">Excelente</div>
              </div>
            </div>

            {/* Inasistencias Log Table */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Historial de Notificaciones de Falta</h3>
              {studentAtts.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                  No posees inasistencias registradas. ¡Felicitaciones por tu asistencia constante!
                </div>
              ) : (
                <div className="space-y-3">
                  {studentAtts.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                          {att.status === 'justified' ? 'J' : att.status === 'late' ? 'T' : 'F'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">
                            {att.subject} • <span className="font-normal text-slate-500">{att.date}</span>
                          </div>
                          <div className="text-slate-600 mt-0.5">{att.notes}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 inline-block mb-1">
                          {att.statusLabel}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {att.notified ? 'Aviso enviado al representante' : 'Pendiente'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB: MEMORIES & YEARBOOK */}
        {activeSubTab === 'memories' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-900">
                  Anuario Escolar & Recuerdos de Nuestra Promoción
                </h2>
                <p className="text-xs text-slate-500">
                  Galería de eventos, proyectos científicos, victorias deportivas y vida estudiantil
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold">
                        {mem.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] text-slate-400 font-medium mb-1">{mem.date}</div>
                    <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{mem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: DIRECTORY & CONTACTS */}
        {activeSubTab === 'directory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900">
                Directorio Docente y Contacto Institucional
              </h2>
              <p className="text-xs text-slate-500">
                Canales de comunicación oficiales para asesorías y dudas pedagógicas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: sub.color }}
                    >
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{sub.teacher}</div>
                      <div className="text-xs text-slate-500">{sub.name}</div>
                    </div>
                  </div>
                  <a
                    href={`mailto:${institution.email}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition"
                    title="Enviar mensaje"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Diploma Modal Viewer */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}
