import React, { useState } from 'react';
import {
  School,
  GraduationCap,
  Users,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  ArrowRight,
  Send,
  Building,
  Award,
  ChevronRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const {
    institution,
    announcements,
    setAuthModalOpen,
    setTargetAuthRole,
    addAdmissionRequest,
    notify
  } = useApp();

  const [interestForm, setInterestForm] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentGrade: '1er Año',
    message: ''
  });
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  const openAuth = (role) => {
    setTargetAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    await addAdmissionRequest({
      parentName: interestForm.parentName,
      phone: interestForm.phone,
      email: interestForm.email,
      studentGrade: interestForm.studentGrade,
      message: interestForm.message
    });
    setInterestSubmitted(true);
    setTimeout(() => {
      setInterestForm({
        parentName: '',
        phone: '',
        email: '',
        studentGrade: '1er Año',
        message: ''
      });
      setInterestSubmitted(false);
    }, 4500);
  };

  const activeYear = institution.currentSchoolYear || '2027-2028';

  return (
    <div className="min-h-screen denim-pattern text-slate-100">
      {/* 1. HERO SECTION (Denim and Industrial Craft Keynote) */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[#DCB35C]/20">
        {/* Subtle radial wash */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#223C63]/30 blur-[140px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full denim-patch border-stitch-subtle text-xs">
                <span className="w-2 h-2 rounded-full bg-[#f0c36d] animate-pulse"></span>
                <span>Año Escolar {activeYear}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#f0c36d] font-semibold">Barcelona, Anzoátegui</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-slab tracking-tight leading-[1.1] text-white">
                {institution.name}
              </h1>

              <p className="text-xl sm:text-2xl font-serif italic text-[#f0c36d] font-light">
                "{institution.motto}"
              </p>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Más de tres décadas dedicadas a la formación académica rigurosa, ética y ciudadana en el sector Colinas del Neverí. Accede a los portales de autogestión para notas, horarios, pagos y administración del plantel.
              </p>

              {/* 4 Portals Action Cards (Denim Craft Patches) */}
              <div className="pt-2">
                <div className="text-xs uppercase font-semibold text-[#DCB35C] tracking-wider mb-3 flex items-center gap-2">
                  <span className="h-px w-6 bg-[#DCB35C]/50"></span>
                  <span>Selecciona tu portal de acceso:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => openAuth('student')}
                    className="p-3.5 bg-[#1A2B45]/90 hover:bg-[#223C63] rounded-lg text-left border border-stitch-subtle hover:border-[#DCB35C] transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#223C63] border border-[#DCB35C]/40 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <GraduationCap className="w-4 h-4 text-[#DCB35C]" />
                    </div>
                    <div className="font-bold font-slab text-xs text-white group-hover:text-[#f0c36d] transition">Estudiantes</div>
                    <div className="text-[10px] text-slate-400">Notas, carnet y horarios</div>
                  </button>

                  <button
                    onClick={() => openAuth('representative')}
                    className="p-3.5 bg-[#1A2B45]/90 hover:bg-[#223C63] rounded-lg text-left border border-stitch-subtle hover:border-emerald-400 transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <Users className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="font-bold font-slab text-xs text-white group-hover:text-emerald-300 transition">Representantes</div>
                    <div className="text-[10px] text-slate-400">Pagos, solvencias y notas</div>
                  </button>

                  <button
                    onClick={() => openAuth('teacher')}
                    className="p-3.5 bg-[#1A2B45]/90 hover:bg-[#223C63] rounded-lg text-left border border-stitch-subtle hover:border-indigo-400 transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <School className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="font-bold font-slab text-xs text-white group-hover:text-indigo-300 transition">Docentes</div>
                    <div className="text-[10px] text-slate-400">Horarios, aulas y notas</div>
                  </button>

                  <button
                    onClick={() => openAuth('admin')}
                    className="p-3.5 bg-[#1A2B45]/90 hover:bg-[#223C63] rounded-lg text-left border border-stitch-subtle hover:border-rose-400 transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="font-bold font-slab text-xs text-white group-hover:text-rose-300 transition">Dirección</div>
                    <div className="text-[10px] text-slate-400">Gestión de Control de Estudios</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Campus Feature Card (Denim Frame with Copper Rivets) */}
            <div className="lg:col-span-5">
              <div className="bg-[#1A2B45] rounded-xl p-6 border-stitch shadow-2xl space-y-4 relative">
                {/* Copper corner rivets */}
                <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#B87333] border border-amber-300/40 shadow-xs"></div>
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#B87333] border border-amber-300/40 shadow-xs"></div>
                <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#B87333] border border-amber-300/40 shadow-xs"></div>
                <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#B87333] border border-amber-300/40 shadow-xs"></div>

                <div className="rounded-lg overflow-hidden h-60 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                    alt="Campus Integral Venezuela"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101c30] via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-bold font-slab tracking-tight">Sede Principal Colinas del Neverí</div>
                    <div className="text-[11px] text-slate-300">Calle 11, Barcelona, Anzoátegui</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3.5 rounded-lg bg-[#101c30] border border-slate-700/80">
                    <div className="text-[#DCB35C] text-[10px] uppercase font-semibold tracking-wider">Director General</div>
                    <div className="font-bold text-white text-sm mt-0.5 font-slab">{institution.principal}</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#101c30] border border-slate-700/80">
                    <div className="text-[#DCB35C] text-[10px] uppercase font-semibold tracking-wider">Fundación</div>
                    <div className="font-bold text-white text-sm mt-0.5 font-slab">10 Nov 1989</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 pt-8 border-t border-[#DCB35C]/20 grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-xs">
            {(institution?.stats || [
              { value: '35+', label: 'Años de Trayectoria' },
              { value: '100%', label: 'Egresados Universitarios' },
              { value: '1989', label: 'Año de Fundación' },
              { value: '5', label: 'Años de Bachillerato' },
              { value: 'DEA', label: 'Registro MPPE' }
            ]).map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-white font-slab text-[#f0c36d]">{s.value}</div>
                <div className="text-slate-300 uppercase text-[10px] font-medium tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL ANNOUNCEMENT BANNER */}
      {announcements.length > 0 && (
        <section className="bg-[#1A2B45] border-b border-[#DCB35C]/20 py-3.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-slate-200">
              <span className="px-2.5 py-0.5 rounded-md bg-[#DCB35C]/20 text-[#f0c36d] border border-[#DCB35C]/30 font-bold uppercase text-[10px] font-slab">
                Circular
              </span>
              <span className="font-semibold text-white">{announcements[0].title}:</span>
              <span className="text-slate-300 line-clamp-1">{announcements[0].content}</span>
            </div>
            <button
              onClick={() => openAuth('representative')}
              className="text-[#f0c36d] hover:underline font-semibold flex items-center gap-1 shrink-0 transition cursor-pointer"
            >
              <span>Consultar en portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. IDENTIDAD, MISIÓN, VISIÓN Y VALORES */}
      <section id="identidad" className="py-20 border-b border-[#DCB35C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold text-[#DCB35C] uppercase tracking-widest font-slab">
              Identidad Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-slab text-white mt-1">
              Treinta y cinco años enseñando a vivir
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Fundado en Barcelona el 10 de noviembre de 1989, el Colegio Integral Venezuela concibe la educación como un compromiso integral con la ciencia, el pensamiento crítico y la formación ética para la vida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-3xl bg-[#1A2B45] border-stitch shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#223C63] border border-[#DCB35C]/40 flex items-center justify-center text-[#DCB35C]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-slab text-white">Misión</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{institution.mission}</p>
            </div>

            <div className="p-8 rounded-3xl bg-[#1A2B45] border-stitch shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#223C63] border border-[#DCB35C]/40 flex items-center justify-center text-[#DCB35C]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-slab text-white">Visión</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{institution.vision}</p>
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(institution?.values || []).map((val, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-stitch-subtle bg-[#16253c] hover:bg-[#1A2B45] transition">
                <div className="font-mono text-xs font-bold text-[#DCB35C] mb-2">0{idx + 1}</div>
                <h4 className="font-bold text-white text-sm mb-1.5 font-slab">{val.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSTALACIONES Y AULAS */}
      <section id="instalaciones" className="py-20 border-b border-[#DCB35C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-[#DCB35C] uppercase tracking-widest font-slab">
              Instalaciones del Plantel
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-slab text-white mt-1">
              Espacios concebidos para el aprendizaje
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Aulas climatizadas por sección, laboratorios experimentales y canchas deportivas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(institution?.gallery || []).map((g) => (
              <div key={g.id} className="bg-[#1A2B45] rounded-3xl overflow-hidden border border-stitch-subtle shadow-xl group">
                <div className="h-48 overflow-hidden">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase font-bold text-[#f0c36d] bg-[#223C63] border border-[#DCB35C]/30 px-2.5 py-1 rounded-md font-slab">
                    {g.category}
                  </span>
                  <h3 className="font-bold text-white text-base font-slab mt-3 mb-1.5">{g.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ADMISIONES Y FORMULARIO */}
      <section id="inscripciones" className="py-20 border-b border-[#DCB35C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Requisitos */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#DCB35C] uppercase tracking-widest font-slab">
                  Proceso de Admisión
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-slab text-white mt-1">
                  Requisitos para el Año Escolar {activeYear}
                </h2>
                <p className="text-sm text-slate-300 mt-2">
                  Atención presencial en Control de Estudios de lunes a viernes en horario matutino.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                {(institution?.admissions?.requirements || []).map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-[#f0c36d] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#1A2B45] border-stitch-subtle rounded-2xl text-xs text-slate-300">
                Dirección de Control de Estudios: <strong className="text-white">Calle 11, sector Colinas del Neverí, Barcelona, Anzoátegui</strong>.
              </div>
            </div>

            {/* Solicitud de Información */}
            <div className="lg:col-span-5 bg-[#1A2B45] p-7 rounded-3xl border-stitch shadow-2xl">
              <h3 className="text-base font-bold font-slab text-white mb-1">
                Solicitud de Cupo • Año {activeYear}
              </h3>
              <p className="text-xs text-slate-300 mb-5">
                Completa este formulario y el departamento de admisión te contactará
              </p>

              {interestSubmitted ? (
                <div className="p-5 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-center text-xs text-emerald-300">
                  <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                  <div className="font-bold text-sm font-slab">¡Solicitud recibida!</div>
                  <p className="mt-1 text-slate-300">Nos comunicaremos pronto con usted.</p>
                </div>
              ) : (
                <form onSubmit={handleInterestSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Nombre del Representante</label>
                    <input
                      type="text"
                      required
                      value={interestForm.parentName}
                      onChange={(e) => setInterestForm({ ...interestForm, parentName: e.target.value })}
                      placeholder="Ej. Carmen Solórzano"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#101c30] text-white placeholder-slate-500 focus:border-[#DCB35C] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={interestForm.phone}
                        onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                        placeholder="+58 414 1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#101c30] text-white placeholder-slate-500 focus:border-[#DCB35C] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Año a Cursar</label>
                      <select
                        value={interestForm.studentGrade}
                        onChange={(e) => setInterestForm({ ...interestForm, studentGrade: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#101c30] text-white focus:border-[#DCB35C] focus:outline-hidden"
                      >
                        <option value="1er Año">1er Año de Bachillerato</option>
                        <option value="2do Año">2do Año de Bachillerato</option>
                        <option value="3er Año">3er Año de Bachillerato</option>
                        <option value="4to Año">4to Año de Bachillerato</option>
                        <option value="5to Año">5to Año de Bachillerato</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={interestForm.email}
                      onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                      placeholder="representante@correo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#101c30] text-white placeholder-slate-500 focus:border-[#DCB35C] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Observaciones</label>
                    <textarea
                      rows={2}
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Colegio de procedencia o consultas..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#101c30] text-white placeholder-slate-500 focus:border-[#DCB35C] focus:outline-hidden"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] font-bold font-slab rounded-xl shadow-lg transition cursor-pointer"
                  >
                    Enviar Solicitud
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. UBICACIÓN Y CONTACTO */}
      <section id="contacto" className="py-16 border-b border-[#DCB35C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#DCB35C] tracking-wider font-slab">
                Contacto Directo
              </span>
              <h2 className="text-2xl font-bold font-slab text-white">{institution.name}</h2>
              <p className="text-slate-300 max-w-md">
                Director General: <strong className="text-white font-slab">{institution.principal}</strong> ({institution.adminEmail})
              </p>

              <div className="space-y-2.5 pt-2 text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#DCB35C] shrink-0" />
                  <span>{institution.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#DCB35C] shrink-0" />
                  <span>{institution.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#DCB35C] shrink-0" />
                  <span>{institution.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#DCB35C] shrink-0" />
                  <span>{institution.schedule}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1A2B45] p-7 rounded-3xl border-stitch text-xs text-slate-300 space-y-3 shadow-xl">
              <div className="font-bold text-white text-sm font-slab">Reseña Histórica</div>
              <p className="leading-relaxed text-slate-300">
                {institution.history || 'Fundada el 10 de noviembre de 1989 en Barcelona, Estado Anzoátegui, la institución ha formado generaciones de bachilleres con excelencia académica y vocación de servicio.'}
              </p>
              <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                Sede autorizada por el Ministerio del Poder Popular para la Educación • Código DEA: {institution.deaCode || 'PD11370304'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 text-[11px] text-slate-400 bg-[#0d1726]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {institution.name}. {institution.motto}. Año Escolar {activeYear}.
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <button onClick={() => openAuth('student')} className="hover:text-white transition cursor-pointer">Estudiantes</button>
            <button onClick={() => openAuth('representative')} className="hover:text-white transition cursor-pointer">Representantes</button>
            <button onClick={() => openAuth('teacher')} className="hover:text-white transition cursor-pointer">Docentes</button>
            <button onClick={() => openAuth('admin')} className="hover:text-white transition cursor-pointer">Dirección</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
