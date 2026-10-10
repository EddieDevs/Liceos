import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  initialInstitution,
  initialStudents,
  initialRepresentative,
  initialTeacher,
  initialTeachersList,
  initialAdmin,
  initialClassrooms,
  initialSubjects,
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
    return null; // Public website by default
  });

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'student-portal', 'teacher-portal', 'representative-portal', 'admin-portal'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetAuthRole, setTargetAuthRole] = useState('student'); // 'student', 'teacher', 'representative', 'admin'

  // Application Data States (persisted to localStorage & synced with Supabase)
  const [institution, setInstitution] = useState(initialInstitution);

  const [classrooms, setClassrooms] = useState(() => {
    const saved = localStorage.getItem('iv_classrooms');
    return saved ? JSON.parse(saved) : initialClassrooms;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('iv_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [representative] = useState(initialRepresentative);

  const [teachersList, setTeachersList] = useState(() => {
    const saved = localStorage.getItem('iv_teachers_list');
    return saved ? JSON.parse(saved) : initialTeachersList;
  });

  const [teacher] = useState(initialTeacher);
  const [adminUser] = useState(initialAdmin);
  const [subjects] = useState(initialSubjects);

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
    }, 4000);
  };

  // Sync to localStorage
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
    localStorage.setItem('iv_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('iv_teachers_list', JSON.stringify(teachersList));
  }, [teachersList]);

  useEffect(() => {
    localStorage.setItem('iv_students', JSON.stringify(students));
  }, [students]);

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

  // Check Supabase and handle real authentication session
  useEffect(() => {
    async function checkSupabase() {
      try {
        const { data, error } = await supabase.from('institution_info').select('*').limit(1);
        if (!error && data) {
          setSupabaseConnected(true);
        }
      } catch (err) {
        setSupabaseConnected(false);
      }
    }
    checkSupabase();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const isAdminEmail = user.email?.toLowerCase() === 'quinterostudent@gmail.com';

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          const resolvedRole = isAdminEmail ? 'admin' : (profile?.role || user.user_metadata?.role || 'student');

          const userObj = {
            id: user.id,
            email: user.email,
            name: isAdminEmail ? 'Larry González (Director)' : (profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]),
            role: resolvedRole,
            gradeLevel: profile?.grade_level || user.user_metadata?.grade_level || '4to Año - Sección A',
            avatar: profile?.avatar_url || user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            isSupabaseUser: true,
          };
          setCurrentUser(userObj);

          if (isAdminEmail) {
            setActiveTab('admin-portal');
          } else if (resolvedRole === 'teacher') {
            setActiveTab('teacher-portal');
          } else if (resolvedRole === 'representative') {
            setActiveTab('representative-portal');
          } else {
            setActiveTab('student-portal');
          }
        } catch (e) {
          const resolvedRole = isAdminEmail ? 'admin' : (user.user_metadata?.role || 'student');
          setCurrentUser({
            id: user.id,
            email: user.email,
            name: isAdminEmail ? 'Larry González (Director)' : (user.user_metadata?.full_name || user.email?.split('@')[0]),
            role: resolvedRole,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            isSupabaseUser: true,
          });
          if (isAdminEmail) setActiveTab('admin-portal');
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Quick Account switchers (direct access to roles for testing)
  const loginAsStudent = (studentId = 'usr-student-1') => {
    const st = students.find((s) => s.id === studentId) || students[0];
    const userObj = {
      id: st.id,
      email: st.email,
      name: st.name,
      role: 'student',
      studentIdNumber: st.studentIdNumber,
      gradeLevel: st.gradeLevel,
      avatar: st.avatar,
    };
    setCurrentUser(userObj);
    setActiveTab('student-portal');
    setAuthModalOpen(false);
    notify(`Sesión activa: ${st.name}`);
  };

  const loginAsTeacher = (teacherId = 'usr-teacher-1') => {
    const t = teachersList.find((tc) => tc.id === teacherId) || teacher;
    const userObj = {
      id: t.id,
      email: t.email,
      name: t.name,
      role: 'teacher',
      department: t.department,
      avatar: t.avatar,
      subjects: t.subjects,
    };
    setCurrentUser(userObj);
    setActiveTab('teacher-portal');
    setAuthModalOpen(false);
    notify(`Sesión activa: ${t.name}`);
  };

  const loginAsRepresentative = () => {
    const userObj = {
      id: representative.id,
      email: representative.email,
      name: representative.name,
      role: 'representative',
      phone: representative.phone,
      idNumber: representative.idNumber,
      avatar: representative.avatar,
      wards: representative.wards
    };
    setCurrentUser(userObj);
    setActiveTab('representative-portal');
    setAuthModalOpen(false);
    notify(`Sesión activa: ${representative.name} (Representante)`);
  };

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
    notify(`Acceso Administrativo Concedido: ${adminUser.name}`);
  };

  const logout = async () => {
    if (currentUser?.isSupabaseUser) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setActiveTab('home');
    notify('Has cerrado sesión correctamente');
  };

  // Grade operations
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
        ...gradeData,
      };
      setGrades((prev) => [newGrade, ...prev]);
    }

    try {
      if (supabaseConnected) {
        await supabase.from('grades').upsert({
          id: newGrade.id.startsWith('gr-') ? undefined : newGrade.id,
          student_id: newGrade.studentId,
          evaluation_title: newGrade.evaluationTitle,
          score: newGrade.score,
          max_score: newGrade.maxScore || 20,
          percentage: newGrade.percentage || 20,
          term: newGrade.term || '1er Lapso',
          comments: newGrade.comments,
        });
      }
    } catch (e) {
      // offline fallback
    }

    notify(isUpdate ? 'Calificación actualizada con éxito' : 'Calificación cargada al sistema');
    return newGrade;
  };

  const deleteGrade = (id) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
    notify('Calificación eliminada');
  };

  // Evaluation Plan operations
  const addEvaluationPlan = async (planData) => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      status: 'Programado',
      ...planData,
    };
    setEvaluationPlans((prev) => [newPlan, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('evaluation_plans').insert({
          title: newPlan.title,
          description: newPlan.description,
          due_date: newPlan.dueDate,
          percentage: newPlan.percentage,
          term: newPlan.term,
          evaluation_type: newPlan.type,
        });
      }
    } catch (e) {
      // fallback
    }

    notify('Plan de evaluación publicado en el portal');
  };

  const deleteEvaluationPlan = (id) => {
    setEvaluationPlans((prev) => prev.filter((p) => p.id !== id));
    notify('Plan de evaluación eliminado');
  };

  // Attendance operations
  const recordAttendance = async (attData) => {
    const newAtt = {
      id: `att-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      notified: true,
      ...attData,
    };
    setAttendances((prev) => [newAtt, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('attendances').insert({
          student_id: newAtt.studentId,
          date: newAtt.date,
          status: newAtt.status,
          justification: newAtt.notes,
          notified: true,
        });
      }
    } catch (e) {
      // fallback
    }

    notify(`Inasistencia registrada. Notificación transmitida al representante.`);
  };

  // Certificate operations
  const issueCertificate = (certData) => {
    const newCert = {
      id: `cert-${Date.now()}`,
      issueDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      code: `CERT-IV-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2024`,
      signer: 'Larry González, Director General',
      ...certData,
    };
    setCertificates((prev) => [newCert, ...prev]);
    notify('Certificado oficial generado exitosamente');
    return newCert;
  };

  // Schedule operations
  const addScheduleBlock = (schedData) => {
    const newBlock = {
      id: `sch-${Date.now()}`,
      ...schedData
    };
    setSchedules((prev) => [...prev, newBlock]);
    notify('Horario de clase actualizado');
  };

  const updateScheduleBlock = (id, updatedData) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    notify('Horario modificado');
  };

  const deleteScheduleBlock = (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    notify('Bloque de horario retirado');
  };

  // Classroom operations
  const addClassroom = (classroomData) => {
    const newClassroom = {
      id: `clr-${Date.now()}`,
      ...classroomData
    };
    setClassrooms((prev) => [...prev, newClassroom]);
    notify(`Aula ${newClassroom.name} registrada`);
  };

  // Memories operations (by students or faculty)
  const addMemory = async (memoryData) => {
    const newMem = {
      id: `mem-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      authorName: memoryData.authorName || currentUser?.name || 'Comunidad Escolar',
      gradeYear: memoryData.gradeYear || currentUser?.gradeLevel?.split('-')[0]?.trim() || '4to Año',
      ...memoryData,
    };
    setMemories((prev) => [newMem, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('memories').insert({
          title: newMem.title,
          description: newMem.description,
          image_url: newMem.image,
          category: newMem.category,
          author_name: newMem.authorName,
          grade_year: newMem.gradeYear
        });
      }
    } catch (e) {
      // fallback
    }

    notify('Recuerdo agregado al anuario de tu año escolar');
  };

  // Payments operations (Representatives and Admin)
  const addPayment = async (paymentData) => {
    const newPayment = {
      id: `pay-${Date.now()}`,
      representativeId: currentUser?.id || representative.id,
      representativeName: currentUser?.name || representative.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      adminNotes: 'En revisión por administración',
      ...paymentData,
    };
    setPayments((prev) => [newPayment, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('payments').insert({
          representative_id: newPayment.representativeId,
          representative_name: newPayment.representativeName,
          student_id: newPayment.studentId,
          student_name: newPayment.studentName,
          student_grade: newPayment.studentGrade,
          amount: newPayment.amount,
          currency: newPayment.currency || 'USD',
          payment_method: newPayment.paymentMethod,
          reference_number: newPayment.referenceNumber,
          payment_concept: newPayment.paymentConcept,
          receipt_url: newPayment.receiptUrl,
          payment_date: newPayment.paymentDate,
          status: 'pending',
        });
      }
    } catch (e) {
      // fallback
    }

    notify('Comprobante de pago enviado para validación administrativa');
    return newPayment;
  };

  const updatePaymentStatus = async (paymentId, newStatus, notes = '') => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, status: newStatus, adminNotes: notes || (newStatus === 'approved' ? 'Pago conciliado y aprobado' : 'Pago rechazado') }
          : p
      )
    );

    try {
      if (supabaseConnected) {
        await supabase
          .from('payments')
          .update({
            status: newStatus,
            admin_notes: notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentId);
      }
    } catch (e) {
      // fallback
    }

    notify(newStatus === 'approved' ? 'Pago aprobado satisfactoriamente' : 'Estado de pago actualizado');
  };

  // Teachers management (Admin)
  const addTeacher = (teacherData) => {
    const newT = {
      id: `usr-teacher-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      ...teacherData,
    };
    setTeachersList((prev) => [...prev, newT]);
    notify(`Docente ${newT.name} registrado en la nómina`);
  };

  const updateTeacher = (id, updatedData) => {
    setTeachersList((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
    notify('Datos del docente actualizados');
  };

  const deleteTeacher = (id) => {
    setTeachersList((prev) => prev.filter((t) => t.id !== id));
    notify('Docente retirado del sistema');
  };

  // Announcements
  const addAnnouncement = async (annData) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...annData,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('announcements').insert({
          title: newAnn.title,
          content: newAnn.content,
          priority: newAnn.priority,
          target_role: newAnn.roleTarget === 'Todos' ? 'all' : newAnn.roleTarget.toLowerCase(),
          author_name: 'Dirección del Plantel'
        });
      }
    } catch (e) {
      // fallback
    }

    notify('Comunicado oficial difundido en la plataforma');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        authModalOpen,
        setAuthModalOpen,
        targetAuthRole,
        setTargetAuthRole,
        institution,
        setInstitution,
        students,
        setStudents,
        representative,
        teacher,
        teachersList,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        adminUser,
        classrooms,
        addClassroom,
        subjects,
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
        issueCertificate,
        memories,
        addMemory,
        payments,
        addPayment,
        updatePaymentStatus,
        announcements,
        addAnnouncement,
        loginAsStudent,
        loginAsTeacher,
        loginAsRepresentative,
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
