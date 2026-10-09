import React, { useState } from 'react';
import { X, GraduationCap, School, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../lib/supabase';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    targetAuthRole,
    setTargetAuthRole,
    loginAsDemoStudent,
    loginAsDemoTeacher,
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
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        notify('¡Bienvenido! Sesión iniciada con Supabase.');
        setAuthModalOpen(false);
      } else {
        const { error } = await signUpWithEmail(email, password, {
          fullName,
          role,
          gradeLevel,
        });
        if (error) throw error;
        notify('Registro exitoso. Revisa tu correo o inicia sesión.');
        setMode('login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al autenticar con Supabase');
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
      setErrorMsg(err.message || 'Error con autenticación de Google');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-white/10 rounded-xl backdrop-blur">
              <GraduationCap className="w-6 h-6 text-blue-200" />
            </span>
            <div>
              <h2 className="text-xl font-bold font-heading">Portal Académico</h2>
              <p className="text-xs text-blue-200">Liceo Experimental Bicentenario</p>
            </div>
          </div>
          <p className="text-sm text-blue-100 mt-2">
            Acceso a notas, planes de evaluación, horarios y notificaciones
          </p>

          {/* Quick Demo Shortcuts Banner */}
          <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-yellow-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso de Prueba Rápido (1 Clic):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => loginAsDemoStudent()}
                className="bg-white text-blue-900 font-medium py-2 px-3 rounded-xl hover:bg-blue-50 transition text-center shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>🎓 Como Estudiante</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemoTeacher()}
                className="bg-blue-900/80 hover:bg-blue-900 text-white font-medium py-2 px-3 rounded-xl transition text-center border border-white/20 flex items-center justify-center gap-1.5"
              >
                <span>👨‍🏫 Como Profesor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {/* Mode Switch (Login / Register) */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Role Selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Tipo de Perfil:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Estudiante / Alumno</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                  role === 'teacher'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <School className="w-4 h-4 text-indigo-600" />
                <span>Profesor / Admin</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Andrés Miranda"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && role === 'student' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Año / Sección</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="1er Año - Sección A">1er Año - Sección A</option>
                  <option value="2do Año - Sección A">2do Año - Sección A</option>
                  <option value="3er Año - Sección A">3er Año - Sección A</option>
                  <option value="4to Año - Sección A">4to Año - Sección A</option>
                  <option value="5to Año - Sección A">5to Año - Sección A</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@liceobicentenario.edu.ve"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrar Perfil'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 uppercase">
              <span className="bg-white px-2">o ingresar con</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl border border-slate-200 transition shadow-sm flex items-center justify-center gap-3"
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
            <span>Continuar con Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
