-- ==============================================================================
-- INSTALACIÓN COMPLETA Y LIMPIA DESDE CERO - U.E. COLEGIO INTEGRAL VENEZUELA
-- ==============================================================================
-- Este script elimina todas las tablas anteriores y las recrea con tipos TEXT en las 
-- claves primarias para garantizar compatibilidad total con los identificadores del sistema,
-- evitando cualquier error de tipo UUID (22P02) o error de sintaxis de políticas (42601).
-- ==============================================================================

-- 1. ELIMINAR TABLAS ANTERIORES EN CASCADA
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.memories CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.attendances CASCADE;
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.evaluation_plans CASCADE;
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.classrooms CASCADE;
DROP TABLE IF EXISTS public.sections CASCADE;
DROP TABLE IF EXISTS public.school_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREACIÓN DE TABLAS

-- A. Configuración Institucional
CREATE TABLE public.school_settings (
    id TEXT PRIMARY KEY DEFAULT 'config-default',
    name TEXT NOT NULL DEFAULT 'U.E. Colegio Integral Venezuela',
    motto TEXT DEFAULT 'Enseñando a vivir',
    foundation_date TEXT DEFAULT '10 de noviembre de 1989',
    address TEXT DEFAULT 'Calle 11, sector Colinas del Neverí, Barcelona, Anzoátegui',
    director_name TEXT DEFAULT 'Larry González',
    admin_email TEXT DEFAULT 'quinterostudent@gmail.com',
    phone TEXT DEFAULT '+58 (414) 820-1122',
    current_school_year TEXT DEFAULT '2027-2028',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. Perfiles de Usuarios de Supabase Auth
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    cedula TEXT,
    role TEXT DEFAULT 'representative',
    grade_level TEXT DEFAULT '1er Año',
    section TEXT DEFAULT 'Sección A',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. Aulas de Clase
CREATE TABLE public.classrooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    building TEXT DEFAULT 'Sede Principal',
    capacity INT DEFAULT 35,
    status TEXT DEFAULT 'disponible',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. Secciones (1er a 5to Año, A a C)
CREATE TABLE public.sections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade_year TEXT NOT NULL,
    section_letter TEXT NOT NULL,
    capacity INT DEFAULT 35,
    classroom TEXT DEFAULT 'Aula por asignar',
    guide_teacher TEXT DEFAULT 'Por asignar',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. Asignaturas / Cátedras
CREATE TABLE public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    grade_level TEXT,
    weekly_hours INT DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. Docentes (Nómina Oficial)
CREATE TABLE public.teachers (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    cedula TEXT,
    email TEXT UNIQUE NOT NULL,
    specialty TEXT DEFAULT 'Castellano y Literatura',
    phone TEXT,
    password_plain TEXT DEFAULT 'docente123',
    avatar_url TEXT,
    status TEXT DEFAULT 'Activo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- G. Estudiantes Matriculados
CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT NOT NULL,
    cedula TEXT,
    grade_year TEXT DEFAULT '1er Año',
    section TEXT DEFAULT 'Sección A',
    email TEXT UNIQUE,
    password_plain TEXT DEFAULT 'estudiante123',
    representative_name TEXT DEFAULT 'Por asignar',
    phone TEXT,
    status TEXT DEFAULT 'Activo',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. Horarios Semanales y Módulos
CREATE TABLE public.schedules (
    id TEXT PRIMARY KEY,
    day_of_week TEXT NOT NULL,
    time TEXT,
    start_time TEXT,
    end_time TEXT,
    classroom_name TEXT,
    subject_name TEXT NOT NULL,
    teacher_name TEXT,
    grade_level TEXT DEFAULT '1er Año - Sección A',
    entry_type TEXT DEFAULT 'regular',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- I. Planes de Evaluación
CREATE TABLE public.evaluation_plans (
    id TEXT PRIMARY KEY,
    subject_name TEXT NOT NULL,
    unit_title TEXT NOT NULL,
    strategy TEXT DEFAULT 'Evaluación Escrita',
    instrument TEXT DEFAULT 'Escala de Estimación',
    percentage INT DEFAULT 20,
    lapso INT DEFAULT 1,
    evaluation_date TEXT,
    teacher_name TEXT,
    status TEXT DEFAULT 'Programado',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- J. Calificaciones
CREATE TABLE public.grades (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    evaluation_title TEXT,
    score NUMERIC DEFAULT 0,
    max_score NUMERIC DEFAULT 20,
    percentage NUMERIC DEFAULT 20,
    term TEXT DEFAULT '1er Lapso',
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K. Control de Asistencia e Inasistencias
CREATE TABLE public.attendances (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'ausente',
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- L. Reconocimientos y Certificados Oficiales
CREATE TABLE public.certificates (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    certificate_type TEXT NOT NULL,
    certificate_code TEXT,
    issue_date TEXT,
    points NUMERIC,
    director_name TEXT DEFAULT 'Larry González',
    academic_coord TEXT,
    school_year TEXT DEFAULT '2027-2028',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- M. Recuerdos del Anuario Escolar
CREATE TABLE public.memories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Proyectos',
    image_url TEXT NOT NULL,
    author_name TEXT,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- N. Pagos y Comprobantes de Representantes
CREATE TABLE public.payments (
    id TEXT PRIMARY KEY,
    representative_id TEXT,
    representative_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    concept TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    voucher_url TEXT,
    date TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HABILITAR SEGURIDAD (RLS) Y POLÍTICAS PERMISIVAS
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access school_settings" ON public.school_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access classrooms" ON public.classrooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access schedules" ON public.schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access evaluation_plans" ON public.evaluation_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access grades" ON public.grades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access attendances" ON public.attendances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- 4. INSERTAR DATOS INICIALES DEL PLANTEL

-- Datos de la Institución
INSERT INTO public.school_settings (
    id, name, motto, foundation_date, address, director_name, admin_email, phone, current_school_year
) VALUES (
    'config-default',
    'U.E. Colegio Integral Venezuela',
    'Enseñando a vivir',
    '10 de noviembre de 1989',
    'Calle 11, sector Colinas del Neverí, Barcelona, Anzoátegui',
    'Larry González',
    'quinterostudent@gmail.com',
    '+58 (414) 820-1122',
    '2027-2028'
) ON CONFLICT (id) DO NOTHING;

-- Aulas Iniciales
INSERT INTO public.classrooms (id, name, building, capacity, status) VALUES
    ('clr-1', 'Aula 01', 'Edificio Central', 35, 'disponible'),
    ('clr-2', 'Aula 02', 'Edificio Central', 35, 'disponible'),
    ('clr-3', 'Aula 03', 'Edificio Central', 35, 'disponible'),
    ('clr-4', 'Aula 04', 'Edificio Central', 35, 'disponible'),
    ('clr-5', 'Aula 05', 'Edificio Central', 35, 'disponible'),
    ('clr-6', 'Laboratorio de Ciencias', 'Módulo de Ciencias', 30, 'disponible')
ON CONFLICT (id) DO NOTHING;

-- Secciones Oficiales (1er a 5to Año, Secciones A, B y C)
INSERT INTO public.sections (id, name, grade_year, section_letter, capacity, classroom, guide_teacher) VALUES
    ('sec-1a', '1er Año - Sección A', '1er Año', 'A', 35, 'Aula 01', 'Por asignar'),
    ('sec-1b', '1er Año - Sección B', '1er Año', 'B', 35, 'Aula 02', 'Por asignar'),
    ('sec-1c', '1er Año - Sección C', '1er Año', 'C', 35, 'Aula 03', 'Por asignar'),
    ('sec-2a', '2do Año - Sección A', '2do Año', 'A', 35, 'Aula 04', 'Por asignar'),
    ('sec-2b', '2do Año - Sección B', '2do Año', 'B', 35, 'Aula 05', 'Por asignar'),
    ('sec-2c', '2do Año - Sección C', '2do Año', 'C', 35, 'Aula 01', 'Por asignar'),
    ('sec-3a', '3er Año - Sección A', '3er Año', 'A', 35, 'Aula 02', 'Por asignar'),
    ('sec-3b', '3er Año - Sección B', '3er Año', 'B', 35, 'Aula 03', 'Por asignar'),
    ('sec-3c', '3er Año - Sección C', '3er Año', 'C', 35, 'Aula 04', 'Por asignar'),
    ('sec-4a', '4to Año - Sección A', '4to Año', 'A', 35, 'Aula 05', 'Por asignar'),
    ('sec-4b', '4to Año - Sección B', '4to Año', 'B', 35, 'Aula 01', 'Por asignar'),
    ('sec-4c', '4to Año - Sección C', '4to Año', 'C', 35, 'Aula 02', 'Por asignar'),
    ('sec-5a', '5to Año - Sección A', '5to Año', 'A', 35, 'Aula 03', 'Por asignar'),
    ('sec-5b', '5to Año - Sección B', '5to Año', 'B', 35, 'Aula 04', 'Por asignar'),
    ('sec-5c', '5to Año - Sección C', '5to Año', 'C', 35, 'Aula 05', 'Por asignar')
ON CONFLICT (id) DO NOTHING;
