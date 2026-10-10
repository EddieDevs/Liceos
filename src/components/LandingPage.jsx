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
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const {
    institution,
    announcements,
    setAuthModalOpen,
    setTargetAuthRole,
    notify
  } = useApp();

  const [interestForm, setInterestForm] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentGrade: '1er Año de Bachillerato',
    message: ''
  });
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  const openAuth = (role) => {
    setTargetAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    setInterestSubmitted(true);
    notify('Solicitud registrada. El departamento de admisiones se comunicará a la brevedad.');
    setTimeout(() => {
      setInterestForm({
        parentName: '',
        phone: '',
        email: '',
        studentGrade: '1er Año de Bachillerato',
        message: ''
      });
      setInterestSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      {/* 1. HERO SECTION (Apple / Google Keynote Dark Matte) */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-800/80">
        {/* Ambient subtle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-slate-300 text-xs font-medium border border-slate-700/60 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span>Fundado el 10 de noviembre de 1989</span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400 font-semibold">Barcelona, Anzoátegui</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.1] text-white">
                {institution.name}
              </h1>

              <p className="text-xl sm:text-2xl font-serif italic text-slate-300 font-light">
                "{institution.motto}"
              </p>

              <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                Más de tres décadas dedicadas a la formación académica rigurosa, ética y ciudadana en el sector Colinas del Neverí. Accede a los portales de autogestión para notas, horarios, pagos y administración del plantel.
              </p>

              {/* 4 Portals Action Cards */}
              <div className="pt-2">
                <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">
                  Selecciona tu portal de acceso:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => openAuth('student')}
                    className="p-4 bg-slate-900/70 hover:bg-slate-800/80 rounded-2xl text-left border border-slate-800 hover:border-blue-500/40 transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="font-bold text-xs text-white group-hover:text-blue-400 transition">Estudiantes</div>
                    <div className="text-[10px] text-slate-400">Notas y horarios</div>
                  </button>

                  <button
                    onClick={() => openAuth('representative')}
                    className="p-4 bg-slate-900/70 hover:bg-slate-800/80 rounded-2xl text-left border border-slate-800 hover:border-emerald-500/40 transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <Users className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="font-bold text-xs text-white group-hover:text-emerald-400 transition">Representantes</div>
                    <div className="text-[10px] text-slate-400">Pagos y boletín</div>
                  </button>

                  <button
                    onClick={() => openAuth('teacher')}
                    className="p-4 bg-slate-900/70 hover:bg-slate-800/80 rounded-2xl text-left border border-slate-800 hover:border-indigo-500/40 transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <School className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="font-bold text-xs text-white group-hover:text-indigo-400 transition">Docentes</div>
                    <div className="text-[10px] text-slate-400">Horarios y aulas</div>
                  </button>

                  <button
                    onClick={() => openAuth('admin')}
                    className="p-4 bg-slate-900/70 hover:bg-slate-800/80 rounded-2xl text-left border border-slate-800 hover:border-rose-500/40 transition group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="font-bold text-xs text-white group-hover:text-rose-400 transition">Administración</div>
                    <div className="text-[10px] text-slate-400">Dirección general</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Campus Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
                <div className="rounded-2xl overflow-hidden h-60 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                    alt="Campus Integral Venezuela"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-bold tracking-tight">Sede Principal Colinas del Neverí</div>
                    <div className="text-[11px] text-slate-300">Calle 11, Barcelona, Anzoátegui</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Director General</div>
                    <div className="font-bold text-white text-sm mt-0.5">{institution.principal}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Fundación</div>
                    <div className="font-bold text-white text-sm mt-0.5">10 Nov 1989</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-xs">
            {(institution?.stats || [
              { value: '35+', label: 'Años de Trayectoria' },
              { value: '100%', label: 'Egresados Universitarios' },
              { value: '1989', label: 'Año de Fundación' },
              { value: '5', label: 'Años de Bachillerato' },
              { value: 'DEA', label: 'Registro MPPE' }
            ]).map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">{s.value}</div>
                <div className="text-slate-400 uppercase text-[10px] font-medium tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL ANNOUNCEMENT BANNER */}
      {announcements.length > 0 && (
        <section className="bg-slate-900/60 border-b border-slate-800 py-3.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-slate-200">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase text-[10px]">
                Comunicado
              </span>
              <span className="font-semibold text-white">{announcements[0].title}:</span>
              <span className="text-slate-400 line-clamp-1">{announcements[0].content}</span>
            </div>
            <button
              onClick={() => openAuth('representative')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0 transition cursor-pointer"
            >
              <span>Consultar en portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. IDENTIDAD, MISIÓN, VISIÓN Y VALORES */}
      <section id="identidad" className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
              Identidad Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1">
              Treinta y cinco años enseñando a vivir
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Fundado en Barcelona el 10 de noviembre de 1989, el Colegio Integral Venezuela concibe la educación como un compromiso integral con la ciencia, el pensamiento crítico y la formación ética.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Misión</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{institution.mission}</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Visión</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{institution.vision}</p>
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(institution?.values || []).map((val, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 transition">
                <div className="font-mono text-xs font-bold text-blue-400 mb-2">0{idx + 1}</div>
                <h4 className="font-bold text-white text-sm mb-1.5">{val.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSTALACIONES Y AULAS */}
      <section id="instalaciones" className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
              Instalaciones del Plantel
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1">
              Espacios concebidos para el aprendizaje
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Aulas climatizadas, laboratorios y canchas deportivas en Colinas del Neverí
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(institution?.gallery || []).map((g) => (
              <div key={g.id} className="bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-800 shadow-xl group">
                <div className="h-48 overflow-hidden">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">
                    {g.category}
                  </span>
                  <h3 className="font-bold text-white text-base font-heading mt-3 mb-1.5">{g.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ADMISIONES Y FORMULARIO */}
      <section id="inscripciones" className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Requisitos */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
                  Proceso de Admisión
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1">
                  Requisitos para el Año Escolar
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Atención presencial en Control de Estudios de lunes a viernes en horario matutino.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                {(institution?.admissions?.requirements || []).map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400">
                Dirección de Control de Estudios: <strong className="text-slate-200">Calle 11, sector Colinas del Neverí, Barcelona</strong>.
              </div>
            </div>

            {/* Solicitud de Información */}
            <div className="lg:col-span-5 bg-slate-900/70 p-7 rounded-3xl border border-slate-800 shadow-2xl">
              <h3 className="text-base font-bold font-heading text-white mb-1">
                Solicitud de Información y Cupo
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Completa este formulario y el departamento de admisión te contactará
              </p>

              {interestSubmitted ? (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center text-xs text-emerald-300">
                  <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                  <div className="font-bold text-sm">¡Solicitud recibida!</div>
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Año a Cursar</label>
                      <select
                        value={interestForm.studentGrade}
                        onChange={(e) => setInterestForm({ ...interestForm, studentGrade: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white focus:border-blue-500 focus:outline-hidden"
                      >
                        <option value="1er Año de Bachillerato">1er Año</option>
                        <option value="2do Año de Bachillerato">2do Año</option>
                        <option value="3er Año de Bachillerato">3er Año</option>
                        <option value="4to Año de Bachillerato">4to Año</option>
                        <option value="5to Año de Bachillerato">5to Año</option>
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Observaciones</label>
                    <textarea
                      rows={2}
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Colegio de procedencia o consultas..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 transition cursor-pointer"
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
      <section id="contacto" className="py-16 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Contacto Directo
              </span>
              <h2 className="text-2xl font-bold font-heading text-white">{institution.name}</h2>
              <p className="text-slate-400 max-w-md">
                Director General: <strong className="text-white">{institution.principal}</strong> ({institution.adminEmail})
              </p>

              <div className="space-y-2.5 pt-2 text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{institution.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{institution.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{institution.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{institution.schedule}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 text-xs text-slate-300 space-y-3 shadow-xl">
              <div className="font-bold text-white text-sm">Reseña Histórica</div>
              <p className="leading-relaxed text-slate-400">
                {institution.history}
              </p>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                Sede autorizada por el Ministerio del Poder Popular para la Educación • Código DEA oficial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 text-[11px] text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {institution.name}. {institution.motto}.
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <button onClick={() => openAuth('student')} className="hover:text-white transition cursor-pointer">Estudiantes</button>
            <button onClick={() => openAuth('representative')} className="hover:text-white transition cursor-pointer">Representantes</button>
            <button onClick={() => openAuth('teacher')} className="hover:text-white transition cursor-pointer">Docentes</button>
            <button onClick={() => openAuth('admin')} className="hover:text-white transition cursor-pointer">Administración</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
