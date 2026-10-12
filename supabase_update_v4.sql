-- ==============================================================================
-- U.E. COLEGIO INTEGRAL VENEZUELA - ACTUALIZACIÓN SQL V4
-- AÑO ESCOLAR 2027-2028 | SECCIONES A-C | NÓMINA SEGURA & DOCENTES
-- Ejecutar en el SQL Editor de Supabase (Proyecto: ouysblhxqlidfxrjxhft)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CONFIGURACIÓN GLOBAL INSTITUCIONAL (Año Escolar & Credenciales de Dirección)
CREATE TABLE IF NOT EXISTS public.school_settings (
    id TEXT PRIMARY KEY DEFAULT 'settings-main',
    institution_name TEXT DEFAULT 'U.E. Colegio Integral Venezuela',
    current_school_year TEXT DEFAULT '2027-2028',
    admin_email TEXT DEFAULT 'quinterostudent@gmail.com',
    admin_password TEXT DEFAULT 'admin',
    principal_name TEXT DEFAULT 'Larry González',
    motto TEXT DEFAULT 'Enseñando a vivir',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.school_settings (id, current_school_year, admin_email, principal_name)
VALUES ('settings-main', '2027-2028', 'quinterostudent@gmail.com', 'Larry González')
ON CONFLICT (id) DO UPDATE SET
    current_school_year = EXCLUDED.current_school_year,
    admin_email = EXCLUDED.admin_email;

-- 2. SECCIONES OFICIALES (1er Año a 5to Año, Secciones A a C)
CREATE TABLE IF NOT EXISTS public.sections (
    id TEXT PRIMARY KEY,
    grade_year TEXT NOT NULL,
    section_letter TEXT NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER DEFAULT 35,
    classroom TEXT,
    guide_teacher TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. NÓMINA DE DOCENTES (Gestión por el Administrador)
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    cedula TEXT,
    email TEXT UNIQUE NOT NULL,
    specialty TEXT,
    phone TEXT,
    password_plain TEXT DEFAULT 'docente123',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MATRÍCULA OFICIAL DE ESTUDIANTES (Solo registrados por el Administrador)
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT NOT NULL,
    cedula TEXT,
    grade_year TEXT NOT NULL,
    section TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_plain TEXT NOT NULL,
    representative_name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Activo',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Actualizar tabla de perfiles para soportar cédula y sección venezolana
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cedula TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS section TEXT;

-- 5. ASIGNATURAS POR BASE DE DATOS
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    grade_level TEXT DEFAULT '1er Año',
    teacher_id TEXT,
    teacher_name TEXT,
    color TEXT DEFAULT '#223C63',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AULAS Y ESPACIOS
CREATE TABLE IF NOT EXISTS public.classrooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    building TEXT DEFAULT 'Sede Principal',
    capacity INTEGER DEFAULT 35,
    status TEXT DEFAULT 'disponible',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. HORARIOS (Regular, Recesos, Días Libres, Módulos Libres)
CREATE TABLE IF NOT EXISTS public.schedules (
    id TEXT PRIMARY KEY,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    subject_name TEXT,
    teacher_name TEXT,
    classroom_name TEXT,
    grade_level TEXT,
    entry_type TEXT DEFAULT 'regular' CHECK (entry_type IN ('regular', 'recess', 'free_module', 'day_off')),
    notes TEXT,
    created_by_role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CERTIFICADOS OFICIALES (Azul Rey, Dorado, Puntos centrados y firmas en blanco)
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'recognition' CHECK (category IN ('grade', 'recognition')),
    template_type TEXT DEFAULT 'academic' CHECK (template_type IN ('academic', 'sports', 'anniversary', 'values')),
    student_id TEXT,
    student_name TEXT NOT NULL,
    student_id_number TEXT,
    grade_level TEXT,
    score_note TEXT,
    custom_text TEXT,
    verification_code TEXT,
    issued_date DATE DEFAULT CURRENT_DATE,
    signer_name TEXT DEFAULT 'Larry González',
    signer_title TEXT DEFAULT 'Director General',
    status TEXT DEFAULT 'emitido',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. GESTIÓN DE PAGOS
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    representative_name TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    concept TEXT NOT NULL,
    receipt_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. RECUERDOS Y ANUARIO
CREATE TABLE IF NOT EXISTS public.memories (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    year_title TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. HABILITAR SEGURIDAD RLS
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura y escritura
DROP POLICY IF EXISTS "Public select settings" ON public.school_settings;
CREATE POLICY "Public select settings" ON public.school_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage settings" ON public.school_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select sections" ON public.sections;
CREATE POLICY "Public select sections" ON public.sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage sections" ON public.sections FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select teachers" ON public.teachers;
CREATE POLICY "Public select teachers" ON public.teachers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage teachers" ON public.teachers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select students" ON public.students;
CREATE POLICY "Public select students" ON public.students FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage students" ON public.students FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select subjects" ON public.subjects;
CREATE POLICY "Public select subjects" ON public.subjects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage subjects" ON public.subjects FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select schedules" ON public.schedules;
CREATE POLICY "Public select schedules" ON public.schedules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage schedules" ON public.schedules FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select certs" ON public.certificates;
CREATE POLICY "Public select certs" ON public.certificates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage certs" ON public.certificates FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select pay" ON public.payments;
CREATE POLICY "Public select pay" ON public.payments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage pay" ON public.payments FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select mem" ON public.memories;
CREATE POLICY "Public select mem" ON public.memories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage mem" ON public.memories FOR ALL USING (true);
