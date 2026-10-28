import crypto from 'node:crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'croma-dev-secret-change-in-production'
const TOKEN_TTL_SECONDS = 8 * 60 * 60

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const check = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'))
}

export function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  const body = { ...payload, exp }
  const headerPart = base64url(JSON.stringify(header))
  const bodyPart = base64url(JSON.stringify(body))
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${headerPart}.${bodyPart}`).digest('base64url')
  return `${headerPart}.${bodyPart}.${signature}`
}

export function verifyToken(token) {
  const [headerPart, bodyPart, signature] = token.split('.')
  if (!headerPart || !bodyPart || !signature) return null
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${headerPart}.${bodyPart}`).digest('base64url')
  if (signature !== expected) return null
  const body = JSON.parse(Buffer.from(bodyPart, 'base64url').toString('utf8'))
  if (body.exp && Math.floor(Date.now() / 1000) > body.exp) return null
  return body
}

export function requireAuth(roles) {
  return (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    const payload = token && verifyToken(token)
    if (!payload) {
      return res.status(401).json({ error: 'No autenticado' })
    }
    if (roles && !roles.includes(payload.role)) {
      return res.status(403).json({ error: 'No autorizado' })
    }
    req.user = payload
    next()
  }
}
