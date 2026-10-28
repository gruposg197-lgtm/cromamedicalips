import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MOCK_ROOT = path.join(__dirname, 'mock-sgd')

const PROVIDER = process.env.DOC_PROVIDER || 'mock'

function listMock(cedula, limit) {
  const folder = path.join(MOCK_ROOT, cedula)
  if (!fs.existsSync(folder)) return []
  return fs
    .readdirSync(folder)
    .filter((name) => !name.startsWith('.'))
    .map((name) => {
      const stat = fs.statSync(path.join(folder, name))
      return {
        id: name,
        name,
        modifiedAt: stat.mtime.toISOString(),
        sizeKb: Math.max(1, Math.round(stat.size / 1024)),
      }
    })
    .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
    .slice(0, limit)
}

// --- Microsoft Graph (SharePoint Online) provider ---
// Requiere las variables de entorno:
//   MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET
//   MS_SITE_HOSTNAME        p.ej. "gruposg197.sharepoint.com"
//   MS_SITE_PATH            p.ej. "/sites/SGDGRUPOSG"
//   MS_LIBRARY_NAME         p.ej. "Documentos"
//   MS_BASE_FOLDER_PATH     p.ej. "01.CROMA_MEDICAL/B_LINEAS_DE_NEGOCIO/14_Croma_Medical-IPS"
let cachedToken = null
let cachedSiteDriveId = null
let cachedBaseFolderId = null

async function getGraphToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value
  }
  const tenantId = process.env.MS_TENANT_ID
  const clientId = process.env.MS_CLIENT_ID
  const clientSecret = process.env.MS_CLIENT_SECRET
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) {
    throw new Error(`No se pudo autenticar con Microsoft Graph: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cachedToken.value
}

async function getSiteDriveId(token) {
  if (cachedSiteDriveId) return cachedSiteDriveId
  const hostname = process.env.MS_SITE_HOSTNAME
  const sitePath = process.env.MS_SITE_PATH
  const libraryName = process.env.MS_LIBRARY_NAME || 'Documents'

  const siteRes = await fetch(`https://graph.microsoft.com/v1.0/sites/${hostname}:${sitePath}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!siteRes.ok) throw new Error(`No se pudo resolver el sitio de SharePoint: ${siteRes.status} ${await siteRes.text()}`)
  const site = await siteRes.json()

  const drivesRes = await fetch(`https://graph.microsoft.com/v1.0/sites/${site.id}/drives`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!drivesRes.ok) throw new Error(`No se pudo listar las bibliotecas del sitio: ${drivesRes.status}`)
  const drives = await drivesRes.json()
  const drive = drives.value.find((d) => d.name === libraryName) || drives.value[0]
  if (!drive) throw new Error('No se encontró la biblioteca de documentos indicada')

  cachedSiteDriveId = drive.id
  return cachedSiteDriveId
}

async function getBaseFolderId(token, driveId) {
  if (cachedBaseFolderId) return cachedBaseFolderId
  const basePath = process.env.MS_BASE_FOLDER_PATH || ''
  const res = await fetch(`https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${encodeURI(basePath)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`No se pudo resolver la carpeta base: ${res.status} ${await res.text()}`)
  const item = await res.json()
  cachedBaseFolderId = item.id
  return cachedBaseFolderId
}

function mapFile(item) {
  return {
    id: item.id,
    name: item.name,
    modifiedAt: item.lastModifiedDateTime,
    sizeKb: Math.max(1, Math.round(item.size / 1024)),
    viewUrl: item.webUrl,
    downloadUrl: item['@microsoft.graph.downloadUrl'],
  }
}

function isPatientFolder(item, cedula) {
  if (!item.folder) return false
  const name = item.name.toUpperCase().trim()
  return name.startsWith('CC') && name.includes(cedula)
}

async function getChildren(token, driveId, itemId) {
  const res = await fetch(`https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/children?$top=200`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`No se pudo listar el contenido de la carpeta: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.value || []
}

// Las carpetas de cada paciente siguen el patrón "CC {cedula} - {nombre}" y pueden estar
// anidadas en cualquier nivel (aseguradora/programa/año/mes), así que en vez de asumir una
// ruta fija, se busca el nombre de la carpeta en todo el árbol documental.
async function listGraph(cedula, limit) {
  const token = await getGraphToken()
  const driveId = await getSiteDriveId(token)
  const baseFolderId = await getBaseFolderId(token, driveId)

  const searchRes = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${baseFolderId}/search(q='${encodeURIComponent(cedula)}')`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!searchRes.ok) throw new Error(`No se pudo buscar la carpeta del paciente: ${searchRes.status} ${await searchRes.text()}`)
  const searchData = await searchRes.json()

  const patientFolders = (searchData.value || []).filter((item) => isPatientFolder(item, cedula))

  const files = []
  for (const folder of patientFolders) {
    const children = await getChildren(token, driveId, folder.id)
    for (const child of children) {
      if (child.file) {
        files.push(child)
      } else if (child.folder) {
        const grandchildren = await getChildren(token, driveId, child.id)
        files.push(...grandchildren.filter((gc) => gc.file))
      }
    }
  }

  const seen = new Set()
  const unique = files.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  unique.sort((a, b) => new Date(b.lastModifiedDateTime) - new Date(a.lastModifiedDateTime))
  return unique.slice(0, limit).map(mapFile)
}

export async function listLatestDocuments(cedula, limit = 5) {
  if (PROVIDER === 'graph') {
    return listGraph(cedula, limit)
  }
  return listMock(cedula, limit)
}

export function currentProvider() {
  return PROVIDER
}

async function getMockPreview(cedula, documentId) {
  const folder = path.join(MOCK_ROOT, cedula)
  const filePath = path.join(folder, documentId)
  if (path.dirname(filePath) !== folder || !fs.existsSync(filePath)) {
    throw new Error('Documento no encontrado')
  }
  const content = fs.readFileSync(filePath, 'utf8')
  return { kind: 'text', content }
}

async function getGraphPreview(cedula, documentId) {
  // Verifica que el documento solicitado realmente pertenezca a esta cédula antes de generar la vista previa.
  const docs = await listGraph(cedula, 200)
  const match = docs.find((d) => d.id === documentId)
  if (!match) throw new Error('Documento no encontrado')

  const token = await getGraphToken()
  const driveId = await getSiteDriveId(token)
  const res = await fetch(`https://graph.microsoft.com/v1.0/drives/${driveId}/items/${documentId}/preview`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  if (!res.ok) throw new Error(`No se pudo generar la vista previa: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return { kind: 'iframe', url: data.getUrl }
}

export async function getDocumentPreview(cedula, documentId) {
  if (PROVIDER === 'graph') {
    return getGraphPreview(cedula, documentId)
  }
  return getMockPreview(cedula, documentId)
}
