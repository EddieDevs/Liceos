import React, { useState } from 'react';
import {
  CreditCard,
  Users,
  GraduationCap,
  Calendar,
  Building,
  Award,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  Clock,
  Coffee,
  CalendarOff,
  Bell,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CertificateModal from './CertificateModal';
import ReportCardModal from './ReportCardModal';

export default function AdminPortal() {
  const {
    currentUser,
    institution,
    students,
    teachersList,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    schedules,
    addScheduleBlock,
    updateScheduleBlock,
    deleteScheduleBlock,
    classrooms,
    addClassroom,
    payments,
    updatePaymentStatus,
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    grades,
    announcements,
    addAnnouncement,
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments', 'subjects', 'schedules', 'certificates', 'teachers', 'students', 'classrooms'
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Preview modals
  const [previewCert, setPreviewCert] = useState(null);
  const [previewReportCardStudent, setPreviewReportCardStudent] = useState(null);

  // Subject Form State
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    gradeLevel: '4to Año',
    teacherName: '',
    color: '#2563eb'
  });

  // Schedule Block Form State (Supports Regular, Recess, Day Off)
  const [schedModalOpen, setSchedModalOpen] = useState(false);
  const [schedType, setSchedType] = useState('regular'); // 'regular', 'recess', 'day_off'
  const [schedForm, setSchedForm] = useState({
    day: 'Lunes',
    time: '07:00 - 08:30 AM',
    subject: subjects[0]?.name || '',
    classroom: classrooms[0]?.name || '',
    teacher: teachersList[0]?.name || '',
    notes: ''
  });

  // Certificate Creation / Editing State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    studentIdNumber: students[0]?.studentIdNumber || '',
    gradeLevel: students[0]?.gradeLevel || '4to Año',
    category: 'recognition', // 'grade' or 'recognition'
    template_type: 'academic', // 'academic', 'sports', 'anniversary', 'values'
    title: 'Diploma de Honor al Rendimiento Académico',
    scoreNote: '',
    description: 'Otorgado en reconocimiento a su sobresaliente dedicación y méritos académicos.'
  });

  // Teacher Form State
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Ciencias Exactas',
    subjects: ''
  });

  // Classroom Form State
  const [classroomModalOpen, setClassroomModalOpen] = useState(false);
  const [classroomForm, setClassroomForm] = useState({
    name: '',
    code: '',
    capacity: 35,
    floor: 'Planta Baja'
  });

  // Handlers for Subjects
  const handleOpenSubjectModal = (sub = null) => {
    if (sub) {
      setEditingSubId(sub.id);
      setSubjectForm({ ...sub });
    } else {
      setEditingSubId(null);
      setSubjectForm({
        name: '',
        code: '',
        gradeLevel: '4to Año',
        teacherName: teachersList[0]?.name || '',
        color: '#2563eb'
      });
    }
    setSubjectModalOpen(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    if (editingSubId) {
      await updateSubject(editingSubId, subjectForm);
    } else {
      await addSubject(subjectForm);
    }
    setSubjectModalOpen(false);
  };

  // Handlers for Schedules
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    let title = schedForm.subject;
    let place = schedForm.classroom;

    if (schedType === 'day_off') {
      title = 'Día Libre Escolar';
      place = 'Sin actividad';
    } else if (schedType === 'recess') {
      title = 'Receso Escolar';
      place = 'Áreas comunes';
    }

    await addScheduleBlock({
      day: schedForm.day,
      time: schedForm.time,
      subject: title,
      classroom: place,
      teacher: schedType === 'regular' ? schedForm.teacher : 'Dirección',
      entry_type: schedType,
      notes: schedForm.notes
    });
    setSchedModalOpen(false);
  };

  // Handlers for Certificates
  const handleOpenCertModal = (cert = null) => {
    if (cert) {
      setEditingCertId(cert.id);
      setCertForm({
        studentId: cert.studentId || '',
        studentName: cert.studentName || cert.student_name || '',
        studentIdNumber: cert.studentIdNumber || cert.student_id_number || '',
        gradeLevel: cert.gradeLevel || cert.grade_level || '4to Año',
        category: cert.category || 'recognition',
        template_type: cert.template_type || 'academic',
        title: cert.title || 'Diploma Oficial',
        scoreNote: cert.scoreNote || cert.score_note || '',
        description: cert.description || ''
      });
    } else {
      setEditingCertId(null);
      setCertForm({
        studentId: students[0]?.id || '',
        studentName: students[0]?.name || '',
        studentIdNumber: students[0]?.studentIdNumber || '',
        gradeLevel: students[0]?.gradeLevel || '4to Año',
        category: 'recognition',
        template_type: 'academic',
        title: 'Certificado de Excelencia Académica',
        scoreNote: '19.5 pts',
        description: 'En reconocimiento por su destacada dedicación y rendimiento escolar.'
      });
    }
    setCertModalOpen(true);
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    if (editingCertId) {
      await updateCertificate(editingCertId, certForm);
    } else {
      await addCertificate(certForm);
    }
    setCertModalOpen(false);
  };

  // Handlers for Teachers
  const handleSaveTeacher = (e) => {
    e.preventDefault();
    if (editingTeacherId) {
      updateTeacher(editingTeacherId, teacherForm);
    } else {
      addTeacher(teacherForm);
    }
    setTeacherModalOpen(false);
  };

  // Handlers for Classrooms
  const handleSaveClassroom = (e) => {
    e.preventDefault();
    addClassroom(classroomForm);
    setClassroomModalOpen(false);
  };

  const filteredPayments =
    paymentFilter === 'all'
      ? payments
      : payments.filter((p) => p.status === paymentFilter);

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
            <span className="text-white font-medium">Panel de Dirección y Control de Estudios</span>
          </div>

          <div className="glass-surface p-6 sm:p-7 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[11px] font-semibold border border-blue-400/20 inline-block mb-1">
                  Dirección General ({institution.adminEmail})
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                  Larry González • Dirección General
                </h1>
                <p className="text-xs text-slate-400">
                  {institution.name} • Barcelona, Estado Anzoátegui
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5 text-center w-full md:w-auto">
              <div className="glass-surface-subtle px-3.5 py-2.5 rounded-xl text-center">
                <div className="text-lg font-bold font-heading text-white">{subjects.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Materias</div>
              </div>
              <div className="glass-surface-subtle px-3.5 py-2.5 rounded-xl text-center">
                <div className="text-lg font-bold font-heading text-white">{teachersList.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Docentes</div>
              </div>
              <div className="glass-surface-subtle px-3.5 py-2.5 rounded-xl text-center">
                <div className="text-lg font-bold font-heading text-amber-400">
                  {payments.filter((p) => p.status === 'pending').length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Pagos Pend.</div>
              </div>
              <div className="glass-surface-subtle px-3.5 py-2.5 rounded-xl text-center">
                <div className="text-lg font-bold font-heading text-blue-400">{certificates.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Diplomas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="glass-surface rounded-xl p-1 flex gap-1 overflow-x-auto text-xs font-semibold shadow-md">
          <button
            onClick={() => setActiveSubTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'payments' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Auditoría de Pagos ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subjects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'subjects' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Gestión de Asignaturas ({subjects.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'schedules' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Horarios, Recesos y Días Libres</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'certificates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Emisión de Certificados ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'teachers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Nómina de Profesores ({teachersList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('students')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Censo Estudiantil ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('classrooms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'classrooms' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Sistema de Aulas ({classrooms.length})</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: AUDITORÍA DE PAGOS */}
        {activeSubTab === 'payments' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Auditoría y Validación de Pagos
                </h2>
                <p className="text-xs text-slate-400">
                  Concilia los pagos reportados por los representantes y actualiza su solvencia
                </p>
              </div>

              <div className="flex gap-2 text-xs">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPaymentFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition capitalize ${
                      paymentFilter === st ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'Todos' : st === 'pending' ? 'Pendientes' : st === 'approved' ? 'Aprobados' : 'Rechazados'}
                  </button>
                ))}
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-500 italic">
                No hay pagos registrados bajo este filtro.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Representante / Alumno</th>
                      <th className="py-2.5 px-3">Concepto</th>
                      <th className="py-2.5 px-3">Método & Referencia</th>
                      <th className="py-2.5 px-3 text-right">Monto</th>
                      <th className="py-2.5 px-3 text-center">Estado</th>
                      <th className="py-2.5 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{p.representativeName}</div>
                          <div className="text-[11px] text-slate-400">{p.studentName}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-200">{p.paymentConcept}</td>
                        <td className="py-3 px-3">
                          <div className="text-slate-300">{p.paymentMethod}</div>
                          <div className="text-[11px] font-mono text-slate-400">Ref: {p.referenceNumber}</div>
                          {p.receiptUrl && (
                            <a
                              href={p.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <span>Ver comprobante</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-white font-mono">
                          ${Number(p.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : p.status === 'rejected'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {p.status === 'approved' ? 'Aprobado' : p.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          {p.status !== 'approved' && (
                            <button
                              onClick={() => updatePaymentStatus(p.id, 'approved', 'Conciliado en cuenta por Dirección')}
                              className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded"
                              title="Aprobar pago"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {p.status !== 'rejected' && (
                            <button
                              onClick={() => updatePaymentStatus(p.id, 'rejected', 'Referencia bancaria no encontrada')}
                              className="p-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded"
                              title="Rechazar pago"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GESTIÓN DE ASIGNATURAS (Zero mock, full dynamic database) */}
        {activeSubTab === 'subjects' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Catálogo Oficial de Asignaturas
                </h2>
                <p className="text-xs text-slate-400">
                  Agrega asignatura por asignatura a la base de datos de la institución
                </p>
              </div>

              <button
                onClick={() => handleOpenSubjectModal()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Asignatura</span>
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 italic">
                No hay asignaturas en la base de datos. Haz clic en "Agregar Asignatura" para registrar la primera.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Nombre de la Asignatura</th>
                      <th className="py-2.5 px-3">Nivel / Año</th>
                      <th className="py-2.5 px-3">Profesor Asignado</th>
                      <th className="py-2.5 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {subjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono text-blue-400 font-semibold">{sub.code || '—'}</td>
                        <td className="py-3 px-3 font-bold text-white">{sub.name}</td>
                        <td className="py-3 px-3 text-slate-300">{sub.gradeLevel || '4to Año'}</td>
                        <td className="py-3 px-3 text-slate-400">{sub.teacherName || 'Por asignar'}</td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenSubjectModal(sub)}
                            className="p-1.5 text-blue-400 hover:bg-slate-800 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSubject(sub.id)}
                            className="p-1.5 text-rose-400 hover:bg-slate-800 rounded"
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

        {/* TAB 3: HORARIOS, RECESOS Y DÍAS LIBRES */}
        {activeSubTab === 'schedules' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Programación de Horarios, Recesos y Días Libres
                </h2>
                <p className="text-xs text-slate-400">
                  Establece bloques de clases regulares, recesos o marca días libres institucionales
                </p>
              </div>

              <button
                onClick={() => setSchedModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Bloque al Horario</span>
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 italic">
                El horario está vacío. Agrega clases, recesos escolares o días libres.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Día</th>
                      <th className="py-2.5 px-3">Horario</th>
                      <th className="py-2.5 px-3">Tipo de Entrada</th>
                      <th className="py-2.5 px-3">Materia / Actividad</th>
                      <th className="py-2.5 px-3">Aula Asignada</th>
                      <th className="py-2.5 px-3">Docente</th>
                      <th className="py-2.5 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {schedules.map((sc) => (
                      <tr key={sc.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-bold text-white">{sc.day || sc.day_of_week}</td>
                        <td className="py-3 px-3 font-mono text-slate-300">{sc.time}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              sc.entry_type === 'day_off'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : sc.entry_type === 'recess'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : sc.entry_type === 'free_module'
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-900 text-slate-200'
                            }`}
                          >
                            {sc.entry_type === 'day_off'
                              ? 'Día Libre'
                              : sc.entry_type === 'recess'
                              ? 'Receso'
                              : sc.entry_type === 'free_module'
                              ? 'Módulo Libre'
                              : 'Clase Regular'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-white">{sc.subject}</td>
                        <td className="py-3 px-3 text-slate-400">{sc.classroom}</td>
                        <td className="py-3 px-3 text-slate-400">{sc.teacher}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => deleteScheduleBlock(sc.id)}
                            className="p-1.5 text-rose-400 hover:bg-slate-800 rounded"
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

        {/* TAB 4: CERTIFICADOS Y MODELOS AUTOMÁTICOS */}
        {activeSubTab === 'certificates' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Emisión y Edición de Certificados Oficiales
                </h2>
                <p className="text-xs text-slate-400">
                  Modelos de Excelencia Académica, Deportes, Aniversario y Valores con diseño oficial imprimible
                </p>
              </div>

              <button
                onClick={() => handleOpenCertModal()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Emitir Certificado a Alumno</span>
              </button>
            </div>

            {certificates.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 italic">
                No hay certificados emitidos. El administrador puede asignarlos individualmente con modelos automáticos.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Estudiante</th>
                      <th className="py-2.5 px-3">Título / Modelo</th>
                      <th className="py-2.5 px-3">Categoría</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {certificates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{c.certificate_code || c.code}</td>
                        <td className="py-3 px-3 font-bold text-white">{c.studentName || c.student_name}</td>
                        <td className="py-3 px-3 text-slate-200">{c.title}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-800">
                            {c.category === 'grade' ? `Nota: ${c.scoreNote || c.score_note}` : 'Reconocimiento'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400">{c.issue_date || c.issueDate}</td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          <button
                            onClick={() => setPreviewCert(c)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px]"
                          >
                            Imprimir
                          </button>
                          <button
                            onClick={() => handleOpenCertModal(c)}
                            className="p-1 text-blue-400 hover:bg-slate-800 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCertificate(c.id)}
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
            )}
          </div>
        )}

        {/* TAB 5: NÓMINA DE PROFESORES */}
        {activeSubTab === 'teachers' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">Nómina Docente</h2>
                <p className="text-xs text-slate-400">Registra y edita la plantilla de profesores</p>
              </div>

              <button
                onClick={() => { setEditingTeacherId(null); setTeacherModalOpen(true); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Profesor</span>
              </button>
            </div>

            {teachersList.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 italic">
                No hay profesores agregados a la nómina escolar.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachersList.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-slate-400 mt-0.5">{t.department}</div>
                      <div className="text-slate-500 text-[11px] mt-2">{t.email} • {t.phone}</div>
                    </div>
                    <button onClick={() => deleteTeacher(t.id)} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CENSO ESTUDIANTIL */}
        {activeSubTab === 'students' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-heading text-white">Censo Estudiantil Registrado</h2>
                <p className="text-xs text-slate-400">Alumnos inscritos en la plataforma</p>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 italic">
                No hay estudiantes registrados en la base de datos actualmente.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Estudiante</th>
                      <th className="py-2.5 px-3">Cédula</th>
                      <th className="py-2.5 px-3">Año / Grado</th>
                      <th className="py-2.5 px-3 text-right">Boletín Oficial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-bold text-white">{st.name}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">{st.studentIdNumber || '—'}</td>
                        <td className="py-3 px-3 text-slate-300">{st.gradeLevel || '4to Año'}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setPreviewReportCardStudent(st)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px]"
                          >
                            Ver / Imprimir Boletín
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

        {/* TAB 7: AULAS */}
        {activeSubTab === 'classrooms' && (
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-heading text-white">Sistema de Aulas y Espacios</h2>
                <p className="text-xs text-slate-400">Espacios físicos de la sede en Barcelona</p>
              </div>

              <button
                onClick={() => setClassroomModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Aula</span>
              </button>
            </div>

            {classrooms.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 italic">
                No hay aulas registradas en el sistema.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classrooms.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
                    <div className="font-bold text-white text-sm">{c.name}</div>
                    <div className="text-blue-400 font-mono mt-0.5">{c.code}</div>
                    <div className="text-slate-400 mt-2">{c.floor} • Capacidad: {c.capacity} alumnos</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject Modal */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold font-heading text-white mb-4">
              {editingSubId ? 'Editar Asignatura' : 'Agregar Asignatura a la Base de Datos'}
            </h3>
            <form onSubmit={handleSaveSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre de la Materia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Matemáticas"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Código</label>
                  <input
                    type="text"
                    placeholder="MAT-401"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Año / Nivel</label>
                  <select
                    value={subjectForm.gradeLevel}
                    onChange={(e) => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="1er Año">1er Año</option>
                    <option value="2do Año">2do Año</option>
                    <option value="3er Año">3er Año</option>
                    <option value="4to Año">4to Año</option>
                    <option value="5to Año">5to Año</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Profesor Asignado</label>
                <input
                  type="text"
                  placeholder="Ej. Prof. Carlos Ramírez"
                  value={subjectForm.teacherName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacherName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubjectModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg"
                >
                  Guardar Asignatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal (Classes, Recess, Day Off) */}
      {schedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold font-heading text-white mb-3">
              Añadir Entrada al Horario
            </h3>

            {/* Selector de Tipo */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs mb-4">
              <button
                type="button"
                onClick={() => setSchedType('regular')}
                className={`py-1.5 rounded-md font-medium transition ${
                  schedType === 'regular' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Clase Regular
              </button>
              <button
                type="button"
                onClick={() => setSchedType('recess')}
                className={`py-1.5 rounded-md font-medium transition ${
                  schedType === 'recess' ? 'bg-amber-600 text-white' : 'text-slate-400'
                }`}
              >
                Receso
              </button>
              <button
                type="button"
                onClick={() => setSchedType('day_off')}
                className={`py-1.5 rounded-md font-medium transition ${
                  schedType === 'day_off' ? 'bg-blue-700 text-white' : 'text-slate-400'
                }`}
              >
                Día Libre
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Día</label>
                  <select
                    value={schedForm.day}
                    onChange={(e) => setSchedForm({ ...schedForm, day: e.target.value })}
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
                  <label className="block text-slate-400 mb-1">Horario</label>
                  <input
                    type="text"
                    required
                    placeholder="07:00 - 08:30 AM"
                    value={schedForm.time}
                    onChange={(e) => setSchedForm({ ...schedForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {schedType === 'regular' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Materia</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Física"
                      value={schedForm.subject}
                      onChange={(e) => setSchedForm({ ...schedForm, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Aula Asignada</label>
                    <input
                      type="text"
                      placeholder="Aula 1 - Simón Bolívar (A-101)"
                      value={schedForm.classroom}
                      onChange={(e) => setSchedForm({ ...schedForm, classroom: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Profesor Asignado</label>
                    <input
                      type="text"
                      placeholder="Prof. Carlos Ramírez"
                      value={schedForm.teacher}
                      onChange={(e) => setSchedForm({ ...schedForm, teacher: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </>
              )}

              {schedType === 'day_off' && (
                <div>
                  <label className="block text-slate-400 mb-1">Motivo del Día Libre</label>
                  <input
                    type="text"
                    placeholder="Ej. Feriado Regional o Consejo Pedagógico"
                    value={schedForm.notes}
                    onChange={(e) => setSchedForm({ ...schedForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSchedModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg"
                >
                  Guardar en Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Creation & Editing Modal (Templates & Note vs Recognition) */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-lg p-6 my-6">
            <h3 className="text-base font-bold font-heading text-white mb-4">
              {editingCertId ? 'Editar Certificado Oficial' : 'Emitir Certificado Automático'}
            </h3>

            <form onSubmit={handleSaveCert} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre del Estudiante</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Valeria Sofía Morales"
                  value={certForm.studentName}
                  onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cédula de Identidad</label>
                  <input
                    type="text"
                    placeholder="V-31.452.981"
                    value={certForm.studentIdNumber}
                    onChange={(e) => setCertForm({ ...certForm, studentIdNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Año / Grado</label>
                  <input
                    type="text"
                    placeholder="4to Año de Bachillerato"
                    value={certForm.gradeLevel}
                    onChange={(e) => setCertForm({ ...certForm, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Template / Model selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Modelo de Certificado</label>
                  <select
                    value={certForm.template_type}
                    onChange={(e) => {
                      const t = e.target.value;
                      let tit = 'Certificado de Excelencia Académica';
                      let desc = 'En reconocimiento por su destacado rendimiento académico.';
                      if (t === 'sports') {
                        tit = 'Reconocimiento al Mérito Deportivo';
                        desc = 'Por su destacada participación en torneos y disciplina atlética.';
                      } else if (t === 'anniversary') {
                        tit = 'Mención de Aniversario: 35 Años Enseñando a Vivir';
                        desc = 'Por su compromiso y participación en las jornadas conmemorativas del colegio.';
                      } else if (t === 'values') {
                        tit = 'Mención al Civismo, Convivencia y Valores';
                        desc = 'Por su conducta ejemplar, respeto a los símbolos patrios y solidaridad.';
                      }
                      setCertForm({
                        ...certForm,
                        template_type: t,
                        title: tit,
                        description: desc
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="academic">Excelencia Académica</option>
                    <option value="sports">Eventos Deportivos</option>
                    <option value="anniversary">Aniversario Institucional</option>
                    <option value="values">Valores y Convivencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tipo de Certificado</label>
                  <select
                    value={certForm.category}
                    onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="recognition">Reconocimiento (Honor)</option>
                    <option value="grade">Tipo Nota (Con Promedio)</option>
                  </select>
                </div>
              </div>

              {certForm.category === 'grade' && (
                <div>
                  <label className="block text-slate-400 mb-1">Calificación / Promedio a Destacar</label>
                  <input
                    type="text"
                    placeholder="Ej. 19.8 / 20 pts"
                    value={certForm.scoreNote}
                    onChange={(e) => setCertForm({ ...certForm, scoreNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Título del Diploma</label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Texto Conmemorativo</label>
                <textarea
                  rows={3}
                  required
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg"
                >
                  {editingCertId ? 'Actualizar Certificado' : 'Emitir Certificado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold font-heading text-white mb-4">Agregar Profesor</h3>
            <form onSubmit={handleSaveTeacher} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Prof. Carlos Ramírez"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="profesor@integralvenezuela.edu.ve"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+58 412 1234567"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Departamento</label>
                  <input
                    type="text"
                    placeholder="Ciencias Exactas"
                    value={teacherForm.department}
                    onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTeacherModalOpen(false)}
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

      {/* Classroom Modal */}
      {classroomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-surface border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-base font-bold font-heading text-white mb-4">Agregar Aula</h3>
            <form onSubmit={handleSaveClassroom} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre del Aula</label>
                <input
                  type="text"
                  required
                  placeholder="Aula 1 - Simón Bolívar"
                  value={classroomForm.name}
                  onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Código</label>
                  <input
                    type="text"
                    required
                    placeholder="A-101"
                    value={classroomForm.code}
                    onChange={(e) => setClassroomForm({ ...classroomForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Capacidad</label>
                  <input
                    type="number"
                    required
                    value={classroomForm.capacity}
                    onChange={(e) => setClassroomForm({ ...classroomForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClassroomModalOpen(false)}
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

      {/* Official Certificate Preview Modal */}
      <CertificateModal certificate={previewCert} onClose={() => setPreviewCert(null)} />

      {/* Official Report Card Preview Modal */}
      {previewReportCardStudent && (
        <ReportCardModal
          student={previewReportCardStudent}
          grades={grades}
          subjects={subjects}
          onClose={() => setPreviewReportCardStudent(null)}
        />
      )}
    </div>
  );
}
