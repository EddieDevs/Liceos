export const initialInstitution = {
  name: 'Liceo Bicentenario',
  subtitle: 'Institución Educativa de Educación Media General',
  motto: 'Educación con excelencia, ciencia y valores para transformar el porvenir',
  phone: '+58 (212) 555-0199 / +58 (414) 302-8871',
  email: 'contacto@liceobicentenario.edu.ve',
  admissionsEmail: 'inscripciones@liceobicentenario.edu.ve',
  address: 'Av. Las Acacias con Calle Los Ilustres, Edif. Sede Bicentenario, Caracas',
  schedule: 'Lunes a Viernes: 7:00 AM - 4:30 PM',
  principal: 'Dra. Carmen Teresa Mendoza',
  academicDirector: 'Prof. Marcos Aurelio Peña',
  foundedYear: '1988',
  stats: [
    { label: 'Años de Trayectoria', value: '36+' },
    { label: 'Estudiantes Activos', value: '1,250' },
    { label: 'Docentes Especialistas', value: '64' },
    { label: 'Promociones Egresadas', value: '35' },
    { label: 'Tasa de Ingreso Universitario', value: '98%' },
  ],
  mission: 'Formar de manera integral a jóvenes bachilleres con alto rigor académico, pensamiento crítico, sólidas bases éticas, sensibilidad social y competencias tecnológicas, preparándolos como agentes de cambio constructivo para el desarrollo del país y el mundo.',
  vision: 'Consolidarnos como la institución de educación media general referente nacional e internacional por su vanguardia pedagógica, cultura de innovación científica, excelencia humanística y formación de líderes comprometidos con el progreso sostenible.',
  values: [
    { title: 'Excelencia y Rigor', desc: 'Búsqueda constante del conocimiento y la superación personal y académica.' },
    { title: 'Ética y Responsabilidad', desc: 'Actuación honesta, puntual y coherente con el bienestar de la comunidad.' },
    { title: 'Innovación Científica', desc: 'Fomento a la curiosidad, experimentación, robótica e investigación aplicada.' },
    { title: 'Identidad y Cultura', desc: 'Aprecio por nuestras raíces históricas, el arte y el civismo ciudadano.' },
  ],
  admissions: {
    period: 'Año Escolar 2024 - 2025',
    status: 'Inscripciones y Prosecución Abiertas',
    steps: [
      { step: '01', title: 'Registro y Pre-inscripción', desc: 'Completar el formulario digital o en secretaría con datos del estudiante y representante.' },
      { step: '02', title: 'Consignación de Recaudos', desc: 'Presentar carpetas con notas certificadas, partida de nacimiento y cédulas en control de estudios.' },
      { step: '03', title: 'Entrevista Pedagógica', desc: 'Jornada de orientación vocacional y conocimiento familiar con el departamento de psicología.' },
      { step: '04', title: 'Formalización de Matrícula', desc: 'Asignación de sección, carnetización estudiantil y entrega del cronograma escolar.' },
    ],
    requirements: [
      'Original y copia de la Partida de Nacimiento del estudiante.',
      'Copia ampliada de la Cédula de Identidad del estudiante y de ambos representantes.',
      'Calificaciones Certificadas del año anterior expedidas por el Ministerio de Educación.',
      'Carta de buena conducta de la institución de procedencia.',
      'Constancia de vacunas y certificado de salud integral vigente.',
      'Cuatro (4) fotos tipo carnet recientes con fondo blanco.',
    ]
  },
  gallery: [
    {
      id: 'g1',
      title: 'Laboratorio de Ciencias Experimentales',
      category: 'Instalaciones',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      description: 'Equipado con microscopios ópticos, material reactivo y sensores para química, física y biología.'
    },
    {
      id: 'g2',
      title: 'Biblioteca y Sala de Investigación Digital',
      category: 'Academia',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      description: 'Más de 10.000 títulos bibliográficos y terminales de consulta con internet de alta velocidad.'
    },
    {
      id: 'g3',
      title: 'Complejo Deportivo y Gimnasio Techado',
      category: 'Deportes',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
      description: 'Canchas multifuncionales para baloncesto, voleibol, futsal y pista de atletismo.'
    },
    {
      id: 'g4',
      title: 'Aulas Climatizadas e Interactivas',
      category: 'Aulas',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      description: 'Espacios modernos de aprendizaje equipados con pantallas inteligentes y acústica adecuada.'
    },
    {
      id: 'g5',
      title: 'Auditorio Mayor "Andrés Bello"',
      category: 'Cultura',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      description: 'Capacidad para 500 personas, sede de conferencias, actos solemnes y festivales artísticos.'
    },
    {
      id: 'g6',
      title: 'Centro de Robótica y Computación',
      category: 'Tecnología',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      description: 'Plataformas Arduino, kits de electrónica y estaciones de trabajo para programación.'
    }
  ]
};

