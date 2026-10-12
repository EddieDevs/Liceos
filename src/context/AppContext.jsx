import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  initialInstitution,
  initialAdmin,
  initialSections,
  initialSubjects,
  initialStudents,
  initialTeachersList,
  initialClassrooms,
  initialGrades,
  initialEvaluationPlans,
  initialSchedules,
  initialAttendances,
  initialCertificates,
  initialMemories,
  initialPayments,
  initialAnnouncements,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current user state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('iv_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'student-portal', 'teacher-portal', 'representative-portal', 'admin-portal'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetAuthRole, setTargetAuthRole] = useState('student');

  // Institution settings (includes currentSchoolYear)
  const [institution, setInstitution] = useState(() => {
    const saved = localStorage.getItem('iv_institution');
    return saved ? JSON.parse(saved) : initialInstitution;
  });

  // Admin Account (email & password saved in DB / localStorage)
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('iv_admin_account');
    return saved ? JSON.parse(saved) : initialAdmin;
  });

  // Sections (1er a 5to año, Secciones A a C)
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('iv_sections');
    return saved ? JSON.parse(saved) : initialSections;
  });

  // Dynamic Data States
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('iv_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [classrooms, setClassrooms] = useState(() => {
    const saved = localStorage.getItem('iv_classrooms');
    return saved ? JSON.parse(saved) : initialClassrooms;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('iv_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teachersList, setTeachersList] = useState(() => {
    const saved = localStorage.getItem('iv_teachers_list');
    return saved ? JSON.parse(saved) : initialTeachersList;
  });

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('iv_grades');
    return saved ? JSON.parse(saved) : initialGrades;
  });

  const [evaluationPlans, setEvaluationPlans] = useState(() => {
    const saved = localStorage.getItem('iv_eval_plans');
    return saved ? JSON.parse(saved) : initialEvaluationPlans;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('iv_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [attendances, setAttendances] = useState(() => {
    const saved = localStorage.getItem('iv_attendances');
    return saved ? JSON.parse(saved) : initialAttendances;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('iv_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('iv_memories');
    return saved ? JSON.parse(saved) : initialMemories;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('iv_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('iv_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const notify = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('iv_institution', JSON.stringify(institution));
  }, [institution]);

  useEffect(() => {
    localStorage.setItem('iv_admin_account', JSON.stringify(adminUser));
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem('iv_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('iv_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('iv_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('iv_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('iv_teachers_list', JSON.stringify(teachersList));
  }, [teachersList]);

  useEffect(() => {
    localStorage.setItem('iv_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('iv_eval_plans', JSON.stringify(evaluationPlans));
  }, [evaluationPlans]);

  useEffect(() => {
    localStorage.setItem('iv_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('iv_attendances', JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem('iv_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('iv_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('iv_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('iv_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('iv_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('iv_current_user');
    }
  }, [currentUser]);

  // Sync with Supabase on load
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data: info } = await supabase.from('school_settings').select('*').limit(1);
        if (info && info.length > 0) {
          setSupabaseConnected(true);
          if (info[0].current_school_year) {
            setInstitution(prev => ({
              ...prev,
              currentSchoolYear: info[0].current_school_year,
              admissions: {
                ...prev.admissions,
                period: `Año Escolar ${info[0].current_school_year}`
              }
            }));
          }
          if (info[0].admin_email) {
            setAdminUser(prev => ({
              ...prev,
              email: info[0].admin_email,
              password: info[0].admin_password || prev.password
            }));
          }
        }

        // Fetch sections
        const { data: secData } = await supabase.from('sections').select('*');
        if (secData && secData.length > 0) {
          const normSections = secData.map(s => ({
            id: s.id,
            year: s.grade_year || s.year || '1er Año',
            section: s.section_letter || s.section || 'A',
            name: s.name || `${s.grade_year || '1er Año'} - Sección ${s.section_letter || 'A'}`,
            capacity: s.capacity || 35,
            classroom: s.classroom || 'Aula por asignar',
            guideTeacher: s.guide_teacher || s.guideTeacher || 'Por asignar'
          }));
          setSections(normSections);
        }

        // Fetch subjects
        const { data: subData } = await supabase.from('subjects').select('*');
        if (subData && subData.length > 0) setSubjects(subData);

        // Fetch classrooms
        const { data: clrData } = await supabase.from('classrooms').select('*');
        if (clrData && clrData.length > 0) setClassrooms(clrData);

        // Fetch teachers
        const { data: tchData } = await supabase.from('teachers').select('*');
        if (tchData && tchData.length > 0) setTeachersList(tchData);

        // Fetch students
        const { data: stuData } = await supabase.from('students').select('*');
        if (stuData && stuData.length > 0) {
          const normStudents = stuData.map(s => ({
            id: s.id,
            name: s.full_name || s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Estudiante',
            firstName: s.first_name || s.firstName || '',
            lastName: s.last_name || s.lastName || '',
            cedula: s.cedula || '',
            gradeLevel: s.grade_year || s.gradeLevel || '1er Año',
            grade_year: s.grade_year || s.gradeLevel || '1er Año',
            section: s.section || 'Sección A',
            email: s.email || '',
            password: s.password_plain || s.password || '',
            representativeName: s.representative_name || s.representativeName || 'Por asignar',
            phone: s.phone || '',
            status: s.status || 'Activo',
            avatar: s.avatar_url || s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          }));
          setStudents(normStudents);
        }

        // Fetch schedules
        const { data: schData } = await supabase.from('schedules').select('*');
        if (schData && schData.length > 0) {
          const normSchedules = schData.map(s => ({
            id: s.id,
            day: s.day_of_week || s.day || 'Lunes',
            day_of_week: s.day_of_week || s.day || 'Lunes',
            time: s.time || (s.start_time && s.end_time ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}` : '07:00 - 08:30 AM'),
            start_time: s.start_time || s.time?.split('-')[0]?.trim() || '07:00',
            end_time: s.end_time || s.time?.split('-')[1]?.trim() || '08:30',
            classroom: s.classroom_name || s.classroom || 'Aula 01',
            classroom_name: s.classroom_name || s.classroom || 'Aula 01',
            subject: s.subject_name || s.subjectName || s.subject || (s.entry_type === 'recess' ? 'Receso' : (s.entry_type === 'day_off' ? 'Día Libre' : 'Clase Regular')),
            subjectName: s.subject_name || s.subjectName || s.subject || (s.entry_type === 'recess' ? 'Receso' : (s.entry_type === 'day_off' ? 'Día Libre' : 'Clase Regular')),
            subject_name: s.subject_name || s.subjectName || s.subject || (s.entry_type === 'recess' ? 'Receso' : (s.entry_type === 'day_off' ? 'Día Libre' : 'Clase Regular')),
            teacher: s.teacher_name || s.teacher || 'Docente Titular',
            teacher_name: s.teacher_name || s.teacher || 'Docente Titular',
            gradeLevel: s.grade_level || s.gradeLevel || '1er Año - Sección A',
            grade_level: s.grade_level || s.gradeLevel || '1er Año - Sección A',
            entry_type: s.entry_type || 'regular',
            notes: s.notes || ''
          }));
          setSchedules(normSchedules);
        }

        // Fetch certificates
        const { data: certData } = await supabase.from('certificates').select('*');
        if (certData && certData.length > 0) setCertificates(certData);

        // Fetch memories
        const { data: memData } = await supabase.from('memories').select('*');
        if (memData && memData.length > 0) setMemories(memData);

        // Fetch payments
        const { data: payData } = await supabase.from('payments').select('*');
        if (payData && payData.length > 0) setPayments(payData);
      } catch (err) {
        setSupabaseConnected(false);
      }
    }
    loadFromSupabase();

    // Supabase auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const currentAdminEmail = adminUser.email?.toLowerCase();
        const isAdmin = user.email?.toLowerCase() === currentAdminEmail;

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          const resolvedRole = isAdmin ? 'admin' : (profile?.role || user.user_metadata?.role || 'representative');

          const userObj = {
            id: user.id,
            email: user.email,
            name: isAdmin ? adminUser.name : (profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]),
            cedula: profile?.cedula || '',
            role: resolvedRole,
            gradeLevel: profile?.grade_level || user.user_metadata?.grade_level || '1er Año',
            section: profile?.section || 'Sección A',
            avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
            isSupabaseUser: true,
          };
          setCurrentUser(userObj);

          if (isAdmin) setActiveTab('admin-portal');
          else if (resolvedRole === 'teacher') setActiveTab('teacher-portal');
          else if (resolvedRole === 'representative') setActiveTab('representative-portal');
          else setActiveTab('student-portal');
        } catch (e) {
          const resolvedRole = isAdmin ? 'admin' : 'representative';
          const userObj = {
            id: user.id,
            email: user.email,
            name: isAdmin ? adminUser.name : user.email?.split('@')[0],
            role: resolvedRole,
            isSupabaseUser: true,
          };
          setCurrentUser(userObj);
          if (isAdmin) setActiveTab('admin-portal');
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [adminUser.email]);

  // Admin Login Handler
  const loginAsAdmin = () => {
    const userObj = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: 'admin',
      title: adminUser.title,
      avatar: adminUser.avatar,
      phone: adminUser.phone
    };
    setCurrentUser(userObj);
    setActiveTab('admin-portal');
    setAuthModalOpen(false);
    notify(`Acceso concedido a Dirección General (${adminUser.name})`);
  };

  const logout = async () => {
    if (currentUser?.isSupabaseUser) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setActiveTab('home');
    notify('Has cerrado sesión');
  };

  // REQUISITO 8: Actualizar credenciales del Administrador en la Base de Datos
  const updateAdminCredentials = async ({ email, password, name, phone }) => {
    const updated = {
      ...adminUser,
      email: email ? email.trim() : adminUser.email,
      password: password ? password : adminUser.password,
      name: name || adminUser.name,
      phone: phone || adminUser.phone,
    };
    setAdminUser(updated);
    setInstitution(prev => ({
      ...prev,
      adminEmail: updated.email,
      principal: updated.name
    }));

    if (currentUser?.role === 'admin') {
      setCurrentUser(prev => ({ ...prev, email: updated.email, name: updated.name }));
    }

    try {
      if (supabaseConnected) {
        await supabase.from('school_settings').upsert({
          id: 'settings-main',
          admin_email: updated.email,
          admin_password: updated.password,
          updated_at: new Date().toISOString()
        });
      }
    } catch (e) {}

    notify('Credenciales de Dirección actualizadas y guardadas en la base de datos');
  };

  // REQUISITO 1: Actualizar Perfil de Estudiante (Cédula, Año, Sección, etc.)
  const updateStudentProfile = async (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    // Sync in students list
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === updated.id || s.email === updated.email);
      if (exists) {
        return prev.map((s) => (s.id === updated.id || s.email === updated.email ? { ...s, ...updates } : s));
      }
      return [...prev, updated];
    });

    try {
      if (supabaseConnected && updated.id) {
        await supabase.from('students').update({
          full_name: updated.name,
          cedula: updated.cedula,
          grade_year: updated.gradeLevel || updated.grade_year,
          section: updated.section,
          phone: updated.phone,
          avatar_url: updated.avatar
        }).eq('id', updated.id);

        await supabase.from('profiles').update({
          full_name: updated.name,
          cedula: updated.cedula,
          grade_level: updated.gradeLevel,
          section: updated.section,
          phone: updated.phone,
          avatar_url: updated.avatar
        }).eq('id', updated.id);
      }
    } catch (e) {}

    notify('Datos del estudiante actualizados correctamente');
  };

  // REQUISITO 5: Matricular Estudiante (Solo el Administrador)
  const enrollStudent = async (studentData) => {
    const newStudent = {
      id: `stu-${Date.now()}`,
      name: `${studentData.firstName} ${studentData.lastName}`.trim(),
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      cedula: studentData.cedula,
      gradeLevel: studentData.gradeYear || '1er Año',
      grade_year: studentData.gradeYear || '1er Año',
      section: studentData.sectionLetter || 'Sección A',
      email: studentData.email.trim().toLowerCase(),
      password: studentData.password,
      representativeName: studentData.representativeName || 'Por asignar',
      representativePhone: studentData.phone || '',
      phone: studentData.phone || '',
      role: 'student',
      status: 'Activo',
      enrolledAt: new Date().toLocaleDateString('es-ES'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };

    setStudents((prev) => [newStudent, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('students').insert({
          id: newStudent.id,
          first_name: newStudent.firstName,
          last_name: newStudent.lastName,
          full_name: newStudent.name,
          cedula: newStudent.cedula,
          grade_year: newStudent.grade_year,
          section: newStudent.section,
          email: newStudent.email,
          password_plain: newStudent.password,
          representative_name: newStudent.representativeName,
          phone: newStudent.phone,
          status: 'Activo'
        });
      }
    } catch (e) {}

    notify(`Estudiante matriculado: ${newStudent.name} (${newStudent.grade_year} ${newStudent.section})`);
    return newStudent;
  };

  const deleteStudent = async (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('students').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Estudiante retirado de la matrícula');
  };

  const updateStudent = async (id, updatedData) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const merged = { ...s, ...updatedData };
          if (updatedData.firstName || updatedData.lastName) {
            merged.name = `${updatedData.firstName || s.firstName || ''} ${updatedData.lastName || s.lastName || ''}`.trim() || merged.name;
          }
          if (updatedData.gradeYear) {
            merged.gradeLevel = updatedData.gradeYear;
            merged.grade_year = updatedData.gradeYear;
          }
          return merged;
        }
        return s;
      })
    );

    // If updating currently logged in user
    if (currentUser?.id === id) {
      setCurrentUser((prev) => ({
        ...prev,
        ...updatedData,
        name: updatedData.name || (updatedData.firstName ? `${updatedData.firstName} ${updatedData.lastName || ''}`.trim() : prev.name),
        gradeLevel: updatedData.gradeYear || updatedData.gradeLevel || prev.gradeLevel
      }));
    }

    try {
      if (supabaseConnected) {
        await supabase.from('students').update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          full_name: updatedData.name || (updatedData.firstName ? `${updatedData.firstName} ${updatedData.lastName || ''}`.trim() : undefined),
          cedula: updatedData.cedula,
          grade_year: updatedData.gradeYear || updatedData.grade_year || updatedData.gradeLevel,
          section: updatedData.section,
          email: updatedData.email,
          password_plain: updatedData.password,
          representative_name: updatedData.representativeName,
          phone: updatedData.phone,
          avatar_url: updatedData.avatar
        }).eq('id', id);
      }
    } catch (e) {}

    notify('Expediente del estudiante actualizado exitosamente');
  };

  // REQUISITO 6: Gestión de Profesores (Agregar, Editar, Eliminar)
  const addTeacher = async (teacherData) => {
    const newTeacher = {
      id: `tch-${Date.now()}`,
      name: teacherData.name,
      cedula: teacherData.cedula || 'V-00.000.000',
      email: teacherData.email.trim().toLowerCase(),
      specialty: teacherData.specialty || 'Educación Media General',
      phone: teacherData.phone || '',
      password: teacherData.password || 'docente123',
      role: 'teacher',
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    };

    setTeachersList((prev) => [newTeacher, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('teachers').insert({
          id: newTeacher.id,
          full_name: newTeacher.name,
          cedula: newTeacher.cedula,
          email: newTeacher.email,
          specialty: newTeacher.specialty,
          phone: newTeacher.phone,
          password_plain: newTeacher.password
        });
      }
    } catch (e) {}

    notify(`Profesor "${newTeacher.name}" registrado en la nómina docente`);
    return newTeacher;
  };

  const updateTeacher = async (id, updatedData) => {
    setTeachersList((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
    try {
      if (supabaseConnected) {
        await supabase.from('teachers').update(updatedData).eq('id', id);
      }
    } catch (e) {}
    notify('Datos del docente actualizados');
  };

  const deleteTeacher = async (id) => {
    setTeachersList((prev) => prev.filter((t) => t.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('teachers').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Docente eliminado del registro');
  };

  // REQUISITO 4: Gestión de Secciones (1er Año a 5to Año, Secciones A a C)
  const addSection = async (secData) => {
    const newSec = {
      id: `sec-${Date.now()}`,
      year: secData.year, // '1er Año', '2do Año', '3er Año', '4to Año', '5to Año'
      section: secData.section, // 'A', 'B', 'C'
      name: `${secData.year} - Sección ${secData.section}`,
      capacity: Number(secData.capacity) || 35,
      classroom: secData.classroom || 'Aula por asignar',
      guideTeacher: secData.guideTeacher || 'Por asignar'
    };

    // Check if section already exists
    const exists = sections.some(s => s.year === newSec.year && s.section === newSec.section);
    if (exists) {
      notify(`La sección ${newSec.name} ya existe en el sistema`, 'error');
      return null;
    }

    setSections((prev) => [...prev, newSec]);

    try {
      if (supabaseConnected) {
        await supabase.from('sections').insert({
          id: newSec.id,
          grade_year: newSec.year,
          section_letter: newSec.section,
          name: newSec.name,
          capacity: newSec.capacity,
          classroom: newSec.classroom,
          guide_teacher: newSec.guideTeacher
        });
      }
    } catch (e) {}

    notify(`Sección ${newSec.name} agregada con éxito`);
    return newSec;
  };

  const deleteSection = async (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('sections').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Sección escolar eliminada');
  };

  const updateSection = async (id, updatedData) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const year = updatedData.year || s.year;
          const section = updatedData.section || s.section;
          return {
            ...s,
            ...updatedData,
            year,
            section,
            name: `${year} - Sección ${section}`
          };
        }
        return s;
      })
    );

    try {
      if (supabaseConnected) {
        await supabase.from('sections').update({
          grade_year: updatedData.year,
          section_letter: updatedData.section,
          name: updatedData.year && updatedData.section ? `${updatedData.year} - Sección ${updatedData.section}` : undefined,
          capacity: updatedData.capacity ? Number(updatedData.capacity) : undefined,
          classroom: updatedData.classroom,
          guide_teacher: updatedData.guideTeacher
        }).eq('id', id);
      }
    } catch (e) {}

    notify('Sección escolar actualizada');
  };

  // REQUISITO 9: Promover al siguiente Año Escolar (Prosecución de Estudios)
  const promoteSchoolYear = async () => {
    const currentYearStr = institution.currentSchoolYear || '2027-2028';
    const parts = currentYearStr.split('-');
    let nextYearStr = '2028-2029';
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const y1 = parseInt(parts[0], 10) + 1;
      const y2 = parseInt(parts[1], 10) + 1;
      nextYearStr = `${y1}-${y2}`;
    }

    // Advance students grade
    const promotedStudents = students.map((s) => {
      let nextGrade = s.grade_year || s.gradeLevel;
      let status = s.status || 'Activo';

      if (nextGrade === '1er Año') nextGrade = '2do Año';
      else if (nextGrade === '2do Año') nextGrade = '3er Año';
      else if (nextGrade === '3er Año') nextGrade = '4to Año';
      else if (nextGrade === '4to Año') nextGrade = '5to Año';
      else if (nextGrade === '5to Año') {
        nextGrade = 'Egresado';
        status = 'Egresado (Bachiller)';
      }

      return {
        ...s,
        grade_year: nextGrade,
        gradeLevel: nextGrade,
        status: status
      };
    });

    setStudents(promotedStudents);

    // Update Institution Period
    const updatedInst = {
      ...institution,
      currentSchoolYear: nextYearStr,
      admissions: {
        ...institution.admissions,
        period: `Año Escolar ${nextYearStr}`
      }
    };
    setInstitution(updatedInst);

    try {
      if (supabaseConnected) {
        await supabase.from('school_settings').upsert({
          id: 'settings-main',
          current_school_year: nextYearStr,
          updated_at: new Date().toISOString()
        });
      }
    } catch (e) {}

    notify(`¡Año Escolar actualizado con éxito a ${nextYearStr}! Se han promovido todos los estudiantes.`);
  };

  // REQUISITO 9: Vaciar la Base de Datos de Estudiantes y Registros
  const emptyStudentsDatabase = async () => {
    setStudents([]);
    setGrades([]);
    setAttendances([]);
    setCertificates([]);
    setPayments([]);

    try {
      if (supabaseConnected) {
        await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('grades').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('attendances').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('certificates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      }
    } catch (e) {}

    notify('Nómina de estudiantes y registros vaciados con éxito. Base de datos reiniciada.');
  };

  // SUBJECTS MANAGEMENT (Admin only)
  const addSubject = async (subData) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...subData,
    };
    setSubjects((prev) => [...prev, newSub]);

    try {
      if (supabaseConnected) {
        await supabase.from('subjects').insert({
          id: newSub.id,
          name: newSub.name,
          code: newSub.code,
          grade_level: newSub.gradeLevel,
          teacher_id: newSub.teacherId,
          teacher_name: newSub.teacherName,
          color: newSub.color,
        });
      }
    } catch (e) {}

    notify(`Asignatura "${newSub.name}" agregada al plan de estudios`);
    return newSub;
  };

  const updateSubject = async (id, updatedData) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    try {
      if (supabaseConnected) {
        await supabase.from('subjects').update(updatedData).eq('id', id);
      }
    } catch (e) {}
    notify('Asignatura actualizada');
  };

  const deleteSubject = async (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('subjects').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Asignatura eliminada');
  };

  // SCHEDULES MANAGEMENT (Regular, Recess, Free Module, Day Off)
  const addScheduleBlock = async (schedData) => {
    const isRecess = schedData.entry_type === 'recess';
    const isDayOff = schedData.entry_type === 'day_off';
    const isFreeModule = schedData.entry_type === 'free_module';

    const cleanSubject = isRecess
      ? 'Receso'
      : (isDayOff ? 'Día Libre' : (schedData.subject || schedData.subjectName || schedData.subject_name || 'Clase Regular'));

    const newBlock = {
      id: `sch-${Date.now()}`,
      day: schedData.day || schedData.day_of_week || 'Lunes',
      day_of_week: schedData.day || schedData.day_of_week || 'Lunes',
      time: schedData.time || '07:00 - 08:30 AM',
      start_time: schedData.time?.split('-')[0]?.trim() || '07:00:00',
      end_time: schedData.time?.split('-')[1]?.trim() || '08:30:00',
      classroom: schedData.classroom || schedData.classroom_name || (isRecess ? 'Patio Central' : 'Aula 01'),
      classroom_name: schedData.classroom || schedData.classroom_name || (isRecess ? 'Patio Central' : 'Aula 01'),
      subject: cleanSubject,
      subjectName: cleanSubject,
      subject_name: cleanSubject,
      teacher: schedData.teacher || schedData.teacher_name || (isRecess ? 'Personal de Guardia' : 'Docente Titular'),
      teacher_name: schedData.teacher || schedData.teacher_name || (isRecess ? 'Personal de Guardia' : 'Docente Titular'),
      gradeLevel: schedData.gradeLevel || schedData.grade_level || '1er Año - Sección A',
      grade_level: schedData.gradeLevel || schedData.grade_level || '1er Año - Sección A',
      entry_type: schedData.entry_type || 'regular',
      notes: schedData.notes || '',
      ...schedData
    };
    newBlock.subject = cleanSubject;
    newBlock.subjectName = cleanSubject;
    newBlock.subject_name = cleanSubject;

    setSchedules((prev) => [...prev, newBlock]);

    try {
      if (supabaseConnected) {
        await supabase.from('schedules').upsert({
          id: newBlock.id,
          day_of_week: newBlock.day_of_week,
          start_time: newBlock.start_time,
          end_time: newBlock.end_time,
          classroom_name: newBlock.classroom_name,
          subject_name: newBlock.subject_name,
          teacher_name: newBlock.teacher_name,
          grade_level: newBlock.grade_level,
          entry_type: newBlock.entry_type,
          notes: newBlock.notes
        });
      }
    } catch (e) {}

    let msg = 'Bloque de horario añadido';
    if (newBlock.entry_type === 'day_off') msg = `Día libre (${newBlock.day}) programado`;
    if (newBlock.entry_type === 'recess') msg = 'Receso escolar programado';
    if (newBlock.entry_type === 'free_module') msg = 'Módulo libre registrado';
    notify(msg);
    return newBlock;
  };

  const updateScheduleBlock = async (id, updatedData) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const isRecess = (updatedData.entry_type || s.entry_type) === 'recess';
          const sub = isRecess
            ? 'Receso'
            : (updatedData.subject || updatedData.subjectName || s.subject || 'Clase Regular');
          return {
            ...s,
            ...updatedData,
            subject: sub,
            subjectName: sub,
            subject_name: sub,
            day: updatedData.day || updatedData.day_of_week || s.day,
            day_of_week: updatedData.day || updatedData.day_of_week || s.day,
            classroom: updatedData.classroom || updatedData.classroom_name || s.classroom,
            classroom_name: updatedData.classroom || updatedData.classroom_name || s.classroom
          };
        }
        return s;
      })
    );

    try {
      if (supabaseConnected) {
        await supabase.from('schedules').update({
          day_of_week: updatedData.day || updatedData.day_of_week,
          start_time: updatedData.time?.split('-')[0]?.trim(),
          end_time: updatedData.time?.split('-')[1]?.trim(),
          classroom_name: updatedData.classroom || updatedData.classroom_name,
          subject_name: updatedData.subject || updatedData.subjectName,
          teacher_name: updatedData.teacher || updatedData.teacher_name,
          grade_level: updatedData.gradeLevel || updatedData.grade_level,
          entry_type: updatedData.entry_type,
          notes: updatedData.notes
        }).eq('id', id);
      }
    } catch (e) {}
    notify('Horario actualizado');
  };

  const deleteScheduleBlock = async (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('schedules').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Bloque retirado del horario');
  };

  // CERTIFICATES MANAGEMENT
  const addCertificate = async (certData) => {
    const newCert = {
      id: `cert-${Date.now()}`,
      certificate_code: `CIV-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${institution.currentSchoolYear || '2027-2028'}`,
      issue_date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: certData.category || 'recognition', // 'grade' or 'recognition'
      template_type: certData.template_type || 'academic', // 'academic', 'sports', 'anniversary', 'values'
      issued_by: `${institution.principal}, Director General`,
      ...certData
    };
    setCertificates((prev) => [newCert, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('certificates').insert({
          id: newCert.id,
          student_id: newCert.studentId,
          title: newCert.title,
          description: newCert.description,
          verification_code: newCert.certificate_code,
          category: newCert.category,
          template_type: newCert.template_type,
          student_name: newCert.studentName,
          student_id_number: newCert.studentIdNumber,
          grade_level: newCert.gradeLevel,
          score_note: newCert.scoreNote,
          custom_text: newCert.customText
        });
      }
    } catch (e) {}

    notify(`Certificado oficial emitido a ${newCert.studentName || 'estudiante'}`);
    return newCert;
  };

  const updateCertificate = async (id, updatedData) => {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)));
    try {
      if (supabaseConnected) {
        await supabase.from('certificates').update(updatedData).eq('id', id);
      }
    } catch (e) {}
    notify('Certificado editado correctamente');
  };

  const deleteCertificate = async (id) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('certificates').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Certificado eliminado');
  };

  // MEMORIES
  const addMemory = async (memData) => {
    const newMem = {
      id: `mem-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      author_name: memData.authorName || currentUser?.name || 'Estudiante',
      grade_year: memData.gradeYear || currentUser?.gradeLevel || '4to Año',
      ...memData
    };
    setMemories((prev) => [newMem, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('memories').insert({
          id: newMem.id,
          title: newMem.title,
          description: newMem.description,
          photo_url: newMem.image,
          student_name: newMem.author_name,
          year_title: newMem.grade_year
        });
      }
    } catch (e) {}

    notify('Tu recuerdo ha sido publicado en el anuario');
    return newMem;
  };

  // PAYMENTS
  const addPayment = async (payData) => {
    const newPay = {
      id: `pay-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      admin_notes: 'Pendiente de conciliación bancaria',
      ...payData
    };
    setPayments((prev) => [newPay, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('payments').insert({
          id: newPay.id,
          representative_name: newPay.representativeName,
          student_name: newPay.studentName,
          amount: newPay.amount,
          payment_method: newPay.paymentMethod,
          reference_number: newPay.referenceNumber,
          concept: newPay.paymentConcept,
          receipt_url: newPay.receiptUrl,
          status: 'pending'
        });
      }
    } catch (e) {}

    notify('Comprobante de pago enviado a la Dirección para su validación');
    return newPay;
  };

  const updatePaymentStatus = async (id, newStatus, notes = '') => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: newStatus, admin_notes: notes || (newStatus === 'approved' ? 'Pago verificado y solvente' : 'Pago rechazado') }
          : p
      )
    );

    try {
      if (supabaseConnected) {
        await supabase.from('payments').update({
          status: newStatus
        }).eq('id', id);
      }
    } catch (e) {}

    notify(newStatus === 'approved' ? 'Pago aprobado exitosamente' : 'Estado de pago actualizado');
  };

  // GRADES
  const addOrUpdateGrade = async (gradeData) => {
    const isUpdate = !!gradeData.id;
    let newGrade;
    if (isUpdate) {
      newGrade = { ...gradeData };
      setGrades((prev) => prev.map((g) => (g.id === gradeData.id ? newGrade : g)));
    } else {
      newGrade = {
        id: `gr-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...gradeData
      };
      setGrades((prev) => [newGrade, ...prev]);
    }

    notify(isUpdate ? 'Calificación actualizada' : 'Calificación registrada en el sistema');
    return newGrade;
  };

  const deleteGrade = (id) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
    notify('Calificación eliminada');
  };

  // EVALUATION PLANS
  const addEvaluationPlan = async (planData) => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      status: 'Programado',
      ...planData
    };
    setEvaluationPlans((prev) => [newPlan, ...prev]);
    notify('Plan de evaluación publicado');
    return newPlan;
  };

  const deleteEvaluationPlan = (id) => {
    setEvaluationPlans((prev) => prev.filter((p) => p.id !== id));
    notify('Plan de evaluación retirado');
  };

  // ATTENDANCE
  const recordAttendance = async (attData) => {
    const newAtt = {
      id: `att-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      notified: true,
      ...attData
    };
    setAttendances((prev) => [newAtt, ...prev]);
    notify('Inasistencia registrada en el expediente');
    return newAtt;
  };

  // CLASSROOMS
  const addClassroom = async (clrData) => {
    const newClr = {
      id: `clr-${Date.now()}`,
      name: clrData.name,
      building: clrData.building || 'Sede Principal',
      capacity: Number(clrData.capacity) || 35,
      status: clrData.status || 'disponible'
    };
    setClassrooms((prev) => [...prev, newClr]);

    try {
      if (supabaseConnected) {
        await supabase.from('classrooms').insert({
          id: newClr.id,
          name: newClr.name,
          building: newClr.building,
          capacity: newClr.capacity,
          status: newClr.status
        });
      }
    } catch (e) {}

    notify(`Aula "${newClr.name}" agregada`);
    return newClr;
  };

  const updateClassroom = async (id, updatedData) => {
    setClassrooms((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updatedData,
              capacity: updatedData.capacity !== undefined ? Number(updatedData.capacity) : c.capacity
            }
          : c
      )
    );

    try {
      if (supabaseConnected) {
        await supabase.from('classrooms').update({
          name: updatedData.name,
          building: updatedData.building,
          capacity: updatedData.capacity !== undefined ? Number(updatedData.capacity) : undefined,
          status: updatedData.status
        }).eq('id', id);
      }
    } catch (e) {}

    notify('Información del aula actualizada');
  };

  const deleteClassroom = async (id) => {
    setClassrooms((prev) => prev.filter((c) => c.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('classrooms').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Aula eliminada del inventario');
  };

  // ANNOUNCEMENTS
  const addAnnouncement = async (annData) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...annData
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    notify('Circular oficial emitida');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateStudentProfile,
        activeTab,
        setActiveTab,
        authModalOpen,
        setAuthModalOpen,
        targetAuthRole,
        setTargetAuthRole,
        institution,
        setInstitution,
        adminUser,
        updateAdminCredentials,
        sections,
        addSection,
        updateSection,
        deleteSection,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        classrooms,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        students,
        setStudents,
        enrollStudent,
        updateStudent,
        deleteStudent,
        promoteSchoolYear,
        emptyStudentsDatabase,
        teachersList,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        grades,
        addOrUpdateGrade,
        deleteGrade,
        evaluationPlans,
        addEvaluationPlan,
        deleteEvaluationPlan,
        schedules,
        addScheduleBlock,
        updateScheduleBlock,
        deleteScheduleBlock,
        attendances,
        recordAttendance,
        certificates,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        memories,
        addMemory,
        payments,
        addPayment,
        updatePaymentStatus,
        announcements,
        addAnnouncement,
        loginAsAdmin,
        logout,
        supabaseConnected,
        toastMessage,
        notify,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
