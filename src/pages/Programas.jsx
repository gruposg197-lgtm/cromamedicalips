import { Link } from 'react-router-dom'
import { IconCheck } from '../components/icons'

const QUICK_LIST = [
  'Medicina general',
  'Telexperticia',
  'Medicina internista',
  'Salud ocupacional',
  'Seguridad y Salud en el Trabajo (SST)',
  'Rehabilitación',
  'Medicina especializada',
  'Salud mental',
  'Exámenes de laboratorio',
  'Enfermería',
  'Home Care especializado',
  'Promoción y Prevención',
  'Nutrición y dietética',
  'Vacunación',
  'Servicio farmacéutico',
  'Vitales No Disponibles (VND)',
  'Enfermedades huérfanas',
]

const TAGS = [
  'Angioedema Hereditario',
  'Alcaptonuria',
  'Enf. de Gaucher',
  'Enf. de Wilson',
  'Artritis Reumatoide',
  'Coagulopatías',
  'Enf. de Fabry',
  'Enf. de Pompe',
  'HPN',
  'Esclerosis Múltiple',
]

export default function Programas() {
  return (
    <>
      <section className="container page-hero page-intro" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Programas</span>
        <h1>Nuestros servicios</h1>
        <p>
          Servicios médicos especializados de alta calidad, con un enfoque integral que incluye prevención,
          diagnóstico, tratamiento, rehabilitación y acompañamiento.
        </p>
      </section>

      <section className="container" style={{ paddingTop: 20 }}>
        <div className="pills-grid">
          {QUICK_LIST.map((item) => (
            <div className="pill-item" key={item}>
              <span className="dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: '60px 40px 96px', display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1120 }}>
        <ProgramDetail
          tag="Prevención y trabajo"
          title="Salud Preventiva y Medicina Ocupacional"
          text="Evaluaciones y exámenes médicos ocupacionales con énfasis en la salud y seguridad del trabajador."
          image="https://images.unsplash.com/photo-1666887360680-9dc27a1d2753?auto=format&fit=crop&w=900&q=80"
          alt="Salud Preventiva y Medicina Ocupacional"
          items={[
            'Evaluaciones ocupacionales: ingreso, periódico, egreso y reintegro',
            'Exámenes en alturas, espacios confinados y manipulación de alimentos',
            'Audiometría, optometría, espirometría y electrocardiografía',
            'Bioanalítica básica y especializada',
            'Psicología ocupacional y baterías psicológicas',
            'Psicosensométricos, test de fobias y test para espacios confinados',
            'Diseño, interventoría y auditoría de Sistemas de Gestión de Seguridad y Salud en el Trabajo (SG-SST)',
            'Asesoría ambiental, mediciones y saneamiento ambiental',
          ]}
        />

        <ProgramDetail
          reverse
          tag="Recuperación"
          title="Rehabilitación y Medicina Laboral"
          text="Procesos de rehabilitación y medicina laboral para recuperar la funcionalidad y el bienestar."
          image="https://images.unsplash.com/photo-1772122028843-9139d23af4fb?auto=format&fit=crop&w=900&q=80"
          alt="Rehabilitación y Medicina Laboral"
          items={[
            'Evaluaciones médicas laborales especializadas',
            'Fisiatría y fisioterapia',
            'Terapia física, ocupacional y respiratoria',
            'Apoyo psicológico integral',
          ]}
        />

        <ProgramDetail
          tag="En casa"
          title="Asistencia y Acompañamiento"
          text="Home Care especializado: atención en casa y a distancia para un cuidado continuo, cómodo y cercano."
          image="https://images.unsplash.com/photo-1765896387387-0538bc9f997e?auto=format&fit=crop&w=900&q=80"
          alt="Asistencia y Acompañamiento"
          items={[
            'Home Care especializado: enfermería domiciliaria con seguimiento clínico',
            'Terapia domiciliaria en diversas especialidades',
            'Telexperticia: telemedicina con enfoque de expertis para consultas y seguimientos remotos',
          ]}
        />

        <ProgramDetail
          reverse
          tag="Especializada"
          title="Medicina y Servicios Especializados"
          text="Atención médica general y especializada para el manejo de afecciones complejas."
          image="https://images.unsplash.com/photo-1758691461935-202e2ef6b69f?auto=format&fit=crop&w=900&q=80"
          alt="Medicina Especializada"
          items={[
            'Medicina general con enfoque en prevención y diagnóstico temprano',
            'Medicina interna para afecciones complejas',
            'Salud mental',
            'Atención en enfermedades huérfanas y de alto costo',
            'Nutrición y dietética',
            'Vacunación',
            'Servicio farmacéutico y dispensación de medicamentos',
            'Gestión e importación de medicamentos Vitales No Disponibles (VND)',
            'Dispositivos médicos',
          ]}
        />

        {/* Enfermedades huérfanas - dark feature */}
        <div className="program-detail is-dark">
          <div className="program-detail-image">
            <img
              src="https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=900&q=80"
              style={{ opacity: 0.92 }}
              alt="Enfermedades Huérfanas"
            />
          </div>
          <div className="program-detail-body">
            <div className="tag">Diagnósticos complejos</div>
            <h2>Enfermedades Huérfanas</h2>
            <p>
              Sólida experiencia en el tratamiento de enfermedades huérfanas, con atención integral y personalizada
              mediante un modelo interdisciplinario.
            </p>
            <ul className="check-list">
              <li><IconCheck size={18} />Abordaje integral considerando variables individuales y fenotipos</li>
              <li><IconCheck size={18} />Diagnósticos precisos y personalizados</li>
              <li><IconCheck size={18} />Cuidado paliativo y soporte terapéutico continuo</li>
              <li><IconCheck size={18} />Empoderamiento y autocuidado para pacientes y familias</li>
              <li><IconCheck size={18} />Integración de redes y coordinación con el sistema de salud</li>
              <li><IconCheck size={18} />Farmacovigilancia y manejo integral de medicamentos</li>
              <li><IconCheck size={18} />Gestión e importación de medicamentos Vitales No Disponibles (VND)</li>
            </ul>
            <div className="tag-cloud">
              <div className="tag-cloud-label">Algunas patologías tratadas</div>
              <div className="tag-cloud-items">
                {TAGS.map((t) => (
                  <span className="tag-chip" key={t}>{t}</span>
                ))}
              </div>
              <div className="tag-cloud-note">
                Más de 6.000 enfermedades huérfanas en el mundo, el 80% de origen genético · 2.198 reconocidas en
                Colombia (Res. 5265 de 2018).
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Link to="/contacto" className="btn btn-navy">
            Solicitar atención en un programa
          </Link>
        </div>
      </section>
    </>
  )
}

function ProgramDetail({ tag, title, text, image, alt, items, reverse }) {
  const body = (
    <div className="program-detail-body">
      <div className="tag">{tag}</div>
      <h2>{title}</h2>
      <p>{text}</p>
      <ul className="check-list">
        {items.map((item) => (
          <li key={item}>
            <IconCheck size={18} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )

  const imageBlock = (
    <div className="program-detail-image">
      <img src={image} alt={alt} />
    </div>
  )

  return (
    <div className={`program-detail ${reverse ? 'is-reverse' : ''}`}>
      {reverse ? (
        <>
          {body}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {body}
        </>
      )}
    </div>
  )
}
