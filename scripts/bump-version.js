// Incrementa buildRevision en metadata.json y actualiza buildTag.
// Lo ejecuta el workflow de GitHub en cada push a main. Uso local: npm run version:bump
// buildRevision -1 => primer bump deja 0 => versión 1.0.0
// buildTag se escribe en hora de Argentina con offset (ej. 2026-11-11T19:02:10.123-03:00),
// independiente de la zona horaria de la máquina (el runner de GitHub está en UTC).
const fs = require('fs')
const path = require('path')

const TZ = 'America/Argentina/Buenos_Aires'
const OFFSET = '-03:00' // Argentina no usa horario de verano

const nowArgentina = () => {
  const now = new Date()
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value])
  )
  const ms = String(now.getMilliseconds()).padStart(3, '0')
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${ms}${OFFSET}`
}

const file = path.join(__dirname, '..', 'metadata.json')
const meta = JSON.parse(fs.readFileSync(file, 'utf8'))

meta.buildRevision = Number(meta.buildRevision) + 1
meta.buildTag = nowArgentina()

fs.writeFileSync(file, JSON.stringify(meta, null, 2) + '\n')
console.log('version ->', meta.buildMajor + '.' + meta.buildMinor + '.' + meta.buildRevision, '(' + meta.buildTag + ')')
