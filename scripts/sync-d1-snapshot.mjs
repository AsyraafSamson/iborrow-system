import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const databaseName = 'iborrow'
const databaseId = '51ddaea3-c7f4-4c5c-ad87-0a4e592e0154'
const outputPath = path.join(repoRoot, 'data', 'remote-d1-snapshot.local.json')

const tables = ['users', 'barang', 'tempahan', 'log_aktiviti', 'return_requests']

function runWranglerJson(sql) {
  const stdout = execSync(
    `npx wrangler d1 execute ${databaseName} --remote --command="${sql.replaceAll('"', '\\"')}" --json`,
    {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    }
  )

  const parsed = JSON.parse(stdout)
  if (!Array.isArray(parsed) || !parsed[0]?.success) {
    throw new Error(`Unexpected Wrangler response for SQL: ${sql}`)
  }

  return parsed[0].results ?? []
}

function sortRows(rows, table) {
  if (table === 'log_aktiviti') {
    return [...rows].sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
  }

  if (table === 'tempahan' || table === 'return_requests') {
    return [...rows].sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
  }

  if (table === 'barang') {
    return [...rows].sort((left, right) => String(left.namaBarang).localeCompare(String(right.namaBarang)))
  }

  return [...rows].sort((left, right) => String(left.id).localeCompare(String(right.id)))
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  source: {
    databaseName,
    databaseId,
  },
  tables: {},
}

mkdirSync(path.dirname(outputPath), { recursive: true })

for (const table of tables) {
  const rows = runWranglerJson(`SELECT * FROM ${table};`)
  snapshot.tables[table] = sortRows(rows, table)
}

writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
console.log(`Wrote D1 snapshot to ${outputPath}`)
