import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  LogOut,
  User,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  BookOpen,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setAuthModalOpen,
    setTargetAuthRole,
    loginAsDemoStudent,
    loginAsDemoTeacher,
    logout,
    institution,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const openAuth = (role) => {
    setTargetAuthRole(role);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    setActiveTab('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{institution.phone.split('/')[0]}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{institution.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{institution.schedule}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {institution.admissions.status}
            </span>
            {/* Fast demo login switch */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1 text-[11px] text-yellow-300 hover:text-yellow-200 font-semibold bg-white/10 px-2.5 py-0.5 rounded-md transition"
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>Acceso Demo</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1 z-50 text-xs"
                  onClick={() => setDemoDropdownOpen(false)}
                >
                  <button
                    onClick={() => loginAsDemoStudent()}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 font-medium"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Entrar como Estudiante</span>
                  </button>
                  <button
                    onClick={() => loginAsDemoTeacher()}
                    className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                  >
                    <School className="w-4 h-4 text-indigo-600" />
                    <span>Entrar como Profesor/Admin</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition">
                {institution.name}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Educación Media General • Fundado en {institution.foundedYear}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeTab === 'home'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('identidad')}
              className="px-3.5 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition"
            >
              Misión y Valores
            </button>
            <button
              onClick={() => scrollToSection('inscripciones')}
              className="px-3.5 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition"
            >
              Inscripciones
            </button>
            <button
              onClick={() => scrollToSection('galeria')}
              className="px-3.5 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition"
            >
              Galería & Recuerdos
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="px-3.5 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition"
            >
              Ubicación & Contacto
            </button>
          </nav>

          {/* Action Buttons / User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-3 rounded-2xl border border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-white shadow-xs"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[140px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                    {currentUser.role === 'teacher' ? 'Docente / Admin' : 'Estudiante'}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setActiveTab(
                      currentUser.role === 'teacher' ? 'teacher-portal' : 'student-portal'
                    )
                  }
                  className="ml-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Mi Panel</span>
                </button>

                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('student')}
                  className="px-4 py-2.5 rounded-xl border border-blue-600/30 text-blue-700 hover:bg-blue-50 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Portal Estudiante</span>
                </button>
                <button
                  onClick={() => openAuth('teacher')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
                >
                  <School className="w-4 h-4 text-blue-200" />
                  <span>Portal Docente / Admin</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <nav className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('identidad')}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
            >
              Misión y Valores
            </button>
            <button
              onClick={() => scrollToSection('inscripciones')}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
            >
              Inscripciones y Requisitos
            </button>
            <button
              onClick={() => scrollToSection('galeria')}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
            >
              Galería de Fotos y Recuerdos
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
            >
              Ubicación y Contacto
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                    <div className="text-[10px] text-blue-600 uppercase font-semibold">
                      {currentUser.role === 'teacher' ? 'Docente' : 'Estudiante'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab(
                      currentUser.role === 'teacher' ? 'teacher-portal' : 'student-portal'
                    );
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ir a Mi Panel de Control</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuth('student')}
                  className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-700 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Acceso Estudiante</span>
                </button>
                <button
                  onClick={() => openAuth('teacher')}
                  className="w-full py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <School className="w-4 h-4 text-white" />
                  <span>Acceso Profesor / Admin</span>
                </button>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      loginAsDemoStudent();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium"
                  >
                    Demo Estudiante
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemoTeacher();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium"
                  >
                    Demo Profesor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
