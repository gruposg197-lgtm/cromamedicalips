import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo dark />
          <p className="footer-about">
            IPS especializada en enfermedades huérfanas y de alto costo. Prestación integral de servicios de salud,
            humana y confiable.
          </p>
        </div>

        <div>
          <div className="footer-heading">Programas</div>
          <ul className="footer-links">
            <li><Link to="/programas">Enfermedades huérfanas y de alto costo</Link></li>
            <li><Link to="/programas">Salud ocupacional</Link></li>
            <li><Link to="/programas">Rehabilitación y medicina laboral</Link></li>
            <li><Link to="/programas">Asistencia y acompañamiento</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-heading">Institución</div>
          <ul className="footer-links">
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/sedes">Sedes</Link></li>
            <li><Link to="/portal">Portal de pacientes</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer-heading">Contacto</div>
          <ul className="footer-links footer-contact">
            <li>+57 310 589 5425</li>
            <li>comercial@cromamedical.com</li>
            <li>Cra 45A # 103-44, Piso 1 · Bogotá</li>
            <li><Link to="/contacto" className="footer-cta">Agendar atención →</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} Croma Medical · Salud Integral. Todos los derechos reservados.</span>
          <span>Habilitados ante la Secretaría de Salud · Colombia</span>
        </div>
      </div>
    </footer>
  )
}
