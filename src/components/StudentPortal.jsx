import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  FileText,
  Printer,
  ChevronRight,
  Camera,
  PlusCircle,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Upload,
  Heart,
  Tag
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
    addMemory,
    institution,
    subjects,
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('grades'); // 'grades', 'schedule', 'plans', 'certificates', 'attendance', 'memories', 'directory'
  const [selectedTerm, setSelectedTerm] = useState('1er Lapso');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Student memories upload modal
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    category: 'Proyectos',
    gradeYear: '4to Año',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: ''
  });

  // Current student profile
  const student =
    students.find((s) => s.id === currentUser?.id || s.email === currentUser?.email) ||
    students[0];

  // Grades
  const studentGrades = grades.filter(
    (g) => g.studentId === student.id || g.studentName === student.name
  );

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

  const validAverages = subjectAverages
    .map((s) => parseFloat(s.average))
    .filter((a) => !isNaN(a));
  const generalAvg =
    validAverages.length > 0
      ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1)
      : student.overallAverage;

  // Certificates
  const studentCerts = certificates.filter(
    (c) => c.studentId === student.id || c.studentName === student.name
  );

  // Attendances
  const studentAtts = attendances.filter(
    (a) => a.studentId === student.id || a.studentName === student.name
  );

  const handleSaveMemory = (e) => {
    e.preventDefault();
    addMemory({
      ...memoryForm,
      authorName: student.name,
      gradeYear: student.gradeLevel.split('-')[0].trim() || '4to Año',
    });
    setMemoryModalOpen(false);
    setMemoryForm({
      title: '',
      category: 'Proyectos',
      gradeYear: '4to Año',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      description: ''
    });
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
              Inicio
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Portal del Estudiante</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/70">
            <div className="flex items-center gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-600"
              />
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-400/20 inline-block mb-1">
                  Estudiante Regular
                </span>
                <h1 className="text-2xl font-bold font-heading text-white">{student.name}</h1>
                <p className="text-xs text-slate-300">
                  {student.studentIdNumber} • {student.gradeLevel} • {institution.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-white font-heading">{generalAvg}</div>
                <div className="text-[10px] text-slate-400 uppercase">Promedio</div>
              </div>
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-emerald-400 font-heading">
                  {student.attendanceRate}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Asistencia</div>
              </div>
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-amber-400 font-heading">
                  {studentCerts.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Menciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1 flex gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('grades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'grades' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Calificaciones y Notas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'schedule' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Horario de Clases</span>
          </button>

          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'plans' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Planes de Evaluación</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'certificates' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificados y Menciones</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'attendance' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Asistencias y Faltas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('memories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'memories' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Recuerdos de Mi Año</span>
          </button>

          <button
            onClick={() => setActiveSubTab('directory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'directory' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Directorio Docente</span>
          </button>
        </div>
      </div>

      {/* 3. Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* GRADES */}
        {activeSubTab === 'grades' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Boletín Oficial de Calificaciones
                </h2>
                <p className="text-xs text-slate-500">
                  Calificaciones parciales y observaciones emitidas por los docentes
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50"
                >
                  <option value="1er Lapso">1er Lapso</option>
                  <option value="2do Lapso">2do Lapso</option>
                  <option value="3er Lapso">3er Lapso</option>
                </select>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Boletín</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectAverages.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        {sub.average} / 20
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-3">{sub.teacher}</div>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      {sub.grades.length === 0 ? (
                        <div className="text-xs text-slate-400 italic py-2 text-center">
                          Aún sin notas registradas este lapso
                        </div>
                      ) : (
                        sub.grades.map((gr) => (
                          <div
                            key={gr.id}
                            className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-medium text-slate-800">{gr.evaluationTitle}</div>
                              <div className="text-[10px] text-slate-400">{gr.percentage}% • {gr.date}</div>
                            </div>
                            <span className="font-bold text-blue-700">{gr.score}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {sub.grades[0]?.comments && (
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                      "{sub.grades[0].comments}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {activeSubTab === 'schedule' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">
                Horario Semanal de Clases
              </h2>
              <p className="text-xs text-slate-500">
                {student.gradeLevel} • Turno Matutino • Sede Colinas del Neverí
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {daysOfWeek.map((day) => {
                const daySchedules = schedules.filter((s) => s.day === day);
                return (
                  <div key={day} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                    <div className="bg-slate-900 text-white font-medium text-xs py-2 text-center">
                      {day}
                    </div>
                    <div className="p-2 space-y-2">
                      {daySchedules.length === 0 ? (
                        <div className="text-xs text-slate-400 py-4 text-center italic">Libre</div>
                      ) : (
                        daySchedules.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                            <div className="font-bold text-slate-900 mb-0.5">{item.subject}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{item.time}</span>
                            </div>
                            <div className="text-[10px] text-blue-700 font-medium mt-1">
                              {item.classroom}
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

        {/* PLANS */}
        {activeSubTab === 'plans' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold font-heading text-slate-900">
              Planes de Evaluación y Fechas de Entrega
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Materia</th>
                    <th className="py-3 px-3">Evaluación</th>
                    <th className="py-3 px-3">Modalidad</th>
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-3 text-center">Ponderación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evaluationPlans.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{p.subjectName}</td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{p.title}</td>
                      <td className="py-3 px-3 text-slate-500">{p.type}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{p.dueDate}</td>
                      <td className="py-3 px-3 text-center font-bold text-blue-700">{p.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CERTIFICATES */}
        {activeSubTab === 'certificates' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Certificados y Menciones Oficiales
                </h2>
                <p className="text-xs text-slate-500">Reconocimientos avalados por la Dirección General</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800">
                {studentCerts.length} Diplomas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {cert.typeLabel}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm font-heading mt-2 mb-1">{cert.title}</h3>
                    <p className="text-xs text-slate-600 mb-3">{cert.description}</p>
                    <div className="text-[11px] text-slate-400">{cert.issueDate} • Cód: {cert.code}</div>
                  </div>

                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition"
                  >
                    Ver Diploma Oficial
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold font-heading text-slate-900">
              Registro de Inasistencias y Notificaciones
            </h2>
            <div className="space-y-3">
              {studentAtts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 italic">
                  Asistencia perfecta registrada hasta la fecha.
                </div>
              ) : (
                studentAtts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{att.subject} • {att.date}</div>
                      <div className="text-slate-600">{att.notes}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                      {att.statusLabel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* RECUERDOS DE MI AÑO (STUDENT MEMORIES CONTRIBUTION) */}
        {activeSubTab === 'memories' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-slate-900">
                  Recuerdos y Anuario de Nuestro Año Escolar
                </h2>
                <p className="text-xs text-slate-500">
                  Sube fotos y momentos compartidos con tus compañeros de clase
                </p>
              </div>

              <button
                onClick={() => setMemoryModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Agregar Recuerdo a Mi Año</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {memories.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition text-xs"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
                      {m.gradeYear || '4to Año'} • {m.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-slate-900 text-sm mb-1">{m.title}</div>
                    <p className="text-slate-600 leading-relaxed mb-3">{m.description}</p>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>Publicado por: {m.authorName || 'Estudiante'}</span>
                      <span>{m.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIRECTORY */}
        {activeSubTab === 'directory' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold font-heading text-slate-900">Directorio Docente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {subjects.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{s.teacher}</div>
                    <div className="text-slate-500">{s.name}</div>
                  </div>
                  <a
                    href={`mailto:${institution.email}`}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Contacto"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      {memoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              Agregar Recuerdo al Anuario
            </h3>
            <form onSubmit={handleSaveMemory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Título del Recuerdo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Feria de Ciencias en Colinas del Neverí"
                  value={memoryForm.title}
                  onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Año / Curso</label>
                  <input
                    type="text"
                    value={student.gradeLevel.split('-')[0].trim()}
                    disabled
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Categoría</label>
                  <select
                    value={memoryForm.category}
                    onChange={(e) => setMemoryForm({ ...memoryForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Proyectos">Proyectos y Feria</option>
                    <option value="Deportes">Deportes y Juegos</option>
                    <option value="Eventos">Eventos y Aniversario</option>
                    <option value="Aulas">Vida en el Aula</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Enlace de la Foto / Imagen</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={memoryForm.image}
                  onChange={(e) => setMemoryForm({ ...memoryForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Descripción / Anécdota</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comparte qué sucedió en esta actividad..."
                  value={memoryForm.description}
                  onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setMemoryModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Publicar Recuerdo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diploma Viewer */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}
