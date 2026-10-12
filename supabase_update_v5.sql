-- ==============================================================================
-- U.E. COLEGIO INTEGRAL VENEZUELA - ACTUALIZACIÓN SQL DEFINITIVA V5 (COMPATIBILIDAD TEXT ID)
-- RESUELVE EL ERROR 22P02 (UUID A TEXT) Y SINTAXIS RLS
-- Ejecutar en el SQL Editor de Supabase (Proyecto: ouysblhxqlidfxrjxhft)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. MIGRACIÓN DE TABLAS CON ID UUID A ID TEXT (ELIMINA RESTRICCIONES ANTIGUAS)
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.classrooms CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.memories CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;

-- 1. CONFIGURACIÓN GLOBAL INSTITUCIONAL
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

-- 2. INVENTARIO DE AULAS Y ESPACIOS FÍSICOS (ID TEXT)
CREATE TABLE public.classrooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    building TEXT DEFAULT 'Sede Principal',
    capacity INTEGER DEFAULT 35,
    status TEXT DEFAULT 'disponible',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.classrooms (id, name, building, capacity, status)
VALUES
    ('clr-1', 'Aula 01 - Ciencias Exactas', 'Módulo A (Piso 1)', 35, 'disponible'),
    ('clr-2', 'Aula 02 - Humanidades y Letras', 'Módulo A (Piso 1)', 35, 'disponible'),
    ('clr-3', 'Aula 03 - Ciencias Sociales', 'Módulo A (Piso 2)', 32, 'disponible'),
    ('clr-4', 'Laboratorio de Computación e Informática', 'Módulo Tecnológico', 28, 'disponible'),
    ('clr-5', 'Laboratorio de Biología y Química', 'Módulo Científico', 30, 'disponible'),
    ('clr-6', 'Cancha de Educación Física y Deportes', 'Complejo Deportivo', 50, 'disponible')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    building = EXCLUDED.building,
    capacity = EXCLUDED.capacity,
    status = EXCLUDED.status;

-- 3. SECCIONES OFICIALES
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

ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 35;
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS classroom TEXT;
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS guide_teacher TEXT;

-- 4. MATRÍCULA DE ESTUDIANTES (Solo registrados por la Dirección)
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

ALTER TABLE public.students ADD COLUMN IF NOT EXISTS cedula TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS representative_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Activo';

-- 5. NÓMINA DOCENTE
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

-- 6. ASIGNATURAS POR BASE DE DATOS (ID TEXT)
CREATE TABLE public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    grade_level TEXT DEFAULT '1er Año',
    teacher_id TEXT,
    teacher_name TEXT,
    color TEXT DEFAULT '#223C63',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. HORARIOS Y PROGRAMACIÓN ACADÉMICA (ID TEXT)
CREATE TABLE public.schedules (
    id TEXT PRIMARY KEY,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    subject_name TEXT,
    teacher_name TEXT,
    classroom_name TEXT,
    grade_level TEXT,
    entry_type TEXT DEFAULT 'regular',
    notes TEXT,
    created_by_role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CERTIFICADOS Y RECONOCIMIENTOS OFICIALES (ID TEXT)
CREATE TABLE public.certificates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'recognition',
    template_type TEXT DEFAULT 'academic',
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

-- 9. GESTIÓN DE PAGOS Y CONCILIACIONES (ID TEXT)
CREATE TABLE public.payments (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    representative_name TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    concept TEXT NOT NULL,
    receipt_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. RECUERDOS Y ANUARIO ESCOLAR (ID TEXT)
CREATE TABLE public.memories (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    year_title TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. HABILITAR SEGURIDAD RLS EN TODAS LAS TABLAS
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- 12. POLÍTICAS DE ACCESO COMPLETO (PUBLIC / ANON ACCESS)
-- school_settings
DROP POLICY IF EXISTS "Public select settings" ON public.school_settings;
DROP POLICY IF EXISTS "Public manage settings" ON public.school_settings;
DROP POLICY IF EXISTS "Public access settings" ON public.school_settings;
CREATE POLICY "Public access settings" ON public.school_settings FOR ALL USING (true) WITH CHECK (true);

-- classrooms
DROP POLICY IF EXISTS "Public select classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Public manage classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Public access classrooms" ON public.classrooms;
CREATE POLICY "Public access classrooms" ON public.classrooms FOR ALL USING (true) WITH CHECK (true);

-- sections
DROP POLICY IF EXISTS "Public select sections" ON public.sections;
DROP POLICY IF EXISTS "Public manage sections" ON public.sections;
DROP POLICY IF EXISTS "Public access sections" ON public.sections;
CREATE POLICY "Public access sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);

-- students
DROP POLICY IF EXISTS "Public select students" ON public.students;
DROP POLICY IF EXISTS "Public manage students" ON public.students;
DROP POLICY IF EXISTS "Public access students" ON public.students;
CREATE POLICY "Public access students" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- teachers
DROP POLICY IF EXISTS "Public select teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public access teachers" ON public.teachers;
CREATE POLICY "Public access teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);

-- subjects
DROP POLICY IF EXISTS "Public select subjects" ON public.subjects;
DROP POLICY IF EXISTS "Public manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Public access subjects" ON public.subjects;
CREATE POLICY "Public access subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);

-- schedules
DROP POLICY IF EXISTS "Public select schedules" ON public.schedules;
DROP POLICY IF EXISTS "Public manage schedules" ON public.schedules;
DROP POLICY IF EXISTS "Public access schedules" ON public.schedules;
CREATE POLICY "Public access schedules" ON public.schedules FOR ALL USING (true) WITH CHECK (true);

-- certificates
DROP POLICY IF EXISTS "Public select certs" ON public.certificates;
DROP POLICY IF EXISTS "Public manage certs" ON public.certificates;
DROP POLICY IF EXISTS "Public access certificates" ON public.certificates;
CREATE POLICY "Public access certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);

-- payments
DROP POLICY IF EXISTS "Public select pay" ON public.payments;
DROP POLICY IF EXISTS "Public manage pay" ON public.payments;
DROP POLICY IF EXISTS "Public access payments" ON public.payments;
CREATE POLICY "Public access payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- memories
DROP POLICY IF EXISTS "Public select mem" ON public.memories;
DROP POLICY IF EXISTS "Public manage mem" ON public.memories;
DROP POLICY IF EXISTS "Public access memories" ON public.memories;
CREATE POLICY "Public access memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);
