-- ==============================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS PARA SISTEMA DE GESTIÓN EDUCATIVA (LICEO / COLEGIO)
-- Ejecutar este script en el SQL Editor de tu proyecto Supabase: ouysblhxqlidfxrjxhft
-- ==============================================================================

-- Habilitar extensión UUID si no está activada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: PROFILES (Perfiles de usuarios vinculados con auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    avatar_url TEXT,
    phone TEXT,
    student_id_number TEXT, -- Cédula o número de matrícula
    grade_level TEXT, -- Grado/Curso (ej. '4to Año - Sección A')
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA: COURSES (Cursos / Años escolares y secciones)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- Ej: '4to Año de Bachillerato'
    section TEXT NOT NULL DEFAULT 'A', -- 'A', 'B', 'U'
    academic_year TEXT NOT NULL DEFAULT '2024-2025',
    shift TEXT DEFAULT 'Mañana', -- Mañana / Tarde
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: SUBJECTS (Materias / Asignaturas)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- Ej: 'Matemáticas', 'Física', 'Química'
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    color TEXT DEFAULT '#2563eb',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: EVALUATION_PLANS (Planes de evaluación por materia)
CREATE TABLE IF NOT EXISTS public.evaluation_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL, -- Ej: 'Taller de Vectores y Matrices'
    description TEXT,
    due_date DATE,
    percentage NUMERIC(5,2) NOT NULL DEFAULT 20.0, -- Porcentaje (ej: 20%)
    term TEXT NOT NULL DEFAULT '1er Lapso', -- '1er Lapso', '2do Lapso', '3er Lapso'
    evaluation_type TEXT DEFAULT 'Examen Escrito', -- 'Examen', 'Taller', 'Exposición', 'Proyecto'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA: GRADES (Calificaciones de estudiantes)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    evaluation_plan_id UUID REFERENCES public.evaluation_plans(id) ON DELETE SET NULL,
    evaluation_title TEXT NOT NULL, -- Ej: 'Examen Parcial I'
    score NUMERIC(5,2) NOT NULL, -- Calificación obtenida (ej: 18.5)
    max_score NUMERIC(5,2) NOT NULL DEFAULT 20.0, -- Escala (ej: 20 pts)
    percentage NUMERIC(5,2) NOT NULL DEFAULT 20.0, -- Ponderación %
    term TEXT NOT NULL DEFAULT '1er Lapso',
    comments TEXT,
    graded_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA: ATTENDANCES (Asistencias y notificación de faltas)
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'justified')) DEFAULT 'present',
    justification TEXT,
    notified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA: CERTIFICATES (Certificados y Menciones de honor)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- Ej: 'Mención de Honor al Rendimiento Académico'
    type TEXT NOT NULL CHECK (type IN ('honor', 'merit', 'participation', 'sports', 'conduct')) DEFAULT 'honor',
    description TEXT,
    issued_by TEXT DEFAULT 'Dirección Académica',
    issue_date DATE DEFAULT CURRENT_DATE,
    certificate_code TEXT UNIQUE DEFAULT concat('CERT-', substring(uuid_generate_v4()::text, 1, 8)),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLA: SCHEDULES (Horarios de clases)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    classroom TEXT DEFAULT 'Aula 101',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLA: MEMORIES (Recuerdos, galería institucional y anuario)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Eventos', -- 'Eventos', 'Deportes', 'Graduación', 'Cultura', 'Laboratorio'
    event_date DATE DEFAULT CURRENT_DATE,
    academic_year TEXT DEFAULT '2024-2025',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABLA: ANNOUNCEMENTS (Comunicaciones y avisos oficiales)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'normal', 'info')),
    target_role TEXT DEFAULT 'all' CHECK (target_role IN ('all', 'student', 'teacher')),
    author_name TEXT DEFAULT 'Dirección del Liceo',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABLA: INSTITUTION_INFO (Información institucional para la web pública)
CREATE TABLE IF NOT EXISTS public.institution_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Liceo Bolivariano Bicentenario',
    motto TEXT DEFAULT 'Formando líderes con excelencia, valores y compromiso de futuro',
    mission TEXT,
    vision TEXT,
    history TEXT,
    address TEXT DEFAULT 'Av. Principal de Los Ilustres con Calle Simón Bolívar, Edif. Central',
    phone TEXT DEFAULT '+58 212-555-0199 / +58 414-123-4567',
    email TEXT DEFAULT 'contacto@liceobicentenario.edu.ve',
    enrollment_info TEXT,
    hero_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: Crear perfil al registrarse en Supabase Auth
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        role, 
        avatar_url,
        grade_level
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
        COALESCE(new.raw_user_meta_data->>'grade_level', '4to Año - Sección A')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador después de la creación en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_info ENABLE ROW LEVEL SECURITY;

