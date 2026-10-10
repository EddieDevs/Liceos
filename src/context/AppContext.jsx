import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  initialInstitution,
  initialAdmin,
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

  const [institution, setInstitution] = useState(initialInstitution);
  const [adminUser] = useState(initialAdmin);

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
    }, 4000);
  };

  // Sync to localStorage
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
        const { data: info } = await supabase.from('institution_info').select('*').limit(1);
        if (info && info.length > 0) setSupabaseConnected(true);

        // Fetch subjects
        const { data: subData } = await supabase.from('subjects').select('*');
        if (subData && subData.length > 0) setSubjects(subData);

        // Fetch classrooms
        const { data: clrData } = await supabase.from('classrooms').select('*');
        if (clrData && clrData.length > 0) setClassrooms(clrData);

        // Fetch schedules
        const { data: schData } = await supabase.from('schedules').select('*');
        if (schData && schData.length > 0) setSchedules(schData);

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
        const isAdmin = user.email?.toLowerCase() === 'quinterostudent@gmail.com';

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          const resolvedRole = isAdmin ? 'admin' : (profile?.role || user.user_metadata?.role || 'student');

          const userObj = {
            id: user.id,
            email: user.email,
            name: isAdmin ? 'Larry González' : (profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]),
            role: resolvedRole,
            gradeLevel: profile?.grade_level || user.user_metadata?.grade_level || '4to Año',
            avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
            isSupabaseUser: true,
          };
          setCurrentUser(userObj);

          if (isAdmin) setActiveTab('admin-portal');
          else if (resolvedRole === 'teacher') setActiveTab('teacher-portal');
          else if (resolvedRole === 'representative') setActiveTab('representative-portal');
          else setActiveTab('student-portal');
        } catch (e) {
          const resolvedRole = isAdmin ? 'admin' : 'student';
          const userObj = {
            id: user.id,
            email: user.email,
            name: isAdmin ? 'Larry González' : user.email?.split('@')[0],
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
  }, []);

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
    notify(`Acceso administrativo concedido: ${adminUser.name}`);
  };

  const logout = async () => {
    if (currentUser?.isSupabaseUser) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setActiveTab('home');
    notify('Has cerrado sesión');
  };

  // Profile Update (including Direct Avatar File Upload)
  const updateUserProfile = async (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    // If student, update in students list too
    if (updated.role === 'student') {
      setStudents((prev) => {
        const exists = prev.some((s) => s.id === updated.id);
        if (exists) return prev.map((s) => (s.id === updated.id ? { ...s, ...updates } : s));
        return [...prev, updated];
      });
    }

    try {
      if (supabaseConnected && updated.id) {
        await supabase.from('profiles').update({
          full_name: updated.name,
          avatar_url: updated.avatar,
          phone: updated.phone,
          grade_level: updated.gradeLevel,
        }).eq('id', updated.id);
      }
    } catch (e) {
      // offline fallback
    }

    notify('Perfil actualizado exitosamente');
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
          name: newSub.name,
          code: newSub.code,
          grade_level: newSub.gradeLevel,
          teacher_id: newSub.teacherId,
          teacher_name: newSub.teacherName,
          color: newSub.color,
        });
      }
    } catch (e) {
      // offline fallback
    }

    notify(`Asignatura "${newSub.name}" agregada a la base de datos`);
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

  // SCHEDULES MANAGEMENT (Regular classes, Recess, Day Off, Free Module)
  const addScheduleBlock = async (schedData) => {
    const newBlock = {
      id: `sch-${Date.now()}`,
      entry_type: schedData.entry_type || 'regular', // 'regular', 'recess', 'free_module', 'day_off'
      ...schedData
    };
    setSchedules((prev) => [...prev, newBlock]);

    try {
      if (supabaseConnected) {
        await supabase.from('schedules').insert({
          day_of_week: newBlock.day,
          start_time: newBlock.time?.split('-')[0]?.trim() || '07:00:00',
          end_time: newBlock.time?.split('-')[1]?.trim() || '08:30:00',
          classroom: newBlock.classroom,
          subject_id: newBlock.subjectId,
          teacher_name: newBlock.teacher,
          entry_type: newBlock.entry_type,
          notes: newBlock.notes
        });
      }
    } catch (e) {}

    let msg = 'Bloque de horario añadido';
    if (newBlock.entry_type === 'day_off') msg = `Día libre (${newBlock.day}) programado`;
    if (newBlock.entry_type === 'recess') msg = 'Receso escolar agregado al horario';
    if (newBlock.entry_type === 'free_module') msg = 'Módulo libre registrado';
    notify(msg);
    return newBlock;
  };

  const updateScheduleBlock = async (id, updatedData) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    try {
      if (supabaseConnected) {
        await supabase.from('schedules').update(updatedData).eq('id', id);
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

  // CERTIFICATES MANAGEMENT (Admin only: Creation, Templates, Type, and Editing)
  const addCertificate = async (certData) => {
    const newCert = {
      id: `cert-${Date.now()}`,
      certificate_code: `CERT-IV-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${new Date().getFullYear()}`,
      issue_date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: certData.category || 'recognition', // 'grade' or 'recognition'
      template_type: certData.template_type || 'academic', // 'academic', 'sports', 'anniversary', 'values'
      issued_by: 'Larry González, Director General',
      ...certData
    };
    setCertificates((prev) => [newCert, ...prev]);

    try {
      if (supabaseConnected) {
        await supabase.from('certificates').insert({
          student_id: newCert.studentId,
          title: newCert.title,
          type: newCert.type || 'honor',
          description: newCert.description,
          certificate_code: newCert.certificate_code,
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

  // MEMORIES (Students and Faculty upload directly with image files)
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
          title: newMem.title,
          description: newMem.description,
          image_url: newMem.image,
          category: newMem.category,
          author_name: newMem.author_name,
          grade_year: newMem.grade_year
        });
      }
    } catch (e) {}

    notify('Tu recuerdo ha sido publicado en el anuario');
    return newMem;
  };

  // PAYMENTS (Representatives submit receipts via file upload; Admin verifies)
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
          representative_id: newPay.representativeId,
          representative_name: newPay.representativeName,
          student_id: newPay.studentId,
          student_name: newPay.studentName,
          student_grade: newPay.studentGrade,
          amount: newPay.amount,
          currency: newPay.currency || 'USD',
          payment_method: newPay.paymentMethod,
          reference_number: newPay.referenceNumber,
          payment_concept: newPay.paymentConcept,
          receipt_url: newPay.receiptUrl,
          payment_date: newPay.paymentDate,
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
          status: newStatus,
          admin_notes: notes
        }).eq('id', id);
      }
    } catch (e) {}

    notify(newStatus === 'approved' ? 'Pago aprobado exitosamente' : 'Estado de pago actualizado');
  };

  // GRADES (Teachers and Admin)
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
          student_id: newGrade.studentId,
          evaluation_title: newGrade.evaluationTitle,
          score: newGrade.score,
          max_score: newGrade.maxScore || 20,
          percentage: newGrade.percentage || 20,
          term: newGrade.term || '1er Lapso',
          comments: newGrade.comments
        });
      }
    } catch (e) {}

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
    notify('Inasistencia registrada y notificada');
    return newAtt;
  };

  // CLASSROOMS (Admin)
  const addClassroom = async (clrData) => {
    const newClr = { id: `clr-${Date.now()}`, ...clrData };
    setClassrooms((prev) => [...prev, newClr]);
    notify(`Aula "${newClr.name}" agregada`);
  };

  // TEACHERS (Admin)
  const addTeacher = (teacherData) => {
    const newT = { id: `usr-teacher-${Date.now()}`, ...teacherData };
    setTeachersList((prev) => [...prev, newT]);
    notify(`Docente "${newT.name}" registrado`);
  };

  const updateTeacher = (id, updatedData) => {
    setTeachersList((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
    notify('Docente actualizado');
  };

  const deleteTeacher = (id) => {
    setTeachersList((prev) => prev.filter((t) => t.id !== id));
    notify('Docente retirado');
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
        updateUserProfile,
        activeTab,
        setActiveTab,
        authModalOpen,
        setAuthModalOpen,
        targetAuthRole,
        setTargetAuthRole,
        institution,
        setInstitution,
        adminUser,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        classrooms,
        addClassroom,
        students,
        setStudents,
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
