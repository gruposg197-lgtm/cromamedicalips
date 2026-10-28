const DEFAULT_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
const DEFAULT_BASE = `http://${DEFAULT_HOST}:4310`

const CONTACTO_ENDPOINT = import.meta.env.VITE_CONTACTO_ENDPOINT || `${DEFAULT_BASE}/api/contacto`
const PQRSF_ENDPOINT = import.meta.env.VITE_PQRSF_ENDPOINT || `${DEFAULT_BASE}/api/pqrsf`
const PORTAL_BASE = import.meta.env.VITE_PORTAL_API || `${DEFAULT_BASE}/api/portal`

async function post(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'No se pudo enviar la solicitud')
  }
  return res.json()
}

export const submitContacto = (payload) => post(CONTACTO_ENDPOINT, payload)
export const submitPqrsf = (payload) => post(PQRSF_ENDPOINT, payload)

async function portalRequest(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${PORTAL_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'No se pudo completar la solicitud')
  }
  return data
}

export const portalLogin = (username, password) =>
  portalRequest('/login', { method: 'POST', body: { username, password } })

export const portalMe = (token) => portalRequest('/me', { token })

export const adminListUsers = (token) => portalRequest('/admin/users', { token })

export const adminCreatePatient = (token, payload) =>
  portalRequest('/admin/users/patient', { method: 'POST', token, body: payload })

export const adminCreateCompany = (token, payload) =>
  portalRequest('/admin/users/company', { method: 'POST', token, body: payload })

export const adminDeleteUser = (token, id) =>
  portalRequest(`/admin/users/${id}`, { method: 'DELETE', token })

export const adminUpdateUser = (token, id, payload) =>
  portalRequest(`/admin/users/${id}`, { method: 'PUT', token, body: payload })

export const adminResetPassword = (token, id, password) =>
  portalRequest(`/admin/users/${id}/reset-password`, { method: 'POST', token, body: { password } })

export const getPatientDocuments = (token) => portalRequest('/patient/documents', { token })

export const getCompanyDocuments = (token) => portalRequest('/company/documents', { token })

export const previewPatientDocument = (token, documentId) =>
  portalRequest('/patient/documents/preview', { method: 'POST', token, body: { documentId } })

export const previewCompanyDocument = (token, cedula, documentId) =>
  portalRequest('/company/documents/preview', { method: 'POST', token, body: { cedula, documentId } })
