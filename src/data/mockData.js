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
  schedule: 'Lunes a Viernes: 7:00 AM - 1:40 PM / Actividades extracurriculares hasta 4:30 PM',
  principal: 'Larry González',
  foundedDate: '10 de noviembre de 1989',
  foundedYear: '1989',
  stats: [
    { label: 'Años de Trayectoria', value: '35+' },
    { label: 'Estudiantes Formados', value: '1,400' },
    { label: 'Docentes Especialistas', value: '48' },
    { label: 'Promociones Egresadas', value: '34' },
    { label: 'Ingreso Universitario', value: '99%' },
  ],
  mission: 'Formar integralmente a niños y jóvenes con excelencia académica, criterio reflexivo, sólidos valores éticos, civismo y competencias humanas, bajo el principio fundamental de enseñar a vivir con rectitud y compromiso.',
  vision: 'Ser la institución educativa modelo en el estado Anzoátegui y el oriente del país, reconocida por su exigencia pedagógica, vocación transformadora e innovación formativa para la vida y la educación universitaria.',
  values: [
    { title: 'Enseñar a Vivir', desc: 'Aprender no solo para la academia, sino para la convivencia, la ética y la plenitud personal.' },
    { title: 'Rigor y Excelencia', desc: 'Dedicación constante al perfeccionamiento del conocimiento científico y humanístico.' },
    { title: 'Sentido de Comunidad', desc: 'Alianza inquebrantable entre escuela, familia y entorno social barcelonés.' },
    { title: 'Liderazgo y Civismo', desc: 'Compromiso activo con el desarrollo productivo, cultural y social de Venezuela.' },
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
      title: 'Laboratorio de Ciencias Experimentales "Humboldt"',
      category: 'Laboratorios',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      description: 'Equipamiento de microscopía y reactivos para prácticas de química, biología y física.'
    },
    {
      id: 'g2',
      title: 'Aulas Climatizadas de Bachillerato',
      category: 'Aulas',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      description: 'Espacios cómodos, luminosos y con proyectores interactivos para clases dinámicas.'
    },
    {
      id: 'g3',
      title: 'Canchas Deportivas Múltiples',
      category: 'Deportes',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
      description: 'Instalaciones para baloncesto, voleibol, fútbol sala y preparación física escolar.'
    },
    {
      id: 'g4',
      title: 'Biblioteca y Centro de Consulta',
      category: 'Academia',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      description: 'Colección de textos pedagógicos y módulos digitales de investigación guiada.'
    },
    {
      id: 'g5',
      title: 'Sala de Informática y Computación',
      category: 'Tecnología',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      description: 'Estaciones de trabajo individuales con conectividad y herramientas educativas modernas.'
    },
    {
      id: 'g6',
      title: 'Auditorio Institucional',
      category: 'Cultura',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      description: 'Escenario de conferencias, asambleas de padres y actos solemnes de graduación.'
    }
  ]
};

export const initialClassrooms = [
  { id: 'clr-1', name: 'Aula 1 - Simón Bolívar', code: 'A-101', capacity: 35, floor: 'Planta Baja', description: 'Aula multimedia climatizada' },
  { id: 'clr-2', name: 'Aula 2 - Andrés Bello', code: 'A-102', capacity: 35, floor: 'Planta Baja', description: 'Aula estándar de 4to Año' },
  { id: 'clr-3', name: 'Aula 3 - Francisco de Miranda', code: 'A-103', capacity: 35, floor: 'Piso 1', description: 'Aula de 5to Año' },
  { id: 'clr-4', name: 'Aula 4 - Rafael Urdaneta', code: 'A-104', capacity: 32, floor: 'Piso 1', description: 'Aula de ciencias' },
  { id: 'clr-5', name: 'Laboratorio de Ciencias Experimentales', code: 'LAB-01', capacity: 30, floor: 'Planta Baja', description: 'Prácticas de Química y Física' },
  { id: 'clr-6', name: 'Sala de Informática y Robótica', code: 'LAB-INF', capacity: 28, floor: 'Piso 1', description: 'Computación y tecnología' },
  { id: 'clr-7', name: 'Cancha Deportiva Principal', code: 'DEP-01', capacity: 60, floor: 'Exterior', description: 'Educación Física y deportes' },
];

