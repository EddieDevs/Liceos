export const initialInstitution = {
  name: 'U.E. Colegio Integral Venezuela',
  shortName: 'Integral Venezuela',
  subtitle: 'Institución Educativa de Educación Media General',
  motto: 'Enseñando a vivir',
  currentSchoolYear: '2027-2028',
  phone: '0416-6802168 / 0412-8637615',
  phone1: '04166802168',
  phone2: '04128637615',
  email: 'integralvenezuela@gmail.com',
  admissionsEmail: 'integralvenezuela@gmail.com',
  adminEmail: 'quinterostudent@gmail.com',
  deaCode: 'PD11370304',
  instagram: 'https://www.instagram.com/u.eintegralvenezuela/',
  whatsapp: 'https://wa.me/584166802168',
  bcvRate: 48.50,
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
    { value: 'PD11370304', label: 'Código DEA MPPE' }
  ],
  admissions: {
    period: 'Año Escolar 2027 - 2028',
    status: 'Inscripciones y Prosecución Abiertas',
    steps: [
      { step: '01', title: 'Registro y Pre-inscripción', desc: 'Completar el formulario digital o presencial con los datos del alumno y representante legal.' },
      { step: '02', title: 'Consignación de Recaudos', desc: 'Entrega de notas certificadas, partida de nacimiento, cédulas y constancias en Control de Estudios.' },
      { step: '03', title: 'Entrevista Pedagógica', desc: 'Jornada de orientación vocacional y conocimiento familiar con el Departamento de Orientación.' },
      { step: '04', title: 'Formalización y Matrícula', desc: 'Asignación de sección oficial, entrega de credenciales institucionales y cronograma.' },
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
  password: 'admin',
  role: 'admin',
  avatar: '',
  phone: '+58 (414) 820-1122'
};

// Initial default sections in Venezuelan high school system (1er a 5to año, A a C)
export const initialSections = [
  { id: 'sec-1a', year: '1er Año', section: 'A', name: '1er Año - Sección A', capacity: 35, classroom: 'Aula 01', guideTeacher: 'Por asignar' },
  { id: 'sec-1b', year: '1er Año', section: 'B', name: '1er Año - Sección B', capacity: 35, classroom: 'Aula 02', guideTeacher: 'Por asignar' },
  { id: 'sec-1c', year: '1er Año', section: 'C', name: '1er Año - Sección C', capacity: 35, classroom: 'Aula 03', guideTeacher: 'Por asignar' },
  { id: 'sec-2a', year: '2do Año', section: 'A', name: '2do Año - Sección A', capacity: 35, classroom: 'Aula 04', guideTeacher: 'Por asignar' },
  { id: 'sec-2b', year: '2do Año', section: 'B', name: '2do Año - Sección B', capacity: 35, classroom: 'Aula 05', guideTeacher: 'Por asignar' },
  { id: 'sec-2c', year: '2do Año', section: 'C', name: '2do Año - Sección C', capacity: 35, classroom: 'Aula 06', guideTeacher: 'Por asignar' },
  { id: 'sec-3a', year: '3er Año', section: 'A', name: '3er Año - Sección A', capacity: 35, classroom: 'Aula 07', guideTeacher: 'Por asignar' },
  { id: 'sec-3b', year: '3er Año', section: 'B', name: '3er Año - Sección B', capacity: 35, classroom: 'Aula 08', guideTeacher: 'Por asignar' },
  { id: 'sec-3c', year: '3er Año', section: 'C', name: '3er Año - Sección C', capacity: 35, classroom: 'Aula 09', guideTeacher: 'Por asignar' },
  { id: 'sec-4a', year: '4to Año', section: 'A', name: '4to Año - Sección A', capacity: 35, classroom: 'Aula 10', guideTeacher: 'Por asignar' },
  { id: 'sec-4b', year: '4to Año', section: 'B', name: '4to Año - Sección B', capacity: 35, classroom: 'Aula 11', guideTeacher: 'Por asignar' },
  { id: 'sec-4c', year: '4to Año', section: 'C', name: '4to Año - Sección C', capacity: 35, classroom: 'Aula 12', guideTeacher: 'Por asignar' },
  { id: 'sec-5a', year: '5to Año', section: 'A', name: '5to Año - Sección A', capacity: 35, classroom: 'Aula 13', guideTeacher: 'Por asignar' },
  { id: 'sec-5b', year: '5to Año', section: 'B', name: '5to Año - Sección B', capacity: 35, classroom: 'Aula 14', guideTeacher: 'Por asignar' },
  { id: 'sec-5c', year: '5to Año', section: 'C', name: '5to Año - Sección C', capacity: 35, classroom: 'Aula 15', guideTeacher: 'Por asignar' },
];

// Initial classrooms
export const initialClassrooms = [
  { id: 'clr-1', name: 'Aula 01', building: 'Edificio Central', capacity: 35, status: 'disponible' },
  { id: 'clr-2', name: 'Aula 02', building: 'Edificio Central', capacity: 35, status: 'disponible' },
  { id: 'clr-3', name: 'Aula 03', building: 'Edificio Central', capacity: 35, status: 'disponible' },
  { id: 'clr-4', name: 'Aula 04', building: 'Edificio Central', capacity: 35, status: 'disponible' },
  { id: 'clr-5', name: 'Aula 05', building: 'Edificio Central', capacity: 35, status: 'disponible' },
  { id: 'clr-6', name: 'Laboratorio de Ciencias', building: 'Módulo de Ciencias', capacity: 30, status: 'disponible' },
  { id: 'clr-7', name: 'Cancha Múltiple', building: 'Área Deportiva', capacity: 80, status: 'disponible' },
];

// All other dynamic tables start empty for real operations
export const initialSubjects = [];
export const initialStudents = [];
export const initialTeachersList = [];
export const initialGrades = [];
export const initialEvaluationPlans = [];
export const initialSchedules = [];
export const initialAttendances = [];
export const initialCertificates = [];
export const initialMemories = [];
export const initialPayments = [];
export const initialAnnouncements = [];
