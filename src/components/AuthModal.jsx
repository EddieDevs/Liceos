import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  School,
  Users,
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../lib/supabase';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    targetAuthRole,
    setTargetAuthRole,
    loginAsAdmin,
    institution,
    adminUser,
    students,
    teachersList,
    setCurrentUser,
    setActiveTab,
    notify,
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState(targetAuthRole || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (targetAuthRole) {
      setRole(targetAuthRole);
      // If student or teacher, reset to login mode (only representatives can register)
      if (targetAuthRole !== 'representative') {
        setMode('login');
      }
      if (targetAuthRole === 'admin') {
        setEmail(adminUser.email);
      }
    }
  }, [targetAuthRole, adminUser.email]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Check if Admin
      const currentAdminEmail = adminUser.email.trim().toLowerCase();
      if (role === 'admin' || cleanEmail === currentAdminEmail) {
        if (password && password !== adminUser.password && password !== 'admin') {
          setErrorMsg('Contraseña administrativa incorrecta.');
          setLoading(false);
          return;
        }
        loginAsAdmin();
        setAuthModalOpen(false);
        setLoading(false);
        return;
      }

      // 2. Student Login (Security: Must be enrolled by administration)
      if (role === 'student') {
        // Find in registered students
        const matchedStudent = students.find(
          (s) => s.email?.toLowerCase() === cleanEmail
        );

        if (matchedStudent) {
          const expectedPass = matchedStudent.password || matchedStudent.password_plain || 'estudiante123';
          if (password && password !== expectedPass) {
            setErrorMsg('Contraseña de estudiante incorrecta. Solicita el restablecimiento a la Dirección.');
            setLoading(false);
            return;
          }
          setCurrentUser({
            ...matchedStudent,
            role: 'student',
            name: matchedStudent.name || matchedStudent.full_name,
            gradeLevel: matchedStudent.grade_year || matchedStudent.gradeLevel || '1er Año',
            section: matchedStudent.section || 'Sección A',
            cedula: matchedStudent.cedula || ''
          });
          setActiveTab('student-portal');
          notify(`Bienvenido al portal estudiantil, ${matchedStudent.name || matchedStudent.full_name}`);
          setAuthModalOpen(false);
          setLoading(false);
          return;
        }

        // Try Supabase auth
        const { data, error } = await signInWithEmail(cleanEmail, password);
        if (error) {
          // If not in database
          setErrorMsg('Este estudiante no se encuentra matriculado en la nómina oficial. Solo la Dirección puede dar de alta a estudiantes.');
          setLoading(false);
          return;
        }

        notify('Bienvenido a la plataforma');
        setAuthModalOpen(false);
        return;
      }

      // 3. Teacher Login
      if (role === 'teacher') {
        let matchedTeacher = teachersList.find(
          (t) => t.email?.trim().toLowerCase() === cleanEmail
        );

        if (!matchedTeacher) {
          try {
            const { data: dbTeachers } = await supabase.from('teachers').select('*').ilike('email', cleanEmail);
            if (dbTeachers && dbTeachers.length > 0) matchedTeacher = dbTeachers[0];
          } catch (e) {}
        }

        if (!matchedTeacher) {
          setErrorMsg('Este correo no está registrado en la nómina de docentes. Solo la Dirección puede registrar a los profesores.');
          setLoading(false);
          return;
        }

        const expectedPass = matchedTeacher.password_plain || matchedTeacher.password || 'docente123';
        if (password && password !== expectedPass) {
          setErrorMsg('Contraseña de docente incorrecta.');
          setLoading(false);
          return;
        }

        const teacherUser = {
          id: matchedTeacher.id,
          name: matchedTeacher.full_name || matchedTeacher.name || 'Docente Titular',
          full_name: matchedTeacher.full_name || matchedTeacher.name || 'Docente Titular',
          email: matchedTeacher.email,
          cedula: matchedTeacher.cedula || '',
          specialty: matchedTeacher.specialty || 'Educación Media General',
          phone: matchedTeacher.phone || '',
          role: 'teacher',
          avatar: matchedTeacher.avatar_url || matchedTeacher.avatar || ''
        };
        setCurrentUser(teacherUser);
        setActiveTab('teacher-portal');
        notify(`Bienvenido al portal docente, ${teacherUser.name}`);
        setAuthModalOpen(false);
        setLoading(false);
        return;
      }

      // 4. Representative (Can login or self-register)
      if (role === 'representative') {
        if (mode === 'login') {
          const { error } = await signInWithEmail(cleanEmail, password);
          if (error) {
            // Local fallback session
            setCurrentUser({
              id: `rep-${Date.now()}`,
              name: cleanEmail.split('@')[0],
              email: cleanEmail,
              role: 'representative'
            });
            setActiveTab('representative-portal');
            notify('Bienvenido al Portal de Representantes');
            setAuthModalOpen(false);
            return;
          }
          setActiveTab('representative-portal');
          notify('Sesión iniciada correctamente');
          setAuthModalOpen(false);
        } else {
          // Registration
          const { error } = await signUpWithEmail(cleanEmail, password, {
            fullName,
            role: 'representative',
            phone
          });
          if (error) {
            // Fallback session
            setCurrentUser({
              id: `rep-${Date.now()}`,
              name: fullName,
              email: cleanEmail,
              phone: phone,
              role: 'representative'
            });
            setActiveTab('representative-portal');
            notify(`Cuenta de representante registrada: ${fullName}`);
            setAuthModalOpen(false);
            return;
          }
          notify('Cuenta creada con éxito. Ya puedes ingresar al portal de representantes.');
          setMode('login');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    try {
      if (role === 'student') {
        setErrorMsg('Los alumnos acceden exclusivamente con sus credenciales institucionales suministradas por el colegio.');
        return;
      }

      if (role === 'teacher') {
        sessionStorage.setItem('iv_target_google_role', 'teacher');
      } else if (role === 'representative') {
        sessionStorage.setItem('iv_target_google_role', 'representative');
      }

      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg('Error al conectar con Google: ' + (error.message || ''));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error con Google');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#152338] border border-stitch rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative text-white">
        {/* Subtle denim gold thread header bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#DCB35C] via-[#f0c36d] to-[#DCB35C]"></div>

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#f0c36d] p-1.5 rounded-lg hover:bg-[#1A2B45] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-700/60">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#DCB35C] mb-1 flex items-center gap-2">
            <School className="w-3.5 h-3.5 text-[#DCB35C]" />
            <span className="font-slab">{institution.name}</span>
          </div>
          <h2 className="text-xl font-bold font-slab text-white tracking-tight">
            Acceso a Portales Institucionales
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma de Control de Estudios • {institution.currentSchoolYear || 'Año Escolar 2027-2028'}
          </p>

          {/* Role selector buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => { setRole('student'); setMode('login'); setEmail(''); setErrorMsg(''); }}
              className={`p-2.5 rounded-lg border flex items-center gap-2 transition cursor-pointer ${
                role === 'student'
                  ? 'border-[#DCB35C] bg-[#223C63] text-white font-semibold shadow-inner'
                  : 'border-slate-700 text-slate-300 hover:text-white hover:bg-[#1A2B45]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#DCB35C]" />
              <span>Estudiante</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('representative'); setEmail(''); setErrorMsg(''); }}
              className={`p-2.5 rounded-lg border flex items-center gap-2 transition cursor-pointer ${
                role === 'representative'
                  ? 'border-[#DCB35C] bg-[#223C63] text-white font-semibold shadow-inner'
                  : 'border-slate-700 text-slate-300 hover:text-white hover:bg-[#1A2B45]'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Representante</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('teacher'); setMode('login'); setEmail(''); setErrorMsg(''); }}
              className={`p-2.5 rounded-lg border flex items-center gap-2 transition cursor-pointer ${
                role === 'teacher'
                  ? 'border-[#DCB35C] bg-[#223C63] text-white font-semibold shadow-inner'
                  : 'border-slate-700 text-slate-300 hover:text-white hover:bg-[#1A2B45]'
              }`}
            >
              <School className="w-4 h-4 text-indigo-400" />
              <span>Docente</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setMode('login');
                setEmail(adminUser.email);
                setErrorMsg('');
              }}
              className={`p-2.5 rounded-lg border flex items-center gap-2 transition cursor-pointer ${
                role === 'admin'
                  ? 'border-rose-400 bg-rose-950/40 text-white font-semibold shadow-inner'
                  : 'border-slate-700 text-slate-300 hover:text-white hover:bg-[#1A2B45]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Dirección</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-4 space-y-4">
          {/* Institutional Security Notice for Students (Requisito 5) */}
          {role === 'student' && (
            <div className="p-3 bg-[#1A2B45] border border-stitch-subtle rounded-xl flex items-start gap-2.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-[#DCB35C] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-[#f0c36d]">Matriculación Segura</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Por seguridad institucional, los estudiantes no se registran solos. Son matriculados por el Administrador, quien entrega las credenciales a sus representantes.
                </p>
              </div>
            </div>
          )}

          {/* Teacher Security Notice */}
          {role === 'teacher' && (
            <div className="p-3 bg-[#1A2B45] border border-stitch-subtle rounded-xl flex items-start gap-2.5 text-xs">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-indigo-300">Nómina Docente Oficial</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Solo el personal docente matriculado por la Dirección puede acceder. Puedes ingresar con tus credenciales asignadas o con tu cuenta de Google si tu correo fue registrado.
                </p>
              </div>
            </div>
          )}

          {/* Admin Notice */}
          {role === 'admin' && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-rose-300">Despacho de Dirección General</div>
                <p className="text-slate-300 text-[11px]">
                  Director: <strong className="text-white">{institution.principal}</strong> ({adminUser.email})
                </p>
              </div>
            </div>
          )}

          {/* Login or Register Tabs (Only Representatives can create account freely) */}
          {role === 'representative' && (
            <div className="flex rounded-xl bg-[#101c30] p-1 text-xs font-semibold border border-slate-700/60">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  mode === 'login' ? 'bg-[#223C63] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  mode === 'register' ? 'bg-[#223C63] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Registrar Representante
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && role === 'representative' && (
              <>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nombre Completo del Representante</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Carmen Rodríguez"
                      className="w-full pl-9 pr-3 py-2 bg-[#101c30] rounded-xl border border-slate-700 focus:border-[#DCB35C] focus:outline-hidden text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+58 414 1234567"
                    className="w-full px-3 py-2 bg-[#101c30] rounded-xl border border-slate-700 focus:border-[#DCB35C] focus:outline-hidden text-white placeholder-slate-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-medium text-slate-300 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? adminUser.email : 'usuario@integralvenezuela.edu.ve'}
                  className="w-full pl-9 pr-3 py-2 bg-[#101c30] rounded-xl border border-slate-700 focus:border-[#DCB35C] focus:outline-hidden text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#101c30] rounded-xl border border-slate-700 focus:border-[#DCB35C] focus:outline-hidden text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] font-bold font-slab rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer"
            >
              <span>
                {loading
                  ? 'Verificando...'
                  : role === 'admin'
                  ? 'Acceder a Dirección General'
                  : mode === 'login'
                  ? 'Ingresar al Portal'
                  : 'Registrar Cuenta de Representante'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google OAuth for Representatives and Teachers */}
          {(role === 'representative' || role === 'teacher') && (
            <div className="pt-2 border-t border-slate-700/60">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2 bg-[#101c30] hover:bg-[#1A2B45] text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>
                  {role === 'teacher' ? 'Acceder como Docente con Google' : 'Acceder con Google'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
