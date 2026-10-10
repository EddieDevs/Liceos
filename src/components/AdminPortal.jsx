import React, { useState } from 'react';
import {
  ShieldAlert,
  CreditCard,
  Users,
  GraduationCap,
  Calendar,
  School,
  Clock,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Send,
  Building,
  Bell,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminPortal() {
  const {
    currentUser,
    adminUser,
    institution,
    students,
    teachersList,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    schedules,
    addScheduleBlock,
    updateScheduleBlock,
    deleteScheduleBlock,
    classrooms,
    addClassroom,
    payments,
    updatePaymentStatus,
    attendances,
    recordAttendance,
    announcements,
    addAnnouncement,
    subjects,
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments', 'students', 'teachers', 'schedules', 'classrooms', 'announcements'
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  // Teacher Form State
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Ciencias Exactas',
    subjects: ['Matemáticas']
  });

  // Schedule Form State
  const [schedModalOpen, setSchedModalOpen] = useState(false);
  const [editingSchedId, setEditingSchedId] = useState(null);
  const [schedFormData, setSchedFormData] = useState({
    day: 'Lunes',
    time: '07:00 - 08:30 AM',
    subject: subjects[0]?.name || 'Matemáticas',
    classroom: classrooms[0]?.name || 'Aula 1 - Simón Bolívar (A-101)',
    classroomCode: classrooms[0]?.code || 'A-101',
    teacher: teachersList[0]?.name || 'Prof. Carlos Ramírez',
    teacherId: teachersList[0]?.id || 'usr-teacher-1',
  });

  // Attendance quick action
  const [absenceModalOpen, setAbsenceModalOpen] = useState(false);
  const [absenceFormData, setAbsenceFormData] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    subject: 'Dirección / Guardia',
    date: new Date().toISOString().split('T')[0],
    status: 'absent',
    notes: 'Inasistencia general registrada por control de estudios.'
  });

  // Classroom Form State
  const [classroomFormData, setClassroomFormData] = useState({
    name: '',
    code: '',
    capacity: 35,
    floor: 'Planta Baja',
    description: ''
  });

  // Announcement Form State
  const [annFormData, setAnnFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    roleTarget: 'Todos'
  });

  // Verification note for payments
  const [reviewNote, setReviewNote] = useState('');

  // Handlers for Teachers
  const handleOpenTeacherModal = (teach = null) => {
    if (teach) {
      setEditingTeacherId(teach.id);
      setTeacherFormData({
        name: teach.name,
        email: teach.email,
        phone: teach.phone,
        department: teach.department,
        subjects: teach.subjects || ['Matemáticas']
      });
    } else {
      setEditingTeacherId(null);
      setTeacherFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Ciencias Exactas',
        subjects: ['Matemáticas']
      });
    }
    setTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    if (editingTeacherId) {
      updateTeacher(editingTeacherId, teacherFormData);
    } else {
      addTeacher(teacherFormData);
    }
    setTeacherModalOpen(false);
  };

  // Handlers for Schedule
  const handleOpenSchedModal = (sched = null) => {
    if (sched) {
      setEditingSchedId(sched.id);
      setSchedFormData({ ...sched });
    } else {
      setEditingSchedId(null);
      setSchedFormData({
        day: 'Lunes',
        time: '07:00 - 08:30 AM',
        subject: subjects[0]?.name || 'Matemáticas',
        classroom: classrooms[0]?.name || 'Aula 1 - Simón Bolívar (A-101)',
        classroomCode: classrooms[0]?.code || 'A-101',
        teacher: teachersList[0]?.name || 'Prof. Carlos Ramírez',
        teacherId: teachersList[0]?.id || 'usr-teacher-1',
      });
    }
    setSchedModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (editingSchedId) {
      updateScheduleBlock(editingSchedId, schedFormData);
    } else {
      addScheduleBlock(schedFormData);
    }
    setSchedModalOpen(false);
  };

  // Handlers for Absence
  const handleSaveAbsence = async (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === absenceFormData.studentId) || students[0];
    await recordAttendance({
      ...absenceFormData,
      studentName: st.name,
      statusLabel: absenceFormData.status === 'absent' ? 'Falta Injustificada' : 'Falta Justificada',
      sentTo: st.email
    });
    setAbsenceModalOpen(false);
  };

  // Handlers for Classroom
  const handleSaveClassroom = (e) => {
    e.preventDefault();
    addClassroom(classroomFormData);
    setClassroomFormData({
      name: '',
      code: '',
      capacity: 35,
      floor: 'Planta Baja',
      description: ''
    });
  };

  // Handlers for Announcement
  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    await addAnnouncement(annFormData);
    setAnnFormData({
      title: '',
      content: '',
      priority: 'normal',
      roleTarget: 'Todos'
    });
  };

  // Filtered payments
  const filteredPayments =
    paymentFilter === 'all'
      ? payments
      : payments.filter((p) => p.status === paymentFilter);

  const pendingPaymentsCount = payments.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="bg-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
              Inicio
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Panel Administrativo Central</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/70">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatar || adminUser.avatar}
                alt="Director"
                className="w-16 h-16 rounded-xl object-cover border border-slate-600"
              />
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[11px] font-semibold border border-rose-400/20 inline-block mb-1">
                  Administrador General ({institution.adminEmail})
                </span>
                <h1 className="text-2xl font-bold font-heading text-white">
                  Larry González • Dirección General
                </h1>
                <p className="text-xs text-slate-300">
                  {institution.name} • {institution.city}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-white font-heading">{students.length}</div>
                <div className="text-[10px] text-slate-400 uppercase">Alumnos</div>
              </div>
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-white font-heading">{teachersList.length}</div>
                <div className="text-[10px] text-slate-400 uppercase">Docentes</div>
              </div>
              <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700">
                <div className="text-lg font-bold text-amber-400 font-heading">
                  {pendingPaymentsCount}
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Por Revisar</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1 flex gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'payments' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Revisión de Pagos ({pendingPaymentsCount} pendientes)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('students')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'students' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Control de Estudiantes ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'teachers' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestión de Profesores ({teachersList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'schedules' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Horarios y Aulas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('classrooms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'classrooms' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Catálogo de Aulas ({classrooms.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('announcements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'announcements' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Circulares Institucionales</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: PAYMENTS REVIEW */}
        {activeSubTab === 'payments' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Auditoría y Validación de Pagos
                </h2>
                <p className="text-xs text-slate-500">
                  Concilia las transferencias y pagos móviles reportados por los representantes
                </p>
              </div>

              <div className="flex gap-2 text-xs">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPaymentFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition capitalize ${
                      paymentFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'Todos'
                      : st === 'pending'
                      ? 'Pendientes'
                      : st === 'approved'
                      ? 'Aprobados'
                      : 'Rechazados'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Representante / Alumno</th>
                    <th className="py-3 px-3">Concepto</th>
                    <th className="py-3 px-3">Método y Referencia</th>
                    <th className="py-3 px-3 text-right">Monto</th>
                    <th className="py-3 px-3 text-center">Estado</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{p.representativeName}</div>
                        <div className="text-[11px] text-slate-500">
                          {p.studentName} ({p.studentGrade})
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{p.paymentConcept}</td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800">{p.paymentMethod}</div>
                        <div className="text-[11px] font-mono text-slate-500">Ref: {p.referenceNumber}</div>
                        {p.receiptUrl && (
                          <a
                            href={p.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>Ver comprobante</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-heading">
                        ${Number(p.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.status === 'approved'
                            ? 'Aprobado'
                            : p.status === 'rejected'
                            ? 'Rechazado'
                            : 'Pendiente'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        {p.status !== 'approved' && (
                          <button
                            onClick={() => updatePaymentStatus(p.id, 'approved', 'Conciliado en banco por Dirección')}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium"
                            title="Aprobar pago"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button
                            onClick={() => updatePaymentStatus(p.id, 'rejected', 'Referencia no encontrada o monto incorrecto')}
                            className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-medium"
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
          </div>
        )}

        {/* TAB 2: STUDENTS CONTROL */}
        {activeSubTab === 'students' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Censo y Control Estudiantil
                </h2>
                <p className="text-xs text-slate-500">
                  Listado de alumnos matriculados y registro de novedades académicas
                </p>
              </div>

              <button
                onClick={() => setAbsenceModalOpen(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Registrar Falta Institucional</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Estudiante</th>
                    <th className="py-3 px-3">Cédula / Carnet</th>
                    <th className="py-3 px-3">Grado y Sección</th>
                    <th className="py-3 px-3">Representante</th>
                    <th className="py-3 px-3 text-center">Promedio</th>
                    <th className="py-3 px-3 text-center">Asistencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">
                        {st.studentIdNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{st.gradeLevel}</td>
                      <td className="py-3 px-3 text-slate-600">{st.representativeName || 'Titular Asignado'}</td>
                      <td className="py-3 px-3 text-center font-bold text-blue-700">
                        {st.overallAverage} pts
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-emerald-700">
                        {st.attendanceRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TEACHERS MANAGEMENT */}
        {activeSubTab === 'teachers' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Nómina y Asignación de Profesores
                </h2>
                <p className="text-xs text-slate-500">
                  Crea y edita docentes, asigna departamentos y materias a impartir
                </p>
              </div>

              <button
                onClick={() => handleOpenTeacherModal()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Agregar Nuevo Profesor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachersList.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-300"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                      <div className="text-slate-500">{t.department}</div>
                      <div className="text-blue-700 font-medium mt-1">
                        Materias: {Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {t.email} • {t.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenTeacherModal(t)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTeacher(t.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULES & CLASSROOM ASSIGNMENT */}
        {activeSubTab === 'schedules' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Programación de Horarios y Asignación de Aulas
                </h2>
                <p className="text-xs text-slate-500">
                  Modifica qué profesor imparte cada materia, en qué día y en qué aula específica
                </p>
              </div>

              <button
                onClick={() => handleOpenSchedModal()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Añadir Bloque de Horario</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Día</th>
                    <th className="py-3 px-3">Horario</th>
                    <th className="py-3 px-3">Materia</th>
                    <th className="py-3 px-3">Docente Asignado</th>
                    <th className="py-3 px-3">Aula Asignada</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{sc.day}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{sc.time}</td>
                      <td className="py-3 px-3 font-semibold text-blue-700">{sc.subject}</td>
                      <td className="py-3 px-3 text-slate-800">{sc.teacher}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                          {sc.classroom}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenSchedModal(sc)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteScheduleBlock(sc.id)}
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
        )}

        {/* TAB 5: CLASSROOMS CATALOG */}
        {activeSubTab === 'classrooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 font-heading mb-1">
                Registrar Nueva Aula o Espacio
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Añade aulas para su posterior asignación a los profesores
              </p>

              <form onSubmit={handleSaveClassroom} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nombre del Aula</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Aula 6 - Gran Mariscal de Ayacucho"
                    value={classroomFormData.name}
                    onChange={(e) => setClassroomFormData({ ...classroomFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Código del Aula</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. A-106"
                      value={classroomFormData.code}
                      onChange={(e) => setClassroomFormData({ ...classroomFormData, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Capacidad (Alumnos)</label>
                    <input
                      type="number"
                      required
                      value={classroomFormData.capacity}
                      onChange={(e) => setClassroomFormData({ ...classroomFormData, capacity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Piso / Ubicación</label>
                  <select
                    value={classroomFormData.floor}
                    onChange={(e) => setClassroomFormData({ ...classroomFormData, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Planta Baja">Planta Baja</option>
                    <option value="Piso 1">Piso 1</option>
                    <option value="Piso 2">Piso 2</option>
                    <option value="Área Exterior / Canchas">Área Exterior / Canchas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Descripción / Dotación</label>
                  <input
                    type="text"
                    placeholder="Ej. Climatizada, proyector interactivo"
                    value={classroomFormData.description}
                    onChange={(e) => setClassroomFormData({ ...classroomFormData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition"
                >
                  Guardar Aula
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Aulas y Espacios Físicos Registrados ({classrooms.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classrooms.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-blue-700 font-mono font-semibold mt-0.5">
                      Código: {c.code}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {c.floor} • Capacidad: {c.capacity} alumnos
                    </div>
                    {c.description && (
                      <div className="text-[10px] text-slate-400 mt-1 italic">{c.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANNOUNCEMENTS */}
        {activeSubTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 font-heading mb-1">
                Emitir Circular Oficial
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Firma y difunde comunicados para toda la comunidad del Colegio Integral Venezuela
              </p>

              <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cronograma de Exámenes de Reparación"
                    value={annFormData.title}
                    onChange={(e) => setAnnFormData({ ...annFormData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Audiencia Destinataria</label>
                  <select
                    value={annFormData.roleTarget}
                    onChange={(e) => setAnnFormData({ ...annFormData, roleTarget: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Todos">Toda la Comunidad (Público)</option>
                    <option value="Representantes">Solo Representantes</option>
                    <option value="Docentes">Solo Cuerpo Docente</option>
                    <option value="Estudiantes">Solo Estudiantes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contenido</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Texto de la circular institucional..."
                    value={annFormData.content}
                    onChange={(e) => setAnnFormData({ ...annFormData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-xs transition"
                >
                  Difundir Circular
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Circulares Vigentes ({announcements.length})
              </h3>
              {announcements.map((a) => (
                <div key={a.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">{a.title}</span>
                    <span className="text-[10px] text-slate-400">{a.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Teacher Modal */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              {editingTeacherId ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}
            </h3>
            <form onSubmit={handleSaveTeacher} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  placeholder="Prof. Juan Pérez"
                  value={teacherFormData.name}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="juan.perez@integralvenezuela.edu.ve"
                  value={teacherFormData.email}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+58 414 1234567"
                    value={teacherFormData.phone}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Departamento</label>
                  <select
                    value={teacherFormData.department}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Ciencias Exactas">Ciencias Exactas</option>
                    <option value="Ciencias Naturales">Ciencias Naturales</option>
                    <option value="Humanidades y Lengua">Humanidades y Lengua</option>
                    <option value="Idiomas Modernos">Idiomas Modernos</option>
                    <option value="Educación Física">Educación Física</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setTeacherModalOpen(false)}
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

      {/* Schedule Modal */}
      {schedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              {editingSchedId ? 'Editar Bloque de Horario' : 'Añadir Bloque de Horario'}
            </h3>
            <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Día de la Semana</label>
                  <select
                    value={schedFormData.day}
                    onChange={(e) => setSchedFormData({ ...schedFormData, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Horario</label>
                  <input
                    type="text"
                    required
                    placeholder="07:00 - 08:30 AM"
                    value={schedFormData.time}
                    onChange={(e) => setSchedFormData({ ...schedFormData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Materia</label>
                <select
                  value={schedFormData.subject}
                  onChange={(e) => setSchedFormData({ ...schedFormData, subject: e.target.value })}
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
                <label className="block font-medium text-slate-700 mb-1">Docente Asignado</label>
                <select
                  value={schedFormData.teacher}
                  onChange={(e) => {
                    const t = teachersList.find((tc) => tc.name === e.target.value);
                    setSchedFormData({
                      ...schedFormData,
                      teacher: e.target.value,
                      teacherId: t?.id || 'usr-teacher-1'
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Aula Física Asignada</label>
                <select
                  value={schedFormData.classroom}
                  onChange={(e) => {
                    const cl = classrooms.find((c) => c.name === e.target.value);
                    setSchedFormData({
                      ...schedFormData,
                      classroom: e.target.value,
                      classroomCode: cl?.code || 'A-101'
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSchedModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Guardar Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Absence Modal */}
      {absenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              Registrar Inasistencia Oficial
            </h3>
            <form onSubmit={handleSaveAbsence} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Alumno</label>
                <select
                  value={absenceFormData.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    setAbsenceFormData({
                      ...absenceFormData,
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
                  <label className="block font-medium text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={absenceFormData.date}
                    onChange={(e) => setAbsenceFormData({ ...absenceFormData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Condición</label>
                  <select
                    value={absenceFormData.status}
                    onChange={(e) => setAbsenceFormData({ ...absenceFormData, status: e.target.value })}
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
                  value={absenceFormData.notes}
                  onChange={(e) => setAbsenceFormData({ ...absenceFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAbsenceModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg"
                >
                  Registrar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