export const initialStudents = [
  {
    id: 'usr-student-1',
    name: 'Valeria Sofía Morales Mendoza',
    email: 'valeria.morales@liceobicentenario.edu.ve',
    studentIdNumber: 'V-31.452.981',
    gradeLevel: '4to Año - Sección A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    overallAverage: 19.3,
    attendanceRate: 98,
    conduct: 'Excelente'
  },
  {
    id: 'usr-student-2',
    name: 'Alejandro José Gómez Rangel',
    email: 'alejandro.gomez@liceobicentenario.edu.ve',
    studentIdNumber: 'V-31.884.103',
    gradeLevel: '4to Año - Sección A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    overallAverage: 17.8,
    attendanceRate: 95,
    conduct: 'Muy Buena'
  },
  {
    id: 'usr-student-3',
    name: 'Sofía Isabella Herrera Peña',
    email: 'sofia.herrera@liceobicentenario.edu.ve',
    studentIdNumber: 'V-32.001.455',
    gradeLevel: '4to Año - Sección A',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    overallAverage: 18.5,
    attendanceRate: 100,
    conduct: 'Excelente'
  },
  {
    id: 'usr-student-4',
    name: 'Andrés Daniel Castillo Rojas',
    email: 'andres.castillo@liceobicentenario.edu.ve',
    studentIdNumber: 'V-31.950.210',
    gradeLevel: '4to Año - Sección A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    overallAverage: 16.2,
    attendanceRate: 91,
    conduct: 'Buena'
  },
  {
    id: 'usr-student-5',
    name: 'Mariana Victoria Rivas Blanco',
    email: 'mariana.rivas@liceobicentenario.edu.ve',
    studentIdNumber: 'V-32.112.789',
    gradeLevel: '4to Año - Sección A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    overallAverage: 19.0,
    attendanceRate: 97,
    conduct: 'Excelente'
  }
];

export const initialTeacher = {
  id: 'usr-teacher-1',
  name: 'Prof. Carlos Eduardo Ramírez',
  email: 'carlos.ramirez@liceobicentenario.edu.ve',
  role: 'teacher',
  department: 'Ciencias Exactas e Ingenierías',
  subjects: ['Matemáticas', 'Física'],
  assignedGrade: '4to Año - Sección A y B',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  phone: '+58 (412) 887-2301'
};

