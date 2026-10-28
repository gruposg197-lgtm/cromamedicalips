import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { registerPortalRoutes } from './portal-routes.js'

const PORT = process.env.PORT || 4310

const FORMS = {
  contacto: {
    to: 'direccion.medica@cromamedical.com',
    label: 'contacto',
    required: ['name', 'doc', 'phone', 'email', 'program', 'message'],
  },
  pqrsf: {
    to: 'calidad@cromamedical.com',
    label: 'PQRSF',
    required: ['name', 'doc', 'phone', 'email', 'tipo', 'message'],
  },
}

const app = express()
app.use(cors())
app.use(express.json())

const transporterPromise = (async () => {
  const testAccount = await nodemailer.createTestAccount()
  console.log('Cuenta de prueba Ethereal creada:', testAccount.user)
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })
})()

function handleForm(formKey) {
  return async (req, res) => {
    const form = FORMS[formKey]
    const data = req.body || {}

    const missing = form.required.filter((field) => !data[field])
    if (missing.length) {
      return res.status(400).json({ error: `Faltan campos: ${missing.join(', ')}` })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return res.status(400).json({ error: 'Correo inválido' })
    }

    const subject = `[Croma Medical] Nueva solicitud de ${form.label}`
    const text = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    try {
      const transporter = await transporterPromise
      const info = await transporter.sendMail({
        from: '"Sitio web Croma Medical" <no-reply@cromamedical.test>',
        to: form.to,
        replyTo: data.email,
        subject,
        text,
      })
      const previewUrl = nodemailer.getTestMessageUrl(info)
      console.log(`[${formKey}] correo de prueba enviado -> ${form.to}`)
      console.log('Vista previa:', previewUrl)
      res.json({ ok: true, previewUrl })
    } catch (err) {
      console.error(`Error enviando correo de ${formKey}:`, err)
      res.status(500).json({ error: 'No se pudo enviar el correo de prueba' })
    }
  }
}

app.post('/api/contacto', handleForm('contacto'))
app.post('/api/pqrsf', handleForm('pqrsf'))
app.get('/api/health', (req, res) => res.json({ ok: true }))

registerPortalRoutes(app)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend de prueba escuchando en http://localhost:${PORT}`)
})