-- Políticas universales de lectura abierta o autenticada para vistas
CREATE POLICY "Lectura pública de perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Actualizar propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lectura pública de cursos" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Lectura pública de materias" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Lectura pública de planes" ON public.evaluation_plans FOR SELECT USING (true);
CREATE POLICY "Lectura de calificaciones" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Lectura de asistencias" ON public.attendances FOR SELECT USING (true);
CREATE POLICY "Lectura de certificados" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Lectura pública de horarios" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Lectura pública de recuerdos" ON public.memories FOR SELECT USING (true);
CREATE POLICY "Lectura pública de comunicados" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Lectura pública institucional" ON public.institution_info FOR SELECT USING (true);

-- Políticas de escritura (Docentes, Admin o desarrollo autenticado)
CREATE POLICY "Insertar notas autenticados" ON public.grades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modificar notas autenticados" ON public.grades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Eliminar notas autenticados" ON public.grades FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertar planes autenticados" ON public.evaluation_plans FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modificar planes autenticados" ON public.evaluation_plans FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Eliminar planes autenticados" ON public.evaluation_plans FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertar asistencias autenticados" ON public.attendances FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modificar asistencias autenticados" ON public.attendances FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertar certificados autenticados" ON public.certificates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modificar certificados autenticados" ON public.certificates FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertar horarios autenticados" ON public.schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modificar horarios autenticados" ON public.schedules FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertar recuerdos autenticados" ON public.memories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Modificar recuerdos autenticados" ON public.memories FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertar avisos autenticados" ON public.announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==============================================================================
-- DATOS INICIALES SEMILLA (SEED DATA)
-- Carga inicial para que la plataforma se visualice completa desde el minuto cero
-- ==============================================================================

-- Información institucional por defecto
INSERT INTO public.institution_info (name, motto, mission, vision, history, enrollment_info)
VALUES (
    'Liceo Experimental Bicentenario',
    'Educar con excelencia, ciencia y valores para transformar el futuro',
    'Formar integralmente a jóvenes de bachillerato con un alto nivel académico, pensamiento crítico, sólidas bases éticas y habilidades tecnológicas que les permitan liderar los desafíos del mañana.',
    'Ser una institución educativa modelo a nivel nacional, reconocida por su excelencia académica, innovación pedagógica y por formar egresados comprometidos con el desarrollo social y científico.',
    'Fundado en 1985, el Liceo Experimental Bicentenario ha formado a más de 35 promociones de egresados destacados en ciencias, artes, humanidades e ingeniería en las más prestigiosas universidades.',
    'El proceso de inscripciones para el periodo 2024-2025 está abierto. Requisitos: Partida de nacimiento, notas certificadas del año anterior, cédula de identidad del estudiante y representante, 4 fotos tipo carnet.'
) ON CONFLICT DO NOTHING;

-- Cursos de muestra
INSERT INTO public.courses (id, name, section, academic_year, shift)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', '1er Año de Bachillerato', 'A', '2024-2025', 'Mañana'),
    ('c2222222-2222-2222-2222-222222222222', '2do Año de Bachillerato', 'A', '2024-2025', 'Mañana'),
    ('c3333333-3333-3333-3333-333333333333', '3er Año de Bachillerato', 'A', '2024-2025', 'Mañana'),
    ('c4444444-4444-4444-4444-444444444444', '4to Año de Bachillerato', 'A', '2024-2025', 'Mañana'),
    ('c5555555-5555-5555-5555-555555555555', '5to Año de Bachillerato', 'A', '2024-2025', 'Mañana')
ON CONFLICT DO NOTHING;

-- Materias para 4to Año
INSERT INTO public.subjects (id, name, course_id, color)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'Matemáticas', 'c4444444-4444-4444-4444-444444444444', '#2563eb'),
    ('s2222222-2222-2222-2222-222222222222', 'Física', 'c4444444-4444-4444-4444-444444444444', '#0284c7'),
    ('s3333333-3333-3333-3333-333333333333', 'Química', 'c4444444-4444-4444-4444-444444444444', '#059669'),
    ('s4444444-4444-4444-4444-444444444444', 'Biología', 'c4444444-4444-4444-4444-444444444444', '#16a34a'),
    ('s5555555-5555-5555-5555-555555555555', 'Castellano y Literatura', 'c4444444-4444-4444-4444-444444444444', '#d97706'),
    ('s6666666-6666-6666-6666-666666666666', 'Inglés', 'c4444444-4444-4444-4444-444444444444', '#7c3aed'),
    ('s7777777-7777-7777-7777-777777777777', 'Historia de Venezuela', 'c4444444-4444-4444-4444-444444444444', '#e11d48')
ON CONFLICT DO NOTHING;

