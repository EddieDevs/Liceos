import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setAuthModalOpen,
    setTargetAuthRole,
    logout,
    institution,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessDropdownOpen, setAccessDropdownOpen] = useState(false);

  const openAuth = (role) => {
    setTargetAuthRole(role);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
    setAccessDropdownOpen(false);
  };

  const getPortalTabForUser = () => {
    if (!currentUser) return 'home';
    if (currentUser.role === 'admin') return 'admin-portal';
    if (currentUser.role === 'teacher') return 'teacher-portal';
    if (currentUser.role === 'representative') return 'representative-portal';
    return 'student-portal';
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'admin') return 'Director / Administrador';
    if (currentUser.role === 'teacher') return 'Docente Titular';
    if (currentUser.role === 'representative') return 'Representante Legal';
    return 'Estudiante Regular';
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 text-white">
      {/* Top Institutional Micro-bar */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-1.5 px-4 hidden md:block border-b border-slate-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-slate-300 transition">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{institution.address}</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-300 transition">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{institution.phone.split('/')[0]}</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-300 transition">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{institution.email}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Fundado el {institution.foundedDate}</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-200 italic font-serif">"{institution.motto}"</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition transform duration-200">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight group-hover:text-blue-400 transition">
                {institution.name}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Barcelona, Anzoátegui • Lema: {institution.motto}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeTab === 'home'
                  ? 'text-white bg-slate-800/90 font-semibold shadow-xs'
                  : 'hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Inicio
            </button>
            <a
              href="#identidad"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-800/50 transition"
            >
              Identidad & Valores
            </a>
            <a
              href="#inscripciones"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-800/50 transition"
            >
              Admisiones
            </a>
            <a
              href="#instalaciones"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-800/50 transition"
            >
              Instalaciones & Galería
            </a>
            <a
              href="#contacto"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-800/50 transition"
            >
              Ubicación & Contacto
            </a>
          </nav>

          {/* Portals Access / User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 pr-3 rounded-2xl border border-slate-800 shadow-md">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-white max-w-[150px] truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-blue-400 font-medium">{getRoleLabel()}</div>
                </div>

                <button
                  onClick={() => setActiveTab(getPortalTabForUser())}
                  className="ml-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Mi Panel</span>
                </button>

                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccessDropdownOpen(!accessDropdownOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-900/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Acceso a Portales</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {accessDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-slate-900/95 backdrop-blur-xl text-slate-200 rounded-2xl shadow-2xl border border-slate-700/80 p-2 z-50 text-xs font-medium animate-fade-in"
                    onClick={() => setAccessDropdownOpen(false)}
                  >
                    <button
                      onClick={() => openAuth('student')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 rounded-xl flex items-center gap-3 text-slate-200 hover:text-white transition cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Portal Estudiantes</div>
                        <div className="text-[10px] text-slate-400">Notas, horarios y boletín</div>
                      </div>
                    </button>
                    <button
                      onClick={() => openAuth('representative')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 rounded-xl flex items-center gap-3 text-slate-200 hover:text-white transition cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Portal Representantes</div>
                        <div className="text-[10px] text-slate-400">Pagos, solvencias y notas</div>
                      </div>
                    </button>
                    <button
                      onClick={() => openAuth('teacher')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 rounded-xl flex items-center gap-3 text-slate-200 hover:text-white transition cursor-pointer"
                    >
                      <School className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Portal Docentes</div>
                        <div className="text-[10px] text-slate-400">Horarios, aulas y notas</div>
                      </div>
                    </button>
                    <div className="my-1.5 border-t border-slate-800"></div>
                    <button
                      onClick={() => openAuth('admin')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-rose-500/10 rounded-xl flex items-center gap-3 text-slate-100 hover:text-white font-semibold transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div>Panel Administrativo</div>
                        <div className="text-[10px] text-rose-300 font-normal">Dirección General</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-2xl text-xs">
          <nav className="flex flex-col gap-1 font-medium text-slate-300">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white font-medium"
            >
              Inicio
            </button>
            <a
              href="#identidad"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white"
            >
              Identidad & Valores
            </a>
            <a
              href="#inscripciones"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white"
            >
              Admisiones
            </a>
            <a
              href="#instalaciones"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white"
            >
              Instalaciones & Galería
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white"
            >
              Ubicación & Contacto
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { setActiveTab(getPortalTabForUser()); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ir a Mi Panel ({currentUser.role})</span>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1 font-medium">
                <button
                  onClick={() => openAuth('student')}
                  className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Estudiante</span>
                </button>
                <button
                  onClick={() => openAuth('representative')}
                  className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Representante</span>
                </button>
                <button
                  onClick={() => openAuth('teacher')}
                  className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <School className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Docente</span>
                </button>
                <button
                  onClick={() => openAuth('admin')}
                  className="py-2 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Administración</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
