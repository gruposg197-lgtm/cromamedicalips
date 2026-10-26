import { useState } from 'react'
import { IconPause, IconPlay } from './icons'
import './AliadosCarousel.css'

const ALIADOS = [
  { name: 'Positiva', file: 'positiva.png' },
  { name: 'Sura', file: 'sura.png' },
  { name: 'Escuela Militar', file: 'escuela-militar.png' },
  { name: 'Famisanar', file: 'famisanar.png' },
  { name: 'Convida', file: 'convida.png' },
  { name: 'Gobernación de Boyacá', file: 'gobernacion-boyaca.png' },
  { name: 'Inpec', file: 'inpec.png' },
  { name: 'Empucol', file: 'empucol.png' },
]

export default function AliadosCarousel() {
  const [paused, setPaused] = useState(false)

  return (
    <section className="aliados-section" aria-label="Nuestros aliados">
      <div className="aliados-track-wrap">
        <div className={`aliados-track ${paused ? 'is-paused' : ''}`}>
          {[...ALIADOS, ...ALIADOS].map((aliado, i) => (
            <span className="aliado-item" key={`${aliado.file}-${i}`}>
              <img
                src={`/aliados/${aliado.file}`}
                alt={aliado.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'inline'
                }}
              />
              <span className="aliado-fallback">{aliado.name}</span>
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="aliados-toggle"
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? 'Reanudar animación' : 'Pausar animación'}
      >
        {paused ? <IconPlay size={14} /> : <IconPause size={14} />}
      </button>
    </section>
  )
}