export const initialStudents = [
  {
    id: 'usr-student-1',
    name: 'Valeria Sofía Morales Mendoza',
    email: 'valeria.morales@integralvenezuela.edu.ve',
    studentIdNumber: 'V-31.452.981',
    gradeLevel: '4to Año - Sección A',
    representativeId: 'rep-1',
    representativeName: 'Carlos Morales',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    overallAverage: 19.3,
    attendanceRate: 98,
    conduct: 'Excelente'
  },
  {
    id: 'usr-student-2',
    name: 'Alejandro José Gómez Rangel',
    email: 'alejandro.gomez@integralvenezuela.edu.ve',
    studentIdNumber: 'V-31.884.103',
    gradeLevel: '4to Año - Sección A',
    representativeId: 'rep-2',
    representativeName: 'Mariana Rangel',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    overallAverage: 17.8,
    attendanceRate: 95,
    conduct: 'Muy Buena'
  },
  {
    id: 'usr-student-3',
    name: 'Sofía Isabella Herrera Peña',
    email: 'sofia.herrera@integralvenezuela.edu.ve',
    studentIdNumber: 'V-32.001.455',
    gradeLevel: '4to Año - Sección A',
    representativeId: 'rep-3',
    representativeName: 'Ricardo Herrera',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    overallAverage: 18.5,
    attendanceRate: 100,
    conduct: 'Excelente'
  },
  {
    id: 'usr-student-4',
    name: 'Andrés Daniel Castillo Rojas',
    email: 'andres.castillo@integralvenezuela.edu.ve',
    studentIdNumber: 'V-31.950.210',
    gradeLevel: '4to Año - Sección A',
    representativeId: 'rep-4',
    representativeName: 'Patricia Rojas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    overallAverage: 16.2,
    attendanceRate: 91,
    conduct: 'Buena'
  },
  {
    id: 'usr-student-5',
    name: 'Mariana Victoria Rivas Blanco',
    email: 'mariana.rivas@integralvenezuela.edu.ve',
    studentIdNumber: 'V-32.112.789',
    gradeLevel: '4to Año - Sección A',
    representativeId: 'rep-5',
    representativeName: 'Enrique Rivas',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    overallAverage: 19.0,
    attendanceRate: 97,
    conduct: 'Excelente'
  }
];

export const initialRepresentative = {
  id: 'rep-1',
  name: 'Carlos Alberto Morales Solórzano',
  email: 'carlos.morales@gmail.com',
  phone: '+58 (414) 819-4433',
  idNumber: 'V-14.892.411',
  role: 'representative',
  address: 'Urb. Las Garzas, Sector Neverí, Barcelona',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  wards: [
    {
      id: 'usr-student-1',
      name: 'Valeria Sofía Morales Mendoza',
      gradeLevel: '4to Año - Sección A',
      overallAverage: 19.3,
      relationship: 'Hija'
    }
  ]
};

export const initialTeacher = {
  id: 'usr-teacher-1',
  name: 'Prof. Carlos Eduardo Ramírez',
  email: 'carlos.ramirez@integralvenezuela.edu.ve',
  role: 'teacher',
  department: 'Ciencias Exactas e Ingenierías',
  subjects: ['Matemáticas', 'Física'],
  assignedGrade: '4to Año - Sección A',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  phone: '+58 (412) 887-2301'
};