export const initialSubjects = [
  { id: 'sub-mat', name: 'Matemáticas', teacher: 'Prof. Carlos Ramírez', color: '#2563eb', icon: 'Calculator' },
  { id: 'sub-fis', name: 'Física', teacher: 'Prof. Carlos Ramírez', color: '#0284c7', icon: 'Atom' },
  { id: 'sub-qui', name: 'Química', teacher: 'Prof. Roberto Vargas', color: '#059669', icon: 'FlaskConical' },
  { id: 'sub-bio', name: 'Biología', teacher: 'Prof. Roberto Vargas', color: '#16a34a', icon: 'Dna' },
  { id: 'sub-cas', name: 'Castellano y Literatura', teacher: 'Prof. Elena Méndez', color: '#d97706', icon: 'BookOpen' },
  { id: 'sub-ing', name: 'Inglés', teacher: 'Prof. Sarah Jenkins', color: '#7c3aed', icon: 'Languages' },
  { id: 'sub-his', name: 'Historia de Venezuela', teacher: 'Prof. Lisandro Alvarado', color: '#e11d48', icon: 'Landmark' },
  { id: 'sub-edf', name: 'Educación Física', teacher: 'Prof. Javier Briceño', color: '#ea580c', icon: 'Activity' },
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
    comments: 'Excelente planteamiento algebraico y orden impecable.'
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
    comments: 'Nota máxima. Demostración perfecta de identidades.'
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
    comments: 'Gran precisión en el cálculo de márgenes de error.'
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
    comments: 'Muy buen dominio de los óxidos y sales.'
  },
  {
    id: 'gr-5',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subjectId: 'sub-cas',
    subjectName: 'Castellano y Literatura',
    evaluationTitle: 'Ensayo Crítico sobre Novela Romántica',
    score: 20.0,
    maxScore: 20,
    percentage: 25,
    term: '1er Lapso',
    date: '2024-11-08',
    comments: 'Riqueza argumentativa y ortografía perfecta.'
  },
  {
    id: 'gr-6',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    subjectId: 'sub-ing',
    subjectName: 'Inglés',
    evaluationTitle: 'Oral Presentation: Global Challenges',
    score: 19.0,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    date: '2024-11-12',
    comments: 'Fluid speech and natural pronunciation.'
  },
  // Grades for student 2 (Alejandro)
  {
    id: 'gr-7',
    studentId: 'usr-student-2',
    studentName: 'Alejandro José Gómez Rangel',
    subjectId: 'sub-mat',
    evaluationTitle: 'Taller de Funciones y Dominio',
    score: 17.5,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    date: '2024-10-14',
    comments: 'Buen trabajo. Reforzar el despeje de radicales.'
  },
  {
    id: 'gr-8',
    studentId: 'usr-student-2',
    studentName: 'Alejandro José Gómez Rangel',
    subjectId: 'sub-mat',
    evaluationTitle: 'Examen Parcial I: Trigonometría',
    score: 18.0,
    maxScore: 20,
    percentage: 25,
    term: '1er Lapso',
    date: '2024-11-04',
    comments: 'Demostró comprensión de las fórmulas principales.'
  },
  // Grades for student 3 (Sofía)
  {
    id: 'gr-9',
    studentId: 'usr-student-3',
    studentName: 'Sofía Isabella Herrera Peña',
    subjectId: 'sub-mat',
    evaluationTitle: 'Taller de Funciones y Dominio',
    score: 19.0,
    maxScore: 20,
    percentage: 20,
    term: '1er Lapso',
    date: '2024-10-14',
    comments: 'Excelente precisión analítica.'
  },
  {
    id: 'gr-10',
    studentId: 'usr-student-3',
    studentName: 'Sofía Isabella Herrera Peña',
    subjectId: 'sub-mat',
    evaluationTitle: 'Examen Parcial I: Trigonometría',
    score: 18.5,
    maxScore: 20,
    percentage: 25,
    term: '1er Lapso',
    date: '2024-11-04',
    comments: 'Muy bien resueltos los problemas de aplicación.'
  }
];

