export const initialInstitution = {
  name: 'U.E. Colegio Integral Venezuela',
  shortName: 'Integral Venezuela',
  subtitle: 'Institución Educativa de Educación Media General',
  motto: 'Enseñando a vivir',
  phone: '+58 (281) 286-4192 / +58 (414) 820-1122',
  email: 'contacto@integralvenezuela.edu.ve',
  admissionsEmail: 'admisiones@integralvenezuela.edu.ve',
  adminEmail: 'quinterostudent@gmail.com',
  address: 'Calle 11, sector Colinas del Neverí, Barcelona, Anzoátegui',
  city: 'Barcelona, Anzoátegui',
  schedule: 'Lunes a Viernes: 7:00 AM - 1:40 PM / Extracurricular hasta 4:30 PM',
  principal: 'Larry González',
  foundedDate: '10 de noviembre de 1989',
  foundedYear: '1989',
  mission: 'Formar ciudadanos integrales con alto pensamiento crítico, sólidos principios morales, capacidad innovadora y habilidades para la vida y la educación superior, bajo el lema y principio de enseñar a vivir.',
  vision: 'Ser la institución educativa modelo en el estado Anzoátegui y el oriente del país, reconocida por su exigencia pedagógica, calidad humana y formación en valores para la vida.',
  values: [
    { title: 'Enseñar a Vivir', desc: 'Aprender no solo para la academia, sino para la convivencia, la ética y la plenitud personal.' },
    { title: 'Rigor y Excelencia', desc: 'Dedicación constante al perfeccionamiento del conocimiento científico y humanístico.' },
    { title: 'Sentido de Comunidad', desc: 'Alianza inquebrantable entre escuela, familia y entorno social barcelonés.' },
    { title: 'Liderazgo y Civismo', desc: 'Compromiso activo con el desarrollo productivo, cultural y social de Venezuela.' },
  ],
  stats: [
    { value: '35+', label: 'Años de Trayectoria' },
    { value: '100%', label: 'Egresados Universitarios' },
    { value: '1989', label: 'Año de Fundación' },
    { value: '5', label: 'Años de Bachillerato' },
    { value: 'DEA', label: 'Registro MPPE' }
  ],
  admissions: {
    period: 'Año Escolar 2024 - 2025',
    status: 'Inscripciones y Prosecución Abiertas',
    steps: [
      { step: '01', title: 'Registro y Pre-inscripción', desc: 'Completar el formulario digital o presencial con los datos del alumno y representante legal.' },
      { step: '02', title: 'Consignación de Recaudos', desc: 'Entrega de notas certificadas, partida de nacimiento, cédulas y constancias en Control de Estudios.' },
      { step: '03', title: 'Entrevista Pedagógica', desc: 'Jornada de orientación vocacional y conocimiento familiar con el Departamento de Orientación.' },
      { step: '04', title: 'Formalización y Matrícula', desc: 'Asignación de sección, entrega de carnet y cronograma del año escolar.' },
    ],
    requirements: [
      'Original y copia de la Partida de Nacimiento del estudiante.',
      'Copia ampliada de la Cédula de Identidad del alumno y de ambos representantes.',
      'Calificaciones Certificadas del grado anterior expedidas por el Ministerio de Educación.',
      'Carta de buena conducta de la institución de procedencia.',
      'Constancia de vacunas y certificado de salud integral emitido por médico certificado.',
      'Cuatro (4) fotos tipo carnet recientes con fondo blanco.',
    ]
  },
  gallery: [
    {
      id: 'g1',
      title: 'Laboratorio de Ciencias Experimentales',
      category: 'Laboratorios',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      description: 'Equipamiento de microscopía y reactivos para química, física y biología.'
    },
    {
      id: 'g2',
      title: 'Aulas Climatizadas de Bachillerato',
      category: 'Aulas',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      description: 'Espacios luminosos y confortables para clases dinámicas.'
    },
    {
      id: 'g3',
      title: 'Canchas Deportivas',
      category: 'Deportes',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
      description: 'Instalaciones para baloncesto, voleibol y preparación física.'
    },
    {
      id: 'g4',
      title: 'Biblioteca y Sala de Lectura',
      category: 'Academia',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      description: 'Centro bibliográfico y de consulta para los alumnos.'
    }
  ]
};

// Admin profile is the only persistent real account requested by user
export const initialAdmin = {
  id: 'usr-admin-larry',
  name: 'Larry González',
  title: 'Director General',
  email: 'quinterostudent@gmail.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  phone: '+58 (414) 820-1122'
};

// All other tables start empty as requested for real database operations
export const initialSubjects = [];
export const initialStudents = [];
export const initialTeachersList = [];
export const initialClassrooms = [];
export const initialGrades = [];
export const initialEvaluationPlans = [];
export const initialSchedules = [];
export const initialAttendances = [];
export const initialCertificates = [];
export const initialMemories = [];
export const initialPayments = [];
export const initialAnnouncements = [];
