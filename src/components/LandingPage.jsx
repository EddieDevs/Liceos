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
  Award
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
    <div className="min-h-screen bg-white text-slate-800">
      {/* 1. HERO SECTION (Clean, Editorial, Modern) */}
      <section className="border-b border-slate-200 bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                <span>Fundado el 10 de noviembre de 1989</span>
                <span className="text-slate-500">•</span>
                <span className="text-blue-400 font-semibold">Barcelona, Anzoátegui</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight">
                {institution.name}
              </h1>

              <p className="text-xl sm:text-2xl font-serif italic text-slate-300">
                "{institution.motto}"
              </p>

              <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                Más de tres décadas dedicadas a la formación académica rigurosa, ética y ciudadana en el sector Colinas del Neverí. Accede a los portales de gestión para calificaciones, horarios, pagos y administración.
              </p>

              {/* 4 Portals Direct Action Buttons */}
              <div className="pt-2">
                <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2.5">
                  Selecciona tu portal de acceso:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => openAuth('student')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition"
                  >
                    <GraduationCap className="w-5 h-5 text-blue-400 mb-1" />
                    <div className="font-bold text-xs text-white">Estudiantes</div>
                    <div className="text-[10px] text-slate-400">Notas y horarios</div>
                  </button>

                  <button
                    onClick={() => openAuth('representative')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition"
                  >
                    <Users className="w-5 h-5 text-emerald-400 mb-1" />
                    <div className="font-bold text-xs text-white">Representantes</div>
                    <div className="text-[10px] text-slate-400">Pagos y boletín</div>
                  </button>

                  <button
                    onClick={() => openAuth('teacher')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition"
                  >
                    <School className="w-5 h-5 text-indigo-400 mb-1" />
                    <div className="font-bold text-xs text-white">Profesores</div>
                    <div className="text-[10px] text-slate-400">Horarios y aulas</div>
                  </button>

                  <button
                    onClick={() => openAuth('admin')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left border border-slate-700 transition"
                  >
                    <ShieldCheck className="w-5 h-5 text-rose-400 mb-1" />
                    <div className="font-bold text-xs text-white">Administración</div>
                    <div className="text-[10px] text-slate-400">Dirección general</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Campus Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="rounded-xl overflow-hidden h-56 relative">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                    alt="Campus Integral Venezuela"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs font-semibold">Sede Principal Colinas del Neverí</div>
                    <div className="text-[11px] text-slate-300">Calle 11, Barcelona, Anzoátegui</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/80">
                    <div className="text-slate-400 text-[10px] uppercase">Director</div>
                    <div className="font-bold text-white text-sm">{institution.principal}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/80">
                    <div className="text-slate-400 text-[10px] uppercase">Fundación</div>
                    <div className="font-bold text-white text-sm">10 Nov 1989</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-xs">
            {institution.stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl font-bold text-white font-heading">{s.value}</div>
                <div className="text-slate-400 uppercase text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL ANNOUNCEMENT BANNER */}
      {announcements.length > 0 && (
        <section className="bg-slate-50 border-b border-slate-200 py-3 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="px-2 py-0.5 rounded bg-slate-200 font-bold uppercase text-[10px]">
                Comunicado
              </span>
              <span className="font-semibold">{announcements[0].title}:</span>
              <span className="text-slate-600 line-clamp-1">{announcements[0].content}</span>
            </div>
            <button
              onClick={() => openAuth('representative')}
              className="text-blue-700 font-semibold hover:underline shrink-0"
            >
              Consultar en portal &rarr;
            </button>
          </div>
        </section>
      )}

      {/* 3. IDENTIDAD, MISIÓN, VISIÓN Y VALORES */}
      <section id="identidad" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Identidad Institucional
            </span>
            <h2 className="text-3xl font-bold font-heading text-slate-900 mt-1">
              Treinta y cinco años enseñando a vivir
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Fundado en Barcelona el 10 de noviembre de 1989, el Colegio Integral Venezuela concibe la educación como un compromiso integral con la ciencia, el pensamiento crítico y la formación ética.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">Misión</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{institution.mission}</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">Visión</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{institution.vision}</p>
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {institution.values.map((val, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-white">
                <div className="font-mono text-xs font-bold text-blue-700 mb-2">0{idx + 1}</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSTALACIONES Y AULAS */}
      <section id="instalaciones" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Instalaciones del Plantel
            </span>
            <h2 className="text-3xl font-bold font-heading text-slate-900 mt-1">
              Espacios concebidos para el aprendizaje
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Aulas climatizadas, laboratorios y canchas en Colinas del Neverí
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {institution.gallery.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                <img src={g.image} alt={g.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {g.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm font-heading mt-2 mb-1">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ADMISIONES Y FORMULARIO */}
      <section id="inscripciones" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Requisitos */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Proceso de Admisión
                </span>
                <h2 className="text-3xl font-bold font-heading text-slate-900 mt-1">
                  Requisitos para el Año Escolar 2024-2025
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Atención en Control de Estudios de lunes a viernes en horario matutino.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {institution.admissions.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                Dirección de Control de Estudios: <strong>Calle 11, sector Colinas del Neverí, Barcelona</strong>.
              </div>
            </div>

            {/* Solicitud de Información */}
            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-base font-bold font-heading text-slate-900 mb-1">
                Solicitud de Información y Cupo
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Completa este formulario y el departamento de admisión te contactará
              </p>

              {interestSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-bold">¡Solicitud recibida!</div>
                  <p className="mt-1">Nos comunicaremos pronto contigo.</p>
                </div>
              ) : (
                <form onSubmit={handleInterestSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nombre del Representante</label>
                    <input
                      type="text"
                      required
                      value={interestForm.parentName}
                      onChange={(e) => setInterestForm({ ...interestForm, parentName: e.target.value })}
                      placeholder="Ej. Carmen Solórzano"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={interestForm.phone}
                        onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                        placeholder="+58 414 1234567"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Año a Cursar</label>
                      <select
                        value={interestForm.studentGrade}
                        onChange={(e) => setInterestForm({ ...interestForm, studentGrade: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
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
                    <label className="block font-medium text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={interestForm.email}
                      onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                      placeholder="representante@correo.com"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Observaciones</label>
                    <textarea
                      rows={2}
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Colegio de procedencia o consultas..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition"
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
      <section id="contacto" className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Contacto Directo
              </span>
              <h2 className="text-2xl font-bold font-heading">{institution.name}</h2>
              <p className="text-slate-400 max-w-md">
                Director General: <strong className="text-white">{institution.principal}</strong> ({institution.adminEmail})
              </p>

              <div className="space-y-2 pt-2 text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{institution.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{institution.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{institution.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{institution.schedule}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-3">
              <div className="font-bold text-white text-sm">Reseña Histórica</div>
              <p className="leading-relaxed text-slate-400">
                {institution.history}
              </p>
              <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-500">
                Sede autorizada por el Ministerio del Poder Popular para la Educación • Código DEA oficial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-[11px] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {institution.name}. {institution.motto}.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => openAuth('student')} className="hover:text-white">Estudiantes</button>
            <button onClick={() => openAuth('representative')} className="hover:text-white">Representantes</button>
            <button onClick={() => openAuth('teacher')} className="hover:text-white">Docentes</button>
            <button onClick={() => openAuth('admin')} className="hover:text-white">Administración</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
