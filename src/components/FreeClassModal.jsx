  import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

const STEPS = ['datos', 'estilo', 'horario']

const initialForm = {
  nombre: '', apellido: '', email: '', telefono: '',
  estilo: '', nivel: '', objetivo: '',
  dia: '', horario: '',
}

export default function FreeClassModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleOverlay = (e) => { if (e.target === e.currentTarget) handleClose() }

  const handleClose = () => {
    onClose()
    setTimeout(() => { setStep(0); setForm(initialForm); setSuccess(false) }, 300)
  }

  const validateStep0 = () => {
    if (!form.nombre.trim()) { toast.error('Ingresa tu nombre'); return false }
    if (!form.apellido.trim()) { toast.error('Ingresa tu apellido'); return false }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { toast.error('Ingresa un email válido'); return false }
    if (!form.telefono.trim()) { toast.error('Ingresa tu teléfono'); return false }
    return true
  }

  const validateStep1 = () => {
    if (!form.estilo) { toast.error('Selecciona un estilo de baile'); return false }
    if (!form.nivel) { toast.error('Selecciona tu nivel'); return false }
    if (!form.objetivo) { toast.error('Selecciona tu objetivo'); return false }
    return true
  }

  const validateStep2 = () => {
    if (!form.dia) { toast.error('Selecciona un día preferido'); return false }
    if (!form.horario) { toast.error('Selecciona un horario'); return false }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    setLoading(true)
    try {
      const { error } = await supabase.from('free_leads').insert({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono,
        estilo: form.estilo,
        nivel: form.nivel,
        objetivo: form.objetivo,
        dia_preferido: form.dia,
        horario_preferido: form.horario,
      })
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      console.error(err)
      toast.error('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={handleOverlay}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={handleClose} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="modal-title" style={{ marginBottom: '.5rem' }}>
              ¡Listo, <span className="gold">te esperamos!</span>
            </h2>
            <p style={{ color: 'var(--muted-fg)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Tu solicitud fue recibida. Un asesor de Clave de Tres te contactará en las próximas horas para confirmar tu clase gratuita.
            </p>
            <button className="btn btn-outline" onClick={handleClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="step-indicator">
              {STEPS.map((_, i) => (
                <div key={i} className={`step-dot${i < step ? ' done' : i === step ? ' active' : ''}`} />
              ))}
            </div>

            {step === 0 && (
              <>
                <h2 className="modal-title">Tu clase <span className="gold">gratis</span></h2>
                <p className="modal-sub">¡Sin compromisos! Ven a conocernos y descubre por qué Clave de Tres es diferente.</p>
                <div className="form-2col">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre" />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input type="text" value={form.apellido} onChange={set('apellido')} placeholder="Tu apellido" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="tu@email.com" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" value={form.telefono} onChange={set('telefono')} placeholder="+52 221 263 6042" />
                </div>
                <div className="modal-nav">
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (validateStep0()) setStep(1) }}>
                    Continuar →
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="modal-title">Tu <span className="orange">estilo</span></h2>
                <p className="modal-sub">¿Qué tipo de baile te llama la atención? Elige uno para tu primera clase.</p>
                <div className="form-group">
                  <label>Estilo de baile</label>
                  <select value={form.estilo} onChange={set('estilo')}>
                    <option value="">Selecciona un estilo</option>
                    <option>Salsa & Bachata</option>
                    <option>Ballet Contemporáneo</option>
                    <option>Hip-Hop & Urban</option>
                    <option>Jazz & Lírico</option>
                    <option>Zumba & Fitness</option>
                    <option>Flamenco</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nivel</label>
                  <select value={form.nivel} onChange={set('nivel')}>
                    <option value="">Tu nivel actual</option>
                    <option>Principiante (sin experiencia)</option>
                    <option>Básico (algo de experiencia)</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>¿Cuál es tu objetivo?</label>
                  <select value={form.objetivo} onChange={set('objetivo')}>
                    <option value="">Selecciona un objetivo</option>
                    <option>Aprender a bailar desde cero</option>
                    <option>Mejorar mi técnica</option>
                    <option>Fitness y bienestar</option>
                    <option>Competir profesionalmente</option>
                    <option>Disfrutar como hobby</option>
                  </select>
                </div>
                <div className="modal-nav">
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Atrás</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (validateStep1()) setStep(2) }}>
                    Continuar →
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="modal-title">Elige tu <span className="gold">horario</span></h2>
                <p className="modal-sub">¿Cuándo prefieres venir? Te contactaremos para confirmar tu clase.</p>
                <div className="form-group">
                  <label>Día preferido</label>
                  <select value={form.dia} onChange={set('dia')}>
                    <option value="">Selecciona un día</option>
                    <option>Lunes</option><option>Martes</option><option>Miércoles</option>
                    <option>Jueves</option><option>Viernes</option><option>Sábado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Horario preferido</label>
                  <select value={form.horario} onChange={set('horario')}>
                    <option value="">Selecciona un horario</option>
                    <option>Mañana (7am – 12pm)</option>
                    <option>Tarde (12pm – 6pm)</option>
                    <option>Noche (6pm – 10pm)</option>
                  </select>
                </div>
                <div className="modal-nav">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Atrás</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Enviando...' : '✦ Reservar mi clase gratis'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}