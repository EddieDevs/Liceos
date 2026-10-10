-- ==============================================================================
-- ACTUALIZACIÓN DE ESQUEMA V2: LICEO INTEGRAL VENEZUELA
-- Ejecuta este comando en el SQL Editor de Supabase (ouysblhxqlidfxrjxhft)
-- ==============================================================================

-- 1. ACTUALIZAR ROL EN PROFILES (Agregar rol 'representative')
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'teacher', 'admin', 'representative'));

-- 2. ACTUALIZAR O INSERTAR INFORMACIÓN INSTITUCIONAL DE "INTEGRAL VENEZUELA"
UPDATE public.institution_info
SET 
  name = 'U.E. Colegio Integral Venezuela',
  motto = 'Enseñando a vivir',
  history = 'Fundado el 10 de noviembre de 1989, el Colegio Integral Venezuela ha formado generaciones de bachilleres con excelencia académica, valores éticos y compromiso social en el oriente del país.',
  mission = 'Formar ciudadanos integrales con alto pensamiento crítico, sólidos principios morales, capacidad innovadora y habilidades para la vida y la educación superior.',
  vision = 'Consolidarnos como la institución educativa líder en Barcelona y el estado Anzoátegui, reconocida por su exigencia pedagógica, calidad humana y formación en valores para la vida.',
  address = 'Calle 11, sector Colinas del Neverí, Barcelona, Anzoátegui',
  phone = '+58 (281) 286-4192 / +58 (414) 820-1122',
  email = 'contacto@integralvenezuela.edu.ve',
  updated_at = now()
WHERE id IS NOT NULL;

-- 3. SISTEMA DE AULAS (Classrooms)
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- Ej: 'Aula 1', 'Lab de Ciencias'
    code TEXT UNIQUE NOT NULL, -- Ej: 'A-101', 'LAB-CIE'
    capacity INT DEFAULT 35,
    floor TEXT DEFAULT 'Planta Baja',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar aulas si no existen
INSERT INTO public.classrooms (name, code, capacity, floor, description)
VALUES
    ('Aula 1 - Simón Bolívar', 'A-101', 35, 'Planta Baja', 'Aula multimedia climatizada'),
    ('Aula 2 - Andrés Bello', 'A-102', 35, 'Planta Baja', 'Aula estándar'),
    ('Aula 3 - Francisco de Miranda', 'A-103', 35, 'Piso 1', 'Aula estándar'),
    ('Aula 4 - Rafael Urdaneta', 'A-104', 35, 'Piso 1', 'Aula de bachillerato'),
    ('Aula 5 - José Antonio Páez', 'A-105', 35, 'Piso 1', 'Aula de bachillerato'),
    ('Laboratorio de Ciencias Experimentales', 'LAB-01', 30, 'Planta Baja', 'Química, Física y Biología'),
    ('Sala de Computación y Robótica', 'LAB-INF', 28, 'Piso 1', 'Equipada con red de alta velocidad'),
    ('Canchas Deportivas Múltiples', 'DEP-01', 60, 'Exterior', 'Baloncesto, fútbol y voleibol')
ON CONFLICT (code) DO NOTHING;

-- 4. GESTIÓN DE PAGOS Y COMPROBANTES DE REPRESENTANTES
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    representative_name TEXT NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    student_grade TEXT,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'VES', 'EUR')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Pago Móvil', 'Transferencia Bancaria', 'Zelle', 'Efectivo Divisas', 'Punto de Venta')),
    reference_number TEXT NOT NULL,
    payment_concept TEXT NOT NULL, -- 'Mensualidad Octubre', 'Matrícula', etc.
    receipt_url TEXT,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. VÍNCULO REPRESENTANTE - ESTUDIANTE
CREATE TABLE IF NOT EXISTS public.representative_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship TEXT DEFAULT 'Representante Legal',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(representative_id, student_id)
);

-- 6. ACTUALIZAR RECUERDOS (Permitir aportes estudiantiles con curso y año)
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.memories ADD COLUMN IF NOT EXISTS grade_year TEXT DEFAULT '4to Año';

-- 7. ACTUALIZAR HORARIOS (Vincular con aula y profesor)
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL;
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS teacher_name TEXT;

-- 8. TRIGGER DE AUTOCONFIGURACIÓN DE ADMIN PARA 'quinterostudent@gmail.com'
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
        COALESCE(
          new.raw_user_meta_data->>'full_name',
          CASE WHEN new.email = 'quinterostudent@gmail.com' THEN 'Larry González (Director)'
               ELSE split_part(new.email, '@', 1) END
        ),
        CASE WHEN new.email = 'quinterostudent@gmail.com' THEN 'admin'
             ELSE COALESCE(new.raw_user_meta_data->>'role', 'student') END,
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
        COALESCE(new.raw_user_meta_data->>'grade_level', '4to Año - Sección A')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = CASE WHEN EXCLUDED.email = 'quinterostudent@gmail.com' THEN 'admin' ELSE profiles.role END,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asignar rol admin inmediatamente si el correo ya existe en profiles
UPDATE public.profiles 
SET role = 'admin', full_name = 'Larry González (Director)'
WHERE email = 'quinterostudent@gmail.com';

-- 9. HABILITAR RLS Y POLÍTICAS PARA NUEVAS TABLAS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.representative_students ENABLE ROW LEVEL SECURITY;

-- Políticas de aulas
DROP POLICY IF EXISTS "Lectura de aulas" ON public.classrooms;
CREATE POLICY "Lectura de aulas" ON public.classrooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Escritura de aulas autenticada" ON public.classrooms;
CREATE POLICY "Escritura de aulas autenticada" ON public.classrooms FOR ALL WITH CHECK (auth.role() = 'authenticated');

-- Políticas de pagos
DROP POLICY IF EXISTS "Lectura de pagos" ON public.payments;
CREATE POLICY "Lectura de pagos" ON public.payments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Crear pagos" ON public.payments;
CREATE POLICY "Crear pagos" ON public.payments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Modificar pagos" ON public.payments;
CREATE POLICY "Modificar pagos" ON public.payments FOR UPDATE USING (true);

-- Políticas de recuerdos actualizadas
DROP POLICY IF EXISTS "Crear recuerdos alumnos" ON public.memories;
CREATE POLICY "Crear recuerdos alumnos" ON public.memories FOR INSERT WITH CHECK (true);
