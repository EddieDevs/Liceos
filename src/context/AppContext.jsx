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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((p) => !['plan-1', 'plan-2', 'plan-3', 'plan-4', 'plan-5', 'ep-1', 'ep-2'].includes(p.id));
      } catch (e) {
        return [];
      }
    }
    return initialEvaluationPlans;
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((m) => !['mem-1', 'mem-2', 'mem-3', 'mem-4', 'g1', 'g2', 'g3', 'g4'].includes(m.id));
      } catch (e) {
        return [];
      }
    }
    return initialMemories;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('iv_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('iv_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [admissionRequests, setAdmissionRequests] = useState(() => {
    const saved = localStorage.getItem('iv_admission_requests');
    return saved ? JSON.parse(saved) : [];
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
    localStorage.setItem('iv_admission_requests', JSON.stringify(admissionRequests));
  }, [admissionRequests]);

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
        if (tchData && tchData.length > 0) {
          const normTeachers = tchData.map(t => ({
            id: t.id,
            name: t.full_name || t.name || 'Docente Titular',
            full_name: t.full_name || t.name || 'Docente Titular',
            cedula: t.cedula || '',
            email: t.email,
            specialty: t.specialty || 'Castellano y Literatura',
            phone: t.phone || '',
            password: t.password_plain || t.password || 'docente123',
            password_plain: t.password_plain || t.password || 'docente123',
            role: 'teacher',
            avatar: t.avatar_url || t.avatar || ''
          }));
          setTeachersList(normTeachers);
        }

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
            avatar: s.avatar_url || s.avatar || ''
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

        // Fetch evaluation plans
        const { data: epData } = await supabase.from('evaluation_plans').select('*');
        if (epData && epData.length > 0) setEvaluationPlans(epData);

        // Fetch grades
        const { data: grData } = await supabase.from('grades').select('*');
        if (grData && grData.length > 0) {
          const normGrades = grData.map(g => ({
            id: g.id,
            studentId: g.student_id || g.studentId,
            studentName: g.student_name || g.studentName,
            subjectName: g.subject_name || g.subjectName,
            evaluationTitle: g.evaluation_title || g.evaluationTitle,
            score: Number(g.score) || 0,
            maxScore: Number(g.max_score) || 20,
            percentage: Number(g.percentage) || 20,
            term: g.term || '1er Lapso',
            comments: g.comments || ''
          }));
          setGrades(normGrades);
        }

        // Fetch attendances
        const { data: attData } = await supabase.from('attendances').select('*');
        if (attData && attData.length > 0) {
          const normAtt = attData.map(a => ({
            id: a.id,
            studentId: a.student_id || a.studentId,
            studentName: a.student_name || a.studentName,
            grade_year: a.grade_year,
            date: a.date,
            status: a.status || 'ausente',
            reason: a.reason || '',
            reported_by: a.reported_by || 'Docente'
          }));
          setAttendances(normAtt);
        }

        // Fetch admission requests
        try {
          const { data: admData } = await supabase.from('admission_requests').select('*').order('created_at', { ascending: false });
          if (admData && admData.length > 0) {
            setAdmissionRequests(admData);
          }
        } catch (e) {}
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
        const targetGoogleRole = sessionStorage.getItem('iv_target_google_role');
        sessionStorage.removeItem('iv_target_google_role');

        if (isAdmin) {
          loginAsAdmin();
          return;
        }

        // Check if user is a registered teacher
        let matchedTeacher = null;
        try {
          const { data: dbTeachers } = await supabase
            .from('teachers')
            .select('*')
            .ilike('email', user.email);
          if (dbTeachers && dbTeachers.length > 0) {
            matchedTeacher = dbTeachers[0];
          }
        } catch (e) {}

        if (!matchedTeacher) {
          matchedTeacher = teachersList.find(
            (t) => t.email?.trim().toLowerCase() === user.email?.trim().toLowerCase()
          );
        }

        // Teacher role evaluation
        if (targetGoogleRole === 'teacher' || (matchedTeacher && targetGoogleRole !== 'representative' && targetGoogleRole !== 'student')) {
          if (!matchedTeacher) {
            await supabase.auth.signOut();
            setCurrentUser(null);
            setActiveTab('home');
            notify(`Este correo de Google (${user.email}) no se encuentra registrado en la nómina oficial de docentes.`, 'error');
            return;
          }

          const teacherUser = {
            id: matchedTeacher.id,
            name: matchedTeacher.full_name || matchedTeacher.name || user.user_metadata?.full_name || 'Docente Titular',
            full_name: matchedTeacher.full_name || matchedTeacher.name || 'Docente Titular',
            email: matchedTeacher.email || user.email,
            cedula: matchedTeacher.cedula || '',
            specialty: matchedTeacher.specialty || 'Educación Media General',
            phone: matchedTeacher.phone || '',
            role: 'teacher',
            avatar: matchedTeacher.avatar_url || matchedTeacher.avatar || user.user_metadata?.avatar_url || '',
            isSupabaseUser: true,
          };
          setCurrentUser(teacherUser);
          setActiveTab('teacher-portal');
          notify(`Bienvenido al portal docente, ${teacherUser.name}`);
          return;
        }

        // Check if user is a registered student
        let matchedStudent = null;
        try {
          const { data: dbStudents } = await supabase
            .from('students')
            .select('*')
            .ilike('email', user.email);
          if (dbStudents && dbStudents.length > 0) {
            matchedStudent = dbStudents[0];
          }
        } catch (e) {}

        if (!matchedStudent) {
          matchedStudent = students.find(
            (s) => s.email?.trim().toLowerCase() === user.email?.trim().toLowerCase()
          );
        }

        // Student role evaluation
        if (targetGoogleRole === 'student' || (matchedStudent && targetGoogleRole !== 'representative')) {
          if (!matchedStudent) {
            await supabase.auth.signOut();
            setCurrentUser(null);
            setActiveTab('home');
            notify(`Acceso denegado: El correo (${user.email}) no está registrado en la nómina de estudiantes por Control de Estudios.`, 'error');
            return;
          }

          const studentUser = {
            id: matchedStudent.id,
            name: matchedStudent.full_name || matchedStudent.name || `${matchedStudent.first_name || ''} ${matchedStudent.last_name || ''}`.trim() || user.user_metadata?.full_name || 'Estudiante',
            email: matchedStudent.email || user.email,
            cedula: matchedStudent.cedula || '',
            role: 'student',
            gradeLevel: matchedStudent.grade_year || matchedStudent.gradeLevel || '1er Año',
            section: matchedStudent.section || 'Sección A',
            avatar: matchedStudent.avatar_url || matchedStudent.avatar || '',
            isSupabaseUser: true
          };
          setCurrentUser(studentUser);
          setActiveTab('student-portal');
          notify(`Bienvenido al portal estudiantil, ${studentUser.name}`);
          return;
        }

        // Representative role evaluation
        if (targetGoogleRole === 'representative') {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            const userObj = {
              id: user.id,
              email: user.email,
              name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
              cedula: profile?.cedula || '',
              role: 'representative',
              avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
              isSupabaseUser: true,
            };
            setCurrentUser(userObj);
            setActiveTab('representative-portal');
            notify('Bienvenido al Portal de Representantes');
            return;
          } catch (e) {
            const userObj = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split('@')[0],
              role: 'representative',
              avatar: '',
              isSupabaseUser: true,
            };
            setCurrentUser(userObj);
            setActiveTab('representative-portal');
            notify('Bienvenido al Portal de Representantes');
            return;
          }
        }

        // If no role specified, check if existing profile exists as representative
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile && profile.role === 'representative') {
            const userObj = {
              id: user.id,
              email: user.email,
              name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
              cedula: profile?.cedula || '',
              role: 'representative',
              avatar: profile?.avatar_url || '',
              isSupabaseUser: true,
            };
            setCurrentUser(userObj);
            setActiveTab('representative-portal');
            notify('Bienvenido al Portal de Representantes');
            return;
          }
        } catch (e) {}

        // REJECT ANY UNRECOGNIZED GOOGLE LOGIN (Security Requirement 3)
        await supabase.auth.signOut();
        setCurrentUser(null);
        setActiveTab('home');
        notify(`El correo (${user.email}) no tiene una cuenta asignada en el colegio. Si eres estudiante, debes ser registrado por la Dirección.`, 'error');
        return;
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
      avatar: studentData.avatar || ''
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
      avatar: teacherData.avatar || ''
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

    try {
      if (supabaseConnected) {
        await supabase.from('grades').upsert({
          id: newGrade.id,
          student_id: newGrade.studentId || newGrade.student_id,
          student_name: newGrade.studentName || newGrade.student_name,
          subject_name: newGrade.subjectName || newGrade.subject_name,
          evaluation_title: newGrade.evaluationTitle || newGrade.evaluation_title,
          score: Number(newGrade.score) || 0,
          max_score: Number(newGrade.maxScore || newGrade.max_score) || 20,
          percentage: Number(newGrade.percentage) || 20,
          term: newGrade.term || '1er Lapso',
          comments: newGrade.comments || ''
        });
      }
    } catch (e) {}

    notify(isUpdate ? 'Calificación actualizada' : 'Calificación registrada en el sistema');
    return newGrade;
  };

  const deleteGrade = async (id) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('grades').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Calificación eliminada');
  };

  // EVALUATION PLANS
  const addEvaluationPlan = async (planData) => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      status: 'Programado',
      grade_year: planData.grade_year || planData.gradeYear || '1er Año',
      gradeYear: planData.grade_year || planData.gradeYear || '1er Año',
      ...planData
    };
    setEvaluationPlans((prev) => [newPlan, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('evaluation_plans').insert({
          id: newPlan.id,
          subject_name: newPlan.subjectName || newPlan.subject_name || 'General',
          grade_year: newPlan.grade_year || newPlan.gradeYear || '1er Año',
          unit_title: newPlan.unit_title || newPlan.title || 'Unidad de Evaluación',
          strategy: newPlan.strategy || 'Evaluación Escrita',
          instrument: newPlan.instrument || 'Escala de Estimación',
          percentage: Number(newPlan.percentage) || 20,
          lapso: Number(newPlan.lapso) || 1,
          evaluation_date: newPlan.evaluation_date || new Date().toISOString().split('T')[0],
          teacher_name: newPlan.teacher_name || newPlan.teacherName || '',
          status: 'Programado'
        });
      }
    } catch (e) {}

    notify(`Plan de evaluación publicado para ${newPlan.grade_year}`);
    return newPlan;
  };

  const deleteEvaluationPlan = async (id) => {
    setEvaluationPlans((prev) => prev.filter((p) => p.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('evaluation_plans').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Plan de evaluación retirado');
  };

  // ATTENDANCE
  const recordAttendance = async (attData) => {
    const newAtt = {
      id: `att-${Date.now()}`,
      date: attData.date || new Date().toISOString().split('T')[0],
      notified: true,
      reported_by: attData.reported_by || 'Docente Titular',
      ...attData
    };
    setAttendances((prev) => [newAtt, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('attendances').insert({
          id: newAtt.id,
          student_id: newAtt.studentId || newAtt.student_id,
          student_name: newAtt.studentName || newAtt.student_name,
          grade_year: newAtt.grade_year || newAtt.gradeYear || '',
          date: newAtt.date,
          status: newAtt.status || 'ausente',
          reason: newAtt.reason || '',
          reported_by: newAtt.reported_by || 'Docente Titular'
        });
      }
    } catch (e) {}

    notify('Inasistencia registrada en el expediente');
    return newAtt;
  };

  // Requisito 6: Justificación / Reporte de Faltas por Representantes
  const reportAbsence = async (data) => {
    const newAtt = {
      id: `att-${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      grade_year: data.gradeYear || data.grade_year || '1er Año',
      date: data.date || new Date().toISOString().split('T')[0],
      status: 'justificada',
      reason: data.reason || 'Inasistencia justificada',
      notes: data.notes || '',
      reported_by: 'Representante Legal',
      notified: true
    };
    setAttendances((prev) => [newAtt, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('attendances').insert({
          id: newAtt.id,
          student_id: newAtt.studentId,
          student_name: newAtt.studentName,
          grade_year: newAtt.grade_year,
          date: newAtt.date,
          status: 'justificada',
          reason: `${newAtt.reason}${newAtt.notes ? ` - ${newAtt.notes}` : ''}`,
          reported_by: 'Representante Legal'
        });
      }
    } catch (e) {}

    notify(`Falta justificada de ${newAtt.studentName} notificada a la Dirección`);
    return newAtt;
  };

  // Requisito 1: Gestión de Solicitudes de Cupo (Admissions)
  const addAdmissionRequest = async (req) => {
    const newReq = {
      id: req.id || `adm-${Date.now()}`,
      parent_name: req.parent_name || req.parentName,
      phone: req.phone,
      email: req.email,
      student_grade: req.student_grade || req.studentGrade || '1er Año',
      message: req.message || '',
      status: 'pendiente',
      created_at: new Date().toISOString()
    };
    setAdmissionRequests((prev) => [newReq, ...prev]);
    try {
      if (supabaseConnected) {
        await supabase.from('admission_requests').insert([newReq]);
      }
    } catch (e) {}
    notify('Solicitud de cupo registrada en el sistema.');
    return newReq;
  };

  const updateAdmissionStatus = async (id, newStatus, notes = '') => {
    setAdmissionRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, notes: notes || r.notes } : r))
    );
    try {
      if (supabaseConnected) {
        await supabase.from('admission_requests').update({
          status: newStatus,
          notes: notes,
          updated_at: new Date().toISOString()
        }).eq('id', id);
      }
    } catch (e) {}
    notify(`Estado de solicitud cambiado a: ${newStatus}`);
  };

  const deleteAdmissionRequest = async (id) => {
    setAdmissionRequests((prev) => prev.filter((r) => r.id !== id));
    try {
      if (supabaseConnected) {
        await supabase.from('admission_requests').delete().eq('id', id);
      }
    } catch (e) {}
    notify('Solicitud eliminada');
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
        reportAbsence,
        admissionRequests,
        addAdmissionRequest,
        updateAdmissionStatus,
        deleteAdmissionRequest,
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
