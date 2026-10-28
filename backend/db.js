import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashPassword } from './auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'data.sqlite')

export const db = new DatabaseSync(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'patient', 'company')),
    full_name TEXT NOT NULL,
    cedula TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS company_patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cedula TEXT NOT NULL,
    nombre TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

const ADMIN_USER = process.env.ADMIN_DEFAULT_USER || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'CromaAdmin2026!'

const existingAdmin = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin')
if (!existingAdmin) {
  db.prepare(
    'INSERT INTO users (username, password_hash, role, full_name) VALUES (?, ?, ?, ?)'
  ).run(ADMIN_USER, hashPassword(ADMIN_PASSWORD), 'admin', 'Administrador Croma Medical')
  console.log('--------------------------------------------------')
  console.log('Usuario administrador creado:')
  console.log(`  usuario:  ${ADMIN_USER}`)
  console.log(`  clave:    ${ADMIN_PASSWORD}`)
  console.log('Cámbiala después de tu primer ingreso.')
  console.log('--------------------------------------------------')
}
