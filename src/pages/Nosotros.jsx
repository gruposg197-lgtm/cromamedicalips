import PoliticasAccordion from '../components/PoliticasAccordion'

const VALUES = [
  {
    n: '01',
    title: 'Ética',
    text: 'Actuamos con honestidad y transparencia en cada atención, protegemos la confidencialidad del paciente y cumplimos la normatividad en salud, aun cuando nadie nos esté observando.',
  },
  {
    n: '02',
    title: 'Pasión',
    text: 'Atendemos a cada paciente con calidez, empatía y entusiasmo, y vamos un paso más allá para que se sienta escuchado, cuidado y seguro.',
  },
  {
    n: '03',
    title: 'Excelencia',
    text: 'Seguimos protocolos de calidad y seguridad del paciente, nos actualizamos de forma permanente y revisamos nuestro trabajo para hacerlo bien desde la primera vez.',
  },
  {
    n: '04',
    title: 'Trabajo en equipo',
    text: 'Compartimos información a tiempo, apoyamos a nuestros compañeros entre áreas y ponemos el bienestar del paciente por encima de los intereses individuales.',
  },
  {
    n: '05',
    title: 'Postura de dueño',
    text: 'Asumimos la responsabilidad de nuestros resultados, cuidamos los recursos de Croma Medical como propios y proponemos soluciones en lugar de esperar a que otros resuelvan.',
  },
]

const MODEL = [
  { title: 'Abordaje integral', text: 'Consideramos variables individuales y fenotipos de cada paciente.' },
  { title: 'Diagnósticos precisos', text: 'Evaluación personalizada para un diagnóstico certero y oportuno.' },
  { title: 'Soporte continuo', text: 'Servicios de cuidado paliativo y soporte terapéutico permanente.' },
  { title: 'Empoderamiento', text: 'Autocuidado para pacientes y sus familias a lo largo del tratamiento.' },
  { title: 'Integración de redes', text: 'Coordinación entre los actores del sistema de salud.' },
  { title: 'Farmacovigilancia', text: 'Manejo integral y seguimiento de medicamentos.' },
]

export default function Nosotros() {
  return (
    <>
      <section className="container page-hero page-intro">
        <span className="eyebrow">Nosotros</span>
        <h1>Salud que conecta ciencia y humanidad</h1>
        <p>
          Croma Medical es un grupo de salud integral: una IPS especializada en enfermedades huérfanas y de alto
          costo, junto con programas de salud ocupacional, SST, rehabilitación, home care y bienestar laboral para
          personas y empresas, con un equipo multidisciplinario y un enfoque humanizado, innovador y de alta calidad.
        </p>
      </section>

      <section className="container" style={{ paddingTop: 40 }}>
        <div className="split-image" style={{ height: 420 }}>
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80"
            alt="Instalaciones de Croma Medical"
          />
        </div>
      </section>

      <section className="container page-section mv-grid">
        <div className="mv-card">
          <span className="eyebrow">Misión</span>
          <p style={{ textAlign: 'justify' }}>
            <strong>Croma Medical IPS</strong> brinda atención integral, segura, humanizada y oportuna, centrada en
            las personas. Mediante un modelo interdisciplinario que integra consulta médica, rehabilitación, apoyo
            diagnóstico, atención domiciliaria, medicina laboral y programas especializados para enfermedades de
            alto costo y enfermedades huérfanas, contribuyendo al bienestar y la calidad de vida de la población
            atendida y de nuestros colaboradores.
          </p>
        </div>
        <div className="mv-card is-dark">
          <span className="eyebrow">Visión</span>
          <p style={{ textAlign: 'justify' }}>
            Para el año 2030, <strong>Croma Medical IPS S.A.S.</strong> será reconocida en Colombia como la IPS de
            referencia en la atención integral ambulatoria y domiciliaria de pacientes con patologías de alto costo
            y enfermedades huérfanas, destacándose por la acreditación en salud, la transformación digital de sus
            procesos asistenciales y la innovación en modelos de rehabilitación e intervención interdisciplinaria,
            consolidando un modelo asistencial basado en evidencia científica, gestión del riesgo, analítica de
            datos, mejora continua y sostenibilidad institucional, que garantice la seguridad, la satisfacción y
            experiencias humanizadas de confianza para sus usuarios, colaboradores, aseguradores y aliados
            estratégicos.
          </p>
        </div>
      </section>

      <section className="bg-soft-between">
        <div className="container page-section">
          <h2 style={{ fontSize: 32, textAlign: 'center' }}>Nuestros valores</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 10 }}>
            Las conductas no negociables que esperamos de cada persona.
          </p>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="value-card" key={v.n}>
                <div className="value-number">{v.n}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div style={{ maxWidth: 640 }}>
          <h2 style={{ fontSize: 32 }}>Modelo de atención interdisciplinario</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginTop: 16 }}>
            Un abordaje integral que coordina especialistas, terapias y redes de salud alrededor de cada paciente y su
            familia.
          </p>
        </div>
        <div className="model-grid">
          {MODEL.map((m) => (
            <div className="model-card" key={m.title}>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-soft-between">
        <div className="container page-section split">
          <div className="split-image" style={{ height: 'auto', alignSelf: 'start' }}>
            <img
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=900&q=80"
              alt="Políticas institucionales de Croma Medical"
            />
          </div>
          <div>
            <span className="eyebrow">Políticas institucionales</span>
            <h2 style={{ fontSize: 32, marginTop: 16, marginBottom: 24 }}>Nuestro compromiso institucional</h2>
            <PoliticasAccordion />
          </div>
        </div>
      </section>
    </>
  )
}
