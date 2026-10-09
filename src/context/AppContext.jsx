import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  initialInstitution,
  initialStudents,
  initialTeacher,
  initialSubjects,
  initialGrades,
  initialEvaluationPlans,
  initialSchedules,
  initialAttendances,
  initialCertificates,
  initialMemories,
  initialAnnouncements,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current user state:
  // user = { id, email, fullName, role: 'student' | 'teacher' | 'admin', gradeLevel, avatar }
  // default demo user: student Valeria Morales
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('liceo_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // Public landing page by default
  });

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'student-portal', 'teacher-portal', 'auth'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetAuthRole, setTargetAuthRole] = useState('student'); // 'student' or 'teacher'

  // Application Data States (persisted to localStorage & synced with Supabase)
  const [institution, setInstitution] = useState(initialInstitution);
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('liceo_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teacher] = useState(initialTeacher);
  const [subjects] = useState(initialSubjects);

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('liceo_grades');
    return saved ? JSON.parse(saved) : initialGrades;
  });

  const [evaluationPlans, setEvaluationPlans] = useState(() => {
    const saved = localStorage.getItem('liceo_eval_plans');
    return saved ? JSON.parse(saved) : initialEvaluationPlans;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('liceo_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [attendances, setAttendances] = useState(() => {
    const saved = localStorage.getItem('liceo_attendances');
    return saved ? JSON.parse(saved) : initialAttendances;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('liceo_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('liceo_memories');
    return saved ? JSON.parse(saved) : initialMemories;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('liceo_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show quick toast notification
  const notify = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('liceo_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('liceo_eval_plans', JSON.stringify(evaluationPlans));
  }, [evaluationPlans]);

  useEffect(() => {
    localStorage.setItem('liceo_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('liceo_attendances', JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem('liceo_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('liceo_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('liceo_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('liceo_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('liceo_current_user');
    }
  }, [currentUser]);

  // Check Supabase connection and listen to Auth state changes
  useEffect(() => {
    async function checkSupabase() {
      try {
        const { data, error } = await supabase.from('institution_info').select('*').limit(1);
        if (!error && data) {
          setSupabaseConnected(true);
        }
      } catch (err) {
        // Fallback gracefully
        setSupabaseConnected(false);
      }
    }
    checkSupabase();

    // Listen to real Supabase session
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        // Fetch profile
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setCurrentUser({
              id: profile.id,
              email: profile.email || user.email,
              name: profile.full_name || user.email?.split('@')[0],
              role: profile.role || 'student',
              gradeLevel: profile.grade_level || '4to Año - Sección A',
              avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              isSupabaseUser: true,
            });
          } else {
            // Use metadata
            setCurrentUser({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split('@')[0],
              role: user.user_metadata?.role || 'student',
              gradeLevel: user.user_metadata?.grade_level || '4to Año - Sección A',
              avatar: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              isSupabaseUser: true,
            });
          }
        } catch (e) {
          setCurrentUser({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            role: user.user_metadata?.role || 'student',
            gradeLevel: user.user_metadata?.grade_level || '4to Año - Sección A',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            isSupabaseUser: true,
          });
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Quick Demo Login switches
  const loginAsDemoStudent = (studentId = 'usr-student-1') => {
    const st = students.find((s) => s.id === studentId) || students[0];
    const userObj = {
      id: st.id,
      email: st.email,
      name: st.name,
      role: 'student',
      studentIdNumber: st.studentIdNumber,
      gradeLevel: st.gradeLevel,
      avatar: st.avatar,
      isDemo: true,
    };
    setCurrentUser(userObj);
    setActiveTab('student-portal');
    setAuthModalOpen(false);
    notify(`Sesión iniciada como estudiante: ${st.name}`);
  };

  const loginAsDemoTeacher = () => {
    const userObj = {
      id: teacher.id,
      email: teacher.email,
      name: teacher.name,
      role: 'teacher',
      department: teacher.department,
      avatar: teacher.avatar,
      isDemo: true,
    };
    setCurrentUser(userObj);
    setActiveTab('teacher-portal');
    setAuthModalOpen(false);
    notify(`Sesión iniciada como docente: ${teacher.name}`);
  };

  const logout = async () => {
    if (currentUser?.isSupabaseUser) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setActiveTab('home');
    notify('Sesión cerrada con éxito');
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

    // Try Supabase sync
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

    notify(isUpdate ? 'Calificación actualizada correctamente' : 'Nueva calificación registrada');
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
      // silent
    }

    notify('Plan de evaluación publicado con éxito');
  };

  const deleteEvaluationPlan = (id) => {
    setEvaluationPlans((prev) => prev.filter((p) => p.id !== id));
    notify('Plan de evaluación eliminado');
  };

  // Attendance operations (notifying absences)
  const recordAttendance = async (attData) => {
    const newAtt = {
      id: `att-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      notified: true,
      ...attData,
    };
    setAttendances((prev) => [newAtt, ...prev]);

    notify(`Asistencia registrada. Se envió notificación al representante.`);
  };

  // Certificate operations
  const issueCertificate = (certData) => {
    const newCert = {
      id: `cert-${Date.now()}`,
      issueDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      code: `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2024`,
      signer: 'Dra. Carmen Teresa Mendoza, Directora General',
      ...certData,
    };
    setCertificates((prev) => [newCert, ...prev]);
    notify('Certificado / Mención otorgada satisfactoriamente');
    return newCert;
  };

  // Schedule operations
  const addScheduleBlock = (schedData) => {
    setSchedules((prev) => [...prev, schedData]);
    notify('Bloque de horario añadido al cronograma');
  };

  // Memories operations
  const addMemory = (memoryData) => {
    const newMem = {
      id: `mem-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      ...memoryData,
    };
    setMemories((prev) => [newMem, ...prev]);
    notify('Recuerdo / Foto añadida a la galería institucional');
  };

  // Announcements
  const addAnnouncement = (annData) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      date: 'Reciente',
      ...annData,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    notify('Comunicado oficial publicado');
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
        teacher,
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
        loginAsDemoStudent,
        loginAsDemoTeacher,
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