export const initialEvaluationPlans = [
  {
    id: 'plan-1',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    title: 'Taller Práctico: Funciones Reales y Gráficas',
    description: 'Análisis de dominio, rango, asíntotas y transformaciones de funciones en papel milimetrado.',
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
    description: 'Identidades fundamentales, círculo unitario, razones trigonométricas y teorema del coseno.',
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
    description: 'Cálculo de volúmenes, superficies y teoremas euclidianos en sólidos geométricos.',
    dueDate: '2024-11-25',
    percentage: 25,
    term: '1er Lapso',
    type: 'Evaluación Sumativa',
    status: 'En Progreso'
  },
  {
    id: 'plan-4',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    title: 'Proyecto Integrador y Defensa: Aplicaciones en Ingeniería',
    description: 'Modelo a escala aplicando proporciones y funciones polinómicas.',
    dueDate: '2024-12-09',
    percentage: 20,
    term: '1er Lapso',
    type: 'Proyecto y Defensa',
    status: 'Programado'
  },
  {
    id: 'plan-5',
    subjectId: 'sub-mat',
    subjectName: 'Matemáticas',
    title: 'Apreciación y Rasgos de la Personalidad',
    description: 'Puntualidad, asistencia activa, cuaderno al día y participación constructiva en clase.',
    dueDate: '2024-12-13',
    percentage: 10,
    term: '1er Lapso',
    type: 'Rasgos y Convivencia',
    status: 'Programado'
  },
  {
    id: 'plan-6',
    subjectId: 'sub-fis',
    subjectName: 'Física',
    title: 'Práctica de Laboratorio: Caída Libre y MRUV',
    description: 'Medición de aceleración de la gravedad con fotopuertas y cronómetros.',
    dueDate: '2024-10-21',
    percentage: 25,
    term: '1er Lapso',
    type: 'Laboratorio',
    status: 'Completado'
  },
  {
    id: 'plan-7',
    subjectId: 'sub-fis',
    subjectName: 'Física',
    title: 'Examen Teórico-Práctico: Dinámica y Leyes de Newton',
    description: 'Diagramas de cuerpo libre, fuerzas de fricción y planos inclinados.',
    dueDate: '2024-11-18',
    percentage: 30,
    term: '1er Lapso',
    type: 'Examen Escrito',
    status: 'En Progreso'
  }
];

