import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Send,
  Heart,
  Compass,
  Lightbulb,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const {
    institution,
    memories,
    announcements,
    setAuthModalOpen,
    setTargetAuthRole,
    loginAsDemoStudent,
    loginAsDemoTeacher,
    notify
  } = useApp();

  const [galleryFilter, setGalleryFilter] = useState('Todas');
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
    notify('¡Solicitud enviada! El departamento de admisión se comunicará en breve.');
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

  const filteredGallery =
    galleryFilter === 'Todas'
      ? institution.gallery
      : institution.gallery.filter((g) => g.category.toLowerCase().includes(galleryFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Inscripciones y Prosecución Abiertas 2024-2025</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight">
                Formando líderes con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-200">excelencia, ciencia y valores</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                El <strong className="text-white">{institution.name}</strong> ofrece una educación media general de vanguardia. Accede al portal digital para gestionar calificaciones, horarios, planes de evaluación y certificaciones.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start">
                <button
                  onClick={() => openAuth('student')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition flex items-center justify-center gap-2 group"
                >
                  <GraduationCap className="w-5 h-5 text-blue-100 group-hover:scale-110 transition" />
                  <span>Portal Estudiante</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => openAuth('teacher')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition flex items-center justify-center gap-2"
                >
                  <School className="w-5 h-5 text-indigo-300" />
                  <span>Portal Docente / Admin</span>
                </button>

                <a
                  href="#inscripciones"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-slate-300 hover:text-white font-semibold text-sm transition text-center"
                >
                  Ver Proceso de Admisión
                </a>
              </div>

              {/* Demo 1-Click Fast Trial Helper */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                <span className="font-medium text-slate-300">Explorar de inmediato:</span>
                <button
                  onClick={() => loginAsDemoStudent()}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-yellow-300 font-semibold border border-yellow-300/30 transition flex items-center gap-1"
                >
                  <span>Probar como Estudiante Demo</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => loginAsDemoTeacher()}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-cyan-300 font-semibold border border-cyan-300/30 transition flex items-center gap-1"
                >
                  <span>Probar como Profesor Demo</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80"
                    alt="Estudiantes en el liceo"
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600 inline-block mb-2">
                      Campus Central Bicentenario
                    </span>
                    <h3 className="text-lg font-bold">Laboratorios STEM y Robótica Aplicada</h3>
                    <p className="text-xs text-slate-300 mt-1">Ambientes equipados para el aprendizaje activo y colaborativo</p>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white text-slate-800 p-3.5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Cuadro de Honor</div>
                    <div className="text-sm font-bold text-slate-900">Promedio 19.3 pts</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-5 -right-4 bg-white text-slate-800 p-3.5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Acreditación Oficial</div>
                    <div className="text-sm font-bold text-slate-900">Ministerio de Educación</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {institution.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. RECENT ANNOUNCEMENTS BANNER */}
      {announcements.length > 0 && (
        <section className="bg-amber-50 border-y border-amber-200 py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2.5 text-amber-900">
              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                Aviso
              </span>
              <span className="font-semibold">{announcements[0].title}:</span>
              <span className="text-slate-700 hidden sm:inline">{announcements[0].content}</span>
            </div>
            <button
              onClick={() => openAuth('student')}
              className="text-amber-800 hover:text-amber-950 font-bold text-xs underline underline-offset-4 shrink-0"
            >
              Consultar en mi portal &rarr;
            </button>
          </div>
        </section>
      )}

      {/* 3. IDENTIDAD INSTITUCIONAL: MISIÓN, VISIÓN Y VALORES */}
      <section id="identidad" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
              Nuestra Identidad Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 mt-3">
              Compromiso con el rigor intelectual y el desarrollo humano
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Más de tres décadas guiando generaciones con un modelo pedagógico integral que combina ciencia, valores éticos y vocación ciudadana.
            </p>
          </div>

          {/* Misión y Visión Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-100 shadow-xs relative overflow-hidden group hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mb-3">Misión</h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {institution.mission}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100 shadow-xs relative overflow-hidden group hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-500/20">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mb-3">Visión</h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {institution.vision}
              </p>
            </div>
          </div>

          {/* Valores Institucionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {institution.values.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1.5">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          {/* Breve Reseña Histórica */}
          <div className="mt-14 p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <School className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold font-heading mb-1 text-blue-200">
                36 Años de Historia y Tradición Liceísta
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fundado en {institution.foundedYear}, el Liceo Experimental Bicentenario ha formado a más de 35 promociones de bachilleres con altos índices de admisión en las principales universidades públicas y privadas, así como en proyectos de innovación científica y deportiva.
              </p>
            </div>
            <div className="shrink-0 text-center">
              <div className="text-2xl font-bold text-yellow-300">100%</div>
              <div className="text-[11px] text-slate-400">Docentes Titulados</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GALERÍA DE FOTOS Y RECUERDOS DEL LICEO */}
      <section id="galeria" className="py-20 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                Instalaciones y Vida Escolar
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 mt-2">
                Conoce nuestras áreas y recuerdos
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Espacios diseñados para potenciar la curiosidad, el deporte y el talento artístico
              </p>
            </div>

            {/* Gallery Category Filter */}
            <div className="flex flex-wrap gap-2 text-xs">
              {['Todas', 'Instalaciones', 'Academia', 'Deportes', 'Cultura', 'Tecnología'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition ${
                    galleryFilter === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur text-white text-[11px] font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Memories yearbook highlight */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Anuario Digital y Galería de Recuerdos
                </h4>
                <p className="text-xs text-slate-500">
                  Los estudiantes y profesores pueden ver fotos de torneos, graduaciones y festivales dentro de su panel.
                </p>
              </div>
            </div>
            <button
              onClick={() => openAuth('student')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shrink-0 flex items-center gap-2"
            >
              <span>Ver Anuario en el Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. PROCESO DE INSCRIPCIONES Y REQUISITOS */}
      <section id="inscripciones" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">
              Admisiones y Matrícula
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 mt-2">
              Proceso de Inscripción {institution.admissions.period}
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Conoce los pasos sencillos para formar parte de nuestra comunidad educativa
            </p>
          </div>

          {/* 4 Steps Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {institution.admissions.steps.map((st, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 relative group hover:bg-blue-50/50 hover:border-blue-200 transition"
              >
                <div className="text-3xl font-extrabold text-blue-600/30 group-hover:text-blue-600 transition mb-3 font-heading">
                  {st.step}
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">{st.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Requirements list */}
            <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Recaudos Requeridos para Nuevo Ingreso
                </h3>
              </div>
              <ul className="space-y-3.5">
                {institution.admissions.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
                <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  Horario de atención en Control de Estudios: <strong>Lunes a Viernes de 8:00 AM a 1:00 PM</strong>.
                </span>
              </div>
            </div>

            {/* Contact / Interest Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-1">
                Solicitud de Información de Cupo
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Envíanos tus datos y nos pondremos en contacto contigo
              </p>

              {interestSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-900">¡Solicitud Registrada!</div>
                  <p className="text-xs text-emerald-700">
                    Nuestro equipo de admisión te responderá a la brevedad posible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInterestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre del Representante
                    </label>
                    <input
                      type="text"
                      required
                      value={interestForm.parentName}
                      onChange={(e) => setInterestForm({ ...interestForm, parentName: e.target.value })}
                      placeholder="Ej. María Pérez"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={interestForm.phone}
                        onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                        placeholder="+58 412 1234567"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Año a Cursar</label>
                      <select
                        value={interestForm.studentGrade}
                        onChange={(e) => setInterestForm({ ...interestForm, studentGrade: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                      >
                        <option value="1er Año">1er Año</option>
                        <option value="2do Año">2do Año</option>
                        <option value="3er Año">3er Año</option>
                        <option value="4to Año">4to Año</option>
                        <option value="5to Año">5to Año</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={interestForm.email}
                      onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                      placeholder="ejemplo@correo.com"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mensaje u Observación</label>
                    <textarea
                      rows={3}
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Indique procedencia o consulta especial..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitud de Información</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. UBICACIÓN, CONTACTO Y MAPA */}
      <section id="contacto" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Info details */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-wider text-blue-400 uppercase bg-blue-900/60 px-3 py-1 rounded-full border border-blue-800">
                Ubicación & Contacto
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
                Visítanos en nuestra sede central
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Nuestras instalaciones cuentan con fácil acceso por transporte público y estacionamiento privado para representantes.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Dirección Sede</div>
                    <div className="text-sm font-medium text-slate-200">{institution.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Teléfonos de Atención</div>
                    <div className="text-sm font-medium text-slate-200">{institution.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Correos Electrónicos</div>
                    <div className="text-sm font-medium text-slate-200">
                      {institution.email} • {institution.admissionsEmail}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Jornada de Clases y Atención</div>
                    <div className="text-sm font-medium text-slate-200">{institution.schedule}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl relative">
                {/* Visual map preview */}
                <div className="h-80 w-full relative bg-slate-800">
                  <iframe
                    title="Ubicación del Liceo"
                    className="w-full h-full border-0 grayscale opacity-85 contrast-125"
                    src="https://maps.google.com/maps?q=Caracas,%20Venezuela&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                  ></iframe>
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs text-white">
                    <div className="font-bold flex items-center gap-1.5 text-blue-400">
                      <MapPin className="w-4 h-4" />
                      <span>Sede Bicentenario</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Av. Las Acacias, Caracas</div>
                  </div>
                </div>

                <div className="p-5 bg-slate-950/90 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Directora: <strong className="text-white">{institution.principal}</strong>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Abrir en Google Maps &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="font-heading font-bold text-white text-base">
                  {institution.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {institution.motto}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
              <button onClick={() => openAuth('student')} className="hover:text-white transition">
                Portal Alumnos
              </button>
              <button onClick={() => openAuth('teacher')} className="hover:text-white transition">
                Portal Docentes
              </button>
              <a href="#inscripciones" className="hover:text-white transition">
                Inscripciones
              </a>
              <a href="#galeria" className="hover:text-white transition">
                Galería y Recuerdos
              </a>
              <a href="#contacto" className="hover:text-white transition">
                Contacto
              </a>
            </div>

            <div className="text-center md:text-right text-[11px] text-slate-500">
              © {new Date().getFullYear()} {institution.name}. Todos los derechos reservados.
              <div className="text-[10px] text-slate-600 mt-0.5">
                Plataforma conectada a Supabase (ouysblhxqlidfxrjxhft)
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
