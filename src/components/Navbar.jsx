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
  Calendar,
  User
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
    return `Estudiante (${currentUser.gradeLevel || 'Bachillerato'})`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#16253c]/90 backdrop-blur-xl border-b border-[#DCB35C]/20 text-white shadow-xl">
      {/* Top Institutional Micro-bar */}
      <div className="bg-[#101c30] text-slate-400 text-[11px] py-1.5 px-4 hidden md:block border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#DCB35C]" />
              <span>{institution.address}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-[#DCB35C]" />
              <span>{institution.phone || '0416-6802168 / 0412-8637615'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#DCB35C]" />
              <span>{institution.email || 'integralvenezuela@gmail.com'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="denim-patch px-2.5 py-0.5 text-[10px] flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#DCB35C]" />
              <span>{institution.currentSchoolYear ? `Año Escolar ${institution.currentSchoolYear}` : 'Año Escolar 2027-2028'}</span>
            </span>
            <span className="denim-patch px-2.5 py-0.5 text-[10px] text-[#f0c36d] font-mono">
              DEA: {institution.deaCode || 'PD11370304'}
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Barcelona, Anzoátegui</span>
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
            <div className="w-10 h-10 rounded-lg bg-[#1A2B45] border border-[#DCB35C]/50 flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition transform duration-200">
              <img src="/logo.png" alt="Crest" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="font-slab font-bold text-base sm:text-lg text-white tracking-tight leading-tight group-hover:text-[#f0c36d] transition">
                {institution.name}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Zona Educativa de Anzoátegui • Código DEA: {institution.deaCode || 'PD11370304'}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'home'
                  ? 'text-white bg-[#223C63] border border-stitch-subtle font-semibold shadow-xs'
                  : 'hover:text-white hover:bg-[#1A2B45]'
              }`}
            >
              Inicio
            </button>
            <a
              href="#identidad"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1A2B45] transition"
            >
              Identidad & Valores
            </a>
            <a
              href="#inscripciones"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1A2B45] transition"
            >
              Admisiones
            </a>
            <a
              href="#instalaciones"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1A2B45] transition"
            >
              Instalaciones & Galería
            </a>
            <a
              href="#contacto"
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-[#1A2B45] transition"
            >
              Ubicación & Contacto
            </a>
          </nav>

          {/* Portals Access / User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-[#1A2B45] p-1.5 pr-3 rounded-lg border border-stitch-subtle shadow-md">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-[#DCB35C]/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#223C63] border border-[#DCB35C]/50 flex items-center justify-center text-[#DCB35C] shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="text-left text-xs">
                  <div className="font-semibold text-white max-w-[150px] truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#f0c36d] font-medium">{getRoleLabel()}</div>
                </div>

                <button
                  onClick={() => setActiveTab(getPortalTabForUser())}
                  className="ml-2 px-3 py-1.5 bg-[#DCB35C] hover:bg-[#f0c36d] text-[#1A2B45] rounded-lg text-xs font-bold font-slab flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Mi Panel</span>
                </button>

                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccessDropdownOpen(!accessDropdownOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] font-bold font-slab text-xs rounded-lg shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Acceso a Portales</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {accessDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-[#152338] text-slate-200 rounded-lg shadow-2xl border border-stitch p-2 z-50 text-xs font-medium animate-fade-in"
                    onClick={() => setAccessDropdownOpen(false)}
                  >
                    <button
                      onClick={() => openAuth('student')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#1A2B45] rounded-lg flex items-center gap-3 text-slate-200 hover:text-white transition cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-[#DCB35C] shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Portal Estudiantes</div>
                        <div className="text-[10px] text-slate-400">Notas, horarios, carnet y boletín</div>
                      </div>
                    </button>
                    <button
                      onClick={() => openAuth('representative')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#1A2B45] rounded-lg flex items-center gap-3 text-slate-200 hover:text-white transition cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Portal Representantes</div>
                        <div className="text-[10px] text-slate-400">Pagos, solvencias y notas de alumnos</div>
                      </div>
                    </button>
                    <button
                      onClick={() => openAuth('teacher')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#1A2B45] rounded-lg flex items-center gap-3 text-slate-200 hover:text-white transition cursor-pointer"
                    >
                      <School className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Portal Docentes</div>
                        <div className="text-[10px] text-slate-400">Horarios, aulas y calificaciones</div>
                      </div>
                    </button>
                    <div className="my-1.5 border-t border-slate-700/60"></div>
                    <button
                      onClick={() => openAuth('admin')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-rose-500/10 rounded-lg flex items-center gap-3 text-slate-100 hover:text-white font-semibold transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div className="text-white font-slab">Panel de Dirección</div>
                        <div className="text-[10px] text-rose-300 font-normal">Control de Estudios y Administración</div>
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
              className="p-2 text-slate-300 rounded-xl hover:bg-[#1A2B45] hover:text-white transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-700/60 bg-[#16253c] px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-2xl text-xs">
          <nav className="flex flex-col gap-1 font-medium text-slate-300">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#1A2B45] hover:text-white font-medium"
            >
              Inicio
            </button>
            <a
              href="#identidad"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#1A2B45] hover:text-white"
            >
              Identidad & Valores
            </a>
            <a
              href="#inscripciones"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#1A2B45] hover:text-white"
            >
              Admisiones
            </a>
            <a
              href="#instalaciones"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#1A2B45] hover:text-white"
            >
              Instalaciones & Galería
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3 py-2 rounded-xl hover:bg-[#1A2B45] hover:text-white"
            >
              Ubicación & Contacto
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { setActiveTab(getPortalTabForUser()); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-[#DCB35C] text-[#1A2B45] font-bold font-slab rounded-xl flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ir a Mi Panel ({currentUser.role})</span>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 bg-[#1A2B45] text-slate-300 font-medium rounded-xl hover:bg-slate-700"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1 font-medium">
                <button
                  onClick={() => openAuth('student')}
                  className="py-2 px-2.5 bg-[#101c30] hover:bg-[#1A2B45] text-slate-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <GraduationCap className="w-4 h-4 text-[#DCB35C] shrink-0" />
                  <span>Estudiante</span>
                </button>
                <button
                  onClick={() => openAuth('representative')}
                  className="py-2 px-2.5 bg-[#101c30] hover:bg-[#1A2B45] text-slate-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Representante</span>
                </button>
                <button
                  onClick={() => openAuth('teacher')}
                  className="py-2 px-2.5 bg-[#101c30] hover:bg-[#1A2B45] text-slate-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <School className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Docente</span>
                </button>
                <button
                  onClick={() => openAuth('admin')}
                  className="py-2 px-2.5 bg-rose-950/40 hover:bg-rose-950/60 text-rose-200 rounded-xl text-left flex items-center gap-2 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Dirección</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
