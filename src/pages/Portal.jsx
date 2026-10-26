import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { IconCheck, IconCloud, IconDownload } from '../components/icons'

const ATENCIONES = [
  { date: '18 Jul 2026', type: 'Control programado', prof: 'Dra. Laura Méndez · Hematología', estado: 'Próxima', color: '#1d289c', bg: 'rgba(29,40,156,.12)' },
  { date: '02 Jul 2026', type: 'Control de hematología', prof: 'Dra. Laura Méndez · Hematología', estado: 'Completada', color: '#1e7a4d', bg: 'rgba(30,122,77,.12)' },
  { date: '14 May 2026', type: 'Infusión de factor', prof: 'Enf. Carlos Ruiz', estado: 'Completada', color: '#1e7a4d', bg: 'rgba(30,122,77,.12)' },
  { date: '21 Abr 2026', type: 'Fisioterapia articular', prof: 'Ft. Ana Gómez', estado: 'Completada', color: '#1e7a4d', bg: 'rgba(30,122,77,.12)' },
]

const DOCUMENTOS = [
  { name: 'Hemograma completo.pdf', folder: 'Resultados de laboratorio', date: '02 Jul 2026', size: '340 KB', ext: 'PDF', tint: '#e2453a' },
  { name: 'Orden médica — infusión.pdf', folder: 'Órdenes médicas', date: '14 May 2026', size: '128 KB', ext: 'PDF', tint: '#e2453a' },
  { name: 'Radiografía de rodilla.jpg', folder: 'Imágenes diagnósticas', date: '21 Abr 2026', size: '2.1 MB', ext: 'JPG', tint: '#1d289c' },
  { name: 'Historia clínica — resumen.docx', folder: 'Historia clínica', date: '02 Jul 2026', size: '96 KB', ext: 'DOCX', tint: '#1d5fbf' },
  { name: 'Fórmula médica vigente.pdf', folder: 'Fórmulas', date: '14 May 2026', size: '88 KB', ext: 'PDF', tint: '#e2453a' },
]

export default function Portal() {
  const [authed, setAuthed] = useState(false)

  return authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Login onLogin={() => setAuthed(true)} />
}

function Login({ onLogin }) {
  function handleSubmit(e) {
    e.preventDefault()
    onLogin()
  }

  return (
    <section className="container portal-login">
      <div className="portal-login-copy">
        <span className="eyebrow">Portal de pacientes</span>
        <h1>
          Tu salud,
          <br />
          en un solo lugar
        </h1>
        <p>Accede a tu historia clínica, resultados de laboratorio, citas y tratamiento de forma segura.</p>
        <ul className="portal-login-checks">
          <li><IconCheck size={18} />Resultados y órdenes médicas</li>
          <li><IconCheck size={18} />Agenda y recordatorios de citas</li>
          <li><IconCheck size={18} />Seguimiento de tu tratamiento</li>
        </ul>
      </div>

      <div className="login-card">
        <div className="login-card-head">
          <LogoMark size={26} />
          <h2>Ingreso seguro</h2>
        </div>

        <div className="onedrive-note">
          <IconCloud />
          <span>
            Tus documentos se sincronizan de forma segura desde <b>OneDrive</b>.
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="doc-number">Tipo y número de documento</label>
            <input id="doc-number" placeholder="Nº de documento" required />
          </div>
          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" placeholder="••••••••" required />
          </div>
          <div className="login-meta">
            <label>
              <input type="checkbox" style={{ accentColor: '#1d289c' }} /> Recordarme
            </label>
            <span className="forgot">¿Olvidaste tu clave?</span>
          </div>
          <button type="submit" className="login-submit">
            Ingresar
          </button>
        </form>
        <div className="login-footnote">
          ¿Primera vez?{' '}
          <Link to="/contacto">
            <span>Solicita tu acceso</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Dashboard({ onLogout }) {
  return (
    <div className="container dashboard-wrap">
      <div className="welcome-bar">
        <div className="welcome-identity">
          <div className="avatar">MR</div>
          <div>
            <div className="welcome-label">Bienvenida</div>
            <div className="welcome-name">María Fernanda Ríos</div>
            <div className="welcome-sub">C.C. 52.418.903 · Programa Hemofilia A</div>
          </div>
        </div>
        <div className="welcome-actions">
          <div className="onedrive-chip">
            <IconCloud />
            <span>OneDrive sincronizado</span>
          </div>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card is-dark">
          <div className="tag">Próxima cita</div>
          <div className="summary-value">18 Jul · 9:30 am</div>
          <div className="summary-sub">Control · Dra. Laura Méndez</div>
        </div>
        <div className="summary-card">
          <div className="tag">Último resultado</div>
          <div className="summary-value">Hemograma</div>
          <div className="summary-sub">Cargado el 02 Jul 2026</div>
        </div>
        <div className="summary-card">
          <div className="tag">Adherencia</div>
          <div className="summary-value">96%</div>
          <div className="summary-sub">Tratamiento al día</div>
        </div>
      </div>

      <div className="panels-grid">
        <div className="panel-card">
          <div className="panel-head">
            <h3>Mis atenciones</h3>
            <span className="link">Ver historial</span>
          </div>
          <div className="row-list">
            {ATENCIONES.map((a) => (
              <div className="atencion-row" key={a.date + a.type}>
                <div className="atencion-date">{a.date}</div>
                <div style={{ flex: 1 }}>
                  <div className="atencion-type">{a.type}</div>
                  <div className="atencion-prof">{a.prof}</div>
                </div>
                <span className="status-pill" style={{ color: a.color, background: a.bg }}>
                  {a.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-head">
            <div className="panel-head-left">
              <IconCloud size={22} />
              <h3>Mis documentos</h3>
            </div>
            <span className="panel-meta">Actualizado hace 5 min</span>
          </div>
          <div className="panel-sub">
            Sincronizados desde <b>OneDrive · Croma Medical</b>
          </div>
          <div className="row-list">
            {DOCUMENTOS.map((d) => (
              <div className="doc-row" key={d.name}>
                <div className="doc-icon" style={{ background: d.tint }}>
                  {d.ext}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="doc-name">{d.name}</div>
                  <div className="doc-meta">
                    {d.folder} · {d.date} · {d.size}
                  </div>
                </div>
                <span className="doc-download" title="Descargar">
                  <IconDownload size={19} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
