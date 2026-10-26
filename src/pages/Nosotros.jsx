const VALUES = [
  { n: '01', title: 'Excelencia médica', text: 'Compromiso con la mejora continua y la atención de alta calidad.' },
  { n: '02', title: 'Calidez humana', text: 'Trato amable, respetuoso y empático hacia nuestros pacientes.' },
  { n: '03', title: 'Responsabilidad social', text: 'Contribución activa al bienestar de la comunidad y el medio ambiente.' },
  { n: '04', title: 'Ética y transparencia', text: 'Conducta íntegra y responsable en todas nuestras acciones.' },
  { n: '05', title: 'Innovación', text: 'Incorporación de los últimos avances tecnológicos y científicos.' },
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
          Croma Medical IPS presta servicios integrales de salud en diversas especialidades, con un equipo
          multidisciplinario y un enfoque humanizado, innovador y de alta calidad, especializado en enfermedades
          huérfanas y de alto costo.
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
          <p>
            Proveer atención integral y especializada en salud ocupacional, medicina laboral, procesos de
            rehabilitación y manejo de enfermedades huérfanas y de alto costo, promoviendo el bienestar de nuestros
            pacientes con un enfoque humanizado, innovador y de alta calidad.
          </p>
        </div>
        <div className="mv-card is-dark">
          <span className="eyebrow">Visión</span>
          <p>
            Para el 2030, ser líderes en el sector salud, reconocidos por nuestros modelos de atención integrales,
            innovadores y efectivos, y como referente en la gestión de enfermedades huérfanas y de alto costo.
          </p>
        </div>
      </section>

      <section className="bg-soft-between">
        <div className="container page-section">
          <h2 style={{ fontSize: 32, textAlign: 'center' }}>Nuestros valores</h2>
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
          <h2 style={{ fontSize: 32 }}>Modelo de atención transdisciplinario</h2>
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
    </>
  )
}
