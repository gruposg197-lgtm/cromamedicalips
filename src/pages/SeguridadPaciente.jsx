import { Link } from 'react-router-dom'
import { IconCheck, IconShield, IconUsers, IconProgress, IconPhone, IconMail } from '../components/icons'

const OBJETIVOS = [
  { Icon: IconShield, title: 'Cultura de seguridad', text: 'Promovemos un entorno donde reportar y prevenir incidentes es parte de la atención diaria.' },
  { Icon: IconUsers, title: 'Equipo comprometido', text: 'Todo el personal asistencial se forma y evalúa en prácticas seguras de atención.' },
  { Icon: IconCheck, title: 'Prácticas seguras', text: 'Aplicamos protocolos verificables en identificación, medicamentos e infecciones.' },
  { Icon: IconProgress, title: 'Mejora continua', text: 'Analizamos cada evento para fortalecer procesos y prevenir su repetición.' },
]

const PRACTICAS = [
  'Identificación correcta del paciente en cada atención',
  'Uso seguro de medicamentos y conciliación farmacológica',
  'Prevención y vigilancia de infecciones asociadas a la atención',
  'Prevención de caídas y otros eventos adversos',
  'Comunicación efectiva entre el equipo multidisciplinario',
  'Consentimiento informado antes de procedimientos',
]

const DERECHOS = [
  'Recibir atención digna, respetuosa y de calidad',
  'Conocer el estado de salud y las opciones de tratamiento',
  'Acceder a su historia clínica',
  'Recibir información clara antes de autorizar un procedimiento',
  'Confidencialidad de su información personal y clínica',
  'Presentar quejas, reclamos o sugerencias sin temor a represalias',
]

const DEBERES = [
  'Suministrar información veraz sobre su estado de salud',
  'Seguir las indicaciones del equipo tratante',
  'Cuidar las instalaciones y respetar al personal y a otros pacientes',
  'Informar oportunamente cualquier evento o riesgo que identifique',
  'Cumplir con las citas programadas o cancelarlas con anticipación',
  'Hacer uso responsable de los servicios de salud',
]

export default function SeguridadPaciente() {
  return (
    <>
      <section className="container page-hero page-intro" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Seguridad del paciente</span>
        <h1>Tu seguridad es el centro de cada decisión clínica</h1>
        <p>
          En Croma Medical IPS trabajamos bajo una política de seguridad del paciente que busca prevenir, identificar
          y gestionar los riesgos asociados a la atención en salud, garantizando una experiencia segura en cada etapa
          del proceso.
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
          <span className="eyebrow">Prácticas seguras</span>
          <h2 style={{ fontSize: 32, marginTop: 16 }}>Protocolos que aplicamos en cada atención</h2>
        </div>
        <ul className="check-list" style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 32px', maxWidth: 920 }}>
          {PRACTICAS.map((item) => (
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
            <span className="eyebrow">Derechos del paciente</span>
            <ul className="check-list" style={{ marginTop: 18 }}>
              {DERECHOS.map((item) => (
                <li key={item}>
                  <IconCheck size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mv-card is-dark">
            <span className="eyebrow">Deberes del paciente</span>
            <ul className="check-list" style={{ marginTop: 18 }}>
              {DEBERES.map((item) => (
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
        <span className="eyebrow">Reporta un evento</span>
        <h2 style={{ fontSize: 32, marginTop: 16 }}>¿Identificaste un riesgo o un evento adverso?</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginTop: 16 }}>
          Tu reporte nos ayuda a mejorar. Puedes comunicarte directamente con nuestro equipo de seguridad del paciente
          o radicar tu PQRSF a través de los siguientes canales.
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
              <div className="contact-item-label">Correo</div>
              <div className="contact-item-value">comercial@cromamedical.com</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <Link to="/contacto" className="btn btn-navy">
            Reportar un evento →
          </Link>
        </div>
      </section>
    </>
  )
}
