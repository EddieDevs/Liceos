import React, { useState, useRef } from 'react';
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
  Key,
  Lock,
  Mail,
  UserPlus,
  Copy,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Upload,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CertificateModal from './CertificateModal';
import ReportCardModal from './ReportCardModal';
import { readFileAsDataURL } from '../lib/fileUpload';

export default function AdminPortal() {
  const {
    currentUser,
    institution,
    adminUser,
    updateAdminCredentials,
    students,
    enrollStudent,
    updateStudent,
    deleteStudent,
    promoteSchoolYear,
    emptyStudentsDatabase,
    sections,
    addSection,
    updateSection,
    deleteSection,
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
    updateClassroom,
    deleteClassroom,
    payments,
    updatePaymentStatus,
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    grades,
    announcements,
    addAnnouncement,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('students'); // 'students', 'sections', 'teachers', 'subjects', 'schedules', 'certificates', 'payments', 'classrooms', 'settings'
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Preview modals
  const [previewCert, setPreviewCert] = useState(null);
  const [previewReportCardStudent, setPreviewReportCardStudent] = useState(null);

  // Requisito 5: Student Enrollment Modal
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    gradeYear: '1er Año',
    sectionLetter: 'Sección A',
    email: '',
    password: '',
    representativeName: '',
    phone: ''
  });

  // Access Credentials Card Modal
  const [selectedAccessStudent, setSelectedAccessStudent] = useState(null);

  // Requisito 9: Confirmation Modals for Promote and Wipe
  const [promoteConfirmOpen, setPromoteConfirmOpen] = useState(false);
  const [wipeConfirmOpen, setWipeConfirmOpen] = useState(false);

  // Editing Student Modal State
  const [editStudentModalOpen, setEditStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editStudentForm, setEditStudentForm] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    gradeYear: '1er Año',
    section: 'Sección A',
    email: '',
    password: '',
    representativeName: '',
    phone: '',
    avatar: ''
  });
  const editStudentPhotoInputRef = useRef(null);

  // Classroom Modal State (Add & Edit)
  const [classroomModalOpen, setClassroomModalOpen] = useState(false);
  const [editingClassroomId, setEditingClassroomId] = useState(null);
  const [classroomForm, setClassroomForm] = useState({
    name: '',
    building: 'Sede Principal',
    capacity: 35,
    status: 'disponible'
  });

  // Requisito 4: Section Modal
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    year: '1er Año',
    section: 'A',
    capacity: 35,
    classroom: classrooms[0]?.name || 'Aula 01',
    guideTeacher: teachersList[0]?.name || 'Por asignar'
  });

  // Requisito 6: Teacher Modal
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    cedula: '',
    email: '',
    specialty: 'Castellano y Literatura',
    phone: '',
    password: 'docente123'
  });

  // Requisito 8: Admin Security Credentials State
  const [adminCredForm, setAdminCredForm] = useState({
    email: adminUser.email,
    password: adminUser.password || '',
    name: adminUser.name,
    phone: adminUser.phone || ''
  });

  // Subject Form State
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    gradeLevel: '1er Año',
    teacherName: teachersList[0]?.name || '',
    color: '#223C63'
  });

  // Schedule Block Form State
  const [schedModalOpen, setSchedModalOpen] = useState(false);
  const [schedType, setSchedType] = useState('regular'); // 'regular', 'recess', 'day_off'
  const [schedForm, setSchedForm] = useState({
    day: 'Lunes',
    time: '07:00 - 08:30 AM',
    subject: subjects[0]?.name || '',
    classroom: classrooms[0]?.name || 'Aula 01',
    teacher: teachersList[0]?.name || '',
    gradeLevel: '1er Año - Sección A',
    notes: ''
  });

  // Certificate Creation / Editing State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    studentIdNumber: students[0]?.cedula || '',
    gradeLevel: students[0]?.grade_year || '1er Año',
    category: 'recognition', // 'grade' or 'recognition'
    template_type: 'academic', // 'academic', 'sports', 'anniversary', 'values'
    title: 'Certificado de Excelencia Académica',
    scoreNote: '19.50',
    description: 'Por haber alcanzado el más alto promedio de notas durante el período escolar.'
  });

  const activeYear = institution.currentSchoolYear || '2027-2028';

  // Handler for enrolling student (Requisito 5)
  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!enrollForm.cedula || !enrollForm.email || !enrollForm.password) {
      notify('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const createdStudent = enrollStudent(enrollForm);
    setEnrollModalOpen(false);
    setSelectedAccessStudent(createdStudent);
    setEnrollForm({
      firstName: '',
      lastName: '',
      cedula: '',
      gradeYear: '1er Año',
      sectionLetter: 'Sección A',
      email: '',
      password: '',
      representativeName: '',
      phone: ''
    });
  };

  // Handler for creating / updating teacher (Requisito 6)
  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (editingTeacherId) {
      updateTeacher(editingTeacherId, teacherForm);
    } else {
      addTeacher(teacherForm);
    }
    setTeacherModalOpen(false);
    setEditingTeacherId(null);
    setTeacherForm({
      name: '',
      cedula: '',
      email: '',
      specialty: 'Castellano y Literatura',
      phone: '',
      password: 'docente123'
    });
  };

  // Handlers for Student Editing
  const handleOpenEditStudent = (stu) => {
    setEditingStudentId(stu.id);
    const names = (stu.name || stu.full_name || '').split(' ');
    const first = stu.firstName || stu.first_name || names[0] || '';
    const last = stu.lastName || stu.last_name || names.slice(1).join(' ') || '';
    setEditStudentForm({
      firstName: first,
      lastName: last,
      cedula: stu.cedula || '',
      gradeYear: stu.grade_year || stu.gradeLevel || '1er Año',
      section: stu.section || 'Sección A',
      email: stu.email || '',
      password: stu.password || stu.password_plain || 'estudiante123',
      representativeName: stu.representativeName || stu.representative_name || '',
      phone: stu.phone || '',
      avatar: stu.avatar || stu.avatar_url || ''
    });
    setEditStudentModalOpen(true);
  };

  const handleStudentPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setEditStudentForm((prev) => ({ ...prev, avatar: dataUrl }));
        notify('Fotografía cargada lista para guardar');
      } catch (err) {
        notify('Error al procesar la imagen', 'error');
      }
    }
  };

  const handleEditStudentSubmit = (e) => {
    e.preventDefault();
    if (!editingStudentId) return;
    updateStudent(editingStudentId, editStudentForm);
    setEditStudentModalOpen(false);
    setEditingStudentId(null);
  };

  // Handlers for Classrooms
  const handleOpenAddClassroom = () => {
    setEditingClassroomId(null);
    setClassroomForm({
      name: `Aula ${String(classrooms.length + 1).padStart(2, '0')}`,
      building: 'Sede Principal',
      capacity: 35,
      status: 'disponible'
    });
    setClassroomModalOpen(true);
  };

  const handleOpenEditClassroom = (clr) => {
    setEditingClassroomId(clr.id);
    setClassroomForm({
      name: clr.name,
      building: clr.building || 'Sede Principal',
      capacity: clr.capacity || 35,
      status: clr.status || 'disponible'
    });
    setClassroomModalOpen(true);
  };

  const handleClassroomSubmit = (e) => {
    e.preventDefault();
    if (editingClassroomId) {
      updateClassroom(editingClassroomId, classroomForm);
    } else {
      addClassroom(classroomForm);
    }
    setClassroomModalOpen(false);
    setEditingClassroomId(null);
  };

  // Handlers for Sections
  const handleOpenAddSection = () => {
    setEditingSectionId(null);
    setSectionForm({
      year: '1er Año',
      section: 'A',
      capacity: 35,
      classroom: classrooms[0]?.name || 'Aula 01',
      guideTeacher: teachersList[0]?.name || 'Por asignar'
    });
    setSectionModalOpen(true);
  };

  const handleOpenEditSection = (sec) => {
    setEditingSectionId(sec.id);
    setSectionForm({
      year: sec.year || sec.grade_year || '1er Año',
      section: sec.section || sec.section_letter || 'A',
      capacity: sec.capacity || 35,
      classroom: sec.classroom || classrooms[0]?.name || 'Aula 01',
      guideTeacher: sec.guideTeacher || sec.guide_teacher || teachersList[0]?.name || 'Por asignar'
    });
    setSectionModalOpen(true);
  };

  const handleSectionSubmit = (e) => {
    e.preventDefault();
    if (editingSectionId) {
      updateSection(editingSectionId, sectionForm);
    } else {
      addSection(sectionForm);
    }
    setSectionModalOpen(false);
    setEditingSectionId(null);
  };

  // Handler for updating admin credentials (Requisito 8)
  const handleAdminCredSubmit = (e) => {
    e.preventDefault();
    updateAdminCredentials(adminCredForm);
  };

  // Handler for certificates
  const handleCertSubmit = (e) => {
    e.preventDefault();
    if (editingCertId) {
      updateCertificate(editingCertId, certForm);
    } else {
      addCertificate(certForm);
    }
    setCertModalOpen(false);
    setEditingCertId(null);
  };

  // When selecting a student in Certificate form, auto-fill cedula and grade
  const handleStudentSelectInCert = (studentId) => {
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setCertForm((prev) => ({
        ...prev,
        studentId: found.id,
        studentName: found.name,
        studentIdNumber: found.cedula || '',
        gradeLevel: `${found.grade_year || found.gradeLevel || '1er Año'} (${found.section || 'Sección A'})`
      }));
    }
  };

  return (
    <div className="min-h-screen denim-pattern text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Panel (Denim Craft Frame) */}
        <div className="denim-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#223C63] border-2 border-[#DCB35C] flex items-center justify-center text-[#DCB35C] shadow-lg">
              <ShieldCheck className="w-8 h-8 text-[#DCB35C]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 denim-patch px-2.5 py-0.5 text-[11px] mb-1">
                <Sparkles className="w-3 h-3 text-[#DCB35C]" />
                <span>Despacho de Dirección General</span>
                <span className="text-slate-500">•</span>
                <span className="text-white font-semibold">Año Escolar {activeYear}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-slab text-white tracking-tight">
                Control de Estudios y Gestión Central
              </h1>
              <p className="text-xs text-slate-300">
                Director: <strong className="text-white">{institution.principal}</strong> • {institution.name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setEnrollModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] font-bold font-slab rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Matricular Estudiante</span>
            </button>
            <button
              onClick={() => setActiveSubTab('settings')}
              className="px-3.5 py-2.5 bg-[#101c30] hover:bg-[#1A2B45] text-slate-300 hover:text-white border border-stitch-subtle rounded-xl text-xs font-bold font-slab flex items-center gap-1.5 transition cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#DCB35C]" />
              <span>Seguridad de Dirección</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3 text-xs font-medium">
          {[
            { id: 'students', label: `Nómina Estudiantes (${students.length})`, icon: GraduationCap },
            { id: 'sections', label: `Secciones (${sections.length})`, icon: Layers },
            { id: 'teachers', label: `Docentes (${teachersList.length})`, icon: Users },
            { id: 'subjects', label: `Asignaturas (${subjects.length})`, icon: BookOpen },
            { id: 'schedules', label: 'Horarios & Días Libres', icon: Clock },
            { id: 'certificates', label: `Certificados (${certificates.length})`, icon: Award },
            { id: 'payments', label: `Pagos & Solvencias (${payments.length})`, icon: CreditCard },
            { id: 'classrooms', label: `Aulas (${classrooms.length})`, icon: Building },
            { id: 'settings', label: 'Ajustes de Dirección', icon: Key },
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

        {/* ============================================================== */}
        {/* PESTAÑA: NÓMINA DE ESTUDIANTES (Requisitos 5 y 9)              */}
        {/* ============================================================== */}
        {activeSubTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            <div className="denim-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Nómina Oficial de Estudiantes</h2>
                <p className="text-xs text-slate-400">
                  Matrícula regular y control de expedientes para el <strong>Año Escolar {activeYear}</strong>
                </p>
              </div>

              {/* Action Buttons for Students (Requisito 9: Subir de año y Vaciar BD) */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setEnrollModalOpen(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Matricular Alumno</span>
                </button>

                <button
                  onClick={() => setPromoteConfirmOpen(true)}
                  className="px-3.5 py-2 bg-[#223C63] hover:bg-[#1A2B45] text-white border border-[#DCB35C]/40 font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  title="Promueve a los alumnos al año siguiente y avanza el año escolar"
                >
                  <ArrowUpRight className="w-4 h-4 text-[#f0c36d]" />
                  <span>Subir de Año Escolar</span>
                </button>

                <button
                  onClick={() => setWipeConfirmOpen(true)}
                  className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  title="Vacía la base de datos de estudiantes para un reinicio limpio"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Vaciar Base de Datos</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="denim-card overflow-hidden">
              {students.length === 0 ? (
                <div className="p-12 text-center">
                  <GraduationCap className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <div className="font-bold text-white text-base font-slab">No hay estudiantes matriculados</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                    La matrícula está en cero. Registra manualmente a cada alumno para generar sus credenciales oficiales.
                  </p>
                  <button
                    onClick={() => setEnrollModalOpen(true)}
                    className="px-4 py-2 bg-[#DCB35C] text-[#1A2B45] font-bold font-slab text-xs rounded-xl"
                  >
                    Matricular Primer Alumno
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#101c30] text-[#f0c36d] border-b border-slate-700/80">
                      <tr>
                        <th className="py-3 px-4 font-slab">Estudiante</th>
                        <th className="py-3 px-4 font-slab">Cédula de Identidad</th>
                        <th className="py-3 px-4 font-slab">Año y Sección</th>
                        <th className="py-3 px-4 font-slab">Representante / Contacto</th>
                        <th className="py-3 px-4 font-slab">Credenciales de Acceso</th>
                        <th className="py-3 px-4 text-right font-slab">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {students.map((stu) => (
                        <tr key={stu.id} className="hover:bg-[#1A2B45]/60 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {stu.avatar || stu.avatar_url ? (
                                <img
                                  src={stu.avatar || stu.avatar_url}
                                  alt=""
                                  className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-[#223C63] border border-slate-700 flex items-center justify-center text-[#DCB35C] shrink-0">
                                  <User className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white font-slab">{stu.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{stu.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#f0c36d]">
                            {stu.cedula || 'Pendiente'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="denim-patch px-2 py-0.5 text-[10px]">
                              {stu.grade_year || stu.gradeLevel} - {stu.section || 'Sección A'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-white font-medium">{stu.representativeName || 'Por asignar'}</div>
                            <div className="text-[11px] text-slate-400">{stu.phone || 'Sin teléfono'}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => setSelectedAccessStudent(stu)}
                              className="px-2.5 py-1 bg-[#101c30] hover:bg-[#223C63] text-[#DCB35C] border border-[#DCB35C]/30 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Key className="w-3 h-3" />
                              <span>Ficha de Credencial</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditStudent(stu)}
                                title="Editar Estudiante"
                                className="p-1.5 text-slate-400 hover:text-[#DCB35C] hover:bg-[#101c30] rounded-lg transition cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setPreviewReportCardStudent(stu)}
                                title="Ver Boletín"
                                className="p-1.5 text-slate-400 hover:text-[#f0c36d] hover:bg-[#101c30] rounded-lg transition cursor-pointer"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteStudent(stu.id)}
                                title="Retirar Alumno"
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: GESTIÓN DE SECCIONES (Requisito 4)                    */}
        {/* ============================================================== */}
        {activeSubTab === 'sections' && (
          <div className="space-y-6 animate-fade-in">
            <div className="denim-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Secciones Oficiales del Plantel</h2>
                <p className="text-xs text-slate-400">
                  Estructura de Educación Media General: desde <strong>1er Año Sección A</strong> hasta <strong>5to Año Sección C</strong>
                </p>
              </div>
              <button
                onClick={handleOpenAddSection}
                className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Sección</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((sec) => {
                const enrolledCount = students.filter(
                  (s) => (s.grade_year === sec.year || s.gradeLevel === sec.year) && s.section === `Sección ${sec.section}`
                ).length;

                return (
                  <div key={sec.id} className="denim-card p-5 space-y-3 relative group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="denim-patch px-2 py-0.5 text-[10px]">{sec.year}</span>
                        <h3 className="text-lg font-bold font-slab text-white mt-1">Sección {sec.section}</h3>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleOpenEditSection(sec)}
                          className="p-1 text-slate-400 hover:text-[#DCB35C] rounded-lg transition cursor-pointer"
                          title="Editar Sección"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSection(sec.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                          title="Eliminar Sección"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Aula Asignada:</span>
                        <strong className="text-white">{sec.classroom}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Profesor Guía:</span>
                        <strong className="text-[#f0c36d]">{sec.guideTeacher}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capacidad Máxima:</span>
                        <span>{sec.capacity} alumnos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Matriculados:</span>
                        <span className="font-bold text-white">{enrolledCount} alumnos</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: GESTIÓN DE DOCENTES (Requisito 6)                     */}
        {/* ============================================================== */}
        {activeSubTab === 'teachers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="denim-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Nómina Docente del Plantel</h2>
                <p className="text-xs text-slate-400">
                  Profesores titulares para asignación de cátedras y horarios
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTeacherId(null);
                  setTeacherForm({
                    name: '',
                    cedula: '',
                    email: '',
                    specialty: 'Castellano y Literatura',
                    phone: '',
                    password: 'docente123'
                  });
                  setTeacherModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nuevo Docente</span>
              </button>
            </div>

            {teachersList.length === 0 ? (
              <div className="denim-card p-12 text-center">
                <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <div className="font-bold text-white text-base font-slab">No hay docentes registrados</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Registra a los profesores de la institución para que puedan ser seleccionados en horarios y materias.
                </p>
                <button
                  onClick={() => setTeacherModalOpen(true)}
                  className="px-4 py-2 bg-[#DCB35C] text-[#1A2B45] font-bold font-slab text-xs rounded-xl"
                >
                  Registrar Primer Docente
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachersList.map((t) => (
                  <div key={t.id} className="denim-card p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {t.avatar || t.avatar_url ? (
                          <img
                            src={t.avatar || t.avatar_url}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover border border-[#DCB35C]/50"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-[#223C63] border border-[#DCB35C]/50 flex items-center justify-center text-[#DCB35C] shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-white text-sm font-slab">{t.name}</h3>
                          <div className="text-[11px] text-[#f0c36d] font-mono">C.I: {t.cedula || 'Pendiente'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTeacherId(t.id);
                            setTeacherForm({
                              name: t.name,
                              cedula: t.cedula || '',
                              email: t.email,
                              specialty: t.specialty || '',
                              phone: t.phone || '',
                              password: t.password || ''
                            });
                            setTeacherModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-[#DCB35C] rounded-lg transition"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTeacher(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                      <div><strong className="text-slate-400">Cátedra / Área:</strong> {t.specialty}</div>
                      <div><strong className="text-slate-400">Correo:</strong> {t.email}</div>
                      <div><strong className="text-slate-400">Teléfono:</strong> {t.phone || 'No registrado'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: ASIGNATURAS (Requisito 6: Selector de Docente)        */}
        {/* ============================================================== */}
        {activeSubTab === 'subjects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="denim-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Plan de Estudios y Asignaturas</h2>
                <p className="text-xs text-slate-400">
                  Agregadas una por una a la base de datos con docente titular asignable
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingSubId(null);
                  setSubjectForm({
                    name: '',
                    code: '',
                    gradeLevel: '1er Año',
                    teacherName: teachersList[0]?.name || '',
                    color: '#223C63'
                  });
                  setSubjectModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Asignatura</span>
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="denim-card p-12 text-center">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <div className="font-bold text-white text-base font-slab">No hay materias creadas</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  El sistema no tiene materias predeterminadas. Agrégalas seleccionando al docente registrado.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((sub) => (
                  <div key={sub.id} className="denim-card p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="denim-patch px-2 py-0.5 text-[10px]">{sub.gradeLevel || '1er Año'}</span>
                        <h3 className="font-bold text-white text-base font-slab mt-1">{sub.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingSubId(sub.id);
                            setSubjectForm({
                              name: sub.name,
                              code: sub.code || '',
                              gradeLevel: sub.gradeLevel || '1er Año',
                              teacherName: sub.teacherName || '',
                              color: sub.color || '#223C63'
                            });
                            setSubjectModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-[#DCB35C] rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSubject(sub.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 pt-2 border-t border-slate-700/60 space-y-1">
                      <div><strong className="text-slate-400">Docente Titular:</strong> {sub.teacherName || 'Sin asignar'}</div>
                      <div><strong className="text-slate-400">Código de Materia:</strong> {sub.code || 'MAT-CIV'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: HORARIOS Y DÍAS LIBRES (Selectores Requisito 6)       */}
        {/* ============================================================== */}
        {activeSubTab === 'schedules' && (
          <div className="space-y-6 animate-fade-in">
            <div className="denim-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Horarios, Recesos y Días Libres</h2>
                <p className="text-xs text-slate-400">
                  Programa clases regulares, recesos escolares y declara días no laborables
                </p>
              </div>
              <button
                onClick={() => setSchedModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Bloque de Horario</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
                const dayBlocks = schedules.filter((s) => s.day_of_week === day || s.day === day);
                return (
                  <div key={day} className="denim-card p-4 space-y-3">
                    <div className="font-bold font-slab text-sm text-[#f0c36d] border-b border-slate-700/60 pb-1 flex justify-between items-center">
                      <span>{day}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{dayBlocks.length} bloques</span>
                    </div>

                    {dayBlocks.length === 0 ? (
                      <div className="text-[11px] text-slate-500 italic py-3 text-center">Sin actividades</div>
                    ) : (
                      dayBlocks.map((b) => {
                        const isRecess = b.entry_type === 'recess' || b.subject_name?.toLowerCase().includes('receso') || b.subject?.toLowerCase().includes('receso');
                        const isDayOff = b.entry_type === 'day_off';
                        const isFree = b.entry_type === 'free_module';
                        const title = isRecess
                          ? 'Receso'
                          : (isDayOff ? 'Día Libre' : (isFree ? 'Módulo Libre' : (b.subject_name || b.subject || 'Clase Regular')));

                        return (
                          <div
                            key={b.id}
                            className={`p-2.5 rounded-lg border text-xs space-y-1 relative group ${
                              isDayOff
                                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                                : isRecess
                                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                                : isFree
                                ? 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                                : 'bg-[#101c30] border-slate-700 text-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-1.5">
                                <strong className="text-white font-slab text-xs">{title}</strong>
                                {isRecess && (
                                  <span className="text-[9px] bg-amber-500/20 text-[#f0c36d] px-1.5 py-0.2 rounded font-mono">
                                    Receso
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => deleteScheduleBlock(b.id)}
                                className="text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-[10px] text-slate-400 font-mono">{b.start_time || b.time?.split('-')[0]?.trim()} - {b.end_time || b.time?.split('-')[1]?.trim() || b.time}</div>
                            {b.classroom_name && <div className="text-[10px] text-[#DCB35C]">Aula: {b.classroom_name}</div>}
                            {b.teacher_name && <div className="text-[10px] text-slate-400">Docente: {b.teacher_name}</div>}
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

        {/* ============================================================== */}
        {/* PESTAÑA: CERTIFICADOS Y RECONOCIMIENTOS (Requisito 7)          */}
        {/* ============================================================== */}
        {activeSubTab === 'certificates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="denim-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Emisión de Certificados Oficiales</h2>
                <p className="text-xs text-slate-400">
                  Modelos automáticos: Excelencia Académica, Reconocimiento Deportivo, Aniversario y Valores
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCertId(null);
                  if (students[0]) {
                    handleStudentSelectInCert(students[0].id);
                  }
                  setCertModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Emitir Certificado</span>
              </button>
            </div>

            {certificates.length === 0 ? (
              <div className="denim-card p-12 text-center">
                <Award className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <div className="font-bold text-white text-base font-slab">No hay certificados emitidos</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Selecciona a cualquier alumno matriculado y asígnale un reconocimiento oficial.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="denim-card p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="denim-patch px-2 py-0.5 text-[10px]">{cert.template_type || 'Académico'}</span>
                        <h3 className="font-bold text-white text-sm font-slab mt-1">{cert.title}</h3>
                        <div className="text-xs text-[#f0c36d] font-bold mt-0.5">{cert.studentName}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPreviewCert(cert)}
                          className="p-1.5 text-slate-400 hover:text-white"
                          title="Imprimir"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCertificate(cert.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{cert.description}</p>
                    {cert.scoreNote && (
                      <div className="text-xs font-mono font-bold text-[#DCB35C]">
                        Puntaje: {cert.scoreNote} pts
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: AJUSTES DE SEGURIDAD DE DIRECCIÓN (Requisito 8)       */}
        {/* ============================================================== */}
        {activeSubTab === 'settings' && (
          <div className="denim-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="border-b border-slate-700/60 pb-3">
              <h2 className="text-lg font-bold font-slab text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-[#DCB35C]" />
                <span>Credenciales de Dirección General</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Actualiza el correo y la clave de acceso administrativo. Se guardarán en la base de datos oficial.
              </p>
            </div>

            <form onSubmit={handleAdminCredSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Nombre del Director General</label>
                <input
                  type="text"
                  required
                  value={adminCredForm.name}
                  onChange={(e) => setAdminCredForm({ ...adminCredForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Correo Electrónico Administrativo</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={adminCredForm.email}
                    onChange={(e) => setAdminCredForm({ ...adminCredForm, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Nueva Contraseña de Administrador</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={adminCredForm.password}
                    onChange={(e) => setAdminCredForm({ ...adminCredForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Teléfono Institucional</label>
                <input
                  type="tel"
                  value={adminCredForm.phone}
                  onChange={(e) => setAdminCredForm({ ...adminCredForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guardar Credenciales en Base de Datos</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: PAGOS & SOLVENCIAS                                   */}
        {/* ============================================================== */}
        {activeSubTab === 'payments' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Conciliación de Pagos y Comprobantes</h2>
                <p className="text-xs text-slate-400">Comprobantes subidos directamente por los representantes legales</p>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                <CreditCard className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-white font-slab">No hay pagos pendientes de revisión</div>
                <p className="text-xs text-slate-400 mt-1">Los pagos reportados por representantes aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-[#101c30] border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-white font-slab text-sm">{p.studentName || p.student_name}</div>
                      <div className="text-slate-400">Representante: {p.representativeName || p.representative_name}</div>
                      <div className="text-slate-400 font-mono">Ref: {p.referenceNumber || p.reference_number} • Monto: ${p.amount}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${p.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                        {p.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                      </span>
                      {p.status !== 'approved' && (
                        <button
                          onClick={() => updatePaymentStatus(p.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                        >
                          Aprobar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: AULAS Y ESPACIOS                                     */}
        {/* ============================================================== */}
        {activeSubTab === 'classrooms' && (
          <div className="space-y-6 animate-fade-in">
            <div className="denim-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Espacios y Aulas</h2>
                <p className="text-xs text-slate-400">Aulas disponibles para asignar a secciones y horarios</p>
              </div>
              <button
                onClick={handleOpenAddClassroom}
                className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nueva Aula</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {classrooms.map((c) => (
                <div key={c.id} className="denim-card p-4 space-y-2 relative group">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-white font-slab text-sm">{c.name}</div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEditClassroom(c)}
                        className="p-1 text-slate-400 hover:text-[#DCB35C] rounded-lg transition cursor-pointer"
                        title="Editar Aula"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteClassroom(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                        title="Eliminar Aula"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">Edificio: {c.building || 'Sede Principal'}</div>
                  <div className="text-xs text-[#DCB35C]">Capacidad: {c.capacity} pupitres</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: MATRICULAR ESTUDIANTE (Requisito 5)                   */}
      {/* ============================================================== */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-lg p-6 text-white my-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold font-slab text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#DCB35C]" />
                  <span>Matriculación Oficial de Estudiante</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Año Escolar {activeYear} • Genera las credenciales institucionales
                </p>
              </div>
              <button onClick={() => setEnrollModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Nombres</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. José Daniel"
                    value={enrollForm.firstName}
                    onChange={(e) => setEnrollForm({ ...enrollForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Apellidos</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Marcano Silva"
                    value={enrollForm.lastName}
                    onChange={(e) => setEnrollForm({ ...enrollForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Cédula de Identidad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. V-31.542.890"
                  value={enrollForm.cedula}
                  onChange={(e) => setEnrollForm({ ...enrollForm, cedula: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Año a Cursar</label>
                  <select
                    value={enrollForm.gradeYear}
                    onChange={(e) => setEnrollForm({ ...enrollForm, gradeYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  >
                    <option value="1er Año">1er Año de Bachillerato</option>
                    <option value="2do Año">2do Año de Bachillerato</option>
                    <option value="3er Año">3er Año de Bachillerato</option>
                    <option value="4to Año">4to Año de Bachillerato</option>
                    <option value="5to Año">5to Año de Bachillerato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Sección Oficial</label>
                  <select
                    value={enrollForm.sectionLetter}
                    onChange={(e) => setEnrollForm({ ...enrollForm, sectionLetter: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  >
                    <option value="Sección A">Sección A</option>
                    <option value="Sección B">Sección B</option>
                    <option value="Sección C">Sección C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Correo Electrónico (Usuario)</label>
                  <input
                    type="email"
                    required
                    placeholder="alumno@integralvenezuela.edu.ve"
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Contraseña Asignada</label>
                  <input
                    type="text"
                    required
                    placeholder="clave123"
                    value={enrollForm.password}
                    onChange={(e) => setEnrollForm({ ...enrollForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Nombre del Representante</label>
                  <input
                    type="text"
                    placeholder="Ej. María Silva"
                    value={enrollForm.representativeName}
                    onChange={(e) => setEnrollForm({ ...enrollForm, representativeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    placeholder="+58 414 1234567"
                    value={enrollForm.phone}
                    onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md cursor-pointer"
                >
                  Matricular y Guardar Credenciales
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: FICHA DE CREDENCIALES DEL ALUMNO (Requisito 5)         */}
      {/* ============================================================== */}
      {selectedAccessStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <div>
                <h3 className="text-base font-bold font-slab text-[#f0c36d]">Ficha de Acceso para el Representante</h3>
                <p className="text-xs text-slate-400">Entrega estas credenciales al representante del alumno</p>
              </div>
              <button onClick={() => setSelectedAccessStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#101c30] border border-slate-700 space-y-2.5 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Estudiante:</span>
                <strong className="text-white text-sm font-slab">{selectedAccessStudent.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Cédula:</span>
                <strong className="text-[#f0c36d]">{selectedAccessStudent.cedula}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Año y Sección:</span>
                <strong className="text-white">{selectedAccessStudent.grade_year || selectedAccessStudent.gradeLevel} - {selectedAccessStudent.section}</strong>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Usuario / Correo:</span>
                <strong className="text-white select-all">{selectedAccessStudent.email}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Contraseña Inicial:</span>
                <strong className="text-white select-all text-sm text-[#f0c36d]">{selectedAccessStudent.password}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Credenciales de Acceso - U.E. Colegio Integral Venezuela\nEstudiante: ${selectedAccessStudent.name}\nCédula: ${selectedAccessStudent.cedula}\nAño: ${selectedAccessStudent.grade_year} ${selectedAccessStudent.section}\nCorreo: ${selectedAccessStudent.email}\nContraseña: ${selectedAccessStudent.password}`);
                  notify('Ficha de credenciales copiada al portapapeles');
                }}
                className="px-4 py-2 bg-[#223C63] hover:bg-[#1A2B45] text-white border border-[#DCB35C]/40 rounded-xl text-xs font-bold font-slab flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#DCB35C]" />
                <span>Copiar Ficha</span>
              </button>
              <button
                onClick={() => setSelectedAccessStudent(null)}
                className="px-4 py-2 bg-[#DCB35C] text-[#1A2B45] font-bold font-slab rounded-xl text-xs cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: SUBIR DE AÑO ESCOLAR (Requisito 9)                    */}
      {/* ============================================================== */}
      {promoteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border-2 border-[#DCB35C] rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <ArrowUpRight className="w-7 h-7 text-[#f0c36d]" />
              <div>
                <h3 className="text-base font-bold font-slab text-white">Promover al Siguiente Año Escolar</h3>
                <p className="text-xs text-slate-400">Prosecución de Estudios Institucional</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 p-3.5 bg-[#101c30] rounded-xl border border-slate-700">
              <p>Esta acción ejecutará automáticamente:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>1er Año pasará a 2do Año</li>
                <li>2do Año pasará a 3er Año</li>
                <li>3er Año pasará a 4to Año</li>
                <li>4to Año pasará a 5to Año</li>
                <li>5to Año pasará a estado <strong>Egresado (Bachiller)</strong></li>
                <li>El Año Escolar activo cambiará en toda la página de <strong>{activeYear}</strong> al siguiente período.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPromoteConfirmOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  promoteSchoolYear();
                  setPromoteConfirmOpen(false);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Confirmar y Promover Alumnos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: VACIAR BASE DE DATOS (Requisito 9)                    */}
      {/* ============================================================== */}
      {wipeConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border-2 border-rose-500 rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
              <div>
                <h3 className="text-base font-bold font-slab text-white">¿Vaciar Nómina de Estudiantes?</h3>
                <p className="text-xs text-rose-300">Advertencia de seguridad del sistema</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed p-3.5 bg-rose-950/40 rounded-xl border border-rose-500/30">
              Esta acción eliminará todos los estudiantes matriculados, notas registradas, asistencias y pagos pendientes para dejar la base de datos limpia. Las secciones y las asignaturas se mantendrán intactas.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setWipeConfirmOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  emptyStudentsDatabase();
                  setWipeConfirmOpen(false);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold font-slab text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Sí, Vaciar Base de Datos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDITAR EXPEDIENTE ESTUDIANTE                            */}
      {/* ============================================================== */}
      {editStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#152338] border border-stitch rounded-lg w-full max-w-lg p-6 text-white my-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold font-slab text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-[#DCB35C]" />
                  <span>Editar Estudiante</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Modifica datos personales, sección, credenciales y fotografía oficial
                </p>
              </div>
              <button onClick={() => setEditStudentModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStudentSubmit} className="space-y-3.5 text-xs">
              {/* Photo preview and upload */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[#101c30] border border-slate-700/80">
                {editStudentForm.avatar ? (
                  <img
                    src={editStudentForm.avatar}
                    alt="Preview"
                    className="w-14 h-16 rounded-lg object-cover border border-[#DCB35C]/50 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-16 rounded-lg bg-[#101c30] border border-[#DCB35C]/50 flex items-center justify-center text-[#DCB35C] shadow-sm">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-300 block">Fotografía del Carnet y Expediente</span>
                  <button
                    type="button"
                    onClick={() => editStudentPhotoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#223C63] hover:bg-[#1A2B45] border border-[#DCB35C]/40 rounded-lg text-white font-bold font-slab text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#DCB35C]" />
                    <span>Subir Nueva Foto</span>
                  </button>
                  <input
                    type="file"
                    ref={editStudentPhotoInputRef}
                    accept="image/*"
                    onChange={handleStudentPhotoChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Nombres</label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.firstName}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Apellidos</label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.lastName}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Cédula de Identidad</label>
                  <input
                    type="text"
                    required
                    placeholder="V-31.000.000"
                    value={editStudentForm.cedula}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, cedula: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Año que Cursa</label>
                  <select
                    value={editStudentForm.gradeYear}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, gradeYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  >
                    <option value="1er Año">1er Año</option>
                    <option value="2do Año">2do Año</option>
                    <option value="3er Año">3er Año</option>
                    <option value="4to Año">4to Año</option>
                    <option value="5to Año">5to Año</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Sección</label>
                  <select
                    value={editStudentForm.section}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  >
                    <option value="Sección A">Sección A</option>
                    <option value="Sección B">Sección B</option>
                    <option value="Sección C">Sección C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Teléfono de Contacto</label>
                  <input
                    type="text"
                    value={editStudentForm.phone}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Representante Legal</label>
                <input
                  type="text"
                  placeholder="Nombre y Apellido del Padre o Tutor"
                  value={editStudentForm.representativeName}
                  onChange={(e) => setEditStudentForm({ ...editStudentForm, representativeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Correo Institucional</label>
                  <input
                    type="email"
                    required
                    value={editStudentForm.email}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Contraseña de Acceso</label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.password}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditStudentModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-lg shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AGREGAR / EDITAR AULA                                   */}
      {/* ============================================================== */}
      {classroomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-lg w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">
                {editingClassroomId ? 'Editar Espacio o Aula' : 'Agregar Nueva Aula'}
              </h3>
              <button onClick={() => setClassroomModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClassroomSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nombre o Código del Aula</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Aula 01 / Laboratorio de Química"
                  value={classroomForm.name}
                  onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Edificio / Ubicación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sede Principal / Módulo B / Ala Este"
                  value={classroomForm.building}
                  onChange={(e) => setClassroomForm({ ...classroomForm, building: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Capacidad de Pupitres (Estudiantes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={classroomForm.capacity}
                  onChange={(e) => setClassroomForm({ ...classroomForm, capacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setClassroomModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-lg shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingClassroomId ? 'Guardar Cambios' : 'Crear Aula'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: AGREGAR / EDITAR SECCIÓN (Requisito 4)                 */}
      {/* ============================================================== */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-lg w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">
                {editingSectionId ? 'Editar Sección Escolar' : 'Agregar Sección Escolar'}
              </h3>
              <button onClick={() => setSectionModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSectionSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Año de Bachillerato</label>
                  <select
                    value={sectionForm.year}
                    onChange={(e) => setSectionForm({ ...sectionForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="1er Año">1er Año</option>
                    <option value="2do Año">2do Año</option>
                    <option value="3er Año">3er Año</option>
                    <option value="4to Año">4to Año</option>
                    <option value="5to Año">5to Año</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Sección (Solo hasta la C)</label>
                  <select
                    value={sectionForm.section}
                    onChange={(e) => setSectionForm({ ...sectionForm, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="A">Sección A</option>
                    <option value="B">Sección B</option>
                    <option value="C">Sección C</option>
                  </select>
                </div>
              </div>

              {/* Selector de Aula */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Aula Asignada (Selector)</label>
                <select
                  value={sectionForm.classroom}
                  onChange={(e) => setSectionForm({ ...sectionForm, classroom: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.name}>{c.name} ({c.building})</option>
                  ))}
                </select>
              </div>

              {/* Selector de Profesor Guía */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Profesor Guía (Selector de Docentes)</label>
                <select
                  value={sectionForm.guideTeacher}
                  onChange={(e) => setSectionForm({ ...sectionForm, guideTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  <option value="Por asignar">Por asignar</option>
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Capacidad Máxima de Pupitres</label>
                <input
                  type="number"
                  min="15"
                  max="45"
                  value={sectionForm.capacity}
                  onChange={(e) => setSectionForm({ ...sectionForm, capacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-lg shadow-md cursor-pointer"
                >
                  {editingSectionId ? 'Guardar Cambios' : 'Guardar Sección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: AGREGAR / EDITAR DOCENTE (Requisito 6)                */}
      {/* ============================================================== */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">
                {editingTeacherId ? 'Editar Datos del Docente' : 'Registrar Nuevo Docente'}
              </h3>
              <button onClick={() => setTeacherModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nombre Completo del Profesor</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Prof. Carlos Mendoza"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Cédula de Identidad</label>
                  <input
                    type="text"
                    required
                    placeholder="V-14.892.341"
                    value={teacherForm.cedula}
                    onChange={(e) => setTeacherForm({ ...teacherForm, cedula: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Área / Especialidad</label>
                  <select
                    required
                    value={teacherForm.specialty}
                    onChange={(e) => setTeacherForm({ ...teacherForm, specialty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] focus:outline-hidden"
                  >
                    <option value="">-- Seleccionar Asignatura / Cátedra --</option>
                    {subjects.length > 0 && (
                      <optgroup label="Asignaturas Creadas en el Sistema">
                        {subjects.map((sub) => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Cátedras de Bachillerato">
                      <option value="Castellano y Literatura">Castellano y Literatura</option>
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Física">Física</option>
                      <option value="Química">Química</option>
                      <option value="Biología">Biología</option>
                      <option value="Ciencias Naturales">Ciencias Naturales</option>
                      <option value="Geografía, Historia y Ciudadanía">Geografía, Historia y Ciudadanía</option>
                      <option value="Historia de Venezuela">Historia de Venezuela</option>
                      <option value="Formación para la Soberanía Nacional">Formación para la Soberanía Nacional</option>
                      <option value="Inglés">Inglés</option>
                      <option value="Educación Física">Educación Física</option>
                      <option value="Orientación y Convivencia">Orientación y Convivencia</option>
                      <option value="Informática y Computación">Informática y Computación</option>
                      <option value="Arte y Patrimonio">Arte y Patrimonio</option>
                      <option value="Ciencias de la Tierra">Ciencias de la Tierra</option>
                      <option value="Filosofía y Lógica">Filosofía y Lógica</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="docente@integralvenezuela.edu.ve"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Contraseña Asignada</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Teléfono de Contacto</label>
                <input
                  type="tel"
                  placeholder="+58 414 1234567"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setTeacherModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  {editingTeacherId ? 'Actualizar Docente' : 'Guardar Docente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: AGREGAR / EDITAR MATERIA (Selector de Docente)        */}
      {/* ============================================================== */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">
                {editingSubId ? 'Editar Asignatura' : 'Crear Asignatura en Base de Datos'}
              </h3>
              <button onClick={() => setSubjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingSubId) {
                  updateSubject(editingSubId, subjectForm);
                } else {
                  addSubject(subjectForm);
                }
                setSubjectModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nombre de la Asignatura</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Matemática, Física, Química, Biología..."
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Código</label>
                  <input
                    type="text"
                    placeholder="MAT-01"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Año del Plan</label>
                  <select
                    value={subjectForm.gradeLevel}
                    onChange={(e) => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="1er Año">1er Año</option>
                    <option value="2do Año">2do Año</option>
                    <option value="3er Año">3er Año</option>
                    <option value="4to Año">4to Año</option>
                    <option value="5to Año">5to Año</option>
                  </select>
                </div>
              </div>

              {/* Selector de Docente Titular (Requisito 6) */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Docente Titular (Selector)</label>
                <select
                  value={subjectForm.teacherName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacherName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  <option value="">Selecciona un docente registrado...</option>
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setSubjectModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  Guardar Asignatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 8: HORARIO CON SELECTORES (Requisito 6)                  */}
      {/* ============================================================== */}
      {schedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">Programar Bloque de Horario</h3>
              <button onClick={() => setSchedModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addScheduleBlock({
                  ...schedForm,
                  entry_type: schedType
                });
                setSchedModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Type selector: Regular, Recess, Day Off */}
              <div className="flex rounded-xl bg-[#101c30] p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setSchedType('regular')}
                  className={`flex-1 py-1.5 rounded-lg font-bold font-slab transition ${
                    schedType === 'regular' ? 'bg-[#223C63] text-white' : 'text-slate-400'
                  }`}
                >
                  Clase Regular
                </button>
                <button
                  type="button"
                  onClick={() => setSchedType('recess')}
                  className={`flex-1 py-1.5 rounded-lg font-bold font-slab transition ${
                    schedType === 'recess' ? 'bg-amber-900/60 text-amber-200' : 'text-slate-400'
                  }`}
                >
                  Receso Escolar
                </button>
                <button
                  type="button"
                  onClick={() => setSchedType('day_off')}
                  className={`flex-1 py-1.5 rounded-lg font-bold font-slab transition ${
                    schedType === 'day_off' ? 'bg-rose-900/60 text-rose-200' : 'text-slate-400'
                  }`}
                >
                  Día Libre
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Día de la Semana</label>
                  <select
                    value={schedForm.day}
                    onChange={(e) => setSchedForm({ ...schedForm, day: e.target.value })}
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
                    value={schedForm.time}
                    onChange={(e) => setSchedForm({ ...schedForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>
              </div>

              {schedType === 'regular' && (
                <>
                  {/* Selector de Materia */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Asignatura (Selector)</label>
                    <select
                      value={schedForm.subject}
                      onChange={(e) => setSchedForm({ ...schedForm, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>{s.name} ({s.gradeLevel})</option>
                      ))}
                    </select>
                  </div>

                  {/* Selector de Profesor */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Docente (Selector)</label>
                    <select
                      value={schedForm.teacher}
                      onChange={(e) => setSchedForm({ ...schedForm, teacher: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                    >
                      {teachersList.map((t) => (
                        <option key={t.id} value={t.name}>{t.name} ({t.specialty})</option>
                      ))}
                    </select>
                  </div>

                  {/* Selector de Aula */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Aula (Selector)</label>
                    <select
                      value={schedForm.classroom}
                      onChange={(e) => setSchedForm({ ...schedForm, classroom: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                    >
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.name}>{c.name} ({c.building})</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {schedType === 'recess' && (
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Descripción del Receso</label>
                  <input
                    type="text"
                    placeholder="Pausa pedagógica / Desayuno recreativo"
                    value={schedForm.notes}
                    onChange={(e) => setSchedForm({ ...schedForm, notes: e.target.value, subject: 'Receso Escolar' })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>
              )}

              {schedType === 'day_off' && (
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Motivo del Día Libre</label>
                  <input
                    type="text"
                    placeholder="Feriado nacional / Efeméride / Consejo docente"
                    value={schedForm.notes}
                    onChange={(e) => setSchedForm({ ...schedForm, notes: e.target.value, subject: 'Día Libre (No Laborable)' })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setSchedModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  Guardar Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 9: EMITIR CERTIFICADO (Selector de Alumno Requisito 6/7) */}
      {/* ============================================================== */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#152338] border border-stitch rounded-2xl w-full max-w-lg p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
              <h3 className="text-base font-bold font-slab text-white">Emitir Certificado Institucional</h3>
              <button onClick={() => setCertModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCertSubmit} className="space-y-3.5 text-xs">
              {/* Selector de Alumno (Requisito 6) */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Seleccionar Alumno (Selector de Nómina)</label>
                <select
                  value={certForm.studentId}
                  onChange={(e) => handleStudentSelectInCert(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — C.I: {s.cedula || 'Sin cédula'} ({s.grade_year || s.gradeLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Plantilla */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Modelo de Certificado</label>
                  <select
                    value={certForm.template_type}
                    onChange={(e) => {
                      const t = e.target.value;
                      let tit = 'Certificado de Excelencia Académica';
                      if (t === 'sports') tit = 'Reconocimiento Deportivo';
                      if (t === 'anniversary') tit = 'Participación Conmemorativa 35 Años';
                      if (t === 'values') tit = 'Mérito en Valores y Ciudadanía';
                      setCertForm({ ...certForm, template_type: t, title: tit });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="academic">Excelencia Académica</option>
                    <option value="sports">Reconocimiento Deportivo</option>
                    <option value="anniversary">Aniversario Institucional</option>
                    <option value="values">Valores y Convivencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Tipo de Reconocimiento</label>
                  <select
                    value={certForm.category}
                    onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="recognition">Tipo Reconocimiento (Mérito)</option>
                    <option value="grade">Tipo Nota (Con Promedio)</option>
                  </select>
                </div>
              </div>

              {/* Calificación centrada debajo del nombre (Requisito 7) */}
              {certForm.category === 'grade' && (
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Puntos Obtenidos (Aparecerá Centrado Debajo del Nombre)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 19.50"
                    value={certForm.scoreNote}
                    onChange={(e) => setCertForm({ ...certForm, scoreNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Texto del Reconocimiento</label>
                <textarea
                  rows={2}
                  required
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md"
                >
                  Emitir y Generar Certificado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Certificate Modal */}
      {previewCert && (
        <CertificateModal
          certificate={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}

      {/* Preview Report Card Modal */}
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
