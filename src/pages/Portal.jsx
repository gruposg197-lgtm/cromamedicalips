import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { IconCheck, IconCloud, IconDownload, IconEdit, IconEye, IconKey, IconUser, IconUsers } from '../components/icons'
import {
  portalLogin,
  portalMe,
  adminListUsers,
  adminCreatePatient,
  adminCreateCompany,
  adminDeleteUser,
  adminUpdateUser,
  adminResetPassword,
  getPatientDocuments,
  getCompanyDocuments,
  previewPatientDocument,
  previewCompanyDocument,
} from '../lib/api'

const SESSION_KEY = 'croma_portal_session'

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // almacenamiento no disponible, la sesión no persiste entre recargas
  }
}

export default function Portal() {
  const [session, setSession] = useState(() => loadSession())
  const [checking, setChecking] = useState(() => !!loadSession())

  useEffect(() => {
    const stored = loadSession()
    if (!stored) return
    portalMe(stored.token)
      .catch(() => {
        setSession(null)
        saveSession(null)
      })
      .finally(() => setChecking(false))
  }, [])

  function handleLogin(newSession) {
    setSession(newSession)
    saveSession(newSession)
  }

  function handleLogout() {
    setSession(null)
    saveSession(null)
  }

  if (session && checking) {
    return (
      <div className="container" style={{ padding: '140px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Verificando sesión…
      </div>
    )
  }

  if (!session) {
    return <Login onLogin={handleLogin} />
  }

  if (session.role === 'admin') return <AdminDashboard session={session} onLogout={handleLogout} />
  if (session.role === 'company') return <CompanyDashboard session={session} onLogout={handleLogout} />
  return <PatientDashboard session={session} onLogout={handleLogout} />
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await portalLogin(username, password)
      onLogin(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            <label htmlFor="doc-number">Usuario</label>
            <input
              id="doc-number"
              placeholder="Documento, usuario o NIT asignado"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div style={{ color: '#b42318', fontSize: 13.5, marginTop: 10 }}>{error}</div>
          )}
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
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

// Nomenclatura oficial de documentos según INS-FIN-011-V01 "Instructivo de carpetas para facturar".
// Códigos compuestos documentados (sin guion): HC + disciplina, EV + disciplina, CCC.
const COMPOUND_SERVICE_LABELS = {
  HCPS: 'Historia clínica de psicología',
  HCFS: 'Historia clínica de fisiatría',
  HCML: 'Historia clínica de medicina laboral',
  // HCOT no está en el instructivo oficial; se infiere del mismo patrón HC + disciplina.
  HCOT: 'Historia clínica de ortopedia',
  EVTF: 'Evolución de terapia física',
  EVTO: 'Evolución de terapia ocupacional',
  CCC: 'Certificado de cierre de caso',
}

// Nombres de disciplina/servicio (campo "SERVICIO" del instructivo).
// OT (Ortopedia) no está documentado oficialmente; se infiere de los archivos reales.
const SERVICE_NOUNS = {
  PS: 'Psicología',
  FS: 'Fisiatría',
  ML: 'Medicina laboral',
  TF: 'Terapia física',
  TO: 'Terapia ocupacional',
  VDO: 'Evaluación de desempeño ocupacional',
  CR: 'Carta de recomendaciones',
  JM: 'Junta médica',
  RX: 'Imágenes diagnósticas',
  EX: 'Exámenes',
  OT: 'Ortopedia',
}

const AS_SERVICE_PHRASES = {
  PS: 'Asistencia a psicología',
  FS: 'Asistencia a fisiatría',
  ML: 'Asistencia a medicina laboral',
  TF: 'Asistencia a terapia física',
  TO: 'Asistencia a terapia ocupacional',
  VDO: 'Asistencia a evaluación de desempeño ocupacional',
  CR: 'Asistencia a entrega de carta de recomendaciones',
  OT: 'Asistencia a ortopedia',
}

function deriveServiceLabel(rawName, patientName) {
  const noExt = rawName.replace(/\.[^./]+$/, '')
  const upper = noExt.toUpperCase()

  const compoundCode = Object.keys(COMPOUND_SERVICE_LABELS).find((code) => upper.startsWith(code))
  if (compoundCode) return COMPOUND_SERVICE_LABELS[compoundCode]

  const tokens = upper.split(/[^A-Z0-9]+/).filter(Boolean)
  const prefix = tokens[0]

  if (prefix === 'VDO') return 'Evaluación de desempeño ocupacional'
  if (prefix === 'CR') return 'Carta de recomendaciones'
  if (prefix === 'ACJ') return 'Acta de junta médica'
  if (prefix === 'COT') return 'Cotización'
  if (prefix === 'FAC') return 'Factura'

  if (prefix === 'AS') {
    const serviceToken = tokens.slice(1).find((t) => AS_SERVICE_PHRASES[t])
    return serviceToken ? AS_SERVICE_PHRASES[serviceToken] : 'Asistencia'
  }

  if (prefix === 'AUT') {
    const serviceToken = tokens.slice(1).find((t) => SERVICE_NOUNS[t])
    return serviceToken ? `Autorización — ${SERVICE_NOUNS[serviceToken]}` : 'Autorización del asegurador'
  }

  if (prefix === 'HC') return 'Historia clínica'
  if (prefix === 'EV') return 'Evolución'

  // Documentos ya nombrados de forma literal (no siguen el código abreviado): se limpia
  // la fecha, el nombre del paciente y la cédula, dejando el resto del nombre tal cual.
  let label = noExt
  label = label.replace(/\b\d{1,2}-\d{1,2}-\d{4}\b/g, ' ')
  if (patientName) {
    const words = patientName.split(/\s+/).filter((w) => w.length > 2)
    for (const w of words) {
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      label = label.replace(new RegExp(`\\b${escaped}\\b`, 'ig'), ' ')
    }
  }
  label = label.replace(/\b\d{6,}\b/g, ' ')
  label = label.replace(/[-_]+/g, ' ').replace(/\s{2,}/g, ' ').trim()
  return label || noExt
}

function DocumentList({ documents, error, emptyText, onPreview, patientName }) {
  if (error) {
    return <div style={{ color: '#b42318', fontSize: 13.5, marginTop: 16 }}>{error}</div>
  }
  if (documents === null) {
    return <div style={{ fontSize: 13.5, color: 'var(--text-faint)', marginTop: 16 }}>Cargando…</div>
  }
  if (documents.length === 0) {
    return <div style={{ fontSize: 13.5, color: 'var(--text-faint)', marginTop: 16 }}>{emptyText}</div>
  }

  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Servicio prestado</th>
            <th>Archivo</th>
            <th>Fecha</th>
            <th>Médico</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => {
            const label = deriveServiceLabel(d.name, patientName)
            const date = new Date(d.modifiedAt).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            return (
              <tr key={d.id || d.name}>
                <td className="docs-table-name" data-label="Servicio prestado">
                  {label}
                </td>
                <td className="docs-table-file" data-label="Archivo">
                  {d.name}
                </td>
                <td className="docs-table-date" data-label="Fecha">
                  {date}
                </td>
                <td className="docs-table-doctor" data-label="Médico">
                  {d.medico || '—'}
                </td>
                <td className="docs-table-actions" data-label="Acciones">
                  {onPreview && d.id && (
                    <button
                      type="button"
                      className="doc-download"
                      title="Vista previa"
                      onClick={() => onPreview(d)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <IconEye size={18} />
                    </button>
                  )}
                  {d.downloadUrl || d.viewUrl ? (
                    <a
                      className="doc-download"
                      href={d.downloadUrl || d.viewUrl}
                      title={d.downloadUrl ? 'Descargar' : 'Ver documento'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconDownload size={18} />
                    </a>
                  ) : (
                    <span className="doc-download" title="Documento disponible">
                      <IconDownload size={18} />
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function PreviewModal({ state, onClose }) {
  if (!state) return null
  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="preview-dialog-head">
          <span>{state.name}</span>
          <button type="button" onClick={onClose} aria-label="Cerrar vista previa">
            ✕
          </button>
        </div>
        <div className="preview-dialog-body">
          {state.loading && <div className="preview-loading">Cargando vista previa…</div>}
          {state.error && <div className="preview-error">{state.error}</div>}
          {state.kind === 'iframe' && state.url && <iframe src={state.url} title={state.name} />}
          {state.kind === 'text' && <pre className="preview-text">{state.content}</pre>}
        </div>
      </div>
    </div>
  )
}

function DashboardHeader({ label, name, avatar, onLogout }) {
  return (
    <div className="welcome-bar">
      <div className="welcome-identity">
        <div className="avatar">{avatar}</div>
        <div>
          <div className="welcome-label">{label}</div>
          <div className="welcome-name">{name}</div>
        </div>
      </div>
      <div className="welcome-actions">
        <div className="onedrive-chip">
          <IconCloud />
          <span>Documentos sincronizados</span>
        </div>
        <button type="button" className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

function PatientDashboard({ session, onLogout }) {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    getPatientDocuments(session.token)
      .then((data) => setDocuments(data.documents))
      .catch((err) => setError(err.message))
  }, [session.token])

  async function handlePreview(doc) {
    setPreview({ name: doc.name, loading: true })
    try {
      const data = await previewPatientDocument(session.token, doc.id)
      setPreview({ name: doc.name, loading: false, ...data })
    } catch (err) {
      setPreview({ name: doc.name, loading: false, error: err.message })
    }
  }

  const initials = session.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <div className="container dashboard-wrap">
      <DashboardHeader label="Bienvenido(a)" name={session.name} avatar={initials} onLogout={onLogout} />

      <div className="panel-card" style={{ marginTop: 24 }}>
        <div className="panel-head">
          <div className="panel-head-left">
            <IconCloud size={22} />
            <h3>Últimos conceptos médicos</h3>
          </div>
        </div>
        <div className="panel-sub">
          Sincronizados desde la carpeta documental de <b>Croma Medical IPS</b>
        </div>
        <DocumentList
          documents={documents}
          error={error}
          emptyText="Todavía no tienes conceptos médicos cargados."
          onPreview={handlePreview}
          patientName={session.name}
        />
      </div>
      <PreviewModal state={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

function CompanyDashboard({ session, onLogout }) {
  const [employees, setEmployees] = useState(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    getCompanyDocuments(session.token)
      .then((data) => setEmployees(data.employees))
      .catch((err) => setError(err.message))
  }, [session.token])

  async function handlePreview(cedula, doc) {
    setPreview({ name: doc.name, loading: true })
    try {
      const data = await previewCompanyDocument(session.token, cedula, doc.id)
      setPreview({ name: doc.name, loading: false, ...data })
    } catch (err) {
      setPreview({ name: doc.name, loading: false, error: err.message })
    }
  }

  return (
    <div className="container dashboard-wrap">
      <DashboardHeader label="Empresa" name={session.name} avatar={<IconUsers size={18} color="#fff" />} onLogout={onLogout} />

      {error && <div style={{ color: '#b42318', fontSize: 13.5, marginTop: 20 }}>{error}</div>}
      {employees === null && !error && (
        <div style={{ color: 'var(--text-faint)', marginTop: 20 }}>Cargando…</div>
      )}
      {employees && employees.length === 0 && (
        <div className="panel-card" style={{ marginTop: 24 }}>
          No hay afiliados asociados a esta cuenta todavía.
        </div>
      )}

      <div style={{ display: 'grid', gap: 20, marginTop: 24 }}>
        {employees &&
          employees.map((emp) => (
            <div className="panel-card" key={emp.cedula}>
              <div className="panel-head">
                <div className="panel-head-left">
                  <IconUser size={20} />
                  <h3>{emp.nombre}</h3>
                </div>
                <span className="panel-meta">C.C. {emp.cedula}</span>
              </div>
              <DocumentList
                documents={emp.documents}
                emptyText="Sin conceptos médicos cargados todavía."
                onPreview={(doc) => handlePreview(emp.cedula, doc)}
                patientName={emp.nombre}
              />
            </div>
          ))}
      </div>
      <PreviewModal state={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

function AdminDashboard({ session, onLogout }) {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingUser, setEditingUser] = useState(null)
  const [resettingUser, setResettingUser] = useState(null)

  useEffect(() => {
    adminListUsers(session.token)
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
  }, [session.token, refreshKey])

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este usuario del portal?')) return
    try {
      await adminDeleteUser(session.token, id)
      refresh()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div className="container dashboard-wrap">
      <DashboardHeader label="Administrador" name={session.name} avatar="AD" onLogout={onLogout} />

      <div className="panel-card" style={{ marginTop: 24 }}>
        <div className="panel-head">
          <h3>Usuarios del portal</h3>
        </div>
        {error && <div style={{ color: '#b42318', fontSize: 13.5, marginTop: 12 }}>{error}</div>}
        {users === null && !error && (
          <div style={{ color: 'var(--text-faint)', fontSize: 13.5, marginTop: 12 }}>Cargando…</div>
        )}
        {users && users.length === 0 && (
          <div style={{ color: 'var(--text-faint)', fontSize: 13.5, marginTop: 12 }}>
            Aún no hay pacientes ni empresas registrados.
          </div>
        )}
        {users && users.length > 0 && (
          <div className="row-list">
            {users.map((u) => (
              <div className="doc-row" key={u.id}>
                <div className="doc-icon" style={{ background: u.role === 'company' ? '#1d5fbf' : '#1d289c' }}>
                  {u.role === 'company' ? 'EMP' : 'PAC'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="doc-name">
                    {u.full_name} <span style={{ fontWeight: 400, color: 'var(--text-faint)' }}>· {u.username}</span>
                  </div>
                  <div className="doc-meta">
                    {u.role === 'company'
                      ? `${u.cedulas.length} afiliado(s): ${u.cedulas.map((c) => c.cedula).join(', ') || '—'}`
                      : `C.C. ${u.cedula}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14, flex: 'none' }}>
                  <button
                    type="button"
                    className="doc-download"
                    title="Editar usuario"
                    onClick={() => setEditingUser(u)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <IconEdit size={18} />
                  </button>
                  <button
                    type="button"
                    className="doc-download"
                    title="Restablecer contraseña"
                    onClick={() => setResettingUser(u)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <IconKey size={18} />
                  </button>
                  <button
                    type="button"
                    className="doc-download"
                    title="Eliminar usuario"
                    onClick={() => handleDelete(u.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panels-grid" style={{ marginTop: 20 }}>
        <CreatePatientForm token={session.token} onCreated={refresh} />
        <CreateCompanyForm token={session.token} onCreated={refresh} />
      </div>

      {editingUser && (
        <EditUserModal
          token={session.token}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={() => {
            setEditingUser(null)
            refresh()
          }}
        />
      )}

      {resettingUser && (
        <ResetPasswordModal
          token={session.token}
          user={resettingUser}
          onClose={() => setResettingUser(null)}
        />
      )}
    </div>
  )
}

function CreatePatientForm({ token, onCreated }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const payload = Object.fromEntries(new FormData(form).entries())
    setStatus('sending')
    setError('')
    try {
      await adminCreatePatient(token, payload)
      setStatus('sent')
      form.reset()
      onCreated()
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div className="contact-form-card">
      <h2>Crear usuario paciente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-field full">
            <label htmlFor="p-fullName">Nombre completo</label>
            <input id="p-fullName" name="fullName" placeholder="Nombre y apellidos" required />
          </div>
          <div className="form-field">
            <label htmlFor="p-cedula">Documento (cédula)</label>
            <input id="p-cedula" name="cedula" placeholder="Debe coincidir con la carpeta en SGD" required />
          </div>
          <div className="form-field">
            <label htmlFor="p-username">Usuario de acceso</label>
            <input id="p-username" name="username" placeholder="usuario" required />
          </div>
          <div className="form-field full">
            <label htmlFor="p-password">Contraseña</label>
            <input id="p-password" name="password" type="password" placeholder="••••••••" required />
          </div>
        </div>
        <button type="submit" className="form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Creando…' : 'Crear paciente'}
        </button>
        {status === 'sent' && (
          <div className="alert-success" style={{ marginTop: 14, fontSize: 13, color: '#1e7a4d' }}>
            Usuario creado correctamente.
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: 14, fontSize: 13, color: '#b42318' }}>{error}</div>
        )}
      </form>
    </div>
  )
}

function CreateCompanyForm({ token, onCreated }) {
  const [rows, setRows] = useState([{ cedula: '', nombre: '' }])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function updateRow(i, field, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))
  }
  function addRow() {
    setRows((prev) => [...prev, { cedula: '', nombre: '' }])
  }
  function removeRow(i) {
    setRows((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const base = Object.fromEntries(new FormData(form).entries())
    const cedulas = rows.filter((r) => r.cedula.trim())
    setStatus('sending')
    setError('')
    try {
      await adminCreateCompany(token, { ...base, cedulas })
      setStatus('sent')
      form.reset()
      setRows([{ cedula: '', nombre: '' }])
      onCreated()
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  const rowInputStyle = {
    flex: 1,
    border: '1.5px solid var(--border-strong)',
    borderRadius: 11,
    padding: '10px 12px',
    fontSize: 13.5,
    fontFamily: 'inherit',
  }

  return (
    <div className="contact-form-card">
      <h2>Crear usuario empresa</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-field full">
            <label htmlFor="c-companyName">Nombre de la empresa</label>
            <input id="c-companyName" name="companyName" placeholder="Razón social" required />
          </div>
          <div className="form-field">
            <label htmlFor="c-username">Usuario de acceso</label>
            <input id="c-username" name="username" placeholder="usuario" required />
          </div>
          <div className="form-field">
            <label htmlFor="c-password">Contraseña</label>
            <input id="c-password" name="password" type="password" placeholder="••••••••" required />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-faint)' }}>
            Empleados / afiliados (la cédula debe coincidir con la carpeta en SGD)
          </label>
          {rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                placeholder="Cédula"
                value={row.cedula}
                onChange={(e) => updateRow(i, 'cedula', e.target.value)}
                style={rowInputStyle}
              />
              <input
                placeholder="Nombre"
                value={row.nombre}
                onChange={(e) => updateRow(i, 'nombre', e.target.value)}
                style={rowInputStyle}
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  style={{ background: 'none', border: 'none', color: '#b42318', cursor: 'pointer', fontSize: 15 }}
                  title="Quitar afiliado"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            style={{
              marginTop: 10,
              fontSize: 13,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              padding: 0,
            }}
          >
            + Agregar afiliado
          </button>
        </div>

        <button type="submit" className="form-submit" style={{ marginTop: 22 }} disabled={status === 'sending'}>
          {status === 'sending' ? 'Creando…' : 'Crear empresa'}
        </button>
        {status === 'sent' && (
          <div className="alert-success" style={{ marginTop: 14, fontSize: 13, color: '#1e7a4d' }}>
            Empresa creada correctamente.
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: 14, fontSize: 13, color: '#b42318' }}>{error}</div>
        )}
      </form>
    </div>
  )
}

function EditUserModal({ token, user, onClose, onSaved }) {
  const isCompany = user.role === 'company'
  const [fullName, setFullName] = useState(user.full_name)
  const [cedula, setCedula] = useState(user.cedula || '')
  const [rows, setRows] = useState(
    isCompany && user.cedulas && user.cedulas.length > 0
      ? user.cedulas.map((c) => ({ cedula: c.cedula, nombre: c.nombre }))
      : [{ cedula: '', nombre: '' }]
  )
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function updateRow(i, field, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))
  }
  function addRow() {
    setRows((prev) => [...prev, { cedula: '', nombre: '' }])
  }
  function removeRow(i) {
    setRows((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      if (isCompany) {
        const cedulas = rows.filter((r) => r.cedula.trim())
        await adminUpdateUser(token, user.id, { companyName: fullName, cedulas })
      } else {
        await adminUpdateUser(token, user.id, { fullName, cedula })
      }
      onSaved()
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  const rowInputStyle = {
    flex: 1,
    border: '1.5px solid var(--border-strong)',
    borderRadius: 11,
    padding: '10px 12px',
    fontSize: 13.5,
    fontFamily: 'inherit',
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-dialog-head">
          <h3>Editar {isCompany ? 'empresa' : 'paciente'}</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="edit-fullName">{isCompany ? 'Nombre de la empresa' : 'Nombre completo'}</label>
            <input id="edit-fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          {!isCompany && (
            <div className="form-field" style={{ marginTop: 16 }}>
              <label htmlFor="edit-cedula">Documento (cédula)</label>
              <input id="edit-cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} required />
            </div>
          )}

          {isCompany && (
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-faint)' }}>
                Empleados / afiliados
              </label>
              {rows.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input
                    placeholder="Cédula"
                    value={row.cedula}
                    onChange={(e) => updateRow(i, 'cedula', e.target.value)}
                    style={rowInputStyle}
                  />
                  <input
                    placeholder="Nombre"
                    value={row.nombre}
                    onChange={(e) => updateRow(i, 'nombre', e.target.value)}
                    style={rowInputStyle}
                  />
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      style={{ background: 'none', border: 'none', color: '#b42318', cursor: 'pointer', fontSize: 15 }}
                      title="Quitar afiliado"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRow}
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: 'var(--accent)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                + Agregar afiliado
              </button>
            </div>
          )}

          <button type="submit" className="form-submit" style={{ marginTop: 22 }} disabled={status === 'sending'}>
            {status === 'sending' ? 'Guardando…' : 'Guardar cambios'}
          </button>
          {status === 'error' && (
            <div style={{ marginTop: 14, fontSize: 13, color: '#b42318' }}>{error}</div>
          )}
        </form>
      </div>
    </div>
  )
}

function ResetPasswordModal({ token, user, onClose }) {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await adminResetPassword(token, user.id, password)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-dialog-head">
          <h3>Restablecer contraseña</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--text-faint)', marginTop: -8, marginBottom: 16 }}>
          Nueva contraseña para <b>{user.full_name}</b> ({user.username}).
        </p>
        {status === 'sent' ? (
          <div className="alert-success" style={{ fontSize: 13.5, color: '#1e7a4d' }}>
            Contraseña actualizada correctamente.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="reset-password">Nueva contraseña</label>
              <input
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <button type="submit" className="form-submit" style={{ marginTop: 18 }} disabled={status === 'sending'}>
              {status === 'sending' ? 'Guardando…' : 'Restablecer contraseña'}
            </button>
            {status === 'error' && (
              <div style={{ marginTop: 14, fontSize: 13, color: '#b42318' }}>{error}</div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
