import { useState } from 'react'
import { IconCheck, IconMail, IconClock, IconShield, IconProgress, IconPhone } from '../components/icons'
import { submitPqrsf } from '../lib/api'

const TIPOS_SOLICITUD = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Felicitación', 'Consulta']

const OBJETIVOS = [
  { Icon: IconMail, title: 'Canales accesibles', text: 'Varios canales disponibles para que te comuniques con nosotros como prefieras.' },
  { Icon: IconClock, title: 'Respuesta oportuna', text: 'Atendemos cada solicitud dentro de los términos legales establecidos.' },
  { Icon: IconShield, title: 'Confidencialidad', text: 'Tu información se maneja con total reserva y respeto.' },
  { Icon: IconProgress, title: 'Mejora continua', text: 'Cada PQRSF se analiza para fortalecer nuestros procesos y servicios.' },
]

const TIPOS = [
  'Petición: solicitud de información, documentos o trámites',
  'Queja: inconformidad por la atención recibida',
  'Reclamo: exigencia de solución a un problema concreto',
  'Sugerencia: propuesta de mejora para nuestros servicios',
  'Felicitación: reconocimiento a nuestro equipo',
  'Consulta: dudas sobre nuestros servicios o procesos',
]

const TIEMPOS = [
  'Peticiones generales: 15 días hábiles',
  'Solicitudes de documentos o información: 10 días hábiles',
  'Peticiones de información reservada o clasificada: 5 días hábiles',
  'Consultas: 30 días hábiles',
]

const REQUISITOS = [
  'Datos completos de contacto: nombre, documento, teléfono y correo',
  'Descripción clara y concreta de tu solicitud',
  'Documentos o soportes relacionados, si aplica',
  'Autorización de tratamiento de datos personales',
]

export default function Pqrsf() {
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
      await submitPqrsf(payload)
      setStatus('sent')
      form.reset()
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="container page-hero page-intro" style={{ maxWidth: 760 }}>
        <span className="eyebrow">PQRSF</span>
        <h1>Tu voz nos ayuda a mejorar</h1>
        <p>
          En Croma Medical IPS contamos con un sistema de Peticiones, Quejas, Reclamos, Sugerencias y Felicitaciones
          (PQRSF) para que puedas comunicarte con nosotros de forma rápida, clara y segura.
        </p>
      </section>

      <section className="bg-soft-between">
        <div className="container page-section">
          <h2 style={{ fontSize: 32, textAlign: 'center' }}>Nuestros objetivos</h2>
          <div className="pillars-grid">
            {OBJETIVOS.map((o) => (
              <div className="pillar-card" key={o.title}>
                <div className="pillar-icon">
                  <o.Icon size={22} />
                </div>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div style={{ maxWidth: 640 }}>
          <span className="eyebrow">Qué puedes radicar</span>
          <h2 style={{ fontSize: 32, marginTop: 16 }}>Tipos de solicitud que atendemos</h2>
        </div>
        <ul className="check-list" style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 32px', maxWidth: 920 }}>
          {TIPOS.map((item) => (
            <li key={item}>
              <IconCheck size={18} />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-soft-between">
        <div className="container page-section mv-grid">
          <div className="mv-card">
            <span className="eyebrow">Tiempos de respuesta</span>
            <ul className="check-list" style={{ marginTop: 18 }}>
              {TIEMPOS.map((item) => (
                <li key={item}>
                  <IconCheck size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mv-card is-dark">
            <span className="eyebrow">Qué necesitamos de ti</span>
            <ul className="check-list" style={{ marginTop: 18 }}>
              {REQUISITOS.map((item) => (
                <li key={item}>
                  <IconCheck size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container page-section" style={{ maxWidth: 820 }}>
        <span className="eyebrow">Radica tu solicitud</span>
        <h2 style={{ fontSize: 32, marginTop: 16 }}>¿Tienes una petición, queja, reclamo o sugerencia?</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginTop: 16 }}>
          Radica tu PQRSF a través de cualquiera de nuestros canales. Nuestro equipo de calidad te responderá dentro
          de los términos establecidos.
        </p>
        <div className="contact-items" style={{ marginTop: 28 }}>
          <div className="contact-item">
            <div className="contact-icon"><IconPhone /></div>
            <div>
              <div className="contact-item-label">Línea de atención</div>
              <div className="contact-item-value">+57 310 589 5425</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><IconMail /></div>
            <div>
              <div className="contact-item-label">Correo de calidad</div>
              <div className="contact-item-value">calidad@cromamedical.com</div>
            </div>
          </div>
        </div>

        <div className="contact-form-card" style={{ marginTop: 36 }}>
          <h2>Formulario de PQRSF</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="pq-name">Nombre</label>
                <input id="pq-name" name="name" placeholder="Tu nombre" required />
              </div>
              <div className="form-field">
                <label htmlFor="pq-doc">Documento</label>
                <input id="pq-doc" name="doc" placeholder="Nº de documento" required />
              </div>
              <div className="form-field">
                <label htmlFor="pq-phone">Teléfono</label>
                <input id="pq-phone" name="phone" type="tel" placeholder="Celular" required />
              </div>
              <div className="form-field">
                <label htmlFor="pq-email">Correo</label>
                <input id="pq-email" name="email" type="email" placeholder="correo@ejemplo.com" required />
              </div>
              <div className="form-field full">
                <label htmlFor="pq-tipo">Tipo de solicitud</label>
                <select id="pq-tipo" name="tipo" defaultValue={TIPOS_SOLICITUD[0]}>
                  {TIPOS_SOLICITUD.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="pq-message">Mensaje</label>
                <textarea id="pq-message" name="message" placeholder="Cuéntanos los detalles de tu solicitud" rows={3} required />
              </div>
            </div>
            <button type="submit" className="form-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar a calidad'}
            </button>
            {status === 'sent' && (
              <div className="alert-success" style={{ marginTop: 16, fontSize: 13.5, color: '#1e7a4d' }}>
                Tu solicitud fue enviada a calidad@cromamedical.com. Te responderemos dentro de los términos
                establecidos.
              </div>
            )}
            {status === 'error' && (
              <div className="alert-success" style={{ marginTop: 16, fontSize: 13.5, color: '#b42318' }}>
                No pudimos enviar tu solicitud automáticamente. Escríbenos directamente a{' '}
                <a href="mailto:calidad@cromamedical.com">calidad@cromamedical.com</a>.
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  )
}
