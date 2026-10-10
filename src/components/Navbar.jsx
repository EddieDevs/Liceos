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
  LayoutDashboard
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Top Institutional Micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{institution.address}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{institution.phone.split('/')[0]}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{institution.email}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Fundado el {institution.foundedDate}</span>
            <span className="text-slate-600">•</span>
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
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold group-hover:bg-blue-900 transition">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-blue-900 transition">
                {institution.name}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Barcelona, Anzoátegui • Lema: {institution.motto}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'home'
                  ? 'text-slate-900 bg-slate-100 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Inicio
            </button>
            <a
              href="#identidad"
              onClick={() => setActiveTab('home')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Identidad & Valores
            </a>
            <a
              href="#inscripciones"
              onClick={() => setActiveTab('home')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Admisiones
            </a>
            <a
              href="#instalaciones"
              onClick={() => setActiveTab('home')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Instalaciones & Galería
            </a>
            <a
              href="#contacto"
              onClick={() => setActiveTab('home')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition"
            >
              Ubicación & Contacto
            </a>
          </nav>

          {/* Portals Access / User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-slate-50 p-1.5 pr-2.5 rounded-xl border border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-300"
                />
                <div className="text-left text-xs">
                  <div className="font-bold text-slate-900 max-w-[150px] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-blue-700 font-semibold">{getRoleLabel()}</div>
                </div>

                <button
                  onClick={() => setActiveTab(getPortalTabForUser())}
                  className="ml-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Mi Panel</span>
                </button>

                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccessDropdownOpen(!accessDropdownOpen)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5"
                >
                  <span>Acceso a Portales</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {accessDropdownOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-medium"
                    onClick={() => setAccessDropdownOpen(false)}
                  >
                    <button
                      onClick={() => openAuth('student')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-700" />
                      <span>Portal Estudiantes</span>
                    </button>
                    <button
                      onClick={() => openAuth('representative')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                    >
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span>Portal Representantes (Pagos)</span>
                    </button>
                    <button
                      onClick={() => openAuth('teacher')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                    >
                      <School className="w-4 h-4 text-indigo-700" />
                      <span>Portal Docentes (Horarios)</span>
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    <button
                      onClick={() => openAuth('admin')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-900 font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-700" />
                      <span>Panel Administrativo</span>
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
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl text-xs">
          <nav className="flex flex-col gap-1 font-medium text-slate-700">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 font-medium"
            >
              Inicio
            </button>
            <a
              href="#identidad"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Identidad & Valores
            </a>
            <a
              href="#inscripciones"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Admisiones
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Ubicación & Contacto
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { setActiveTab(getPortalTabForUser()); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ir a Mi Panel ({currentUser.role})</span>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 bg-slate-100 text-slate-700 font-medium rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1 font-medium">
                <button
                  onClick={() => openAuth('student')}
                  className="py-2 px-2.5 bg-slate-100 text-slate-800 rounded-lg text-left"
                >
                  🎓 Estudiante
                </button>
                <button
                  onClick={() => openAuth('representative')}
                  className="py-2 px-2.5 bg-slate-100 text-slate-800 rounded-lg text-left"
                >
                  👨‍👩‍👦 Representante
                </button>
                <button
                  onClick={() => openAuth('teacher')}
                  className="py-2 px-2.5 bg-slate-100 text-slate-800 rounded-lg text-left"
                >
                  👨‍🏫 Docente
                </button>
                <button
                  onClick={() => openAuth('admin')}
                  className="py-2 px-2.5 bg-slate-900 text-white rounded-lg text-left"
                >
                  🛡️ Administración
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
