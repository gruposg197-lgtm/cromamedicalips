import { useState } from 'react'
import { IconPhone, IconMail, IconClock, IconMapPin } from '../components/icons'
import { submitContacto } from '../lib/api'

const LINES = [
  { label: 'Comercial', phone: '+57 310 589 5425', email: 'comercial@cromamedical.com' },
  { label: 'Medicina Laboral y Asistencial', phone: '+57 310 284 9173', email: 'asistencial@cromamedical.com' },
  { label: 'Home Care', phone: '+57 312 301 4584', email: 'homecare@cromamedical.com' },
]

const PROGRAMS = [
  'Enfermedades huérfanas y de alto costo',
  'Salud ocupacional y medicina laboral',
  'Rehabilitación y terapias',
  'Asistencia domiciliaria y telexperticia',
  'Medicina general y especializada',
  'Otro',
]

export default function Contacto() {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const payload = Object.fromEntries(new FormData(form).entries())
    setStatus('sending')
    try {
      await submitContacto(payload)
      setStatus('sent')
      form.reset()
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className="container page-section contact-grid">
      <div>
        <span className="eyebrow">Contacto</span>
        <h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', lineHeight: 1.08, marginTop: 16 }}>
          Estamos para acompañarte
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginTop: 20, maxWidth: 400 }}>
          Solicita atención, agenda una cita o resuelve tus dudas. Nuestro equipo te responderá lo antes posible.
        </p>

        <div className="contact-lines">
          {LINES.map((line) => (
            <div className="contact-line" key={line.label}>
              <div className="contact-line-label">{line.label}</div>
              {line.phone && (
                <div className="contact-line-value">
                  <IconPhone size={15} />
                  {line.phone}
                </div>
              )}
              {line.email && (
                <div className="contact-line-value">
                  <IconMail size={15} />
                  {line.email}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="contact-items">
          <div className="contact-item">
            <div className="contact-icon"><IconClock /></div>
            <div>
              <div className="contact-item-label">Horario</div>
              <div className="contact-item-value">Lun a Vie · 7:00 am – 6:00 pm</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><IconMapPin /></div>
            <div>
              <div className="contact-item-label">Ubicación</div>
              <div className="contact-item-value">CL 41 20 39 Park Way · Bogotá</div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-form-card">
        <h2>Solicitar atención</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" placeholder="Tu nombre" required />
            </div>
            <div className="form-field">
              <label htmlFor="doc">Documento</label>
              <input id="doc" name="doc" placeholder="Nº de documento" required />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Teléfono</label>
              <input id="phone" name="phone" type="tel" placeholder="Celular" required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Correo</label>
              <input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required />
            </div>
            <div className="form-field full">
              <label htmlFor="program">Programa de interés</label>
              <select id="program" name="program" defaultValue={PROGRAMS[0]}>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field full">
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" name="message" placeholder="Cuéntanos cómo podemos ayudarte" rows={3} required />
            </div>
          </div>
          <button type="submit" className="form-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
          </button>
          {status === 'sent' && (
            <div className="alert-success" style={{ marginTop: 16, fontSize: 13.5, color: '#1e7a4d' }}>
              Solicitud enviada. Nuestro equipo te contactará pronto.
            </div>
          )}
          {status === 'error' && (
            <div className="alert-success" style={{ marginTop: 16, fontSize: 13.5, color: '#b42318' }}>
              No pudimos enviar tu solicitud automáticamente. Escríbenos directamente a{' '}
              <a href="mailto:direccion.medica@cromamedical.com">direccion.medica@cromamedical.com</a>.
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
