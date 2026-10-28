const DEFAULT_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
const DEFAULT_BASE = `http://${DEFAULT_HOST}:4310`

const CONTACTO_ENDPOINT = import.meta.env.VITE_CONTACTO_ENDPOINT || `${DEFAULT_BASE}/api/contacto`
const PQRSF_ENDPOINT = import.meta.env.VITE_PQRSF_ENDPOINT || `${DEFAULT_BASE}/api/pqrsf`

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
