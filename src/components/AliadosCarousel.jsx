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

// Un "set" se repite varias veces para que el ancho total supere el de
// cualquier pantalla (incluso ultrawide) y la animación nunca muestre
// espacios en blanco antes de reiniciar el ciclo.
const SET = Array(3).fill(ALIADOS).flat()

export default function AliadosCarousel() {
  return (
    <section className="aliados-section" aria-label="Nuestros aliados">
      <div className="aliados-track-wrap">
        <div className="aliados-track">
          {[...SET, ...SET].map((aliado, i) => (
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
    </section>
  )
}