export const initialSchedules = [
  { day: 'Lunes', time: '07:00 - 08:30 AM', subject: 'Matemáticas', classroom: 'Aula 204', teacher: 'Prof. Carlos Ramírez', color: 'bg-blue-50 border-blue-500 text-blue-700' },
  { day: 'Lunes', time: '08:45 - 10:15 AM', subject: 'Física (Teoría)', classroom: 'Aula 204', teacher: 'Prof. Carlos Ramírez', color: 'bg-sky-50 border-sky-500 text-sky-700' },
  { day: 'Lunes', time: '10:30 - 12:00 PM', subject: 'Castellano y Lit.', classroom: 'Aula 204', teacher: 'Prof. Elena Méndez', color: 'bg-amber-50 border-amber-500 text-amber-700' },
  
  { day: 'Martes', time: '07:00 - 08:30 AM', subject: 'Química', classroom: 'Lab. Química', teacher: 'Prof. Roberto Vargas', color: 'bg-emerald-50 border-emerald-500 text-emerald-700' },
  { day: 'Martes', time: '08:45 - 10:15 AM', subject: 'Biología', classroom: 'Lab. Biología', teacher: 'Prof. Roberto Vargas', color: 'bg-green-50 border-green-500 text-green-700' },
  { day: 'Martes', time: '10:30 - 12:00 PM', subject: 'Inglés', classroom: 'Aula de Idiomas', teacher: 'Prof. Sarah Jenkins', color: 'bg-purple-50 border-purple-500 text-purple-700' },

  { day: 'Miércoles', time: '07:00 - 08:30 AM', subject: 'Física (Laboratorio)', classroom: 'Lab. Física', teacher: 'Prof. Carlos Ramírez', color: 'bg-sky-50 border-sky-500 text-sky-700' },
  { day: 'Miércoles', time: '08:45 - 10:15 AM', subject: 'Matemáticas', classroom: 'Aula 204', teacher: 'Prof. Carlos Ramírez', color: 'bg-blue-50 border-blue-500 text-blue-700' },
  { day: 'Miércoles', time: '10:30 - 12:00 PM', subject: 'Historia de Vzla', classroom: 'Aula 204', teacher: 'Prof. Lisandro Alvarado', color: 'bg-rose-50 border-rose-500 text-rose-700' },

  { day: 'Jueves', time: '07:00 - 08:30 AM', subject: 'Educación Física', classroom: 'Canchas Techadas', teacher: 'Prof. Javier Briceño', color: 'bg-orange-50 border-orange-500 text-orange-700' },
  { day: 'Jueves', time: '08:45 - 10:15 AM', subject: 'Castellano y Lit.', classroom: 'Aula 204', teacher: 'Prof. Elena Méndez', color: 'bg-amber-50 border-amber-500 text-amber-700' },
  { day: 'Jueves', time: '10:30 - 12:00 PM', subject: 'Inglés', classroom: 'Aula de Idiomas', teacher: 'Prof. Sarah Jenkins', color: 'bg-purple-50 border-purple-500 text-purple-700' },

  { day: 'Viernes', time: '07:00 - 08:30 AM', subject: 'Química (Práctica)', classroom: 'Lab. Química', teacher: 'Prof. Roberto Vargas', color: 'bg-emerald-50 border-emerald-500 text-emerald-700' },
  { day: 'Viernes', time: '08:45 - 10:15 AM', subject: 'Orientación y Convivencia', classroom: 'Aula 204', teacher: 'Prof. Carlos Ramírez', color: 'bg-indigo-50 border-indigo-500 text-indigo-700' },
  { day: 'Viernes', time: '10:30 - 12:00 PM', subject: 'Club Científico / Robótica', classroom: 'Sala STEM', teacher: 'Equipo Docente', color: 'bg-cyan-50 border-cyan-500 text-cyan-700' }
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
    notes: 'Presentó justificativo médico por consulta odontológica con sello.',
    notified: true,
    sentTo: 'valeria.morales@liceobicentenario.edu.ve (Representante)'
  },
  {
    id: 'att-2',
    studentId: 'usr-student-2',
    studentName: 'Alejandro José Gómez Rangel',
    subject: 'Física',
    date: '2024-10-23',
    status: 'late',
    statusLabel: 'Llegada Tarde (20 min)',
    notes: 'Retraso por tráfico en la vía de acceso. Ingresó a la segunda hora.',
    notified: true,
    sentTo: 'alejandro.gomez@liceobicentenario.edu.ve'
  },
  {
    id: 'att-3',
    studentId: 'usr-student-4',
    studentName: 'Andrés Daniel Castillo Rojas',
    subject: 'Matemáticas',
    date: '2024-11-06',
    status: 'absent',
    statusLabel: 'Falta Injustificada',
    notes: 'No asistió a la primera hora de clase. Notificación enviada al representante.',
    notified: true,
    sentTo: 'andres.castillo@liceobicentenario.edu.ve'
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
    code: 'CERT-HONOR-2024-0089',
    description: 'Otorgado en reconocimiento por alcanzar el Primer Lugar del Cuadro de Honor con un promedio sobresaliente, demostrando disciplina, compromiso y valores liceístas.',
    signer: 'Dra. Carmen Teresa Mendoza, Directora General'
  },
  {
    id: 'cert-2',
    studentId: 'usr-student-1',
    studentName: 'Valeria Sofía Morales Mendoza',
    title: 'Mención Especial en la Olimpiada Juvenil de Matemáticas',
    type: 'merit',
    typeLabel: 'Mérito Científico',
    gradeLevel: '4to Año de Bachillerato',
    academicYear: '2024 - 2025',
    average: 'Fase Regional',
    issueDate: '15 de Octubre de 2024',
    code: 'CERT-OLYMP-2024-014',
    description: 'Por su brillante participación y clasificación sobresaliente en la fase regional de la Olimpiada Venezolana de Matemáticas, representando con orgullo al liceo.',
    signer: 'Prof. Carlos Eduardo Ramírez, Coordinador de Ciencias'
  },
  {
    id: 'cert-3',
    studentId: 'usr-student-3',
    studentName: 'Sofía Isabella Herrera Peña',
    title: 'Reconocimiento a la Asistencia Perfecta y Ciudadanía',
    type: 'conduct',
    typeLabel: 'Valores y Convivencia',
    gradeLevel: '4to Año de Bachillerato',
    academicYear: '2024 - 2025',
    average: '100% Asistencia',
    issueDate: '30 de Noviembre de 2024',
    code: 'CERT-ATT-2024-0052',
    description: 'Por su admirable puntualidad, constancia ininterrumpida y comportamiento ejemplar a lo largo del período lectivo.',
    signer: 'Prof. Marcos Aurelio Peña, Dirección Académica'
  }
];

