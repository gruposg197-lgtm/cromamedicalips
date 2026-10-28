import { Link } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { IconHeart, IconShield, IconUsers, IconProgress } from '../components/icons'
import AliadosCarousel from '../components/AliadosCarousel'

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="container hero">
        <div>
          <span className="badge-pill">Salud integral · Enfermedades huérfanas y bienestar laboral</span>
          <h1 className="hero-copy-h1">
            Cuidamos lo que más importa,
            <br />
            de forma <span className="accent">integral</span>.
          </h1>
          <p>
            Prestación integral de servicios de salud con un equipo multidisciplinario: enfermedades huérfanas y de
            alto costo, salud ocupacional y medicina laboral, rehabilitación, asistencia domiciliaria y telexperticia,
            y medicina general y especializada — desde la prevención hasta el acompañamiento continuo.
          </p>
          <div className="hero-actions">
            <Link to="/contacto" className="btn btn-navy">
              Solicitar atención
            </Link>
            <Link to="/programas" className="btn btn-outline">
              Conocer programas →
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">+2.198</div>
              <div className="hero-stat-label">enfermedades huérfanas cubiertas en Colombia</div>
            </div>
            <div className="hero-stat-divider" />
            <div>
              <div className="hero-stat-value">5</div>
              <div className="hero-stat-label">líneas de servicio integral</div>
            </div>
            <div className="hero-stat-divider" />
            <div>
              <div className="hero-stat-value">Bogotá</div>
              <div className="hero-stat-label">Colombia</div>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-art-image">
            <img
              src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=900&q=80"
              alt="Profesional de la salud acompañando a un paciente"
            />
          </div>
          <div className="hero-float-card">
            <div className="hero-float-icon">
              <IconHeart color="#1d289c" />
            </div>
            <div>
              <div className="hero-float-title">Atención humana y continua</div>
              <div className="hero-float-sub">seguimiento personalizado</div>
            </div>
          </div>
        </div>
      </section>

      <AliadosCarousel />

      {/* TRUST STRIP */}
      <div className="bg-soft-between">
        <div className="container trust-strip">
          <span className="label">Programas:</span>
          <span>Enfermedades huérfanas y de alto costo</span>
          <span className="dot">•</span>
          <span>Salud ocupacional</span>
          <span className="dot">•</span>
          <span>Rehabilitación y medicina laboral</span>
          <span className="dot">•</span>
          <span>Asistencia y acompañamiento</span>
          <span className="dot">•</span>
          <span>Medicina y servicios especializados</span>
          <span className="habilitado">Habilitados ante la Secretaría de Salud</span>
        </div>
      </div>

      {/* QUIENES SOMOS */}
      <section className="container page-section split">
        <div className="split-image">
          <img
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=900&q=80"
            alt="Equipo médico de Croma Medical"
          />
        </div>
        <div>
          <span className="eyebrow">Quiénes somos</span>
          <h2 style={{ fontSize: 40, lineHeight: 1.12, marginTop: 16 }}>Más que una IPS: un grupo de salud integral</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginTop: 22 }}>
            Croma Medical es un grupo de salud integral que va más allá de la consulta médica: combinamos nuestra IPS
            especializada en enfermedades huérfanas y de alto costo con programas de salud ocupacional y medicina
            laboral, seguridad y salud en el trabajo (SST), rehabilitación, home care, servicio farmacéutico y
            medicina general y especializada — acompañando a personas y empresas desde la prevención hasta el
            cuidado continuo.
          </p>
          <div className="feature-grid">
            <Feature title="Modelo integral" sub="clínico, terapéutico y humano" />
            <Feature title="Equipos expertos" sub="multidisciplinarios y dedicados" />
            <Feature title="Trazabilidad" sub="seguridad en cada proceso" />
            <Feature title="Cercanía" sub="acompañamiento continuo" />
          </div>
          <Link to="/nosotros" className="link-arrow">
            Conocer más sobre nosotros →
          </Link>
        </div>
      </section>

      {/* PROGRAMAS */}
      <section className="bg-soft">
        <div className="container page-section">
          <div className="section-heading centered">
            <span className="eyebrow">Programas</span>
            <h2>Servicios integrales, en cada etapa</h2>
          </div>

          <div className="programs-grid">
            <article className="program-card">
              <div className="program-card-image">
                <img
                  src="https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=700&q=80"
                  alt="Enfermedades Huérfanas"
                />
              </div>
              <div className="program-card-body">
                <div className="tag">Alto costo · Huérfanas</div>
                <h3>Enfermedades Huérfanas</h3>
                <p>Atención integral y personalizada para condiciones poco frecuentes y de alto costo.</p>
              </div>
            </article>

            <article className="program-card">
              <div className="program-card-image">
                <img
                  src="https://images.unsplash.com/photo-1666887360680-9dc27a1d2753?auto=format&fit=crop&w=700&q=80"
                  alt="Salud Ocupacional"
                />
              </div>
              <div className="program-card-body">
                <div className="tag">Prevención y trabajo</div>
                <h3>Salud Ocupacional</h3>
                <p>Evaluaciones médicas ocupacionales, exámenes especializados y medicina laboral.</p>
              </div>
            </article>

            <article className="program-card is-dark">
              <div className="program-card-image">
                <img
                  src="https://images.unsplash.com/photo-1772122028843-9139d23af4fb?auto=format&fit=crop&w=700&q=80"
                  style={{ opacity: 0.9 }}
                  alt="Rehabilitación y Acompañamiento"
                />
              </div>
              <div className="program-card-body">
                <div className="tag">Cuidado continuo</div>
                <h3>Rehabilitación y Acompañamiento</h3>
                <p>Fisioterapia, terapias, enfermería domiciliaria y telexperticia (telemedicina con enfoque de expertis).</p>
              </div>
            </article>

            <article className="program-card">
              <div className="program-card-image">
                <img
                  src="https://images.unsplash.com/photo-1758691461935-202e2ef6b69f?auto=format&fit=crop&w=700&q=80"
                  alt="Medicina y Servicios Especializados"
                />
              </div>
              <div className="program-card-body">
                <div className="tag">Especializada</div>
                <h3>Medicina y Servicios Especializados</h3>
                <p>Medicina general, medicina interna y dispositivos médicos para el manejo de afecciones complejas.</p>
              </div>
            </article>
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/programas" className="btn btn-outline">
              Ver todos los programas
            </Link>
          </div>
        </div>
      </section>

      {/* MODELO / PILARES */}
      <section className="container page-section split" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
        <div>
          <span className="eyebrow">Nuestro modelo</span>
          <h2 style={{ fontSize: 40, lineHeight: 1.12, marginTop: 16 }}>Un cuidado que gira alrededor del paciente</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginTop: 22 }}>
            Cuatro pilares sostienen cada decisión clínica y cada interacción con nuestros pacientes.
          </p>
        </div>
        <div className="pillars-grid">
          <Pillar Icon={IconHeart} title="Centrado en la persona" text="Decisiones que consideran al paciente y su familia." />
          <Pillar Icon={IconUsers} title="Equipos multidisciplinarios" text="Especialistas coordinados en torno a un plan común." />
          <Pillar Icon={IconShield} title="Trazabilidad y seguridad" text="Procesos verificables en cada etapa del tratamiento." />
          <Pillar Icon={IconProgress} title="Acompañamiento continuo" text="Seguimiento y educación durante todo el proceso." />
        </div>
      </section>

      {/* PORTAL CTA */}
      <section className="container" style={{ marginBottom: 96 }}>
        <div className="portal-cta">
          <div className="portal-cta-decor">
            <LogoMark color="#ffffff" size={360} />
          </div>
          <div style={{ position: 'relative' }}>
            <span className="eyebrow" style={{ color: 'var(--sky)' }}>
              Portal de pacientes
            </span>
            <h2>Tu historia clínica, siempre a la mano</h2>
            <p>Consulta resultados, agenda citas y sigue tu tratamiento desde cualquier lugar, de forma segura.</p>
          </div>
          <div className="portal-cta-actions">
            <Link to="/portal" className="btn btn-white">
              Ingresar al portal
            </Link>
            <Link to="/contacto" className="text-link">
              Solicitar mi acceso →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Feature({ title, sub }) {
  return (
    <div className="feature-item">
      <div className="feature-dot" />
      <div>
        <div className="feature-title">{title}</div>
        <div className="feature-sub">{sub}</div>
      </div>
    </div>
  )
}

function Pillar({ Icon, title, text }) {
  return (
    <div className="pillar-card">
      <div className="pillar-icon">
        <Icon size={22} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}
