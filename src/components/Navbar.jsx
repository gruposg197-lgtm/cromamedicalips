import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import './Navbar.css'

const LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Programas', to: '/programas' },
  { label: 'Sedes', to: '/sedes' },
  { label: 'Seguridad del paciente', to: '/seguridad-del-paciente' },
  { label: 'PQRSF', to: '/pqrsf' },
  { label: 'Contacto', to: '/contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <Logo />
        </NavLink>

        <button
          className={`navbar-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-nav ${open ? 'is-open' : ''}`}>
          <ul>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <button
              type="button"
              className="navbar-portal"
              onClick={() => {
                setOpen(false)
                navigate('/portal')
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Portal
            </button>
            <button
              type="button"
              className="btn btn-navy btn-sm"
              onClick={() => {
                setOpen(false)
                navigate('/contacto')
              }}
            >
              Agendar atención
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