export const initialMemories = [
  {
    id: 'mem-1',
    title: 'Feria Científica y Tecnológica Escolar 2024',
    category: 'Ciencia y Robótica',
    date: '18 de Mayo de 2024',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: 'Estudiantes de 4to y 5to año presentaron proyectos sostenibles con paneles solares, filtración de agua y brazos robóticos controlados con sensores.'
  },
  {
    id: 'mem-2',
    title: 'Campeonato Intercolegial de Baloncesto',
    category: 'Deportes',
    date: '4 de Junio de 2024',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    description: 'La selección liceísta se coronó campeona tras un emocionante partido final contra el Colegio San Ignacio. ¡Orgullo Bicentenario!'
  },
  {
    id: 'mem-3',
    title: 'Gala de la XXXV Promoción de Bachilleres',
    category: 'Graduaciones',
    date: '22 de Julio de 2024',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    description: 'Emotiva ceremonia en el Auditorio Mayor donde 140 jóvenes recibieron su título de bachiller, listos para la vida universitaria.'
  },
  {
    id: 'mem-4',
    title: 'Festival Tradicional de Danza y Música Folclórica',
    category: 'Cultura y Tradición',
    date: '12 de Abril de 2024',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    description: 'Muestra cultural con joropo, parrandas, gaitas y artesanía tradicional venezolana elaborada por los estudiantes de arte.'
  },
  {
    id: 'mem-5',
    title: 'Jornada Ecológica y Siembra Comunitaria',
    category: 'Medio Ambiente',
    date: '20 de Marzo de 2024',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    description: 'Siembra de más de 80 árboles autóctonos en los jardines exteriores y creación del nuevo huerto escolar de biología.'
  },
  {
    id: 'mem-6',
    title: 'Olimpiadas de Robótica y Programación',
    category: 'Tecnología',
    date: '8 de Febrero de 2024',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    description: 'Desafíos de programación en Python y carreras de robots seguidores de línea construidos en los talleres extraescolares.'
  }
];

export const initialAnnouncements = [
  {
    id: 'ann-1',
    title: 'Período Oficial de Inscripciones y Reingresos 2024-2025',
    date: 'Hoy a las 09:00 AM',
    priority: 'urgent',
    priorityLabel: 'Urgente / Importante',
    roleTarget: 'Todos',
    content: 'Se hace saber a padres, representantes y estudiantes que el lapso formal de entrega de recaudos estará activo hasta el 30 de este mes. Recuerden traer fotos y notas certificadas en carpeta marrón oficio.'
  },
  {
    id: 'ann-2',
    title: 'Publicación de Notas del 1er Lapso y Entrega de Boletines',
    date: 'Ayer',
    priority: 'normal',
    priorityLabel: 'Académico',
    roleTarget: 'Estudiantes',
    content: 'Las notas parciales de todas las materias ya están cargadas en el sistema. Los representantes podrán consultar el consolidado y el boletín imprimible desde este portal.'
  },
  {
    id: 'ann-3',
    title: 'Convocatoria al Consejo General de Profesores',
    date: 'Hace 3 días',
    priority: 'info',
    priorityLabel: 'Docentes',
    roleTarget: 'Profesores',
    content: 'Reunión de coordinación pedagógica y evaluación de fin de lapso el próximo jueves a las 2:00 PM en la Sala de Conferencias A.'
  }
];
