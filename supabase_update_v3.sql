-- ==============================================================================
-- U.E. COLEGIO INTEGRAL VENEZUELA - ACTUALIZACIÓN SQL V3
-- Ejecutar en el SQL Editor de Supabase (ID: ouysblhxqlidfxrjxhft)
-- ==============================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE ASIGNATURAS (Creadas una por una por el Administrador)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT,
    grade_level TEXT DEFAULT '1er Año a 5to Año',
    teacher_id UUID,
    teacher_name TEXT,
    color TEXT DEFAULT '#2563eb',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA DE AULAS Y ESPACIOS
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    building TEXT DEFAULT 'Sede Principal',
    capacity INTEGER DEFAULT 35,
    equipment TEXT,
    status TEXT DEFAULT 'disponible',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. HORARIOS (Soporte de clases, días libres, recesos y módulos libres)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    subject_id UUID,
    subject_name TEXT,
    teacher_id UUID,
    teacher_name TEXT,
    classroom_name TEXT,
    grade_level TEXT,
    entry_type TEXT DEFAULT 'regular' CHECK (entry_type IN ('regular', 'recess', 'free_module', 'day_off')),
    notes TEXT,
    created_by_role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Si la tabla schedules ya existía previamente, agregar columnas faltantes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schedules' AND column_name = 'entry_type') THEN
    ALTER TABLE public.schedules ADD COLUMN entry_type TEXT DEFAULT 'regular' CHECK (entry_type IN ('regular', 'recess', 'free_module', 'day_off'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schedules' AND column_name = 'notes') THEN
    ALTER TABLE public.schedules ADD COLUMN notes TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schedules' AND column_name = 'created_by_role') THEN
    ALTER TABLE public.schedules ADD COLUMN created_by_role TEXT DEFAULT 'admin';
  END IF;
END $$;

-- 4. CERTIFICADOS OFICIALES (Plantillas automáticas, nota vs reconocimiento)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'recognition' CHECK (category IN ('grade', 'recognition')),
    template_type TEXT DEFAULT 'academic' CHECK (template_type IN ('academic', 'sports', 'anniversary', 'values')),
    student_id UUID,
    student_name TEXT NOT NULL,
    student_id_number TEXT,
    grade_level TEXT,
    score_note TEXT,
    custom_text TEXT,
    issued_date DATE DEFAULT CURRENT_DATE,
    signer_name TEXT DEFAULT 'Larry González',
    signer_title TEXT DEFAULT 'Director General',
    verification_code TEXT,
    status TEXT DEFAULT 'emitido',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Si la tabla certificates ya existía, añadir columnas nuevas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'category') THEN
    ALTER TABLE public.certificates ADD COLUMN category TEXT DEFAULT 'recognition' CHECK (category IN ('grade', 'recognition'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'template_type') THEN
    ALTER TABLE public.certificates ADD COLUMN template_type TEXT DEFAULT 'academic' CHECK (template_type IN ('academic', 'sports', 'anniversary', 'values'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'student_name') THEN
    ALTER TABLE public.certificates ADD COLUMN student_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'student_id_number') THEN
    ALTER TABLE public.certificates ADD COLUMN student_id_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'grade_level') THEN
    ALTER TABLE public.certificates ADD COLUMN grade_level TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'score_note') THEN
    ALTER TABLE public.certificates ADD COLUMN score_note TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'custom_text') THEN
    ALTER TABLE public.certificates ADD COLUMN custom_text TEXT;
  END IF;
END $$;

-- 5. RECUERDOS ESCOLARES (Subidos por los estudiantes)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    student_name TEXT NOT NULL,
    year_title TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. GESTIÓN DE PAGOS Y RECIBOS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    representative_name TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL,
    concept TEXT NOT NULL,
    receipt_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CALIFICACIONES Y EVALUACIONES
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    student_name TEXT NOT NULL,
    subject_id UUID,
    subject_name TEXT NOT NULL,
    lapso INTEGER CHECK (lapso IN (1, 2, 3)),
    nota NUMERIC(4,2),
    ponderacion INTEGER DEFAULT 20,
    observacion TEXT,
    teacher_name TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PLANES DE EVALUACIÓN
CREATE TABLE IF NOT EXISTS public.evaluation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_name TEXT NOT NULL,
    lapso INTEGER CHECK (lapso IN (1, 2, 3)),
    unit_title TEXT NOT NULL,
    strategy TEXT NOT NULL,
    instrument TEXT NOT NULL,
    percentage INTEGER NOT NULL,
    evaluation_date DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ASISTENCIAS Y FALTAS
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    student_name TEXT NOT NULL,
    grade_level TEXT,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'presente' CHECK (status IN ('presente', 'ausente', 'justificada', 'retraso')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. HABILITACIÓN DE POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura abierta y escritura para la plataforma
DROP POLICY IF EXISTS "Public select subjects" ON public.subjects;
CREATE POLICY "Public select subjects" ON public.subjects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage subjects" ON public.subjects;
CREATE POLICY "Public manage subjects" ON public.subjects FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select classrooms" ON public.classrooms;
CREATE POLICY "Public select classrooms" ON public.classrooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage classrooms" ON public.classrooms FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select schedules" ON public.schedules;
CREATE POLICY "Public select schedules" ON public.schedules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage schedules" ON public.schedules FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select certificates" ON public.certificates;
CREATE POLICY "Public select certificates" ON public.certificates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage certificates" ON public.certificates FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select memories" ON public.memories;
CREATE POLICY "Public select memories" ON public.memories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage memories" ON public.memories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select payments" ON public.payments;
CREATE POLICY "Public select payments" ON public.payments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage payments" ON public.payments FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select grades" ON public.grades;
CREATE POLICY "Public select grades" ON public.grades FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage grades" ON public.grades FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select eval_plans" ON public.evaluation_plans;
CREATE POLICY "Public select eval_plans" ON public.evaluation_plans FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage eval_plans" ON public.evaluation_plans FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select attendances" ON public.attendances;
CREATE POLICY "Public select attendances" ON public.attendances FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public manage attendances" ON public.attendances FOR ALL USING (true);
