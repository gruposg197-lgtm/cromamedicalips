import { db } from './db.js'
import { hashPassword, verifyPassword, signToken, requireAuth } from './auth.js'
import { listLatestDocuments, getDocumentPreview } from './docs-provider.js'

export function registerPortalRoutes(app) {
  app.post('/api/portal/login', (req, res) => {
    const { username, password } = req.body || {}
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y clave son obligatorios' })
    }
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Usuario o clave incorrectos' })
    }
    const token = signToken({ id: user.id, role: user.role, name: user.full_name })
    res.json({ token, role: user.role, name: user.full_name })
  })

  app.get('/api/portal/me', requireAuth(), (req, res) => {
    res.json({ id: req.user.id, role: req.user.role, name: req.user.name })
  })

  // --- Admin: user management ---
  app.get('/api/portal/admin/users', requireAuth(['admin']), (req, res) => {
    const users = db
      .prepare("SELECT id, username, full_name, role, cedula, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC")
      .all()
    const withCedulas = users.map((u) => {
      if (u.role === 'company') {
        const cedulas = db
          .prepare('SELECT cedula, nombre FROM company_patients WHERE company_user_id = ?')
          .all(u.id)
        return { ...u, cedulas }
      }
      return u
    })
    res.json({ users: withCedulas })
  })

  app.post('/api/portal/admin/users/patient', requireAuth(['admin']), (req, res) => {
    const { username, password, fullName, cedula } = req.body || {}
    if (!username || !password || !fullName || !cedula) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }
    try {
      const info = db
        .prepare('INSERT INTO users (username, password_hash, role, full_name, cedula) VALUES (?, ?, ?, ?, ?)')
        .run(username, hashPassword(password), 'patient', fullName, cedula)
      res.json({ ok: true, id: info.lastInsertRowid })
    } catch (err) {
      res.status(400).json({ error: 'El usuario ya existe' })
    }
  })

  app.post('/api/portal/admin/users/company', requireAuth(['admin']), (req, res) => {
    const { username, password, companyName, cedulas } = req.body || {}
    if (!username || !password || !companyName || !Array.isArray(cedulas) || cedulas.length === 0) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o no hay cédulas asociadas' })
    }
    try {
      const info = db
        .prepare('INSERT INTO users (username, password_hash, role, full_name) VALUES (?, ?, ?, ?)')
        .run(username, hashPassword(password), 'company', companyName)
      const companyId = info.lastInsertRowid
      const insertCedula = db.prepare('INSERT INTO company_patients (company_user_id, cedula, nombre) VALUES (?, ?, ?)')
      for (const c of cedulas) {
        if (c.cedula) insertCedula.run(companyId, c.cedula, c.nombre || c.cedula)
      }
      res.json({ ok: true, id: companyId })
    } catch (err) {
      res.status(400).json({ error: 'El usuario ya existe' })
    }
  })

  app.delete('/api/portal/admin/users/:id', requireAuth(['admin']), (req, res) => {
    const id = Number(req.params.id)
    db.prepare('DELETE FROM company_patients WHERE company_user_id = ?').run(id)
    db.prepare("DELETE FROM users WHERE id = ? AND role != 'admin'").run(id)
    res.json({ ok: true })
  })

  app.put('/api/portal/admin/users/:id', requireAuth(['admin']), (req, res) => {
    const id = Number(req.params.id)
    const user = db.prepare("SELECT * FROM users WHERE id = ? AND role != 'admin'").get(id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    if (user.role === 'patient') {
      const { fullName, cedula } = req.body || {}
      if (!fullName || !cedula) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' })
      }
      db.prepare('UPDATE users SET full_name = ?, cedula = ? WHERE id = ?').run(fullName, cedula, id)
    } else {
      const { companyName, cedulas } = req.body || {}
      if (!companyName || !Array.isArray(cedulas) || cedulas.length === 0) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o no hay cédulas asociadas' })
      }
      db.prepare('UPDATE users SET full_name = ? WHERE id = ?').run(companyName, id)
      db.prepare('DELETE FROM company_patients WHERE company_user_id = ?').run(id)
      const insertCedula = db.prepare('INSERT INTO company_patients (company_user_id, cedula, nombre) VALUES (?, ?, ?)')
      for (const c of cedulas) {
        if (c.cedula) insertCedula.run(id, c.cedula, c.nombre || c.cedula)
      }
    }
    res.json({ ok: true })
  })

  app.post('/api/portal/admin/users/:id/reset-password', requireAuth(['admin']), (req, res) => {
    const id = Number(req.params.id)
    const { password } = req.body || {}
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'La clave debe tener al menos 6 caracteres' })
    }
    const user = db.prepare("SELECT id FROM users WHERE id = ? AND role != 'admin'").get(id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), id)
    res.json({ ok: true })
  })

  // --- Patient: own medical concepts ---
  app.get('/api/portal/patient/documents', requireAuth(['patient']), async (req, res) => {
    const user = db.prepare('SELECT cedula FROM users WHERE id = ?').get(req.user.id)
    try {
      const documents = await listLatestDocuments(user.cedula, 10)
      res.json({ cedula: user.cedula, documents })
    } catch (err) {
      console.error('Error listando documentos del paciente:', err)
      res.status(500).json({ error: 'No se pudieron cargar los documentos' })
    }
  })

  // --- Company: documents for each associated cedula ---
  app.get('/api/portal/company/documents', requireAuth(['company']), async (req, res) => {
    const cedulas = db
      .prepare('SELECT cedula, nombre FROM company_patients WHERE company_user_id = ?')
      .all(req.user.id)
    try {
      const results = await Promise.all(
        cedulas.map(async (c) => ({
          cedula: c.cedula,
          nombre: c.nombre,
          documents: await listLatestDocuments(c.cedula, 5),
        }))
      )
      res.json({ employees: results })
    } catch (err) {
      console.error('Error listando documentos de la empresa:', err)
      res.status(500).json({ error: 'No se pudieron cargar los documentos' })
    }
  })

  // --- Vista previa de un documento puntual ---
  app.post('/api/portal/patient/documents/preview', requireAuth(['patient']), async (req, res) => {
    const { documentId } = req.body || {}
    if (!documentId) return res.status(400).json({ error: 'Falta documentId' })
    const user = db.prepare('SELECT cedula FROM users WHERE id = ?').get(req.user.id)
    try {
      const preview = await getDocumentPreview(user.cedula, documentId)
      res.json(preview)
    } catch (err) {
      console.error('Error generando vista previa (paciente):', err)
      res.status(500).json({ error: err.message || 'No se pudo generar la vista previa' })
    }
  })

  app.post('/api/portal/company/documents/preview', requireAuth(['company']), async (req, res) => {
    const { cedula, documentId } = req.body || {}
    if (!cedula || !documentId) return res.status(400).json({ error: 'Faltan datos' })
    const owns = db
      .prepare('SELECT 1 FROM company_patients WHERE company_user_id = ? AND cedula = ?')
      .get(req.user.id, cedula)
    if (!owns) return res.status(403).json({ error: 'No autorizado' })
    try {
      const preview = await getDocumentPreview(cedula, documentId)
      res.json(preview)
    } catch (err) {
      console.error('Error generando vista previa (empresa):', err)
      res.status(500).json({ error: err.message || 'No se pudo generar la vista previa' })
    }
  })
}