export const initialTeachersList = [
  {
    id: 'usr-teacher-1',
    name: 'Prof. Carlos Eduardo Ramírez',
    email: 'carlos.ramirez@integralvenezuela.edu.ve',
    phone: '+58 (412) 887-2301',
    department: 'Ciencias Exactas',
    subjects: ['Matemáticas', 'Física'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-teacher-2',
    name: 'Prof. Elena Méndez',
    email: 'elena.mendez@integralvenezuela.edu.ve',
    phone: '+58 (414) 381-9920',
    department: 'Humanidades y Lengua',
    subjects: ['Castellano y Literatura'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-teacher-3',
    name: 'Prof. Roberto Vargas',
    email: 'roberto.vargas@integralvenezuela.edu.ve',
    phone: '+58 (424) 811-3004',
    department: 'Ciencias Naturales',
    subjects: ['Química', 'Biología'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-teacher-4',
    name: 'Prof. Sarah Jenkins',
    email: 'sarah.jenkins@integralvenezuela.edu.ve',
    phone: '+58 (416) 980-4411',
    department: 'Idiomas Modernos',
    subjects: ['Inglés'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  }
];

export const initialAdmin = {
  id: 'usr-admin-1',
  name: 'Larry González',
  title: 'Director General',
  email: 'quinterostudent@gmail.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  phone: '+58 (414) 820-1122'
};

export const initialSubjects = [
  { id: 'sub-mat', name: 'Matemáticas', teacher: 'Prof. Carlos Ramírez', teacherId: 'usr-teacher-1', color: '#1e3a8a', icon: 'Calculator' },
  { id: 'sub-fis', name: 'Física', teacher: 'Prof. Carlos Ramírez', teacherId: 'usr-teacher-1', color: '#0369a1', icon: 'Atom' },
  { id: 'sub-qui', name: 'Química', teacher: 'Prof. Roberto Vargas', teacherId: 'usr-teacher-3', color: '#047857', icon: 'FlaskConical' },
  { id: 'sub-bio', name: 'Biología', teacher: 'Prof. Roberto Vargas', teacherId: 'usr-teacher-3', color: '#15803d', icon: 'Dna' },
  { id: 'sub-cas', name: 'Castellano y Literatura', teacher: 'Prof. Elena Méndez', teacherId: 'usr-teacher-2', color: '#b45309', icon: 'BookOpen' },
  { id: 'sub-ing', name: 'Inglés', teacher: 'Prof. Sarah Jenkins', teacherId: 'usr-teacher-4', color: '#6d28d9', icon: 'Languages' },
  { id: 'sub-his', name: 'Historia de Venezuela', teacher: 'Prof. Lisandro Alvarado', teacherId: 'usr-teacher-2', color: '#be123c', icon: 'Landmark' },
  { id: 'sub-edf', name: 'Educación Física', teacher: 'Prof. Javier Briceño', teacherId: 'usr-teacher-1', color: '#c2410c', icon: 'Activity' },
];

export const initialGrades = [
  {
    id: 'gr-1',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    evaluationTitle: 'Taller de Funciones y Dominio',
    score: 19.5,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    date: '2024-10-14',
    comments: 'Excelente desarrollo analítico y precisión.'
  },
  {
    id: 'gr-2',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    evaluationTitle: 'Examen Parcial I: Trigonometría',
    score: 20.0,
    maxScore: 20,
    percentage: 25,
    term: '1er Lapso',
    date: '2024-11-04',
    comments: 'Nota máxima. Demostración impecable de identidades.'
  },
  {
    id: 'gr-3',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subjectId: 'sub-fis',
    subjectName: 'Física',
    evaluationTitle: 'Práctica de Laboratorio: Caída Libre',
    score: 19.0,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    date: '2024-10-21',
    comments: 'Excelente informe técnico y manejo de márgenes de error.'
  },
  {
    id: 'gr-4',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subjectId: 'sub-qui',
    subjectName: 'Química',
    evaluationTitle: 'Prueba Escrita: Nomenclatura Inorgánica',
    score: 18.5,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    date: '2024-10-28',
    comments: 'Dominio claro de las reacciones de óxido-reducción.'
  },
  {
    id: 'gr-5',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subjectId: 'sub-cas',
    subjectName: 'Castellano y Literatura',
    evaluationTitle: 'Ensayo Crítico sobre Novela Venezolana',
    score: 20.0,
    maxScore: 20,
    percentage: 25,
    term: '1er Lapso',
    date: '2024-11-08',
    comments: 'Riqueza en el vocabulario, cohesión y ortografía impecable.'
  },
  {
    id: 'gr-6',
    studentId: 'usr-student-2',
    studentName: 'Alejandro José Gómez Rangel',
    subjectId: 'sub-mat',
    evaluationTitle: 'Taller de Funciones y Dominio',
    score: 17.5,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    date: '2024-10-14',
    comments: 'Buen planteamiento, cuidar detalles en signos.'
  }
];

export const initialEvaluationPlans = [
  {
    id: 'plan-1',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    title: 'Taller Práctico: Funciones Reales y Gráficas',
    description: 'Análisis de dominio, rango y asíntotas.',
    dueDate: '2024-10-14',
    percentage: 20,
    term: '1er Lapso',
    type: 'Taller Práctico Grupal',
    status: 'Completado'
  },
  {
    id: 'plan-2',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    title: 'Examen Parcial I: Trigonometría Analítica',
    description: 'Identidades trigonométricas y teoremas fundamentales.',
    dueDate: '2024-11-04',
    percentage: 25,
    term: '1er Lapso',
    type: 'Examen Escrito Individual',
    status: 'Completado'
  },
  {
    id: 'plan-3',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    title: 'Resolución de Problemas: Geometría del Espacio',
    description: 'Cálculo de volúmenes y teoremas euclidianos.',
    dueDate: '2024-11-25',
    percentage: 25,
    term: '1er Lapso',
    type: 'Evaluación Sumativa',
    status: 'En Progreso'
  },
  {
    id: 'plan-4',
    subjectId: 'sub-fis',
    subjectName: 'Física',
    title: 'Práctica de Laboratorio: Caída Libre y MRUV',
    description: 'Medición de la gravedad y dinámica de movimiento.',
    dueDate: '2024-10-21',
    percentage: 25,
    term: '1er Lapso',
    type: 'Laboratorio',
    status: 'Completado'
  }
];

export const initialSchedules = [
  { id: 'sch-1', day: 'Lunes', time: '07:00 - 08:30 AM', subject: 'Matemáticas', classroom: 'Aula 2 - Andrés Bello (A-102)', classroomCode: 'A-102', teacher: 'Prof. Carlos Ramírez', teacherId: 'usr-teacher-1' },
  { id: 'sch-2', day: 'Lunes', time: '08:45 - 10:15 AM', subject: 'Física (Teoría)', classroom: 'Aula 2 - Andrés Bello (A-102)', classroomCode: 'A-102', teacher: 'Prof. Carlos Ramírez', teacherId: 'usr-teacher-1' },
  { id: 'sch-3', day: 'Lunes', time: '10:30 - 12:00 PM', subject: 'Castellano y Literatura', classroom: 'Aula 2 - Andrés Bello (A-102)', classroomCode: 'A-102', teacher: 'Prof. Elena Méndez', teacherId: 'usr-teacher-2' },
  
  { id: 'sch-4', day: 'Martes', time: '07:00 - 08:30 AM', subject: 'Química', classroom: 'Laboratorio de Ciencias (LAB-01)', classroomCode: 'LAB-01', teacher: 'Prof. Roberto Vargas', teacherId: 'usr-teacher-3' },
  { id: 'sch-5', day: 'Martes', time: '08:45 - 10:15 AM', subject: 'Biología', classroom: 'Laboratorio de Ciencias (LAB-01)', classroomCode: 'LAB-01', teacher: 'Prof. Roberto Vargas', teacherId: 'usr-teacher-3' },
  { id: 'sch-6', day: 'Martes', time: '10:30 - 12:00 PM', subject: 'Inglés', classroom: 'Aula 1 - Simón Bolívar (A-101)', classroomCode: 'A-101', teacher: 'Prof. Sarah Jenkins', teacherId: 'usr-teacher-4' },

  { id: 'sch-7', day: 'Miércoles', time: '07:00 - 08:30 AM', subject: 'Física (Laboratorio)', classroom: 'Laboratorio de Ciencias (LAB-01)', classroomCode: 'LAB-01', teacher: 'Prof. Carlos Ramírez', teacherId: 'usr-teacher-1' },
  { id: 'sch-8', day: 'Miércoles', time: '08:45 - 10:15 AM', subject: 'Matemáticas', classroom: 'Aula 2 - Andrés Bello (A-102)', classroomCode: 'A-102', teacher: 'Prof. Carlos Ramírez', teacherId: 'usr-teacher-1' },
  { id: 'sch-9', day: 'Miércoles', time: '10:30 - 12:00 PM', subject: 'Historia de Venezuela', classroom: 'Aula 2 - Andrés Bello (A-102)', classroomCode: 'A-102', teacher: 'Prof. Elena Méndez', teacherId: 'usr-teacher-2' },

  { id: 'sch-10', day: 'Jueves', time: '07:00 - 08:30 AM', subject: 'Educación Física', classroom: 'Cancha Deportiva Principal (DEP-01)', classroomCode: 'DEP-01', teacher: 'Prof. Javier Briceño', teacherId: 'usr-teacher-1' },
  { id: 'sch-11', day: 'Jueves', time: '08:45 - 10:15 AM', subject: 'Castellano y Literatura', classroom: 'Aula 2 - Andrés Bello (A-102)', classroomCode: 'A-102', teacher: 'Prof. Elena Méndez', teacherId: 'usr-teacher-2' },
  { id: 'sch-12', day: 'Jueves', time: '10:30 - 12:00 PM', subject: 'Inglés', classroom: 'Aula 1 - Simón Bolívar (A-101)', classroomCode: 'A-101', teacher: 'Prof. Sarah Jenkins', teacherId: 'usr-teacher-4' },

  { id: 'sch-13', day: 'Viernes', time: '07:00 - 08:30 AM', subject: 'Química (Práctica)', classroom: 'Laboratorio de Ciencias (LAB-01)', classroomCode: 'LAB-01', teacher: 'Prof. Roberto Vargas', teacherId: 'usr-teacher-3' },
  { id: 'sch-14', day: 'Viernes', time: '08:45 - 10:15 AM', subject: 'Orientación y Convivencia', classroom: 'Aula 2 - Andrés Bello (A-102)', classroomCode: 'A-102', teacher: 'Prof. Carlos Ramírez', teacherId: 'usr-teacher-1' },
];

export const initialAttendances = [
  {
    id: 'att-1',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subject: 'Química',
    date: '2024-10-18',
    status: 'justified',
    statusLabel: 'Falta Justificada',
    notes: 'Presentó justificativo médico con sello de consulta odontológica.',
    notified: true,
    sentTo: 'carlos.morales@gmail.com'
  },
  {
    id: 'att-2',
    studentId: 'usr-student-2',
    studentName: 'Alejandro José Gómez Rangel',
    subject: 'Física',
    date: '2024-10-23',
    status: 'late',
    statusLabel: 'Llegada Tarde (15 min)',
    notes: 'Retraso de transporte matutino en el puente Neverí.',
    notified: true,
    sentTo: 'mariana.rangel@gmail.com'
  },
  {
    id: 'att-3',
    studentId: 'usr-student-4',
    studentName: 'Andrés Daniel Castillo Rojas',
    subject: 'Matemáticas',
    date: '2024-11-06',
    status: 'absent',
    statusLabel: 'Falta Injustificada',
    notes: 'Inasistencia a la primera hora. Notificación transmitida.',
    notified: true,
    sentTo: 'patricia.rojas@gmail.com'
  }
];

export const initialCertificates = [
  {
    id: 'cert-1',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    title: 'Diploma de Honor al Máximo Rendimiento Académico',
    type: 'honor',
    typeLabel: 'Excelencia Académica',
    gradeLevel: '4to Año de Bachillerato',
    academicYear: '2024 - 2025',
    average: '19.3 pts',
    issueDate: '28 de Noviembre de 2024',
    code: 'CERT-IV-2024-0089',
    description: 'Otorgado en reconocimiento por alcanzar el Primer Lugar del Cuadro de Honor con un promedio sobresaliente, demostrando disciplina, compromiso y los valores del Colegio Integral Venezuela.',
    signer: 'Larry González, Director General'
  },
  {
    id: 'cert-2',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    title: 'Mención Especial en la Olimpiada Juvenil de Ciencias',
    type: 'merit',
    typeLabel: 'Mérito Científico',
    gradeLevel: '4to Año de Bachillerato',
    academicYear: '2024 - 2025',
    average: 'Fase Regional Anzoátegui',
    issueDate: '15 de Octubre de 2024',
    code: 'CERT-IV-2024-014',
    description: 'Por su destacada participación y clasificación en la fase regional de Anzoátegui, representando con orgullo al Colegio Integral Venezuela.',
    signer: 'Larry González, Director General'
  }
];

// Memories now support student contribution (by year/grade)
export const initialMemories = [
  {
    id: 'mem-1',
    title: 'Feria de Ciencias y Tecnología "Neverí 2024"',
    category: 'Proyectos',
    gradeYear: '4to Año',
    authorName: 'Valeria Morales (Estudiante)',
    date: '18 de Mayo de 2024',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: 'Nuestro equipo de 4to Año presentó el prototipo de purificación biológica de agua. ¡Ganamos el 1er lugar del liceo!'
  },
  {
    id: 'mem-2',
    title: 'Campeones del Torneo Intercolegial de Barcelona',
    category: 'Deportes',
    gradeYear: '4to Año',
    authorName: 'Alejandro Gómez (Estudiante)',
    date: '4 de Junio de 2024',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    description: 'Victoria en la final de baloncesto en el gimnasio del Neverí. Orgullo Integral Venezuela.'
  },
  {
    id: 'mem-3',
    title: 'XXXIV Acto de Graduación de Bachilleres',
    category: 'Graduación',
    gradeYear: '5to Año',
    authorName: 'Dirección Académica',
    date: '22 de Julio de 2024',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    description: 'Entrega de títulos a la promoción saliente con un 100% de ingreso universitario.'
  },
  {
    id: 'mem-4',
    title: 'Jornada Ecológica en Colinas del Neverí',
    category: 'Comunidad',
    gradeYear: '3er Año',
    authorName: 'Sofía Herrera (Estudiante)',
    date: '20 de Marzo de 2024',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    description: 'Siembra comunitaria y preservación de especies autóctonas en los alrededores de nuestra sede escolar.'
  }
];

export const initialPayments = [
  {
    id: 'pay-1',
    representativeId: 'rep-1',
    representativeName: 'Carlos Morales',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    studentGrade: '4to Año - Sección A',
    amount: 60.00,
    currency: 'USD',
    paymentMethod: 'Pago Móvil',
    referenceNumber: '0102-849201',
    paymentConcept: 'Mensualidad Octubre 2024',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    paymentDate: '2024-10-05',
    status: 'approved',
    adminNotes: 'Verificado exitosamente en cuenta Banesco.',
    createdAt: '2024-10-05T10:30:00Z'
  },
  {
    id: 'pay-2',
    representativeId: 'rep-1',
    representativeName: 'Carlos Morales',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    studentGrade: '4to Año - Sección A',
    amount: 60.00,
    currency: 'USD',
    paymentMethod: 'Transferencia Bancaria',
    referenceNumber: 'REF-9923841',
    paymentConcept: 'Mensualidad Noviembre 2024',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    paymentDate: '2024-11-02',
    status: 'pending',
    adminNotes: 'En proceso de conciliación bancaria.',
    createdAt: '2024-11-02T14:15:00Z'
  },
  {
    id: 'pay-3',
    representativeId: 'rep-2',
    representativeName: 'Mariana Rangel',
    studentId: 'usr-student-2',
    studentName: 'Alejandro José Gómez Rangel',
    studentGrade: '4to Año - Sección A',
    amount: 60.00,
    currency: 'USD',
    paymentMethod: 'Zelle',
    referenceNumber: 'ZELLE-881203',
    paymentConcept: 'Mensualidad Octubre 2024',
    receiptUrl: '',
    paymentDate: '2024-10-04',
    status: 'approved',
    adminNotes: 'Aprobado por Dirección.',
    createdAt: '2024-10-04T09:00:00Z'
  }
];

export const initialAnnouncements = [
  {
    id: 'ann-1',
    title: 'Aniversario Institucional: 35 Años Enseñando a Vivir',
    date: '10 de Noviembre de 2024',
    priority: 'urgent',
    priorityLabel: 'Institucional',
    roleTarget: 'Todos',
    content: 'Con gran orgullo celebramos el 35º aniversario de nuestra fundación en Barcelona. Convocamos a estudiantes, representantes y egresados al acto solemne y jornada cultural conmemorativa.'
  },
  {
    id: 'ann-2',
    title: 'Publicación de Boletines Parciales del 1er Lapso',
    date: 'Noviembre 2024',
    priority: 'normal',
    priorityLabel: 'Académico',
    roleTarget: 'Representantes',
    content: 'Estimados representantes: ya se encuentran disponibles en el portal las calificaciones y observaciones pedagógicas correspondientes al 1er Lapso.'
  },
  {
    id: 'ann-3',
    title: 'Planificación de Evaluaciones y Horarios Docentes',
    date: 'Semanal',
    priority: 'normal',
    priorityLabel: 'Docentes',
    roleTarget: 'Profesores',
    content: 'Recordatorio al cuerpo profesoral de consignar los cortes de notas y verificar la asignación de aulas en su panel docente.'
  }
];
