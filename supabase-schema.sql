-- ══════════════════════════════════════════════════
-- ELEVARE PREMIUM DANCE — Supabase Schema
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS free_leads (
  id            BIGSERIAL PRIMARY KEY,
  nombre        TEXT NOT NULL,
  apellido      TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefono      TEXT,
  estilo        TEXT,
  nivel         TEXT,
  objetivo      TEXT,
  dia_preferido TEXT,
  horario_preferido TEXT,
  status        TEXT DEFAULT 'nuevo',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE free_leads ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar (formulario público)
CREATE POLICY "public_insert_leads" ON free_leads
  FOR INSERT WITH CHECK (true);

-- Solo admins autenticados pueden leer
CREATE POLICY "auth_read_leads" ON free_leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_update_leads" ON free_leads
  FOR UPDATE USING (auth.role() = 'authenticated');
