import { Link } from 'react-router-dom'
import { IconMapPin, IconPhone, IconClock } from '../components/icons'

export default function Sedes() {
  return (
    <>
      <section className="container page-hero" style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span className="eyebrow">Sede</span>
            <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.06, marginTop: 16 }}>
              Te esperamos
              <br />
              en Bogotá
            </h1>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.6 }}>
            Nuestra sede principal en Bogotá, con atención integral para todas nuestras líneas de servicio.
          </p>
        </div>
      </section>

      <section className="container" style={{ padding: '44px 40px 96px', maxWidth: 1120 }}>
        <div className="location-card">
          <div className="location-map">
            <iframe
              title="Ubicación Croma Medical IPS"
              src="https://www.google.com/maps?q=CL+41+20-39+Park+Way,+Bogot%C3%A1,+Colombia&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="location-info">
            <h3>Sede Principal</h3>
            <div className="location-details">
              <div className="detail-row">
                <IconMapPin size={19} />
                <div>
                  <strong>CL 41 20 39 Park Way</strong>
                  Bogotá, Colombia
                </div>
              </div>
              <div className="detail-row">
                <IconPhone size={19} />
                +57 310 589 5425
              </div>
              <div className="detail-row">
                <IconClock size={19} />
                Lun–Vie · 7:00 am – 6:00 pm
              </div>
            </div>
            <div className="location-cta">
              <Link to="/contacto" className="btn btn-navy btn-sm">
                Agendar en esta sede →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
