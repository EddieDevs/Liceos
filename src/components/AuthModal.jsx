import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  School,
  Users,
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../lib/supabase';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    targetAuthRole,
    setTargetAuthRole,
    loginAsStudent,
    loginAsTeacher,
    loginAsRepresentative,
    loginAsAdmin,
    institution,
    notify,
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState(targetAuthRole || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('4to Año - Sección A');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Check if trying to login as admin with special email
      if (email.trim().toLowerCase() === institution.adminEmail?.toLowerCase()) {
        loginAsAdmin();
        setAuthModalOpen(false);
        setLoading(false);
        return;
      }

      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        notify('Bienvenido a la plataforma');
        setAuthModalOpen(false);
      } else {
        const { error } = await signUpWithEmail(email, password, {
          fullName,
          role,
          gradeLevel,
        });
        if (error) throw error;
        notify('Registro enviado con éxito. Inicia sesión con tus credenciales.');
        setMode('login');
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
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message || 'Error con Google');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="text-xs uppercase tracking-wider font-semibold text-blue-700 mb-1">
            {institution.name}
          </div>
          <h2 className="text-xl font-bold font-heading text-slate-900">
            {mode === 'login' ? 'Acceso al Portal Institucional' : 'Registro de Nuevo Usuario'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresa a tu panel según tu perfil educativo
          </p>

          {/* Role selector buttons (4 profiles) */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                role === 'student'
                  ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Estudiante</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('representative')}
              className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                role === 'representative'
                  ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Representante</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                role === 'teacher'
                  ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Profesor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                role === 'admin'
                  ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrador</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-4 space-y-4">
          {/* Fast testing direct buttons */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              Accesos directos rápidos para prueba:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => loginAsStudent()}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-left truncate"
              >
                🎓 Estudiante
              </button>
              <button
                type="button"
                onClick={() => loginAsRepresentative()}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-left truncate"
              >
                👨‍👩‍👦 Representante
              </button>
              <button
                type="button"
                onClick={() => loginAsTeacher()}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium text-left truncate"
              >
                👨‍🏫 Profesor
              </button>
              <button
                type="button"
                onClick={() => loginAsAdmin()}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-semibold text-left truncate"
              >
                🛡️ Admin ({institution.adminEmail.split('@')[0]})
              </button>
            </div>
          </div>

          {/* Login or Register Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-md transition ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-md transition ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Andrés Miranda"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? institution.adminEmail : 'usuario@integralvenezuela.edu.ve'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
            >
              <span>{loading ? 'Accediendo...' : mode === 'login' ? 'Ingresar al Portal' : 'Registrar Perfil'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google OAuth */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Acceder con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
