import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { GraduationCap, School, Globe, Database, Sparkles } from 'lucide-react';

function MainLayout() {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    loginAsDemoStudent,
    loginAsDemoTeacher,
    logout,
    supabaseConnected
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && <LandingPage />}
        {activeTab === 'student-portal' && <StudentPortal />}
        {activeTab === 'teacher-portal' && <TeacherPortal />}
      </main>

      <AuthModal />
      <Toast />

      {/* Quick Role Switcher Floating Pill (Demo & Testing bar) */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-1.5 p-1.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md text-xs">
        <span className="px-2 py-1 text-[11px] font-bold text-slate-400 flex items-center gap-1">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vistas:</span>
        </span>

        <button
          onClick={() => setActiveTab('home')}
          className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 font-medium ${
            activeTab === 'home'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Web Pública</span>
        </button>

        <button
          onClick={() => {
            loginAsDemoStudent();
            setActiveTab('student-portal');
          }}
          className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 font-medium ${
            activeTab === 'student-portal'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
          <span>Estudiante</span>
        </button>

        <button
          onClick={() => {
            loginAsDemoTeacher();
            setActiveTab('teacher-portal');
          }}
          className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 font-medium ${
            activeTab === 'teacher-portal'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <School className="w-3.5 h-3.5 text-indigo-300" />
          <span>Profesor/Admin</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