-- Planes de Evaluación de muestra
INSERT INTO public.evaluation_plans (subject_id, title, description, due_date, percentage, term, evaluation_type)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'Taller de Funciones Polinómicas', 'Resolución práctica grupal de funciones y gráficas', '2024-10-25', 20.0, '1er Lapso', 'Taller Práctico'),
    ('s1111111-1111-1111-1111-111111111111', 'Examen Parcial I: Trigonometría', 'Identidades trigonométricas y teorema del seno/coseno', '2024-11-12', 25.0, '1er Lapso', 'Examen Escrito'),
    ('s2222222-2222-2222-2222-222222222222', 'Informe de Laboratorio: Cinemática', 'Práctica sobre Movimiento Rectilíneo Uniformemente Variado', '2024-10-28', 20.0, '1er Lapso', 'Laboratorio'),
    ('s3333333-3333-3333-3333-333333333333', 'Proyecto Estequiometría', 'Cálculos cuantitativos y balanceo de reacciones químicas', '2024-11-15', 30.0, '1er Lapso', 'Proyecto'),
    ('s5555555-5555-5555-5555-555555555555', 'Ensayo Literario', 'Análisis crítico sobre la novela Doña Bárbara', '2024-11-05', 25.0, '1er Lapso', 'Ensayo')
ON CONFLICT DO NOTHING;

-- Horarios de clases de muestra
INSERT INTO public.schedules (course_id, subject_id, day_of_week, start_time, end_time, classroom)
VALUES
    ('c4444444-4444-4444-4444-444444444444', 's1111111-1111-1111-1111-111111111111', 'Lunes', '07:00:00', '08:30:00', 'Aula 104'),
    ('c4444444-4444-4444-4444-444444444444', 's2222222-2222-2222-2222-222222222222', 'Lunes', '08:45:00', '10:15:00', 'Lab de Física'),
    ('c4444444-4444-4444-4444-444444444444', 's3333333-3333-3333-3333-333333333333', 'Martes', '07:00:00', '08:30:00', 'Lab de Química'),
    ('c4444444-4444-4444-4444-444444444444', 's5555555-5555-5555-5555-555555555555', 'Martes', '08:45:00', '10:15:00', 'Aula 104'),
    ('c4444444-4444-4444-4444-444444444444', 's1111111-1111-1111-1111-111111111111', 'Miércoles', '07:00:00', '08:30:00', 'Aula 104'),
    ('c4444444-4444-4444-4444-444444444444', 's4444444-4444-4444-4444-444444444444', 'Miércoles', '08:45:00', '10:15:00', 'Aula 104'),
    ('c4444444-4444-4444-4444-444444444444', 's6666666-6666-6666-6666-666666666666', 'Jueves', '07:00:00', '08:30:00', 'Aula de Idiomas'),
    ('c4444444-4444-4444-4444-444444444444', 's7777777-7777-7777-7777-777777777777', 'Jueves', '08:45:00', '10:15:00', 'Aula 104'),
    ('c4444444-4444-4444-4444-444444444444', 's2222222-2222-2222-2222-222222222222', 'Viernes', '07:00:00', '08:30:00', 'Aula 104'),
    ('c4444444-4444-4444-4444-444444444444', 's3333333-3333-3333-3333-333333333333', 'Viernes', '08:45:00', '10:15:00', 'Lab de Química')
ON CONFLICT DO NOTHING;

-- Galería de Recuerdos y Actividades
INSERT INTO public.memories (title, description, image_url, category, event_date)
VALUES
    ('Feria Científica y Tecnológica Anual', 'Presentación de prototipos de robótica y experimentos por los estudiantes de bachillerato.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80', 'Proyectos', '2024-05-18'),
    ('Juegos Intercolegiales de Baloncesto y Voleibol', 'Nuestro equipo liceísta se coronó campeón en la final distrital estudiantil.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80', 'Deportes', '2024-06-04'),
    ('Acto de Graduación - XXXV Promoción', 'Momento emotivo de entrega de títulos a los nuevos bachilleres de la República.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', 'Graduación', '2024-07-22'),
    ('Festival Cultural de Danza y Tradiciones', 'Presentaciones artísticas, música folclórica y muestra gastronómica regional.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', 'Cultura', '2024-04-12'),
    ('Jornada Ecológica y Siembra de Árboles', 'Estudiantes recuperando las áreas verdes y el vivero escolar con gran entusiasmo.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80', 'Eventos', '2024-03-20')
ON CONFLICT DO NOTHING;

-- Avisos y Comunicados Oficiales
INSERT INTO public.announcements (title, content, priority, target_role)
VALUES
    ('Inicio del Proceso de Inscripciones 2024-2025', 'Se informa a toda la comunidad que a partir del lunes 15 de julio inicia la recepción de recaudos para nuevo ingreso y prosecución.', 'urgent', 'all'),
    ('Entrega de Boletines del 1er Lapso Pedagógico', 'La asamblea general con padres y representantes para la entrega de boletines se efectuará el próximo viernes a las 8:00 AM en el auditorio.', 'normal', 'student'),
    ('Consejo Técnico Docente y Planificación', 'Convocatoria a todos los profesores para la sesión de revisión curricular y entrega de planes de evaluación este jueves a las 2:00 PM.', 'normal', 'teacher')
ON CONFLICT DO NOTHING;
